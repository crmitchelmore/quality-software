# Change Data Capture (CDC)

> Capture committed database changes and publish them as a stream for projections, integration, auditing, or replication.

**Scale:** data · **Category:** data-persistence · **Maturity:** established

## Description

Change Data Capture reads the database transaction log, triggers, or versioned tables to produce an ordered stream of inserts, updates, and deletes. It is useful when downstream systems need a reliable feed of committed facts, especially for search indexes, data warehouses, cache invalidation, or service integration. Good CDC designs treat schemas as contracts: they version events, handle snapshots and backfills, preserve ordering where needed, and avoid exposing sensitive columns by default.

**Problem.** Applications often need to notify other systems after a database commit, but hand-coded dual writes are easy to miss, reorder, or partially fail.

**Context.** Use when the database is already the source of truth and consumers need asynchronous, replayable changes. Avoid using raw table changes as a public domain event stream without curation.

## Consequences / Trade-offs

- Reduces application changes needed to feed analytics, search, or integration pipelines.
- Can leak internal schema churn and sensitive columns if the capture stream is not curated.
- Consumers must handle replays, snapshots, tombstones, and at-least-once delivery.
- Operational correctness depends on log retention, connector lag, schema registry discipline, and alerting.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary for small systems; direct application events or simple jobs are easier. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit when projections and integrations multiply, provided schemas are curated. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large data platforms and service ecosystems that need replayable committed change streams. |

## Examples

### Publish only after commit

**❌ Negative (typescript)**

```typescript
async function shipOrder(orderId: string) {
  await bus.publish("order-shipped", { orderId });
  await db.query("UPDATE orders SET status='shipped' WHERE id=$1", [orderId]);
}
```

**✅ Positive (typescript)**

```typescript
async function shipOrder(orderId: string) {
  await db.tx(async t => {
    await t.query("UPDATE orders SET status='shipped' WHERE id=$1", [orderId]);
    await t.query("INSERT INTO outbox(topic, payload) VALUES($1,$2)",
      ["order-shipped", JSON.stringify({ orderId })]);
  });
}
// CDC reads the committed outbox row and publishes it to Kafka.
```

*The positive version makes the state change and publication record part of one transaction; CDC publishes only committed facts.*

## Relationships

**Synergies**

- [Transactional Outbox](../cloud-distributed/outbox.md) — Outbox records can be captured by CDC to publish domain events after the same database commit.
- [Materialized View](../cloud-distributed/materialized-view.md) — CDC streams are a common input to read models and denormalised projections.
- [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md) — Captured changes are distributed to multiple consumers without point-to-point coupling.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Consumers must de-duplicate because CDC delivery and reprocessing are commonly at least once.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Transactional Outbox](../cloud-distributed/outbox.md), [Event Sourcing](../architecture/event-sourcing.md), [Polling Consumer](../enterprise-integration/polling-consumer.md)

## Applicability tags

- **Languages:** language-agnostic, sql, java, go
- **Frameworks:** kafka, none, spring-boot, kubernetes
- **Project types:** data-pipeline, etl, microservices, distributed-system
- **Tags:** cdc, event-streaming, replication

