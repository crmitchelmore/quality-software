# Health Endpoint Monitoring

> Expose lightweight health endpoints that external monitors, load balancers, and orchestrators can probe to detect liveness, readiness, and dependency degradation.

**Scale:** integration · **Altitude:** medium · **Category:** cloud-distributed · **Maturity:** established

## Description

Health Endpoint Monitoring gives infrastructure a contract for deciding whether an instance should receive traffic, be restarted, or trigger an alert. Good endpoints distinguish liveness from readiness and deep dependency checks: a process can be alive but not ready for traffic, or ready for degraded traffic while an optional dependency is unavailable. The endpoint should be cheap, authenticated where needed, and specific enough to avoid both false positives and cascading checks that overload shared dependencies.

**Problem.** Without an external health contract, platforms keep routing to broken instances or restart healthy ones based on misleading process-level signals.

**Context.** Services behind load balancers, orchestrators, API gateways, or synthetic monitors where automated routing and alerting depend on application health.

## Consequences / Trade-offs

- Enables fast removal of unready instances from traffic and clearer alerting.
- Separates process liveness from business readiness and dependency degradation.
- Bad checks can cause restart loops, false incidents, or load spikes against dependencies.
- Health data may reveal internals and should not expose sensitive details publicly.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for any deployed service, though checks should stay simple. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default once load balancers, containers, or alerts rely on service health. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for fleet automation, progressive delivery, and regional failover. |

## Examples

### Separating liveness and readiness

**❌ Negative (typescript)**

```typescript
app.get("/health", async (_req, res) => {
  await database.query("SELECT count(*) FROM huge_table");
  await paymentGateway.ping();
  res.send("ok");
});
```

**✅ Positive (typescript)**

```typescript
app.get("/live", (_req, res) => res.status(200).send("alive"));

app.get("/ready", async (_req, res) => {
  const db = await checks.databaseCanAcceptWrites();
  const queue = await checks.outboxLagBelow(5000);
  res.status(db && queue ? 200 : 503).json({ ready: db && queue });
});
```

*The positive version keeps liveness cheap and readiness focused on dependencies required for serving traffic, avoiding expensive probes and misleading restarts.*

## Relationships

**Synergies**

- [Circuit Breaker](../resilience/circuit-breaker.md) — Health can report degraded dependency state without forcing every probe to call the dependency.
- [Deployment Stamp (Cells)](../cloud-distributed/deployment-stamp.md) — Stamp-level routing depends on consistent health signals from every instance.
- [Gateway Offloading](../cloud-distributed/gateway-offloading.md) — Gateways and load balancers consume readiness signals before forwarding requests.
- [Bulkhead](../resilience/bulkhead.md) — Health checks should use isolated resources so they are not starved by normal traffic.

**Alternatives:** [Audit Logging](../security/audit-logging.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** kubernetes, spring-boot, dotnet, express, fastapi
- **Project types:** web-api, backend-service, microservices, distributed-system, serverless
- **Tags:** observability, readiness, liveness, operations

## References

- [Microsoft Azure Architecture Center; Health Endpoint Monitoring pattern](https://learn.microsoft.com/azure/architecture/patterns/health-endpoint-monitoring)

