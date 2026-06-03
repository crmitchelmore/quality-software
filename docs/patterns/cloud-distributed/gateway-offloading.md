# Gateway Offloading

> Move common edge responsibilities such as TLS termination, authentication, rate limiting, caching, and compression from services into a gateway.

**Scale:** integration · **Altitude:** high · **Category:** cloud-distributed · **Maturity:** established

## Description

Gateway Offloading centralises cross-cutting request handling at the edge so backend services can focus on domain behaviour. The gateway terminates transport concerns, validates tokens, applies quotas, normalises headers, and can perform safe response caching or compression. The boundary must be explicit: services still enforce their own authorisation and invariants for defence in depth, while the gateway handles repetitive protocol and policy mechanics consistently.

**Problem.** Every service reimplements edge concerns differently, causing duplicated code, inconsistent security policy, and unnecessary CPU work on business services.

**Context.** API platforms, microservices, and ingress-heavy systems where many services share identical transport, authentication, throttling, or caching requirements.

## Consequences / Trade-offs

- Standardises cross-cutting behaviour and reduces duplicated service code.
- Lets backend services use simpler protocols or trust a smaller internal surface.
- The gateway becomes critical infrastructure and must be highly available and observable.
- Over-offloading can hide security decisions from services and create a single policy bottleneck.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually overkill unless a managed platform already provides it. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit once several services duplicate the same ingress policy. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for consistent security and traffic management across many services. |

## Examples

### Removing duplicated authentication checks

**❌ Negative (typescript)**

```typescript
app.get("/orders/:id", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const claims = await identityProvider.validate(token);
  await rateLimiter.consume(claims.subject);
  res.json(await orders.get(req.params.id, claims.subject));
});
```

**✅ Positive (typescript)**

```typescript
app.get("/orders/:id", async (req, res) => {
  const subject = req.header("x-authenticated-subject");
  if (!subject) return res.sendStatus(401);
  res.json(await orders.get(req.params.id, subject));
});
// The gateway validates tokens, enforces quotas, and sets the trusted header.
```

*The positive version removes repetitive edge mechanics from the service while still requiring a trusted authenticated subject before domain authorisation runs.*

## Relationships

**Synergies**

- [API Gateway](../architecture/api-gateway.md) — Offloading is one of the core operational responsibilities of an API gateway.
- [Gatekeeper](../cloud-distributed/gatekeeper.md) — A gateway can act as the protected entry point that screens requests before private services.
- [Rate Limiting](../resilience/rate-limiting.md) — Quotas are cheaper and more consistent when enforced before traffic fans out.
- [Token-Based Authentication](../security/token-based-auth.md) — Token validation and claim normalisation are common gateway offload tasks.

**Alternatives:** [Sidecar](../cloud-distributed/sidecar.md), [Service Mesh](../architecture/service-mesh.md), [Middleware Pipeline](../implementation/middleware-pipeline.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go
- **Frameworks:** kubernetes, istio, nodejs, spring-boot, dotnet
- **Project types:** web-api, microservices, backend-service, distributed-system, serverless
- **Tags:** edge, cross-cutting, security, ingress

## References

- [Microsoft Azure Architecture Center; Gateway Offloading pattern](https://learn.microsoft.com/azure/architecture/patterns/gateway-offloading)

