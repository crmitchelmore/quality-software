# Message Endpoint

> Encapsulate the code that connects an application to a messaging system so domain logic deals with commands and events rather than broker APIs.

**Scale:** integration · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

A Message Endpoint is the application-side adapter for a message channel. It knows how to subscribe, acknowledge, commit offsets, deserialize messages, publish replies, map broker errors, preserve correlation identifiers, and call application services. It should be a thin boundary, not the place where business workflows accumulate. Well-designed endpoints isolate transport mechanics and make failure semantics explicit: when to retry, when to dead-letter, when to ignore duplicates, and when to commit.

**Problem.** Without an endpoint abstraction, broker APIs, acknowledgements, headers, serialization, retries, and business logic are interleaved. That makes behaviour hard to test and changing the messaging technology expensive.

**Context.** Use in any application that consumes from or publishes to message channels, especially where acknowledgement, correlation, idempotency, or translation rules matter.

## Consequences / Trade-offs

- Keeps domain services free of broker-specific APIs and threading models.
- Centralises acknowledgement, error handling, deserialization, and correlation mechanics.
- Thin endpoints are easy to test; fat endpoints become accidental transaction scripts.
- Requires careful ownership of offset commits and side effects to avoid message loss or duplicate processing.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Helpful in any message consumer, though a framework listener may be enough for simple apps. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit as soon as acknowledgement, retries, or translation need consistent handling. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large estates to standardise message boundary behaviour across many services. |

## Examples

### Keeping broker mechanics at the endpoint boundary

**❌ Negative (java)**

```java
@Service
class BillingService {
  void poll() {
    ConsumerRecord<String, String> record = kafka.pollOne("orders.submitted");
    OrderSubmitted event = objectMapper.readValue(record.value(), OrderSubmitted.class);
    chargeCard(event.orderId(), event.amount());
    kafka.commitSync();
  }
}
```

**✅ Positive (java)**

```java
@Component
class OrderSubmittedEndpoint {
  private final BillingApplication billing;
  private final OrderMessageTranslator translator;

  @KafkaListener(topics = "orders.submitted.v1")
  void onMessage(ConsumerRecord<String, String> record, Acknowledgment ack) {
    billing.chargeFor(translator.toCommand(record.value(), record.headers()));
    ack.acknowledge();
  }
}
```

*The positive version confines Kafka records, headers, and acknowledgements to an endpoint. Billing application logic receives a command and stays independent of broker mechanics.*

## Relationships

**Synergies**

- [Message Channel](../enterprise-integration/message-channel.md) — Endpoints are the concrete application adapters attached to logical channels.
- [Message Translator](../enterprise-integration/message-translator.md) — Endpoints commonly translate external message shapes into local commands or events.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Receiving endpoints are the right boundary to detect and suppress duplicate messages.
- [Correlation Identifier](../enterprise-integration/correlation-identifier.md) — Endpoints should preserve or create correlation identifiers for tracing and replies.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Gateway](../enterprise-application/gateway.md), [Adapter](../gof-structural/adapter.md), [Polling Consumer](../enterprise-integration/polling-consumer.md), [Event-Driven Consumer](../enterprise-integration/event-driven-consumer.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript
- **Frameworks:** spring-boot, kafka, rabbitmq, nodejs
- **Project types:** microservices, backend-service, distributed-system, web-api
- **Tags:** eip, endpoint, adapter, messaging

## References

- [Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageEndpoint.html)

