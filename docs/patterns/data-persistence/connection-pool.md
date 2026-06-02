# Connection Pool

> Reuse a bounded set of database connections to avoid per-request setup and protect the database from unbounded concurrency.

**Scale:** data · **Category:** data-persistence · **Maturity:** time-tested

## Description

A connection pool keeps a limited number of open database sessions and leases them to requests for short periods. It improves latency by reusing connections and, more importantly, applies backpressure before callers overwhelm the database. Expert use treats pool sizing as a safety control: set acquisition timeouts, avoid holding connections during external calls, separate read/write or automation pools, and expose pool wait time as a production signal.

**Problem.** Opening a database connection for every request is slow, while allowing unlimited concurrent connections can exhaust database memory, locks, and worker processes.

**Context.** Use for any service that makes repeated database calls. Tune per workload and database capacity rather than blindly using framework defaults.

## Consequences / Trade-offs

- Reduces connection setup overhead and caps database concurrency.
- A pool can hide slow queries until callers queue and time out far from the root cause.
- Too large a pool overloads the database; too small a pool causes artificial contention.
- Connections must be released promptly, especially around transactions and error paths.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Even small services benefit from bounded reuse, though defaults may be enough. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Critical for predictable latency and database protection in medium services. |
| Large (>100k LOC) | ●●●●● 5/5 | Load-bearing at large scale; requires per-workload pools, metrics, and timeouts. |

## Examples

### Keep leases short

**❌ Negative (typescript)**

```typescript
async function enrichAccount(id: string) {
  const client = await pool.connect();
  const account = await client.query("SELECT * FROM accounts WHERE id=$1", [id]);
  const risk = await riskApi.score(account.rows[0]); // connection held during HTTP call
  await client.query("UPDATE accounts SET risk=$1 WHERE id=$2", [risk, id]);
  client.release();
}
```

**✅ Positive (typescript)**

```typescript
async function enrichAccount(id: string) {
  const account = await pool.query("SELECT id,balance FROM accounts WHERE id=$1", [id]);
  const risk = await riskApi.score(account.rows[0]);
  await pool.query("UPDATE accounts SET risk=$1 WHERE id=$2", [risk, id]);
}
```

*The positive version does not hold a database session while waiting on an external service, reducing pool starvation and idle transaction risk.*

## Relationships

**Synergies**

- [Bulkhead](../resilience/bulkhead.md) — Separate pools isolate traffic classes so slow reports or agents do not starve critical writes.
- [Timeout](../resilience/timeout.md) — Acquisition and statement timeouts turn pool exhaustion into a fast, observable failure.
- [Read Replica](../data-persistence/read-replica.md) — Separate primary and replica pools prevent stale or slow read traffic from consuming write capacity.
- [Repository](../data-persistence/repository.md) — Repositories should acquire connections briefly and hide pooling mechanics from domain code.

**Conflicts with:** [Lazy Load](../enterprise-application/lazy-load.md)

**Alternatives:** [Object Pool](../implementation/object-pool.md), [Thread Pool](../concurrency/thread-pool.md), [Bulkhead](../resilience/bulkhead.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, python, go
- **Frameworks:** spring-boot, nodejs, django, dotnet, sqlalchemy
- **Project types:** web-api, backend-service, high-throughput, microservices
- **Tags:** resource-management, database-connections, backpressure

