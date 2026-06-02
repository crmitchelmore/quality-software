# REST

> Model an HTTP API around resources, representations, standard methods, status codes, and cache semantics.

**Scale:** integration · **Category:** api-design · **Maturity:** time-tested

## Description

REST uses HTTP as an application protocol: resources are addressed by stable URIs, manipulated with methods such as GET, POST, PUT, PATCH, and DELETE, and represented with media types like JSON. Good REST APIs make safety, idempotency, cacheability, conditional requests, and error semantics explicit rather than tunnelling every action through a generic endpoint. Hypermedia is optional in many pragmatic APIs, but the resource model and HTTP semantics are not.

**Problem.** APIs built as arbitrary remote procedure calls over HTTP lose standard caching, status, idempotency, observability, and tooling benefits.

**Context.** Use for public or internal APIs where resource lifecycles, interoperability, browser/client support, and HTTP infrastructure matter. Prefer GraphQL for client-selected graphs and gRPC for low-latency strongly typed service-to-service calls.

## Consequences / Trade-offs

- Excellent ecosystem support: gateways, caches, logs, documentation, and client libraries understand HTTP.
- Resource modelling can be awkward for command-heavy workflows or streaming interactions.
- Over-fetching and under-fetching are common without careful endpoint design.
- Consistency depends on disciplined methods, status codes, problem details, pagination, and versioning.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent default for small APIs because tooling and conventions reduce custom protocol work. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong fit for most medium product APIs. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still important at large scale, though GraphQL, gRPC, events, and specialised protocols often complement it. |

## Examples

### Use resource semantics, not a command tunnel

**❌ Negative (typescript)**

```typescript
app.post("/api", async (req, res) => {
  if (req.body.action === "getUser") res.json(await users.get(req.body.id));
  if (req.body.action === "deleteUser") res.json(await users.delete(req.body.id));
});
```

**✅ Positive (typescript)**

```typescript
app.get("/users/:id", async (req, res) => {
  const user = await users.get(req.params.id);
  if (!user) return res.status(404).type("application/problem+json").json(notFound());
  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  await users.delete(req.params.id);
  res.status(204).end();
});
```

*The positive version lets clients, caches, gateways, and logs understand the operation through standard HTTP method and resource semantics.*

## Relationships

**Synergies**

- [API Versioning](../api-design/api-versioning.md) — Versioning defines how resource contracts evolve without surprising existing clients.
- [Problem Details (RFC 7807 Errors)](../api-design/problem-details.md) — Problem Details gives REST errors a standard machine-readable shape.
- [ETag / Conditional Request](../api-design/etag-conditional-request.md) — ETags bring HTTP cache validation and optimistic concurrency to resource representations.
- [Pagination](../api-design/pagination.md) — Collection resources need bounded, navigable pages rather than unbounded arrays.

**Conflicts with:** [GraphQL Schema](../api-design/graphql.md), [gRPC / RPC](../api-design/grpc-rpc.md)

**Alternatives:** [GraphQL Schema](../api-design/graphql.md), [gRPC / RPC](../api-design/grpc-rpc.md), [Request-Reply](../enterprise-integration/request-reply.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python, go
- **Frameworks:** express, fastapi, spring-boot, aspnet, rails
- **Project types:** web-api, backend-service, microservices, sdk
- **Tags:** http, resources, interoperability

