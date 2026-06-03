# Publish-Subscribe Channel

> Let a producer publish one message to a channel that independently delivers copies to all interested subscribers.

**Scale:** integration · **Altitude:** medium · **Category:** enterprise-integration · **Maturity:** time-tested

**Also known as:** Pub-Sub, Topic

## Description

A Publish-Subscribe Channel decouples producers from the number and identity of consumers. The producer publishes a fact or notification once; each subscriber receives its own copy or offset and can process independently for billing, search, notifications, analytics or audit. This differs from point-to-point messaging, where one message is consumed by one receiver. Pub-sub is powerful for event-driven architecture, but events must be stable, meaningful and governed because adding subscribers increases downstream responsibility without changing the producer.

**Problem.** A single business event often needs to trigger multiple independent reactions, and direct calls from the producer to every consumer create tight coupling and failure chains.

**Context.** Use when several systems need to react to the same event independently and the publisher should not know who those systems are.

## Consequences / Trade-offs

- Decouples publishers from subscribers and allows new reactions without changing the publisher.
- Supports independent scaling, replay and ownership per subscriber.
- Event contracts become public API and require compatibility discipline.
- Not suitable when exactly one worker should own each message; use point-to-point queue semantics instead.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for decoupling a few reactions, but a broker may be more than a small app needs. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for services that need independent reactions to the same business facts. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational at enterprise scale, with contract governance, replay and topic ownership. |

## Examples

### Publishing one domain event for multiple subscribers

**❌ Negative (typescript)**

```typescript
// Checkout knows every downstream consumer and fails when any one is down.
await billing.reserve(order);
await warehouse.allocate(order);
await marketing.recordPurchase(order);
```

**✅ Positive (typescript)**

```typescript
await kafka.send({
  topic: "order.accepted.v1",
  messages: [{
    key: order.id,
    value: JSON.stringify({
      eventId: crypto.randomUUID(),
      type: "OrderAccepted",
      orderId: order.id,
      occurredAt: new Date().toISOString()
    })
  }]
});
// Billing, warehouse and marketing subscribe independently.
```

*The positive version publishes a single event and lets each subscriber react independently, unlike point-to-point work queues where one consumer owns the message.*

## Relationships

**Synergies**

- [Event-Driven Architecture](../architecture/event-driven-architecture.md) — Pub-sub channels are a core mechanism for distributing domain events across an event-driven system.
- [Event-Driven Consumer](../enterprise-integration/event-driven-consumer.md) — Subscribers are commonly message-driven consumers invoked as events arrive.
- [Wire Tap](../enterprise-integration/wire-tap.md) — A monitoring or audit subscriber can observe the event stream without affecting business subscribers.
- [Message Bus](../enterprise-integration/message-bus.md) — A bus often provides shared pub-sub topics and governance across many applications.

**Conflicts with:** [Competing Consumers](../cloud-distributed/competing-consumers.md)

**Alternatives:** [Message Channel](../enterprise-integration/message-channel.md), [Competing Consumers](../cloud-distributed/competing-consumers.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** kafka, rabbitmq, nats, spring-boot
- **Project types:** microservices, distributed-system, backend-service, realtime-system
- **Tags:** messaging, pub-sub, event-driven

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

