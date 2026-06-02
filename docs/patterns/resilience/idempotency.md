# Idempotency

> Design an operation so repeating the same request has the same intended effect as performing it once, making retries and duplicate delivery safe.

**Scale:** integration · **Category:** resilience · **Maturity:** time-tested

**Also known as:** Safe Repeatability, Deduplicated Side Effects

## Description

Idempotency makes integration reliable in the presence of uncertain outcomes. When a caller times out after sending a request, it may not know whether the server committed the side effect; when a message broker redelivers, the consumer may see the same work twice. Idempotent design gives the operation a stable identity, records completed or in-flight outcomes, and returns the original result for duplicates rather than doing the side effect again. Some operations are naturally idempotent, such as setting a resource to a specific state; others need explicit keys, uniqueness constraints or idempotent receivers.

**Problem.** Distributed systems cannot reliably distinguish "request lost" from "response lost". Without idempotency, safe retry and at-least-once delivery can duplicate payments, emails, shipments, records or commands.

**Context.** Use for commands crossing process boundaries, message consumers, payment/order flows, provisioning, webhooks and any write operation clients may retry. The deduplication record should live in the same durability boundary as the side effect where possible.

## Consequences / Trade-offs

- Enables safe retries and at-least-once delivery without duplicate side effects.
- Provides clearer operation identity and auditability across service boundaries.
- Requires durable storage, expiry policy and careful handling of concurrent duplicates.
- Can be hard for operations whose result depends on time, randomness or external side effects.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Important for payment-like or externally retried writes, even in small systems. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Critical once APIs, workers or webhooks retry side-effecting operations. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational for reliable distributed commands, event processing and sagas. |

## Examples

### Deduplicating side-effecting commands

**❌ Negative (typescript)**

```typescript
// If the client times out and retries, the customer may be charged twice.
app.post("/charges", async (req, res) => {
  const charge = await paymentGateway.charge(req.body.customerId, req.body.amount);
  await db.charges.insert({ customerId: req.body.customerId, gatewayId: charge.id });
  res.status(201).json(charge);
});
```

**✅ Positive (typescript)**

```typescript
app.post("/charges", async (req, res) => {
  const key = req.header("Idempotency-Key");
  if (!key) {
    res.status(400).json({ error: "Idempotency-Key required" });
    return;
  }

  const existing = await db.idempotency.find(key);
  if (existing?.status === "completed") {
    res.status(200).json(existing.response);
    return;
  }

  const result = await db.transaction(async tx => {
    await tx.idempotency.reserve(key, "charges.create");
    const charge = await paymentGateway.charge(req.body.customerId, req.body.amount, { key });
    await tx.charges.insert({ customerId: req.body.customerId, gatewayId: charge.id });
    await tx.idempotency.complete(key, charge);
    return charge;
  });

  res.status(201).json(result);
});
```

*The positive version requires a stable operation key, records the completed response, and returns that response for duplicate attempts instead of charging again.*

## Relationships

**Synergies**

- [Retry with Backoff](../resilience/retry.md) — Retry becomes safe for writes only when repeated attempts cannot duplicate the side effect.
- [Idempotency Key](../api-design/idempotency-key.md) — Idempotency keys give HTTP clients a stable request identity for deduplication.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Message consumers use the same idea to ignore duplicate deliveries.
- [Transactional Outbox](../cloud-distributed/outbox.md) — The outbox records emitted messages durably so replay and publication can be idempotent.

**Alternatives:** [Compensating Transaction](../cloud-distributed/compensating-transaction.md), [Saga](../cloud-distributed/saga.md), [Pessimistic Offline Lock](../enterprise-application/pessimistic-offline-lock.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, nodejs, spring-boot, dotnet, kafka
- **Project types:** web-api, backend-service, microservices, distributed-system, data-pipeline
- **Tags:** resilience, duplicate-suppression, consistency, safe-retry

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns; Idempotent Receiver, (2003)
- [Stripe API Idempotent Requests](https://stripe.com/docs/idempotency)

