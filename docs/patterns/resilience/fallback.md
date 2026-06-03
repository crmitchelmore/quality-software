# Fallback

> Provide a deliberately degraded response when the preferred dependency or behaviour fails, preserving the most important user or system outcome.

**Scale:** integration · **Altitude:** medium · **Category:** resilience · **Maturity:** established

**Also known as:** Graceful Degradation, Degraded Response

## Description

A fallback defines what the system should do when its ideal path is unavailable. Instead of letting an exception or timeout surface raw to the caller, the system may return cached data, default recommendations, a read-only view, queued acceptance, or a precise degraded error. The pattern is not a blanket catch-all: a good fallback is pre-designed, observable, safe for the domain, and honest about freshness or reduced capability. It should protect user experience and system stability without silently corrupting decisions that require authoritative data.

**Problem.** Dependencies fail and optional features often share the same request path as critical ones. If every missing enrichment aborts the whole operation, small outages become large user-visible failures.

**Context.** Use where some value is better than none, the degraded behaviour is acceptable to the domain, and callers can tolerate stale, partial or queued outcomes. Avoid fallback for safety-critical decisions, financial authorisation, or cases where a default could be mistaken for confirmed truth.

## Consequences / Trade-offs

- Improves availability and user experience during partial dependency failure.
- Forces product and engineering teams to define acceptable degraded modes explicitly.
- Can hide outages or serve stale/misleading data if not labelled and monitored.
- Requires domain judgement; the wrong fallback may be worse than an explicit failure.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when optional external features exist; unnecessary for simple CRUD with no degraded mode. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Valuable for user-facing APIs and jobs with clearly separable critical and optional work. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for graceful degradation across many dependencies and product surfaces. |

## Examples

### Returning last-known-good data explicitly

**❌ Negative (typescript)**

```typescript
async function getProductPage(id: string): Promise<ProductPage> {
  const product = await productClient.get(id);
  const recommendations = await recommendationClient.forProduct(id);
  return { product, recommendations };
}
```

**✅ Positive (typescript)**

```typescript
async function getProductPage(id: string): Promise<ProductPage> {
  const product = await productClient.get(id);
  try {
    const recommendations = await recommendationClient.forProduct(id, { timeoutMs: 250 });
    await cache.set(`recommendations:${id}`, recommendations, { ttlSeconds: 3600 });
    return { product, recommendations, degraded: false };
  } catch (error) {
    logger.warn({ error, productId: id }, "serving cached recommendations");
    const cached = await cache.get<Recommendation[]>(`recommendations:${id}`);
    return { product, recommendations: cached ?? [], degraded: true };
  }
}
```

*The positive version keeps the critical product page available, labels the response as degraded, and logs fallback activation instead of treating all data as mandatory.*

## Relationships

**Synergies**

- [Circuit Breaker](../resilience/circuit-breaker.md) — The open circuit creates a clear point to return a cached or degraded response.
- [Timeout](../resilience/timeout.md) — A timeout defines when to abandon the primary path and activate fallback.
- [Cache-Aside](../cloud-distributed/cache-aside.md) — A cache can supply last-known-good data when the authoritative service is unavailable.
- [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md) — Non-urgent writes can fall back to queued acceptance rather than synchronous completion.

**Alternatives:** [Retry with Backoff](../resilience/retry.md), [Load Shedding](../resilience/load-shedding.md), [Request-Reply](../enterprise-integration/request-reply.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python, csharp
- **Frameworks:** none, nodejs, spring-boot, dotnet, redis
- **Project types:** web-api, backend-service, microservices, distributed-system, web-frontend
- **Tags:** resilience, graceful-degradation, availability, cached-response

## References

- Michael T. Nygard, Release It! Design and Deploy Production-Ready Software, (2007)

