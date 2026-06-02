# Request-Reply

> Send a request message and receive a corresponding reply message, preserving synchronous semantics over asynchronous infrastructure.

**Scale:** integration · **Category:** enterprise-integration · **Maturity:** time-tested

**Also known as:** Request-Response Messaging

## Description

Request-Reply models a conversation where a requester sends a message to a service and waits for, or later retrieves, the matching response. The reply may return on a temporary queue, a named reply channel or a topic partition, and it must carry enough correlation information to match the original request. The pattern is useful when messaging infrastructure is required for routing, buffering or protocol bridging, but the business interaction still needs a result. It should not be used to hide slow distributed calls as if they were local method invocations.

**Problem.** Some integrations need a definite answer, but direct synchronous calls are unsuitable because routing, buffering, transport mediation or broker-based decoupling is required.

**Context.** Use where a message-based service must return quotes, validations, enrichment results or command outcomes to the original requester.

## Consequences / Trade-offs

- Enables response semantics across queues and brokers while retaining loose transport coupling.
- Requires correlation identifiers, reply channels, timeouts and cleanup of pending requests.
- Can recreate synchronous coupling and resource exhaustion if callers block indefinitely.
- More complex than fire-and-forget events; use only when a reply is truly required.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Direct HTTP/RPC is often simpler for small systems that do not need broker mediation. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Useful for asynchronous transport with bounded response expectations. |
| Large (>100k LOC) | ●●●○○ 3/5 | Valuable in selected integration flows, but excessive use creates hidden synchronous coupling. |

## Examples

### Correlating replies on a RabbitMQ callback queue

**❌ Negative (typescript)**

```typescript
// The first response wins, even if it belongs to another in-flight request.
channel.sendToQueue("credit-check", Buffer.from(JSON.stringify(request)));
const response = await nextMessage("credit-replies");
return JSON.parse(response.content.toString());
```

**✅ Positive (typescript)**

```typescript
async function requestCreditCheck(request: CreditRequest): Promise<CreditReply> {
  const correlationId = crypto.randomUUID();
  const pending = waitForReply(correlationId, 5_000);

  channel.sendToQueue("credit-check", Buffer.from(JSON.stringify(request)), {
    replyTo: "credit-replies",
    correlationId,
    persistent: true
  });

  return pending;
}
```

*The positive version supplies a reply channel, correlation id and timeout so concurrent requests cannot consume each other's replies or wait forever.*

## Relationships

**Synergies**

- [Correlation Identifier](../enterprise-integration/correlation-identifier.md) — The requester needs a stable id to match each reply to its outstanding request.
- [Timeout](../resilience/timeout.md) — Pending requests must expire so callers do not wait forever for missing replies.
- [Message Channel](../enterprise-integration/message-channel.md) — Request and reply messages travel over explicit channels with distinct responsibilities.
- [Message Translator](../enterprise-integration/message-translator.md) — Request/reply endpoints often translate between broker messages and local service contracts.

**Alternatives:** [gRPC / RPC](../api-design/grpc-rpc.md), [REST](../api-design/rest.md), [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** rabbitmq, nats, kafka, nodejs
- **Project types:** backend-service, microservices, distributed-system, web-api
- **Tags:** messaging, request-reply, correlation

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

