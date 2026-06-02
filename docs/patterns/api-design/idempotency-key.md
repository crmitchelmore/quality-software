# Idempotency Key

> Require clients to send a stable key for retried non-idempotent requests so the server can return the original result.

**Scale:** integration · **Category:** api-design · **Maturity:** established

## Description

An Idempotency Key identifies the logical operation, not an individual HTTP attempt. The server stores the key, request fingerprint, processing state, and final response or resource reference inside the same durable boundary as the side effect. If the client retries after a timeout or connection drop, the server recognises the key and either resumes, waits, or returns the original outcome. This pattern is crucial for payments, orders, fulfilment, and any at-least-once delivery path.

**Problem.** Clients, gateways, and job runners retry requests when responses are lost, but repeating a non-idempotent operation can charge, reserve, or create twice.

**Context.** Use for externally retried POST-like operations that create side effects. Keys must be scoped to a tenant/client and protected from unbounded retention.

## Consequences / Trade-offs

- Makes retries safe for clients and infrastructure.
- Requires durable storage and careful handling of in-progress, failed, and mismatched duplicate requests.
- Retention windows and request fingerprints must balance replay safety with storage growth.
- Poor scoping can let one tenant interfere with another tenant key.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Worth it even in small systems for payments, orders, and external retries. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for medium APIs where mobile and gateway retries are normal. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large distributed write paths and webhook/message processing. |

## Examples

### Store the logical operation result

**❌ Negative (typescript)**

```typescript
app.post("/payments", async (req, res) => {
  const payment = await gateway.charge(req.body.card, req.body.amount);
  await payments.save(payment);
  res.status(201).json(payment);
});
// If the response is lost, retrying may charge again.
```

**✅ Positive (typescript)**

```typescript
app.post("/payments", async (req, res) => {
  const key = req.header("Idempotency-Key");
  if (!key) return res.status(400).json(problem("missing-idempotency-key"));

  const result = await idempotency.run(req.account.id, key, fingerprint(req.body), () =>
    payments.chargeAndRecord(req.body.card, req.body.amount)
  );
  res.status(result.replayed ? 200 : 201).json(result.body);
});
```

*The positive version scopes and records the logical payment attempt, so retries return the original outcome instead of creating another charge.*

## Relationships

**Synergies**

- [Idempotency](../resilience/idempotency.md) — Idempotency Key is a concrete API mechanism for making retried writes logically idempotent.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Message consumers use the same duplicate detection idea for at-least-once delivery.
- [Retry with Backoff](../resilience/retry.md) — Retries become safe only when the server recognises repeated logical operations.
- [Problem Details (RFC 7807 Errors)](../api-design/problem-details.md) — Mismatched key reuse should return a precise machine-readable error.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [ETag / Conditional Request](../api-design/etag-conditional-request.md), [Optimistic Concurrency Control](../data-persistence/optimistic-concurrency-control.md), [Command](../gof-behavioural/command.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python, go
- **Frameworks:** express, spring-boot, fastapi, aspnet, none
- **Project types:** web-api, backend-service, microservices, distributed-system
- **Tags:** safe-retry, deduplication, payments

