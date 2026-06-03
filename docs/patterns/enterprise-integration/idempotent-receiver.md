# Idempotent Receiver

> Make message handling safe under duplicate delivery by detecting repeated message or operation identifiers before applying side effects.

**Scale:** integration · **Altitude:** medium · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

An Idempotent Receiver accepts that brokers, webhooks, retries and crashes often deliver the same logical message more than once. The receiver records a stable message id or operation key in durable storage, applies the business change inside the same transaction where possible, and returns the same logical outcome for repeats. This is stronger than simply ignoring duplicate payloads: the key must represent the intended operation, survive restarts, and be checked at the boundary where irreversible side effects occur.

**Problem.** At-least-once delivery, retry with backoff and consumer crashes can repeat messages, causing duplicate orders, payments, emails or state transitions.

**Context.** Use on any receiver that processes messages from a broker, webhook, outbox, scheduler or API client where the sender may retry and exactly-once delivery is unavailable or too expensive.

## Consequences / Trade-offs

- Prevents duplicate side effects and makes retries operationally safe.
- Requires durable deduplication state with appropriate retention and uniqueness constraints.
- Must choose keys carefully; payload hashes or broker offsets often do not match the business operation.
- Adds read/write overhead to the hot path and may need cleanup of old keys.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Worth using even in small systems when external retries can trigger money, inventory or email side effects. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Core reliability pattern for brokered services and webhooks. |
| Large (>100k LOC) | ●●●●● 5/5 | Non-negotiable in large at-least-once messaging topologies; enforce with database uniqueness where possible. |

## Examples

### Deduplicating payment events with a durable key

**❌ Negative (typescript)**

```typescript
async function onPaymentCaptured(message: Message) {
  const event = JSON.parse(message.value.toString());
  await ledger.insert({
    paymentId: event.paymentId,
    amount: event.amount,
    type: "CAPTURED"
  });
}
```

**✅ Positive (typescript)**

```typescript
async function onPaymentCaptured(message: Message) {
  const event = JSON.parse(message.value.toString());
  await db.transaction(async (tx) => {
    const inserted = await tx.processedMessages.insertIgnore({
      consumer: "ledger",
      messageId: event.messageId
    });
    if (!inserted) return;

    await tx.ledger.insert({
      paymentId: event.paymentId,
      amount: event.amount,
      type: "CAPTURED"
    });
  });
}
```

*The positive version stores the deduplication key and ledger write in one transaction, so a redelivered message cannot create a second ledger entry.*

## Relationships

**Synergies**

- [Idempotency](../resilience/idempotency.md) — The receiver is the messaging-specific application of idempotent operation design.
- [Transactional Outbox](../cloud-distributed/outbox.md) — Outbox publishers often redeliver during recovery; receivers need stable deduplication keys.
- [Guaranteed Delivery](../enterprise-integration/guaranteed-delivery.md) — Durable delivery avoids loss but increases the chance of duplicates after restart.
- [Retry with Backoff](../resilience/retry.md) — Retrying becomes safe only when repeated processing has the same logical result.

**Alternatives:** [Idempotency Key](../api-design/idempotency-key.md), [Optimistic Concurrency Control](../data-persistence/optimistic-concurrency-control.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** kafka, rabbitmq, nodejs, spring-boot
- **Project types:** microservices, backend-service, distributed-system, high-throughput
- **Tags:** messaging, idempotency, reliability

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

