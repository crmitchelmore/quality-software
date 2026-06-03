# Gateway Aggregation

> Let an API gateway or edge service combine several backend calls into one client response, reducing client chattiness and hiding backend topology.

**Scale:** integration · **Altitude:** high · **Category:** cloud-distributed · **Maturity:** established

## Description

Gateway Aggregation places a composition layer close to the client. The gateway fetches data from multiple backend APIs, applies timeouts and fallbacks, and returns a response shaped for one screen or use case. It is most valuable when clients would otherwise make many high-latency calls or need to know service boundaries. It should remain an orchestration and composition layer, not a hidden domain service with its own durable business state.

**Problem.** Clients become chatty and coupled to internal service topology, producing slow page loads and brittle release coordination across many backend APIs.

**Context.** Mobile, web, and partner APIs backed by multiple services where one client operation needs data from several sources.

## Consequences / Trade-offs

- Reduces client latency and simplifies client code by hiding fan-out.
- Centralises cross-cutting timeouts, partial responses, and response shaping.
- Can become a bottleneck or god service if domain logic accumulates at the gateway.
- Requires careful caching and per-backend resilience to avoid amplifying failures.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often unnecessary for small apps; direct backend endpoints are simpler. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit when client latency and backend fan-out become visible problems. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at scale, but split by client or domain to avoid a central bottleneck. |

## Examples

### Composing a product page

**❌ Negative (typescript)**

```typescript
// Browser knows every service and waits on many round trips.
const product = await fetch(`/catalogue/${id}`).then(r => r.json());
const price = await fetch(`/pricing/${id}`).then(r => r.json());
const stock = await fetch(`/inventory/${id}`).then(r => r.json());
```

**✅ Positive (typescript)**

```typescript
app.get("/product-page/:id", async (req, res) => {
  const id = req.params.id;
  const [product, price, stock] = await Promise.all([
    catalogue.getProduct(id),
    pricing.getPrice(id),
    inventory.getAvailability(id),
  ]);

  res.json({ id, name: product.name, price: price.amount, available: stock.available });
});
```

*The positive version lets the edge compose backend responses once, so the client receives a use-case response without learning internal service boundaries.*

## Relationships

**Synergies**

- [API Gateway](../architecture/api-gateway.md) — Aggregation is a specialised responsibility often hosted inside an API gateway.
- [Backend for Frontend (BFF)](../architecture/backend-for-frontend.md) — BFFs use aggregation to produce screen-specific responses for one client type.
- [Aggregator](../enterprise-integration/aggregator.md) — The integration aggregator pattern guides correlation and completeness rules for combining results.
- [Timeout](../resilience/timeout.md) — Backend fan-out must be bounded so one slow dependency does not hold the whole response hostage.

**Conflicts with:** [Monolith](../architecture/monolith.md)

**Alternatives:** [Backend for Frontend (BFF)](../architecture/backend-for-frontend.md), [GraphQL Schema](../api-design/graphql.md), [Scatter-Gather](../enterprise-integration/scatter-gather.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** nodejs, express, nestjs, spring-boot, dotnet, graphql
- **Project types:** web-api, backend-service, microservices, mobile-app, distributed-system
- **Tags:** api-gateway, composition, edge, latency

## References

- [Microsoft Azure Architecture Center; Gateway Aggregation pattern](https://learn.microsoft.com/azure/architecture/patterns/gateway-aggregation)

