# Polling Consumer

> Let a receiver control when it checks a channel for work, trading latency for predictable resource use and simpler scheduling.

**Scale:** integration · **Altitude:** medium · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

A Polling Consumer explicitly asks a channel, queue or endpoint for the next available message. The poll can run on a schedule, with long-polling, or inside a worker loop that only requests more work when it has capacity. This gives the consumer control over concurrency, maintenance windows and backpressure, but messages wait until the next poll and empty polls can waste resources. It is a good pattern for batch-friendly workloads, legacy endpoints, rate-limited APIs and queues where the receiver must decide when it is safe to accept more work.

**Problem.** Some consumers cannot be called asynchronously whenever work arrives because they are offline, batch-oriented, rate-limited, stateful or need to control transaction and resource boundaries.

**Context.** Use when a receiver pulls from a queue, inbox table, SFTP drop, mailbox, REST API or broker subscription on its own cadence rather than being invoked by the channel.

## Consequences / Trade-offs

- Consumer controls load, concurrency and maintenance windows.
- Easier to combine with database transactions and explicit leases for durable work queues.
- Adds latency up to the poll interval and may generate empty polls.
- Requires careful visibility timeouts, leases or acknowledgement handling to avoid duplicate or stuck work.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Practical for simple scheduled imports or small queues, but watch wasteful loops. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for controlled workers, batch integration and rate-limited dependencies. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful, but large low-latency systems often prefer event-driven consumers with broker-managed push. |

## Examples

### Polling RabbitMQ without spinning or losing acknowledgements

**❌ Negative (typescript)**

```typescript
// Tight empty loop; acknowledges before durable work completes.
async function run() {
  while (true) {
    const msg = await channel.get("invoice-work", { noAck: true });
    if (!msg) continue;
    await sendInvoice(JSON.parse(msg.content.toString()));
  }
}
```

**✅ Positive (typescript)**

```typescript
async function run() {
  while (!shuttingDown) {
    const msg = await channel.get("invoice-work", { noAck: false });
    if (!msg) {
      await delay(1_000);
      continue;
    }

    try {
      await sendInvoice(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    } catch (err) {
      channel.nack(msg, false, true); // return to queue for a later poll
      await delay(5_000);
    }
  }
}
```

*The positive poller backs off when the queue is empty and acknowledges only after processing succeeds, so the consumer controls load without dropping work.*

## Relationships

**Synergies**

- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Polling loops commonly retry after crashes or timeouts, so duplicate delivery must be safe.
- [Retry with Backoff](../resilience/retry.md) — Failed polls and transient message processing failures need bounded retry with backoff rather than tight loops.
- [Backpressure](../resilience/backpressure.md) — The poller can stop or slow pulls when downstream capacity is exhausted.
- [Competing Consumers](../cloud-distributed/competing-consumers.md) — Multiple pollers can share a queue when leases or broker acknowledgements prevent double processing.

**Conflicts with:** [Event-Driven Consumer](../enterprise-integration/event-driven-consumer.md)

**Alternatives:** [Event-Driven Consumer](../enterprise-integration/event-driven-consumer.md), [Webhook](../api-design/webhook.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, python
- **Frameworks:** rabbitmq, kafka, nodejs, spring-boot
- **Project types:** backend-service, microservices, data-pipeline, distributed-system
- **Tags:** messaging, scheduling, pull

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

