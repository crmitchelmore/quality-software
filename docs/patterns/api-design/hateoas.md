# HATEOAS

> Include hypermedia links and actions in representations so clients can discover valid next transitions rather than hard-coding workflows.

**Scale:** integration · **Altitude:** medium · **Category:** api-design · **Maturity:** established

## Description

HATEOAS, the hypermedia constraint of REST, makes the server advertise available links, forms, or actions with each resource representation. A client follows relations such as self, next, cancel, approve, or payment rather than manufacturing URLs and guessing state transitions. It improves evolvability for workflow-rich APIs, but it requires consistent relation names, media types, and client discipline to use links instead of treating them as decoration.

**Problem.** Clients often duplicate server workflow rules and endpoint construction, causing breakage when routes or valid state transitions change.

**Context.** Use where resources have state-dependent actions, long-lived external clients, or discoverability requirements. For simple internal CRUD APIs, full hypermedia may be more ceremony than value.

## Consequences / Trade-offs

- Clients can adapt to available actions based on server-provided state.
- Adds payload and design overhead: relation names and media types become contracts.
- Many client frameworks and teams ignore links unless intentionally designed around them.
- Can reduce out-of-band navigation documentation but not semantic documentation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often too much ceremony for small internal APIs. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful for workflow-heavy or public APIs, but adoption must be deliberate. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable for large long-lived API ecosystems when supported by relation governance and client tooling. |

## Examples

### Advertise valid actions

**❌ Negative (typescript)**

```typescript
res.json({
  id: order.id,
  status: order.status
});
// Client guesses that POST /orders/{id}/cancel is valid for every order.
```

**✅ Positive (typescript)**

```typescript
res.json({
  id: order.id,
  status: order.status,
  _links: {
    self: { href: `/orders/${order.id}` },
    ...(order.canCancel() ? { cancel: { href: `/orders/${order.id}/cancellation`, method: "POST" } } : {}),
    payment: { href: `/orders/${order.id}/payment` }
  }
});
```

*The positive representation tells clients which transitions are currently valid, reducing duplicated workflow logic.*

## Relationships

**Synergies**

- [REST](../api-design/rest.md) — HATEOAS is a REST constraint that strengthens resource navigation and evolvability.
- [State](../gof-behavioural/state.md) — State machines pair naturally with links that expose only valid transitions.
- [Pagination](../api-design/pagination.md) — Paginated collections can expose next, previous, first, and last relations.
- [API Versioning](../api-design/api-versioning.md) — Hypermedia can reduce hard-coded route coupling across versions, though relation semantics still need compatibility.

**Conflicts with:** [gRPC / RPC](../api-design/grpc-rpc.md)

**Alternatives:** [GraphQL Schema](../api-design/graphql.md), [Open Host Service](../ddd-strategic/open-host-service.md), [Published Language](../ddd-strategic/published-language.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python
- **Frameworks:** spring-boot, express, fastapi, aspnet, none
- **Project types:** web-api, sdk, backend-service
- **Tags:** hypermedia, links, workflow

