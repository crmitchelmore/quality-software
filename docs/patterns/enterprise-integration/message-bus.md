# Message Bus

> Provide a shared messaging backbone with common channels, contracts and operational services so applications integrate through messages instead of direct point-to-point links.

**Scale:** integration · **Altitude:** high · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

A Message Bus is an integration backbone that standardises how applications publish, route, transform, observe and consume messages. It may be implemented with a broker, streaming platform, service bus or managed eventing platform, but the pattern is more than the technology: it includes channel conventions, envelope metadata, schema governance, security, monitoring and operational ownership. A bus reduces integration sprawl, yet it can become a central bottleneck if every change requires a platform team or if teams use it as a dumping ground for poorly owned events.

**Problem.** As systems multiply, direct integrations and bespoke protocols create a brittle mesh that is hard to secure, observe, change and reason about.

**Context.** Use when many applications exchange messages and need common routing, delivery semantics, schema conventions, security and observability across the enterprise.

## Consequences / Trade-offs

- Reduces point-to-point integration sprawl and provides shared operational capabilities.
- Encourages consistent envelopes, correlation ids, schemas and delivery policies.
- Can become an enterprise choke point if governance is too centralised or abstractions hide important broker semantics.
- Requires strong ownership of platform reliability, topic/channel lifecycle and access control.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary platform overhead for a small application or a few integrations. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit once several services need shared messaging conventions and operations. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for enterprise-scale integration, provided platform governance enables rather than blocks teams. |

## Examples

### Publishing through a standard bus envelope

**❌ Negative (typescript)**

```typescript
// Each producer invents its own topic, headers and payload conventions.
await kafka.send({
  topic: "some-team-events",
  messages: [{ value: JSON.stringify(order) }]
});
```

**✅ Positive (typescript)**

```typescript
type BusEnvelope<T> = {
  id: string;
  type: string;
  version: number;
  correlationId: string;
  occurredAt: string;
  payload: T;
};

await bus.publish<BusEnvelope<OrderAccepted>>("order.accepted.v1", {
  id: crypto.randomUUID(),
  type: "OrderAccepted",
  version: 1,
  correlationId,
  occurredAt: new Date().toISOString(),
  payload: { orderId: order.id, customerId: order.customerId }
});
```

*The positive version uses a bus abstraction and standard envelope so routing, schema validation, correlation and access control can be applied consistently.*

## Relationships

**Synergies**

- [Canonical Data Model](../enterprise-integration/canonical-data-model.md) — Canonical messages make bus participants easier to integrate without pairwise schema knowledge.
- [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md) — A bus commonly provides pub-sub channels for distributing domain events to many subscribers.
- [Message Router](../enterprise-integration/message-router.md) — Routing rules are often bus-level services that direct messages to appropriate channels.
- [Correlation Identifier](../enterprise-integration/correlation-identifier.md) — Bus-wide correlation conventions make flows observable across all participants.

**Alternatives:** [Service-Oriented Architecture (SOA)](../architecture/service-oriented-architecture.md), [API Gateway](../architecture/api-gateway.md), [Broker Architecture](../architecture/broker-architecture.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** kafka, rabbitmq, nats, spring-boot
- **Project types:** microservices, distributed-system, backend-service, data-pipeline
- **Tags:** messaging, integration-platform, enterprise

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

