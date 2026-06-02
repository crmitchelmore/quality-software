# Rate Limiting

> Control how many requests a client, tenant or workload may perform in a time window, protecting shared capacity and enforcing fair use.

**Scale:** integration · **Category:** resilience · **Maturity:** time-tested

**Also known as:** Token Bucket, Quota Enforcement

## Description

Rate limiting is admission control based on identity and time. A service tracks how many units of work a caller has consumed and rejects, delays or shapes requests that exceed its policy. Common algorithms include fixed windows, sliding windows, token buckets and leaky buckets; token buckets are often preferred because they allow bounded bursts while preserving a long-term rate. Effective rate limits are attached to a meaningful subject, return clear status and retry metadata, and are implemented close enough to shared resources to protect them without becoming a single hot spot.

**Problem.** A few callers can monopolise shared resources through bugs, abusive traffic or normal bursts. Without a limit, everyone else experiences higher latency or failure, and the overloaded service has little leverage except scaling.

**Context.** Use for public APIs, multi-tenant services, expensive operations, background job submission and dependency protection. Choose limits from capacity and business rules, not arbitrary round numbers, and consider distributed counters when traffic spans nodes.

## Consequences / Trade-offs

- Protects shared services from abusive, buggy or unexpectedly bursty clients.
- Provides fairness and predictable capacity planning by client, tenant or operation.
- Adds state and distributed consistency concerns when enforced across many instances.
- Poor limits can block legitimate bursts or encourage clients to retry too aggressively.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for public endpoints or expensive operations; overkill for private single-user tools. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | A strong default for APIs with multiple clients or tenants. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for fairness and capacity protection across distributed, multi-tenant platforms. |

## Examples

### Token bucket per API key

**❌ Negative (typescript)**

```typescript
// Every authenticated client can submit unlimited expensive work.
app.post("/exports", authenticate, async (req, res) => {
  const exportId = await exports.start(req.user.id, req.body);
  res.status(202).json({ exportId });
});
```

**✅ Positive (typescript)**

```typescript
type Bucket = { tokens: number; refreshedAt: number };
const buckets = new Map<string, Bucket>();

function takeToken(key: string, now = Date.now()): boolean {
  const capacity = 20;
  const refillPerSecond = 2;
  const bucket = buckets.get(key) ?? { tokens: capacity, refreshedAt: now };
  const elapsedSeconds = (now - bucket.refreshedAt) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSeconds * refillPerSecond);
  bucket.refreshedAt = now;
  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}

app.post("/exports", authenticate, async (req, res) => {
  if (!takeToken(req.user.apiKey)) {
    res.setHeader("Retry-After", "1");
    res.status(429).json({ error: "rate limit exceeded" });
    return;
  }
  const exportId = await exports.start(req.user.id, req.body);
  res.status(202).json({ exportId });
});
```

*The positive version allows bounded bursts but caps sustained expensive work per API key, returning 429 and retry guidance when the quota is exhausted.*

## Relationships

**Synergies**

- [Throttling](../cloud-distributed/throttling.md) — Throttling can slow excessive clients while rate limiting defines the quota boundary.
- [Load Shedding](../resilience/load-shedding.md) — Rate limits handle known per-client pressure; shedding reacts to whole-system saturation.
- [Retry with Backoff](../resilience/retry.md) — Retry policies should honour Retry-After metadata instead of immediately reattempting 429s.
- [Bulkhead](../resilience/bulkhead.md) — Per-tenant limits pair with isolated resource pools to reduce noisy-neighbour impact.

**Alternatives:** [Throttling](../cloud-distributed/throttling.md), [Backpressure](../resilience/backpressure.md), [Load Shedding](../resilience/load-shedding.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, go, java, python
- **Frameworks:** none, nodejs, express, redis, istio
- **Project types:** web-api, backend-service, microservices, distributed-system, high-throughput
- **Tags:** resilience, quota, fairness, token-bucket

## References

- [Microsoft Azure Architecture Center; Rate Limiting pattern](https://learn.microsoft.com/azure/architecture/patterns/rate-limiting-pattern)

