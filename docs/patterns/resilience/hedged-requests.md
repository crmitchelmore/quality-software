# Hedged Requests

> Send a duplicate request after a short delay and use the first successful response, reducing tail latency caused by straggling replicas.

**Scale:** integration · **Category:** resilience · **Maturity:** established

**Also known as:** Backup Requests, Request Hedging

## Description

Hedged requests attack tail latency by speculatively issuing a second equivalent request when the first is slower than expected. The caller races the attempts, uses the first successful response, and cancels the loser. Hedging is not a retry for hard failure; it is a latency tool for replicated, read-heavy or idempotent operations where occasional extra work is cheaper than waiting for a straggler. It must be gated by percentile latency, concurrency budgets and per-request idempotency, or it can double load and make overload worse.

**Problem.** In large distributed systems, a small fraction of slow replicas, noisy neighbours or network hiccups dominate user-visible tail latency. Waiting for the single slowest attempt makes otherwise healthy replicated services feel unreliable.

**Context.** Use for idempotent reads or safe duplicate requests against independently served replicas, shards or regions. Avoid for non-idempotent writes, expensive operations, or when the dependency is already saturated unless a strict hedge budget is enforced.

## Consequences / Trade-offs

- Reduces p95/p99 latency when stragglers are independent and rare.
- Converts some latency risk into controlled extra load.
- Can amplify overload if hedges are sent too early, too often or without cancellation.
- Requires observability that separates primary attempts, hedged attempts and wins.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●○○○○ 1/5 | Usually avoid; it adds complexity and extra load without meaningful tail-latency benefit. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for high-value replicated reads with measured straggler problems. |
| Large (>100k LOC) | ●●●●○ 4/5 | Powerful for large low-latency systems, but only with budgets, cancellation and idempotency. |

## Examples

### Hedging a slow replicated read

**❌ Negative (typescript)**

```typescript
// A single straggling replica controls the whole user-visible latency.
async function readProfile(userId: string): Promise<Profile> {
  return await replicas.primary.get<Profile>(`/profiles/${userId}`, { timeoutMs: 1_000 });
}
```

**✅ Positive (typescript)**

```typescript
async function readProfile(userId: string, signal: AbortSignal): Promise<Profile> {
  const controller = new AbortController();
  const combined = AbortSignal.any([signal, controller.signal]);

  const primary = replicas.primary.get<Profile>(`/profiles/${userId}`, {
    signal: combined,
    timeoutMs: 700,
  });

  const hedge = new Promise<Profile>((resolve, reject) => {
    setTimeout(() => {
      replicas.secondary.get<Profile>(`/profiles/${userId}`, {
        signal: combined,
        timeoutMs: 500,
      }).then(resolve, reject);
    }, 120);
  });

  try {
    return await Promise.any([primary, hedge]);
  } finally {
    controller.abort();
  }
}
```

*The positive version starts a backup read only after the primary exceeds a hedge delay, returns the first success, and cancels the losing request to limit extra work.*

## Relationships

**Synergies**

- [Timeout](../resilience/timeout.md) — Hedging needs an overall deadline so racing attempts cannot outlive the caller.
- [Idempotency](../resilience/idempotency.md) — Duplicate attempts are safe only when the operation can be repeated without changing the outcome.
- [Bulkhead](../resilience/bulkhead.md) — A separate hedge budget prevents speculative work from consuming all normal request capacity.
- [Rate Limiting](../resilience/rate-limiting.md) — Rate limits cap the extra traffic hedging introduces under tail-latency pressure.

**Alternatives:** [Retry with Backoff](../resilience/retry.md), [Cache-Aside](../cloud-distributed/cache-aside.md), [Load Shedding](../resilience/load-shedding.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, go, java, csharp
- **Frameworks:** none, nodejs, grpc, spring-boot, dotnet
- **Project types:** backend-service, web-api, microservices, distributed-system, low-latency
- **Tags:** resilience, tail-latency, speculative-execution, idempotency

## References

- Jeffrey Dean and Luiz André Barroso, The Tail at Scale, (2013)

