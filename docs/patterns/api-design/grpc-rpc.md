# gRPC / RPC

> Define strongly typed service operations and messages, commonly over HTTP/2 with Protocol Buffers, for internal calls and streaming.

**Scale:** integration · **Category:** api-design · **Maturity:** established

## Description

gRPC and similar RPC styles model integration as explicit service methods with request and response messages rather than resources. Interface definitions generate clients and servers, making contracts precise across languages. The pattern is well suited to internal low-latency systems, bidirectional streaming, and platform-owned APIs; it is less convenient for browsers, caching intermediaries, and human exploration than REST.

**Problem.** Hand-written JSON clients and loosely documented internal endpoints drift from server reality and waste effort on repetitive transport code.

**Context.** Use for service-to-service APIs where both sides can share generated contracts and operational tooling. Prefer REST for broad public interoperability and GraphQL for client-driven graph reads.

## Consequences / Trade-offs

- Generated stubs provide strong typing and reduce client/server contract drift.
- Binary protocols and method semantics are less transparent to generic HTTP tooling.
- Schema evolution requires discipline around field numbers, compatibility, and deprecation.
- Streaming and deadlines are first-class, making backpressure and cancellation easier to express.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary for small apps unless streaming or cross-language contracts are central. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for internal services with generated clients and deadlines. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large service meshes and low-latency platforms with strong contract governance. |

## Examples

### Use typed contracts instead of ad hoc JSON

**❌ Negative (typescript)**

```typescript
const response = await fetch("http://pricing/call", {
  method: "POST",
  body: JSON.stringify({ method: "price", sku: item.sku, qty: item.qty })
});
const price = (await response.json()).amount;
```

**✅ Positive (typescript)**

```typescript
const deadline = new Date(Date.now() + 200);
const price = await pricingClient.price({ sku: item.sku, quantity: item.qty }, { deadline });
invoice.addLine(item.sku, price.amount);
```

*The positive version uses a generated client with typed fields and an explicit deadline, reducing contract drift and unbounded waits.*

## Relationships

**Synergies**

- [Contract-First API (OpenAPI)](../api-design/contract-first-api.md) — Both patterns start from an explicit contract; gRPC uses IDL while REST commonly uses OpenAPI.
- [Timeout](../resilience/timeout.md) — RPC calls should carry deadlines so upstream services do not wait indefinitely.
- [Circuit Breaker](../resilience/circuit-breaker.md) — Internal RPC clients benefit from circuit breakers around dependent services.
- [Bulkhead](../resilience/bulkhead.md) — Separate client pools isolate slow dependencies from unrelated calls.

**Conflicts with:** [REST](../api-design/rest.md), [GraphQL Schema](../api-design/graphql.md)

**Alternatives:** [REST](../api-design/rest.md), [GraphQL Schema](../api-design/graphql.md), [Request-Reply](../enterprise-integration/request-reply.md)

## Applicability tags

- **Languages:** language-agnostic, go, java, typescript, csharp
- **Frameworks:** grpc, spring-boot, dotnet, nodejs, none
- **Project types:** microservices, backend-service, distributed-system, low-latency
- **Tags:** rpc, protobuf, service-to-service

