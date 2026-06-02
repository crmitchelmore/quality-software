# Open Host Service

> Offer a stable, well-documented service interface that multiple downstream contexts can use without bespoke point-to-point integrations.

**Scale:** integration · **Category:** ddd-strategic · **Maturity:** time-tested

## Description

Open Host Service is a strategic integration pattern where a bounded context exposes a public protocol or API for other contexts to consume. Instead of creating custom endpoints for every downstream team, the provider designs a stable service surface, documents it, versions it, and supports multiple consumers. It is often paired with a published language that defines the messages, resource representations, or event schemas. The service is open to intended consumers, not necessarily public on the internet.

**Problem.** Point-to-point integrations multiply as each consumer gets a bespoke API, feed, or database view. Provider teams then spend most of their time maintaining slight variants and downstream teams cannot predict compatibility.

**Context.** Use open host service when one bounded context has a capability consumed by several other contexts and the provider can own a product-like API contract.

## Consequences / Trade-offs

- Reduces bespoke integration surfaces and gives consumers a stable entry point.
- Encourages provider ownership of documentation, versioning, and compatibility.
- Works best with a published language for payload semantics.
- Can become a lowest-common-denominator API if consumer needs are not curated.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary for one consumer; a direct API or module call is simpler. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit once a capability has several consumers and compatibility starts to matter. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large ecosystems because it turns an internal capability into a governed product-like integration surface. |

## Examples

### Stable service interface rather than bespoke endpoints

**❌ Negative (typescript)**

```typescript
app.get("/billing/orders-for-shipping", handlerForShipping);
app.get("/billing/orders-for-reporting", handlerForReporting);
app.get("/billing/orders-for-support", handlerForSupport);

// Each endpoint returns a slightly different shape and lifecycle vocabulary.
```

**✅ Positive (typescript)**

```typescript
app.get("/v1/invoices/:invoiceId", getInvoice);
app.get("/v1/accounts/:accountId/invoices", listAccountInvoices);

interface PublishedInvoice {
  invoiceId: string;
  accountId: string;
  status: "issued" | "paid" | "void";
  total: { cents: number; currency: string };
}
```

*The positive version exposes a stable host service with a published invoice representation that multiple consumers can use, instead of bespoke downstream-specific shapes.*

## Relationships

**Synergies**

- [Published Language](../ddd-strategic/published-language.md) — Published language defines the stable payloads and terms used by the open host service.
- [Bounded Context](../ddd-strategic/bounded-context.md) — The service exposes one context's capabilities without exposing its internal model wholesale.
- [Context Map](../ddd-strategic/context-map.md) — OHS relationships should be visible where multiple downstream contexts depend on the provider.
- [API Versioning](../api-design/api-versioning.md) — Versioning protects consumers as the host service evolves.

**Conflicts with:** [Shared Kernel](../ddd-strategic/shared-kernel.md)

**Alternatives:** [Customer-Supplier](../ddd-strategic/customer-supplier.md), [Message Bus](../enterprise-integration/message-bus.md), [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, spring-boot, dotnet, grpc, graphql
- **Project types:** backend-service, microservices, distributed-system, web-api
- **Tags:** ddd, integration, api-design, strategic-design

## References

- Eric Evans, Domain-Driven Design, (2003)

