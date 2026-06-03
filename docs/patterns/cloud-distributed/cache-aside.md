# Cache-Aside

> Let application code read through a cache on misses and explicitly invalidate or refresh cached entries after writes, keeping the database as the source of truth.

**Scale:** data · **Altitude:** medium · **Category:** cloud-distributed · **Maturity:** time-tested

## Description

Cache-Aside, also called lazy loading, keeps the cache outside the database write path. A read first checks the cache; on a miss the application loads from the backing store, stores the value with an appropriate TTL, and returns it. Writes update the source of truth and then invalidate or refresh affected cache keys. This pattern is simple, resilient to cache loss, and effective for read-heavy workloads, but correctness depends on careful key design, TTLs, and invalidation around mutable data.

**Problem.** Repeated reads of the same data overload the primary datastore and add latency, but pushing every write through a cache can complicate consistency and recovery.

**Context.** Use for read-heavy data that can tolerate bounded staleness, where the application owns cache keys and can decide when entries should expire or be invalidated.

## Consequences / Trade-offs

- Reduces database load and tail latency for hot reads.
- Cache outages degrade to slower database reads rather than data loss.
- First requests after expiry still pay the database cost and may stampede.
- Incorrect invalidation can serve stale or cross-tenant data.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for obvious hot reads, but avoid premature caching before measuring latency or load. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for read-heavy APIs when invalidation rules are well understood. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still valuable, though large systems need stampede protection, observability, and tenant-safe keying. |

## Examples

### Explicit cache miss and invalidation

**❌ Negative (typescript)**

```typescript
async function getProduct(id: string): Promise<Product> {
  return db.products.findById(id); // hot products hit the database on every request
}

async function updateProduct(id: string, patch: Partial<Product>): Promise<void> {
  await db.products.update(id, patch); // no cache contract, so later caching risks stale data
}
```

**✅ Positive (typescript)**

```typescript
async function getProduct(id: string): Promise<Product> {
  const key = `product:${id}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as Product;

  const product = await db.products.findById(id);
  await redis.set(key, JSON.stringify(product), { EX: 300 });
  return product;
}

async function updateProduct(id: string, patch: Partial<Product>): Promise<void> {
  await db.products.update(id, patch);
  await redis.del(`product:${id}`);
}
```

*The positive version caches only after a database read and invalidates after writes, keeping the database authoritative while reducing repeated read load.*

## Relationships

**Synergies**

- [Read Replica](../data-persistence/read-replica.md) — Cache misses can fall back to read replicas to protect the primary database.
- [Materialized View](../cloud-distributed/materialized-view.md) — Cache-aside can cache precomputed view rows for hot query shapes.
- [Circuit Breaker](../resilience/circuit-breaker.md) — A breaker around the cache client prevents a slow cache from delaying all reads.
- [Idempotency](../resilience/idempotency.md) — Idempotent write handlers make invalidate-and-retry behaviour safe after partial failures.

**Alternatives:** [Write-Through Cache](../data-persistence/write-through-cache.md), [Write-Behind Cache](../data-persistence/write-behind-cache.md), [Lazy Load](../enterprise-application/lazy-load.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** redis, nodejs, spring-boot, dotnet, django
- **Project types:** backend-service, web-api, microservices, high-throughput
- **Tags:** cache, latency, read-optimisation

## References

- [Microsoft Azure Architecture Center; Cache-Aside pattern](https://learn.microsoft.com/azure/architecture/patterns/cache-aside)

