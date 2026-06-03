# Write-Through Cache

> Write every change to the cache and durable store in the request path so subsequent reads hit fresh cached data.

**Scale:** data · **Altitude:** medium · **Category:** data-persistence · **Maturity:** established

## Description

Write-through caching updates the cache synchronously whenever the system commits the backing store, or uses a cache service that performs both operations as one logical write. Reads can trust that cached values reflect committed writes, reducing miss storms and stale reads compared with cache-aside. The cost is higher write latency and a need to define what happens when either the database or cache write succeeds alone.

**Problem.** Cache-aside systems often forget to invalidate or refresh keys after writes, causing clients to observe stale state until expiry.

**Context.** Use for read-heavy entities with predictable keys and moderate write volume where fresh cache reads matter. Do not use when cache writes are best-effort or when write latency is extremely sensitive.

## Consequences / Trade-offs

- Reads are simpler because hot keys are already populated after writes.
- The write path depends on both the database and cache; partial failure handling must be explicit.
- Write amplification can be expensive for high-cardinality or rarely read values.
- Cache schema and versioning become part of the write contract.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Can be useful for a small hot catalogue, but often simpler invalidation is enough. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good when stale reads cause support issues and write volume is manageable. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable for critical hot keys, though large systems must control write amplification and partial failures carefully. |

## Examples

### Populate cache as part of the write

**❌ Negative (typescript)**

```typescript
async function renameProduct(id: string, name: string) {
  await db.query("UPDATE products SET name=$1 WHERE id=$2", [name, id]);
  // Existing cache entry may stay stale until TTL expires.
}
```

**✅ Positive (typescript)**

```typescript
async function renameProduct(id: string, name: string) {
  const product = await db.tx(async t => {
    await t.query("UPDATE products SET name=$1 WHERE id=$2", [name, id]);
    return t.one("SELECT id,name,price FROM products WHERE id=$1", [id]);
  });
  await cache.set(`product:${id}`, JSON.stringify(product), { ttl: 300 });
}
```

*The positive version refreshes the cache with the committed representation, so later reads do not serve a stale pre-update value.*

## Relationships

**Synergies**

- [Cache-Aside](../cloud-distributed/cache-aside.md) — Write-through can be used for critical keys while cache-aside remains adequate for derived or low-value data.
- [Write-Behind Cache](../data-persistence/write-behind-cache.md) — Write-behind is the latency-oriented alternative; contrasting both clarifies whether durability or speed dominates.
- [Connection Pool](../data-persistence/connection-pool.md) — Synchronous writes must not hold scarce database connections while waiting on slow cache operations.
- [Retry with Backoff](../resilience/retry.md) — Retries need idempotent writes so transient cache failures do not duplicate side effects.

**Conflicts with:** [Write-Behind Cache](../data-persistence/write-behind-cache.md)

**Alternatives:** [Cache-Aside](../cloud-distributed/cache-aside.md), [Write-Behind Cache](../data-persistence/write-behind-cache.md), [Materialized View](../cloud-distributed/materialized-view.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python
- **Frameworks:** redis, spring-boot, nodejs, django, none
- **Project types:** web-api, backend-service, high-throughput
- **Tags:** cache-consistency, write-path, redis

