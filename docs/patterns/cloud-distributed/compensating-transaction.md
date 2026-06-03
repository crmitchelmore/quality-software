# Compensating Transaction

> Undo or neutralise the effects of completed distributed steps with explicit business actions when a long-running workflow cannot use one atomic transaction.

**Scale:** integration · **Altitude:** medium · **Category:** cloud-distributed · **Maturity:** time-tested

## Description

A Compensating Transaction records enough intent and outcome to apply semantically correct reversal steps after part of a distributed workflow has already committed. Compensation is not database rollback: it might issue a refund, release inventory, cancel a shipment, or post an adjusting ledger entry. Each forward step defines its compensating action, ordering, retry policy, and idempotency rules so recovery can proceed after crashes and partial failures.

**Problem.** Distributed operations often commit independently; when a later step fails, earlier successful effects remain visible and must be repaired without a global transaction.

**Context.** Payments, booking, fulfilment, provisioning, and multi-service workflows where steps are long-running, externally visible, or owned by different services.

## Consequences / Trade-offs

- Preserves business consistency without locking resources across services for long periods.
- Makes failure handling auditable because repair is an explicit domain operation.
- Compensation may be imperfect or impossible after external side effects occur.
- Every compensating action must be idempotent and observable, which increases design effort.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely necessary unless the small system already calls external side-effecting services. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for multi-step integrations where business repair is better than locks. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large distributed workflows where global transactions are unavailable or undesirable. |

## Examples

### Reversing a failed booking flow

**❌ Negative (typescript)**

```typescript
await payments.charge(card, amount);
await inventory.reserve(sku, quantity);
await shipping.createLabel(orderId); // throws; charge and reservation remain
```

**✅ Positive (typescript)**

```typescript
const completed: Array<() => Promise<void>> = [];

await payments.charge(card, amount);
completed.push(() => payments.refund(orderId, amount));

await inventory.reserve(sku, quantity);
completed.push(() => inventory.release(orderId, sku, quantity));

try {
  await shipping.createLabel(orderId);
} catch (error) {
  for (const compensate of completed.reverse()) await compensate();
  throw error;
}
```

*The positive version registers domain-specific repair actions as forward steps complete, so a later failure can restore business consistency instead of leaving debris.*

## Relationships

**Synergies**

- [Saga](../cloud-distributed/saga.md) — Sagas sequence forward actions and trigger compensations when later steps fail.
- [Process Manager](../enterprise-integration/process-manager.md) — A process manager tracks which steps completed and which compensations remain due.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Compensation commands may be retried after crashes or broker redelivery.
- [Audit Logging](../security/audit-logging.md) — Financial and operational repairs need an immutable trail of forward and compensating actions.

**Alternatives:** [Pessimistic Offline Lock](../enterprise-application/pessimistic-offline-lock.md), [Optimistic Concurrency Control](../data-persistence/optimistic-concurrency-control.md), [Process Manager](../enterprise-integration/process-manager.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** kafka, rabbitmq, nats, spring-boot, dotnet
- **Project types:** microservices, distributed-system, backend-service, web-api, high-throughput
- **Tags:** recovery, long-running-transaction, business-consistency, rollback

## References

- [Microsoft Azure Architecture Center; Compensating Transaction pattern](https://learn.microsoft.com/azure/architecture/patterns/compensating-transaction)

