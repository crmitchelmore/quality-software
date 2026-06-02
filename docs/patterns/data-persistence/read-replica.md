# Read Replica

> Serve read-only traffic from replicated database copies while writes continue on the primary, improving read scale at the cost of replica lag.

**Scale:** data · **Category:** data-persistence · **Maturity:** time-tested

## Description

A read replica continuously receives changes from a primary database and answers queries that do not need the latest committed write. The pattern separates read capacity, protects the primary from expensive reporting queries, and can place data closer to users. Correct designs make staleness visible: write-after-read paths use the primary, clients tolerate lag, and monitoring treats replication delay as an application-level failure mode.

**Problem.** Read-heavy workloads, dashboards, and search-like screens can saturate the primary database even though they do not modify state.

**Context.** Use when reads dominate writes, queries can tolerate bounded staleness, and the database engine or platform provides reliable replication and lag metrics. Avoid for invariants that require current state.

## Consequences / Trade-offs

- Improves read throughput and isolates analytical or expensive queries from write traffic.
- Replica lag can break read-your-writes expectations unless routing is deliberate.
- Failure modes multiply because replicas can be reachable but behind.
- Security controls must be duplicated; read-only access can still expose sensitive data at scale.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely necessary for small apps; indexes and query limits usually buy enough headroom. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for read-heavy products once lag-aware routing is built. |
| Large (>100k LOC) | ●●●●● 5/5 | Often essential at large scale, but only with lag alerts, failover runbooks, and read/write pool isolation. |

## Examples

### Route consistent reads deliberately

**❌ Negative (typescript)**

```typescript
async function updateEmail(userId: string, email: string) {
  await primary.query("UPDATE users SET email=$1 WHERE id=$2", [email, userId]);
  return replica.query("SELECT id,email FROM users WHERE id=$1", [userId]);
}
```

**✅ Positive (typescript)**

```typescript
async function updateEmail(userId: string, email: string) {
  await primary.query("UPDATE users SET email=$1 WHERE id=$2", [email, userId]);
  return primary.query("SELECT id,email FROM users WHERE id=$1", [userId]);
}

async function listUsers(page: Page) {
  return replica.query("SELECT id,email FROM users ORDER BY id LIMIT $1", [page.limit]);
}
```

*The positive version uses the primary for read-your-writes behaviour and keeps eventually consistent listing traffic on the replica.*

## Relationships

**Synergies**

- [CQRS (Command Query Responsibility Segregation)](../architecture/cqrs.md) — Read replicas are a low-friction read side when full materialised projections are not yet needed.
- [Pagination](../api-design/pagination.md) — Large list endpoints should still page results so replicas are not turned into unbounded scan engines.
- [Connection Pool](../data-persistence/connection-pool.md) — Separate pools for primary and replica traffic prevent slow reads from starving writes.
- [Health Endpoint Monitoring](../cloud-distributed/health-endpoint-monitoring.md) — Health checks should include replication lag, not just TCP reachability.

**Conflicts with:** [Optimistic Concurrency Control](../data-persistence/optimistic-concurrency-control.md)

**Alternatives:** [Materialized View](../cloud-distributed/materialized-view.md), [Cache-Aside](../cloud-distributed/cache-aside.md), [CQRS (Command Query Responsibility Segregation)](../architecture/cqrs.md)

## Applicability tags

- **Languages:** language-agnostic, sql, python, java
- **Frameworks:** none, spring-boot, django, rails, kubernetes
- **Project types:** web-api, backend-service, high-throughput, data-pipeline
- **Tags:** replication, read-scale, staleness

