# Throttling

> Intentionally limit request or work rates so clients, services, and dependencies stay within agreed capacity instead of failing unpredictably under load.

**Scale:** integration · **Category:** cloud-distributed · **Maturity:** time-tested

## Description

Throttling enforces a maximum rate or concurrency for a caller, tenant, operation, or downstream dependency. Unlike passive overload handling, it is an explicit control: requests above the budget are delayed, queued, degraded, or rejected with a clear retry signal. Good throttling protects shared systems from noisy neighbours and preserves fairness, but it must be observable and aligned with product contracts so legitimate traffic is not silently harmed.

**Problem.** Without explicit limits, a single tenant, client bug, or burst can consume shared capacity and cause broad latency or outages.

**Context.** Use at APIs, worker pools, third-party integrations, and tenant boundaries where capacity is finite and fairness or provider quotas matter.

## Consequences / Trade-offs

- Protects dependencies and shared capacity before saturation turns into an outage.
- Makes fairness and quotas explicit through documented limits and retry signals.
- Can harm user experience if limits are too low or opaque.
- Requires distributed counters or token buckets when traffic is spread across many instances.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful at public API or third-party boundaries, but avoid complex distributed limiters too early. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for multi-tenant services and rate-limited integrations. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for fairness and overload control in large distributed systems. |

## Examples

### Tenant-aware outbound throttling

**❌ Negative (typescript)**

```typescript
// A busy tenant can consume all provider quota and starve everyone else.
async function enrichLead(tenantId: string, lead: Lead): Promise<EnrichedLead> {
  return provider.enrich(lead);
}
```

**✅ Positive (typescript)**

```typescript
async function enrichLead(tenantId: string, lead: Lead): Promise<EnrichedLead> {
  const permit = await throttle.take(`provider:${tenantId}`, { ratePerSecond: 5, burst: 20 });
  if (!permit.granted) throw new RetryAfterError(permit.retryAfterMs);
  return provider.enrich(lead);
}
```

*The positive version gives each tenant an explicit provider budget and returns a retry signal instead of allowing one tenant to exhaust shared quota.*

## Relationships

**Synergies**

- [Rate Limiting](../resilience/rate-limiting.md) — Rate limiting is the common API-facing form of throttling with per-client budgets.
- [Backpressure](../resilience/backpressure.md) — Throttling turns capacity pressure into a concrete slow-down signal.
- [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md) — Excess work can be queued and drained at the throttled rate instead of being rejected.
- [Bulkhead](../resilience/bulkhead.md) — Per-tenant or per-operation throttles combine with isolated resource pools for stronger containment.

**Alternatives:** [Load Shedding](../resilience/load-shedding.md), [Rate Limiting](../resilience/rate-limiting.md), [Backpressure](../resilience/backpressure.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** redis, nodejs, spring-boot, dotnet, istio
- **Project types:** web-api, backend-service, microservices, distributed-system, high-throughput
- **Tags:** quotas, overload-protection, fairness

## References

- [Microsoft Azure Architecture Center; Throttling pattern](https://learn.microsoft.com/azure/architecture/patterns/throttling)

