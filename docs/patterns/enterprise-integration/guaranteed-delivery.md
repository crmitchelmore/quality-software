# Guaranteed Delivery

> Store messages durably and acknowledge them only at safe boundaries so delivery survives process crashes, broker restarts and network failures.

**Scale:** integration · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

Guaranteed Delivery uses durable channels, persistent messages, producer confirms, consumer acknowledgements and transactional boundaries to ensure a message is not silently lost once accepted. The guarantee is usually at-least-once rather than exactly-once: a recovered broker or consumer may redeliver. The pattern therefore pairs durability with idempotent receivers, dead-letter handling and clear acknowledgement timing. It is appropriate for business-significant messages where loss is worse than latency or duplicate processing.

**Problem.** Fire-and-forget messaging can lose orders, payments or state changes during crashes, broker failover or network partitions without either side noticing.

**Context.** Use for commands and events whose loss has business impact, particularly across unreliable networks or services that deploy, restart or autoscale independently.

## Consequences / Trade-offs

- Greatly reduces silent message loss across process and broker failures.
- Typically introduces at-least-once delivery, so duplicates must be expected.
- Increases latency and operational cost through disk persistence, confirms and replication.
- Requires end-to-end thinking; durable broker storage cannot protect side effects acknowledged too early.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Valuable for critical events, but may be overkill for ephemeral notifications. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong fit for business workflows where message loss is unacceptable. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential, but must be designed with idempotency and throughput trade-offs. |

## Examples

### Publishing RabbitMQ messages durably with confirms

**❌ Negative (typescript)**

```typescript
// Message can be lost if the broker crashes before flushing it.
channel.publish("orders", "accepted", Buffer.from(JSON.stringify(order)));
```

**✅ Positive (typescript)**

```typescript
const confirm = await amqp.connect(url).then((c) => c.createConfirmChannel());
await confirm.assertExchange("orders", "topic", { durable: true });

const accepted = confirm.publish(
  "orders",
  "accepted",
  Buffer.from(JSON.stringify(order)),
  { persistent: true, messageId: order.eventId }
);
if (!accepted) await once(confirm, "drain");
await confirm.waitForConfirms();
```

*The positive version uses a durable exchange, persistent message and publisher confirms, so the sender knows the broker accepted responsibility for delivery.*

## Relationships

**Synergies**

- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Durable recovery often redelivers messages, so receivers must make duplicate delivery safe.
- [Dead Letter Channel](../enterprise-integration/dead-letter-channel.md) — Messages that cannot be delivered after recovery and retry need a durable failure path.
- [Transactional Outbox](../cloud-distributed/outbox.md) — The outbox preserves messages atomically with local state before publishing to the broker.
- [Retry with Backoff](../resilience/retry.md) — Transient send or ack failures should be retried with backoff around the durable channel.

**Alternatives:** [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md), [Event Sourcing](../architecture/event-sourcing.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** rabbitmq, kafka, nats, spring-boot
- **Project types:** backend-service, microservices, distributed-system, high-throughput
- **Tags:** messaging, durability, reliability

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

