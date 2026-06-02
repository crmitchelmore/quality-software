# Message Filter

> Remove messages from a flow when they are irrelevant, invalid, duplicate, unauthorised, or outside a consumer's declared interest.

**Scale:** integration · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

A Message Filter consumes messages and forwards only those that satisfy a predicate. It differs from a router because there may be no output for rejected messages; the rejection is the intended outcome. Filters protect downstream consumers from noise and enforce clear boundaries, but they must be honest about discard semantics. Some rejected messages can be dropped, some must be audited, and some belong on a Dead Letter Channel with a reason code. The best filters are narrow, observable, and close to the boundary they protect.

**Problem.** Consumers often receive every message on a broad channel and implement ad hoc ignore logic. This wastes capacity, hides discard rules inside business code, and makes it hard to prove why a message was not processed.

**Context.** Use when a flow contains messages that a downstream consumer should not process because of type, validity, tenant, permission, duplication, freshness, or business eligibility.

## Consequences / Trade-offs

- Reduces downstream load and accidental processing of irrelevant messages.
- Makes discard policy explicit and testable.
- Can cause invisible data loss if rejected messages are not counted, audited, or routed to a failure channel when appropriate.
- Predicates must be deterministic and based on data available before side effects happen.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful even in modest event consumers when discard rules matter, but avoid a separate component for trivial checks. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for protecting services from noisy shared channels and invalid events. |
| Large (>100k LOC) | ●●●●● 5/5 | Very valuable in high-volume estates, provided rejected message handling is explicit and monitored. |

## Examples

### Filtering stale fulfilment commands at the boundary

**❌ Negative (typescript)**

```typescript
consumer.on("fulfilment.commands", async (message) => {
  const command = JSON.parse(message.value.toString());
  if (command.cancelled || Date.now() - Date.parse(command.createdAt) > 86_400_000) {
    return; // silently ignored inside business logic
  }
  await fulfil(command);
});
```

**✅ Positive (typescript)**

```typescript
const freshFulfilmentCommands = filterChannel({
  input: "fulfilment.commands",
  output: "fulfilment.commands.accepted",
  rejected: "fulfilment.commands.rejected",
  predicate: (command) => !command.cancelled && ageHours(command.createdAt) <= 24,
  rejectionReason: (command) => command.cancelled ? "cancelled" : "stale"
});

freshFulfilmentCommands.start();
```

*The positive version turns the discard rule into an observable integration step. Rejections can be counted and inspected instead of disappearing inside the consumer.*

## Relationships

**Synergies**

- [Message Router](../enterprise-integration/message-router.md) — Filters often sit before routers to keep irrelevant messages out of route evaluation.
- [Content-Based Router](../enterprise-integration/content-based-router.md) — A filter can reject messages with no valid content-based route and leave routing to accepted messages.
- [Dead Letter Channel](../enterprise-integration/dead-letter-channel.md) — Invalid-but-important messages should be preserved with rejection reasons instead of silently dropped.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Duplicate detection is often implemented as a specialised filter at the receiver boundary.

**Conflicts with:** [Guaranteed Delivery](../enterprise-integration/guaranteed-delivery.md)

**Alternatives:** [Message Router](../enterprise-integration/message-router.md), [Input Validation (Allow-List)](../security/input-validation.md), [Rate Limiting](../resilience/rate-limiting.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript
- **Frameworks:** spring-boot, kafka, rabbitmq, nodejs
- **Project types:** microservices, backend-service, distributed-system, high-throughput
- **Tags:** eip, filtering, messaging, validation

## References

- [Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Filter.html)

