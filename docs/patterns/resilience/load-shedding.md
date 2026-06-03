# Load Shedding

> Deliberately reject or degrade lower-value work during overload so the system can continue serving its most important traffic within safe resource limits.

**Scale:** integration · **Altitude:** medium · **Category:** resilience · **Maturity:** established

**Also known as:** Controlled Rejection, Brownout

## Description

Load shedding is an overload protection pattern: when admission control detects that latency, concurrency, queue depth, CPU or error budgets are beyond safe limits, the system refuses selected work instead of accepting everything and failing globally. Shedding may return 429/503, skip optional features, reduce result quality, sample analytics, or reject low-priority tenants first. The key is intentionality: define priority classes, rejection signals and client retry guidance before overload, then emit metrics showing what was shed and why.

**Problem.** Systems often keep accepting requests after they have no realistic capacity to complete them. Queues grow, latency explodes, clients retry, and eventually even high-value work fails because resources are consumed by work that will time out anyway.

**Context.** Use at APIs, gateways, workers and queue consumers where overload is possible and some traffic is more valuable or more urgent than other traffic. It is most effective with measurable saturation signals and clients that respect retry-after guidance.

## Consequences / Trade-offs

- Preserves capacity for critical work and keeps overload local rather than global.
- Produces explicit, fast failure instead of hidden queueing and timeouts.
- Requires product and operational decisions about priority and fairness.
- Can harm users if shedding criteria are opaque, unfair or too aggressive.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely needed unless the app has visible overload modes or expensive background work. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for APIs and worker systems with bursts, priorities or external clients. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for internet-scale and multi-tenant systems where overload is routine. |

## Examples

### Rejecting low-priority traffic when saturated

**❌ Negative (typescript)**

```typescript
// Accepts every request even when the queue is already beyond useful latency.
app.post("/reports", async (req, res) => {
  await reportQueue.add(req.body);
  res.status(202).json({ accepted: true });
});
```

**✅ Positive (typescript)**

```typescript
app.post("/reports", async (req, res) => {
  const queueDepth = await reportQueue.depth();
  const priority = req.header("x-priority") ?? "normal";

  if (queueDepth > 10_000 && priority !== "critical") {
    res.setHeader("Retry-After", "60");
    res.status(503).json({ accepted: false, reason: "report service overloaded" });
    return;
  }

  await reportQueue.add(req.body, { priority });
  res.status(202).json({ accepted: true });
});
```

*The positive version refuses lower-priority work when the queue is saturated, gives clients retry guidance, and preserves capacity for critical reports.*

## Relationships

**Synergies**

- [Bulkhead](../resilience/bulkhead.md) — Bulkheads define which compartment is full; shedding rejects only that class instead of all work.
- [Rate Limiting](../resilience/rate-limiting.md) — Rate limits prevent predictable overload while shedding reacts to real-time saturation.
- [Backpressure](../resilience/backpressure.md) — Backpressure slows cooperative producers; shedding handles producers that cannot or will not slow down.
- [Fallback](../resilience/fallback.md) — Optional features can be degraded or skipped instead of rejecting the whole request.

**Alternatives:** [Throttling](../cloud-distributed/throttling.md), [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md), [Fallback](../resilience/fallback.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, go, java, python
- **Frameworks:** none, nodejs, spring-boot, kubernetes, istio
- **Project types:** web-api, backend-service, microservices, distributed-system, high-throughput
- **Tags:** resilience, overload-protection, admission-control, graceful-degradation

## References

- [Google, Site Reliability Engineering; Handling Overload](https://sre.google/sre-book/handling-overload/)

