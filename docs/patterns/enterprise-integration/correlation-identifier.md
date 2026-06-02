# Correlation Identifier

> Carry a stable identifier through related messages so receivers, logs and requesters can reconstruct which messages belong together.

**Scale:** integration · **Category:** enterprise-integration · **Maturity:** time-tested

**Also known as:** Correlation ID, Conversation ID

## Description

A Correlation Identifier is metadata attached to messages in a conversation, workflow or distributed trace. It lets a requester match a reply to a request, an aggregator group fragments, and operators follow a business transaction through services and queues. It should be generated at the boundary where the conversation starts, propagated unchanged where appropriate, and distinct from per-message ids used for deduplication. Good correlation ids are non-secret, globally unique enough, logged consistently and included in error and dead-letter metadata.

**Problem.** Once messages cross asynchronous boundaries, replies, retries, logs and fragments no longer have call-stack context to show which business operation they belong to.

**Context.** Use for request-reply messaging, sagas, aggregators, distributed logging, tracing and any asynchronous workflow with multiple related messages.

## Consequences / Trade-offs

- Enables matching replies, grouping related messages and debugging distributed flows.
- Improves observability when propagated into logs, metrics and traces.
- Must not be overloaded as an idempotency key, authentication token or sensitive business identifier.
- Requires consistent propagation conventions across transports and teams.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Cheap and helpful even for small systems with background jobs or webhooks. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Essential for debugging and request-reply flows across services. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational for operations, audit and distributed traceability at enterprise scale. |

## Examples

### Propagating a correlation id through NATS messages

**❌ Negative (typescript)**

```typescript
await nc.publish("shipment.book", JSON.stringify({ orderId }));
logger.info("shipment requested");
```

**✅ Positive (typescript)**

```typescript
const correlationId = incoming.headers?.get("x-correlation-id") ?? crypto.randomUUID();
const headers = nats.headers();
headers.set("correlation-id", correlationId);

await nc.publish(
  "shipment.book",
  JSON.stringify({ orderId, requestedAt: new Date().toISOString() }),
  { headers }
);
logger.info({ correlationId, orderId }, "shipment requested");
```

*The positive version creates or propagates a non-secret correlation id in both the message and logs, making asynchronous work traceable.*

## Relationships

**Synergies**

- [Request-Reply](../enterprise-integration/request-reply.md) — Replies need the request's correlation id so the requester can resolve the right pending call.
- [Aggregator](../enterprise-integration/aggregator.md) — Aggregators use correlation ids to group fragments that belong to the same logical result.
- [Saga](../cloud-distributed/saga.md) — Saga steps and compensations need a shared conversation id for audit and recovery.
- [Dead Letter Channel](../enterprise-integration/dead-letter-channel.md) — Dead-letter metadata with correlation ids makes failed flows diagnosable and replayable.

**Alternatives:** [Request-Reply](../enterprise-integration/request-reply.md), [Idempotency](../resilience/idempotency.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** kafka, rabbitmq, nats, grpc
- **Project types:** backend-service, microservices, distributed-system, web-api
- **Tags:** messaging, observability, tracing

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

