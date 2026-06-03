# Sharding

> Split one logical dataset across multiple storage partitions by a stable shard key, so write load, storage volume, and tenant isolation scale beyond a single database.

**Scale:** data · **Altitude:** high · **Category:** cloud-distributed · **Maturity:** time-tested

## Description

Sharding distributes records across independently owned physical partitions while preserving a single logical model for callers. A shard map, hash ring, tenant catalogue, or range router chooses the partition from a shard key such as tenantId, accountId, region, or aggregateId. The pattern works only when most reads and writes are scoped by that key; cross-shard joins, global uniqueness, migrations, and rebalancing become explicit distributed-system concerns rather than hidden database features.

**Problem.** A single primary database becomes a throughput, storage, lock-contention, or blast radius bottleneck, but simply adding replicas does not scale writes or tenant growth.

**Context.** Multi-tenant SaaS, high-write event stores, large account-based domains, or regional systems where access patterns naturally include a stable partition key.

## Consequences / Trade-offs

- Scales writes and storage horizontally when requests are shard-key aligned.
- Reduces blast radius because a hot tenant or corrupt partition need not affect all data.
- Cross-shard queries, uniqueness, transactions, and analytics become harder and slower.
- Resharding and hot-shard mitigation require operational tooling and careful rollout.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●○○○○ 1/5 | Avoid until a single database is measurably limiting you; it adds significant operational cost. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for fast-growing SaaS or high-write services with clean tenant or aggregate keys. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent fit for very large multi-tenant or high-throughput systems where write scale and blast radius dominate. |

## Examples

### Routing tenant data to a shard

**❌ Negative (typescript)**

```typescript
// Every tenant shares one write bottleneck and one failure domain.
async function recordInvoice(tenantId: string, invoice: Invoice) {
  await defaultDb.query(
    "INSERT INTO invoices(tenant_id, invoice_id, amount) VALUES($1,$2,$3)",
    [tenantId, invoice.id, invoice.amount],
  );
}
```

**✅ Positive (typescript)**

```typescript
interface ShardDirectory {
  forTenant(tenantId: string): Promise<Database>;
}

async function recordInvoice(tenantId: string, invoice: Invoice) {
  const db = await shardDirectory.forTenant(tenantId);
  await db.query(
    "INSERT INTO invoices(tenant_id, invoice_id, amount) VALUES($1,$2,$3)",
    [tenantId, invoice.id, invoice.amount],
  );
}
```

*The positive version makes placement explicit and routes by tenant before writing, allowing tenants to be moved, isolated, or scaled without changing business code.*

## Relationships

**Synergies**

- [Database per Service](../data-persistence/database-per-service.md) — Each service can own its shard map and avoid shared-database coupling while still scaling its data.
- [Materialized View](../cloud-distributed/materialized-view.md) — Global read models can precompute cross-shard views that would be expensive to query live.
- [Cache-Aside](../cloud-distributed/cache-aside.md) — Caches absorb hot-key reads while the shard key still routes authoritative writes.
- [Idempotency](../resilience/idempotency.md) — Retried cross-shard workflows need stable request identity to avoid duplicate writes.

**Conflicts with:** [Monolith](../architecture/monolith.md)

**Alternatives:** [Read Replica](../data-persistence/read-replica.md), [Cache-Aside](../cloud-distributed/cache-aside.md), [Polyglot Persistence](../data-persistence/polyglot-persistence.md)

## Applicability tags

- **Languages:** language-agnostic, sql, java, go, typescript
- **Frameworks:** none, spring-boot, dotnet, nodejs, sqlalchemy
- **Project types:** backend-service, microservices, distributed-system, high-throughput, data-pipeline
- **Tags:** partitioning, multi-tenancy, scalability, data-placement

## References

- [Microsoft Azure Architecture Center; Sharding pattern](https://learn.microsoft.com/azure/architecture/patterns/sharding)
- Martin Kleppmann, Designing Data-Intensive Applications, (2017)

