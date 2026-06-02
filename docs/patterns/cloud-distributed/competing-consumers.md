# Competing Consumers

> Run multiple equivalent consumers on the same queue so each message is handled by one worker, increasing throughput and resilience through horizontal scaling.

**Scale:** integration · **Category:** cloud-distributed · **Maturity:** time-tested

## Description

Competing Consumers uses a queue or broker consumer group to distribute work items across multiple worker instances. Each message is claimed by one consumer, processed, and acknowledged; if a worker fails before acknowledgement, the broker can redeliver the message. The pattern decouples producers from worker capacity and lets operators scale processing by adding consumers, but it assumes handlers are safe under redelivery and that ordering requirements are limited or partitioned deliberately.

**Problem.** A single worker becomes a throughput bottleneck and a failure point, while direct synchronous fan-out couples producers to worker availability.

**Context.** Use for independent background jobs, command processing, media transforms, billing tasks, and message streams where work can be partitioned or processed out of order.

## Consequences / Trade-offs

- Increases throughput by adding workers without changing producers.
- Failed workers can be replaced and unacknowledged messages retried.
- Message ordering is not guaranteed globally and must be designed for explicitly.
- Handlers must be idempotent because most brokers provide at-least-once delivery.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary until background work exceeds one worker's capacity or reliability needs. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for job processing and asynchronous workflows with idempotent handlers. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for high-throughput distributed systems where work must scale horizontally. |

## Examples

### Scaling queue workers safely

**❌ Negative (typescript)**

```typescript
// One process polls and processes everything; a crash stops all work.
setInterval(async () => {
  const jobs = await db.jobs.findPending(100);
  for (const job of jobs) {
    await sendInvoice(job.invoiceId);
    await db.jobs.markDone(job.id);
  }
}, 1000);
```

**✅ Positive (typescript)**

```typescript
queue.consume("invoice-jobs", async (msg) => {
  const job = JSON.parse(msg.body) as InvoiceJob;
  await invoices.sendOnce(job.invoiceId, job.idempotencyKey);
  await msg.ack();
}, { consumerGroup: "invoice-workers", prefetch: 10 });
```

*The positive version lets the broker distribute messages across many workers and redeliver unacknowledged work, while the handler guards side effects with idempotency.*

## Relationships

**Synergies**

- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Competing consumers need safe redelivery because a worker may crash after side effects.
- [Dead Letter Channel](../enterprise-integration/dead-letter-channel.md) — Poison messages should be isolated after retries so one bad item does not block the queue.
- [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md) — The queue buffers bursts while competing consumers drain at available capacity.
- [Backpressure](../resilience/backpressure.md) — Consumer scaling and prefetch limits are a practical way to apply downstream backpressure.

**Alternatives:** [Polling Consumer](../enterprise-integration/polling-consumer.md), [Event-Driven Consumer](../enterprise-integration/event-driven-consumer.md), [Producer-Consumer](../concurrency/producer-consumer.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, typescript, python
- **Frameworks:** kafka, rabbitmq, nats, celery, spring-boot
- **Project types:** backend-service, microservices, distributed-system, high-throughput
- **Tags:** queue, horizontal-scaling, workers

## References

- [Microsoft Azure Architecture Center; Competing Consumers pattern](https://learn.microsoft.com/azure/architecture/patterns/competing-consumers)

