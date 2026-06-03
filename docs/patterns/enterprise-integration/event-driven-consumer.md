# Event-Driven Consumer

> Register a consumer that is invoked when messages arrive, reducing latency and letting the messaging infrastructure drive delivery.

**Scale:** integration · **Altitude:** medium · **Category:** enterprise-integration · **Maturity:** time-tested

**Also known as:** Message-Driven Consumer

## Description

An Event-Driven Consumer subscribes to a channel and reacts as messages arrive instead of repeatedly polling for work. The broker, framework or runtime calls the handler, often with acknowledgement, retry and concurrency controls. This improves responsiveness and resource efficiency for continuous event streams, but shifts more responsibility to the delivery infrastructure: handlers must be fast, idempotent, observable and prepared for concurrent execution. It is the default shape for broker-backed microservices, webhooks and event-driven architecture.

**Problem.** Polling introduces latency and empty work when messages arrive unpredictably or require near-real-time reaction.

**Context.** Use for asynchronous events, commands or notifications delivered by Kafka, RabbitMQ, NATS, webhooks or serverless event sources where the channel can wake the consumer.

## Consequences / Trade-offs

- Low latency and efficient resource use because work starts when messages arrive.
- Scales naturally with broker partitions, consumer groups or concurrent subscribers.
- Handler failures can cause redelivery storms unless retries, dead-lettering and idempotency are deliberate.
- Push-style delivery can overwhelm downstream services without concurrency limits and backpressure.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for small event integrations but can add broker/runtime complexity. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for responsive services consuming brokered events or webhooks. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for high-throughput event-driven architectures, with strong operational controls. |

## Examples

### Handling Kafka events with explicit acknowledgement semantics

**❌ Negative (typescript)**

```typescript
consumer.on("message", async (message) => {
  // Fire-and-forget side effects; offset is auto-committed even if this fails.
  chargeCard(JSON.parse(message.value.toString()));
});
```

**✅ Positive (typescript)**

```typescript
await consumer.run({
  autoCommit: false,
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value!.toString());
    await handlePaymentAuthorised(event);
    await consumer.commitOffsets([{ 
      topic,
      partition,
      offset: (Number(message.offset) + 1).toString()
    }]);
  }
});
```

*The positive version treats the handler as the delivery boundary: it awaits the side effect and commits the offset only after successful processing, avoiding silent loss.*

## Relationships

**Synergies**

- [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md) — Subscribers are often event-driven consumers reacting independently to the same published event.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — At-least-once event delivery means the handler must tolerate duplicate messages.
- [Dead Letter Channel](../enterprise-integration/dead-letter-channel.md) — Poison messages need somewhere observable to go after retries are exhausted.
- [Event-Driven Architecture](../architecture/event-driven-architecture.md) — Event-driven systems rely on handlers that react to published facts quickly and independently.

**Conflicts with:** [Polling Consumer](../enterprise-integration/polling-consumer.md)

**Alternatives:** [Polling Consumer](../enterprise-integration/polling-consumer.md), [Webhook](../api-design/webhook.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** kafka, rabbitmq, nats, spring-boot
- **Project types:** microservices, backend-service, distributed-system, realtime-system
- **Tags:** messaging, event-driven, push

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

