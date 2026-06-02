# GraphQL Schema

> Expose a typed graph schema that lets clients request exactly the fields and relationships they need through queries and mutations.

**Scale:** integration · **Category:** api-design · **Maturity:** established

## Description

A GraphQL schema defines object types, fields, arguments, mutations, and subscriptions as the API contract. Clients compose queries that traverse relationships, while resolvers fetch and authorise the required data. The pattern shines when many clients need different shapes over the same domain, but it demands query cost controls, batching, stable schema governance, and careful error and nullability design to avoid turning flexibility into operational risk.

**Problem.** Multiple clients often need different combinations of related data, causing REST APIs to proliferate endpoints or force over-fetching and under-fetching.

**Context.** Use for product APIs with diverse clients and graph-shaped reads. Prefer REST for cacheable resource APIs and gRPC for service-to-service protocols with strict latency and streaming needs.

## Consequences / Trade-offs

- Clients can evolve screens without waiting for every bespoke endpoint.
- The schema becomes a strong contract with introspection and generated types.
- Unbounded nested queries can cause N+1 explosions or expensive database scans.
- HTTP caching and status semantics are less direct than in resource-oriented REST.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for small multi-client products, but schema and resolver machinery can be heavier than REST. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent when frontend and mobile clients need varied graph-shaped data. |
| Large (>100k LOC) | ●●●●○ 4/5 | Powerful at large scale with governance, cost limits, persisted queries, and ownership boundaries. |

## Examples

### Batch resolver access

**❌ Negative (typescript)**

```typescript
const resolvers = {
  Order: {
    customer: (order: Order) =>
      db.query("SELECT * FROM customers WHERE id=$1", [order.customerId])
  }
};
// Listing 100 orders performs 100 customer queries.
```

**✅ Positive (typescript)**

```typescript
const resolvers = {
  Order: {
    customer: (order: Order, _args: unknown, ctx: Context) =>
      ctx.customers.findByIdsBatched.load(order.customerId)
  }
};
```

*The positive version preserves GraphQL flexibility while batching data access so a nested query does not become an N+1 database problem.*

## Relationships

**Synergies**

- [Backend for Frontend (BFF)](../architecture/backend-for-frontend.md) — GraphQL often acts as a flexible BFF contract tailored to frontend needs.
- [Query Object](../enterprise-application/query-object.md) — Query objects can package complex resolver criteria without leaking ad hoc SQL into field resolvers.
- [API Versioning](../api-design/api-versioning.md) — GraphQL usually evolves through additive fields and deprecation instead of URL versions.
- [Gateway Aggregation](../cloud-distributed/gateway-aggregation.md) — A graph gateway can aggregate multiple backend services behind one client-facing schema.

**Conflicts with:** [REST](../api-design/rest.md), [gRPC / RPC](../api-design/grpc-rpc.md)

**Alternatives:** [REST](../api-design/rest.md), [gRPC / RPC](../api-design/grpc-rpc.md), [Gateway Aggregation](../cloud-distributed/gateway-aggregation.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python, go
- **Frameworks:** graphql, nodejs, spring-boot, fastapi, none
- **Project types:** web-api, web-frontend, backend-service, mobile-app
- **Tags:** schema, client-driven-queries, typed-api

