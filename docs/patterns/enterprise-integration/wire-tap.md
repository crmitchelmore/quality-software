# Wire Tap

> Copy messages from a channel to a secondary destination for observation, audit or analytics without changing the primary route.

**Scale:** integration · **Altitude:** low · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

A Wire Tap adds a passive branch to an integration flow. The original message continues to its intended consumer, while a copy is sent to monitoring, audit, analytics, testing or compliance infrastructure. The tap should not participate in the business transaction or delay the critical path; it must preserve privacy boundaries and avoid mutating the message. It is useful when teams need production visibility without coupling operational consumers to the main endpoint.

**Problem.** Teams need to observe or audit integration traffic, but adding observers directly to the primary consumer changes delivery semantics and risks breaking business flow.

**Context.** Use when messages on a channel need independent inspection, replay capture, metrics, compliance evidence or shadow processing.

## Consequences / Trade-offs

- Enables observability and secondary processing without altering the main route.
- Reduces invasive logging inside business consumers.
- Can leak sensitive data if the tapped channel has broader access than the original flow.
- Adds extra traffic and storage; taps must fail independently from the main path.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually simple logging is enough unless messages need formal audit or replay capture. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for production observability and shadow consumers. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for regulated or high-volume integrations, with strict privacy controls. |

## Examples

### Tapping Kafka events without blocking the primary publish

**❌ Negative (typescript)**

```typescript
async function publishShipment(event: ShipmentEvent) {
  await analytics.send(event); // analytics outage blocks shipping
  await kafka.send({ topic: "shipments", messages: [{ value: JSON.stringify(event) }] });
}
```

**✅ Positive (typescript)**

```typescript
async function publishShipment(event: ShipmentEvent) {
  const value = JSON.stringify(event);
  await kafka.send({ topic: "shipments", messages: [{ key: event.shipmentId, value }] });
  void kafka.send({
    topic: "shipments.tap.audit",
    messages: [{ key: event.shipmentId, value: redactForAudit(value) }]
  }).catch((err) => logger.warn({ err }, "wire tap publish failed"));
}
```

*The positive version keeps the primary shipment publication independent and sends a redacted copy to the tap, so analytics or audit failures do not stop the business event.*

## Relationships

**Synergies**

- [Message Channel](../enterprise-integration/message-channel.md) — A tap attaches to a channel and creates an additional branch without changing producers.
- [Audit Logging](../security/audit-logging.md) — Tapped copies can form an immutable audit trail when retention and access are controlled.
- [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md) — Pub-sub can implement a wire tap as an additional subscriber to the same event.
- [Claim Check](../cloud-distributed/claim-check.md) — Large or sensitive payloads can be replaced by controlled references before being tapped.

**Alternatives:** [Audit Logging](../security/audit-logging.md), [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md), [Event Sourcing](../architecture/event-sourcing.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, go
- **Frameworks:** kafka, rabbitmq, nats, nodejs
- **Project types:** microservices, distributed-system, data-pipeline, backend-service
- **Tags:** messaging, observability, audit

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

