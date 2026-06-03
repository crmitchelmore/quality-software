# Timeout

> Bound how long a caller waits for an operation so slow dependencies release resources predictably instead of turning latency into cascading failure.

**Scale:** integration · **Altitude:** medium · **Category:** resilience · **Maturity:** time-tested

**Also known as:** Deadline, Request Budget

## Description

A timeout turns unbounded waiting into an explicit failure mode. Instead of allowing a thread, connection, event-loop task or queue worker to wait indefinitely, the caller sets a per-operation deadline that is shorter than its own upstream deadline. Effective timeout design uses separate connection, read and overall deadlines where supported, propagates cancellation to downstream work, and records whether the timeout happened before the dependency received the request or while waiting for a response. Timeouts are not just constants: they encode latency budgets and should be chosen from service objectives and observed percentile latency rather than arbitrary round numbers.

**Problem.** Slow dependencies are often more dangerous than failed dependencies because callers keep waiting, pools fill, queues grow and unrelated requests lose capacity. Without explicit deadlines, one stuck network call can pin resources long after the user has gone away.

**Context.** Apply to network calls, database queries, lock acquisition, queue receives, external process execution and any operation crossing a reliability boundary. The caller must know its own deadline and leave room for cleanup, retries or fallback.

## Consequences / Trade-offs

- Frees caller resources and makes slow failure observable instead of indefinite.
- Enables circuit breakers, retries and fallbacks to reason about latency, not only exceptions.
- Badly chosen values either fail healthy requests too aggressively or wait long enough to cascade.
- Requires cancellation propagation; otherwise timed-out work may keep running in the background.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Important for any external call, though a single-process app may only need simple client defaults. |
| Medium (≤100k LOC) | ●●●●● 5/5 | One of the highest-value safeguards for APIs, workers and integrations. |
| Large (>100k LOC) | ●●●●● 5/5 | Mandatory in distributed systems because latency cascades are common and hard to diagnose. |

## Examples

### Propagating an overall deadline

**❌ Negative (typescript)**

```typescript
// The default client may wait for minutes; the request thread remains occupied.
async function priceBasket(userId: string): Promise<Price> {
  const profile = await http.get<Profile>(`https://profiles/users/${userId}`);
  return await http.post<Price>("https://pricing/quote", { tier: profile.tier });
}
```

**✅ Positive (typescript)**

```typescript
async function priceBasket(userId: string, requestSignal: AbortSignal): Promise<Price> {
  const deadline = AbortSignal.timeout(1_500);
  const signal = AbortSignal.any([requestSignal, deadline]);

  const profile = await http.get<Profile>(`https://profiles/users/${userId}`, {
    signal,
    connectTimeoutMs: 200,
    timeoutMs: 500,
  });

  return await http.post<Price>("https://pricing/quote", { tier: profile.tier }, {
    signal,
    timeoutMs: 700,
  });
}
```

*The positive version budgets the full request, applies shorter per-call timeouts, and propagates cancellation so downstream work stops when the caller gives up.*

## Relationships

**Synergies**

- [Retry with Backoff](../resilience/retry.md) — Timeouts bound each retry attempt and prevent the retry policy exceeding the caller deadline.
- [Circuit Breaker](../resilience/circuit-breaker.md) — Breakers need timeouts so slow calls count as failures before resources are exhausted.
- [Fallback](../resilience/fallback.md) — A timeout creates the trigger point for serving cached, degraded or default responses.
- [Bulkhead](../resilience/bulkhead.md) — Bulkheads limit how many operations can be waiting when a timeout threshold is wrong.

**Alternatives:** [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md), [Request-Reply](../enterprise-integration/request-reply.md), [Fallback](../resilience/fallback.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go
- **Frameworks:** none, nodejs, spring-boot, dotnet, grpc
- **Project types:** backend-service, web-api, microservices, distributed-system, low-latency
- **Tags:** resilience, latency, cancellation, resource-management

## References

- Jeffrey Dean and Luiz André Barroso, The Tail at Scale, (2013)
- Michael T. Nygard, Release It! Design and Deploy Production-Ready Software, (2007)

