# Write-Behind Cache

> Acknowledge writes after updating the cache or queue, then persist them asynchronously to reduce latency while accepting durability risk.

**Scale:** data · **Altitude:** medium · **Category:** data-persistence · **Maturity:** established

## Description

Write-behind caching places a fast cache, log, or buffer in front of the durable store. The caller receives success before the database write has completed, and a background worker flushes changes in batches. This can absorb bursts and reduce tail latency, but the cache becomes a temporary system of record; therefore it needs durable buffering, replay, ordering, idempotency, and explicit loss semantics.

**Problem.** Synchronous database writes can dominate latency or collapse under bursty workloads even though the business can tolerate delayed persistence.

**Context.** Use for counters, telemetry, preferences, or derived state where bounded loss or delayed durability is acceptable. Avoid for money, entitlement, legal, or inventory decisions unless the write-behind log itself is durable and audited.

## Consequences / Trade-offs

- Improves write latency and can batch database IO efficiently.
- Risk of acknowledged-but-lost writes if the buffer is volatile or replay is not tested.
- Conflict resolution and ordering become application concerns.
- Observability must cover queue depth, flush lag, replay failures, and dead letters.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too risky for small systems unless the state is disposable telemetry. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for burst absorption where delayed persistence is acceptable and replay exists. |
| Large (>100k LOC) | ●●●●○ 4/5 | Powerful at large scale, but only with durable logs, lag alerts, and rehearsed recovery. |

## Examples

### Do not treat volatile cache as durable

**❌ Negative (typescript)**

```typescript
async function incrementViews(articleId: string) {
  await redis.incr(`views:${articleId}`);
  return { accepted: true };
}
```

**✅ Positive (typescript)**

```typescript
async function incrementViews(articleId: string, eventId: string) {
  await stream.append("article-viewed", { eventId, articleId, delta: 1 });
  await redis.incr(`views:${articleId}`);
  return { accepted: true };
}

async function flush(record: ViewRecord) {
  await db.query(`
    INSERT INTO article_view_events(event_id, article_id, delta)
    VALUES ($1,$2,$3) ON CONFLICT (event_id) DO NOTHING`,
    [record.eventId, record.articleId, record.delta]);
}
```

*The positive version acknowledges only after writing a replayable record and makes the asynchronous database flush idempotent.*

## Relationships

**Synergies**

- [Write-Through Cache](../data-persistence/write-through-cache.md) — Write-through is the safer consistency-oriented alternative for state that must be durable before acknowledgement.
- [Transactional Outbox](../cloud-distributed/outbox.md) — A durable log or outbox can make asynchronous flushes replayable rather than memory-only.
- [Idempotency](../resilience/idempotency.md) — Flush workers should make repeated writes produce the same logical database state.
- [Dead Letter Channel](../enterprise-integration/dead-letter-channel.md) — Poison flush records need quarantine instead of infinite retries blocking later changes.

**Conflicts with:** [Write-Through Cache](../data-persistence/write-through-cache.md)

**Alternatives:** [Write-Through Cache](../data-persistence/write-through-cache.md), [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md), [Event Sourcing](../architecture/event-sourcing.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, go, python
- **Frameworks:** redis, kafka, rabbitmq, spring-boot, nodejs
- **Project types:** high-throughput, backend-service, data-pipeline, distributed-system
- **Tags:** async-persistence, buffering, latency

