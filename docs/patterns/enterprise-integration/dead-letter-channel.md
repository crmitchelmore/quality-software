# Dead Letter Channel

> Route messages that cannot be delivered or processed after bounded attempts to a separate, observable channel for diagnosis and recovery.

**Scale:** integration · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

A Dead Letter Channel prevents poison messages from blocking normal processing indefinitely. When delivery fails because of malformed payloads, missing dependencies, expired retries or business validation errors, the broker or consumer moves the message to a dedicated channel with failure metadata. Operators can inspect, alert, repair, replay or discard from there without hiding the failure or repeatedly harming the main flow. The pattern works only when retry limits, classification and replay procedures are explicit.

**Problem.** A single bad message can be retried forever, clog a queue, hide data quality defects or cause repeated side effects in downstream services.

**Context.** Use with queues, topics, event streams and integration pipelines where messages may be malformed, out of order, unsupported, expired or repeatedly rejected by consumers.

## Consequences / Trade-offs

- Keeps the main channel moving when individual messages are poisonous.
- Creates an operational audit trail for failed messages and their causes.
- Requires secure handling because dead-letter payloads may contain sensitive data.
- Can become a graveyard unless alerts, ownership and replay tooling are defined.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when messages matter, but manual inspection may be enough for tiny systems. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent fit for production queues where poison messages would otherwise halt work. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential at scale, with alerting, replay controls and privacy-aware access. |

## Examples

### Sending poison messages to a RabbitMQ dead-letter exchange

**❌ Negative (typescript)**

```typescript
channel.consume("orders", async (msg) => {
  try {
    await processOrder(JSON.parse(msg!.content.toString()));
    channel.ack(msg!);
  } catch {
    channel.nack(msg!, false, true); // retries forever and blocks progress
  }
});
```

**✅ Positive (typescript)**

```typescript
channel.consume("orders", async (msg) => {
  const attempts = Number(msg!.properties.headers?.["x-attempts"] ?? 0);
  try {
    await processOrder(JSON.parse(msg!.content.toString()));
    channel.ack(msg!);
  } catch (error) {
    channel.ack(msg!);
    await channel.publish("orders.dlx", "orders.failed", msg!.content, {
      headers: { attempts: attempts + 1, reason: String(error) },
      persistent: true
    });
  }
});
```

*The positive version moves irrecoverable messages out of the main queue with failure metadata, allowing the normal flow to continue and operators to investigate.*

## Relationships

**Synergies**

- [Retry with Backoff](../resilience/retry.md) — Retry should be bounded; the dead-letter channel receives messages after the retry budget is exhausted.
- [Guaranteed Delivery](../enterprise-integration/guaranteed-delivery.md) — Durable messaging needs a durable failure path when delivery cannot complete.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Replaying repaired dead letters is safer when receivers tolerate duplicates.
- [Audit Logging](../security/audit-logging.md) — Dead-letter metadata should explain who replayed or discarded a failed message and why.

**Alternatives:** [Message Filter](../enterprise-integration/message-filter.md), [Fallback](../resilience/fallback.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, python
- **Frameworks:** rabbitmq, kafka, nats, nodejs
- **Project types:** backend-service, microservices, distributed-system, data-pipeline
- **Tags:** messaging, failure-handling, operations

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

