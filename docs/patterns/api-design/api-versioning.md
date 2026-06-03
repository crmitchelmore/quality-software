# API Versioning

> Evolve API contracts without breaking existing clients by making compatibility, deprecation, and migration rules explicit.

**Scale:** integration · **Altitude:** medium · **Category:** api-design · **Maturity:** time-tested

## Description

API Versioning defines how clients opt into a contract and how providers introduce, deprecate, and retire changes. Versions may appear in URLs, headers, media types, schemas, or fields, but the important pattern is governance: additive changes are preferred, breaking changes are isolated, sunset dates are communicated, and observability shows who still uses old behaviour. Versioning is a lifecycle discipline, not just a string in a route.

**Problem.** APIs inevitably change, and unmanaged breaking changes cause client outages or force providers to freeze flawed contracts forever.

**Context.** Use for any API consumed outside a single deployment unit. Internal APIs also need versioning when clients cannot all update atomically.

## Consequences / Trade-offs

- Protects existing clients while allowing deliberate contract evolution.
- Too many active versions multiply tests, documentation, security fixes, and support burden.
- URL versions are simple but can overstate differences; media-type or field evolution can be subtler.
- Deprecation without usage telemetry becomes guesswork.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when even a small API has external clients; otherwise can be lightweight policy. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Essential once clients deploy independently. |
| Large (>100k LOC) | ●●●●● 5/5 | Load-bearing for large ecosystems; requires telemetry, deprecation policy, and contract tests. |

## Examples

### Do not change response meaning in place

**❌ Negative (typescript)**

```typescript
app.get("/orders/:id", async (req, res) => {
  const order = await orders.get(req.params.id);
  res.json({ id: order.id, total: order.totalCents }); // used to be decimal pounds
});
```

**✅ Positive (typescript)**

```typescript
app.get("/v1/orders/:id", async (req, res) => {
  const order = await orders.get(req.params.id);
  res.json({ id: order.id, total: order.totalPounds });
});

app.get("/v2/orders/:id", async (req, res) => {
  const order = await orders.get(req.params.id);
  res.json({ id: order.id, total_cents: order.totalCents });
});
```

*The positive version isolates a breaking representation change so existing clients keep their contract while new clients opt into v2.*

## Relationships

**Synergies**

- [Contract-First API (OpenAPI)](../api-design/contract-first-api.md) — Contract files make version differences reviewable and testable before implementation.
- [Problem Details (RFC 7807 Errors)](../api-design/problem-details.md) — Error shapes should remain stable across versions or change only through a clear version boundary.
- [REST](../api-design/rest.md) — REST APIs commonly expose major versions through URLs or media types.
- [GraphQL Schema](../api-design/graphql.md) — GraphQL usually versions through additive schema evolution and deprecation metadata rather than endpoint versions.

**Conflicts with:** [Shared Kernel](../ddd-strategic/shared-kernel.md)

**Alternatives:** [Strangler Fig](../architecture/strangler-fig.md), [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md), [Published Language](../ddd-strategic/published-language.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python, csharp
- **Frameworks:** express, spring-boot, fastapi, aspnet, graphql
- **Project types:** web-api, sdk, backend-service, microservices
- **Tags:** compatibility, deprecation, contract-lifecycle

