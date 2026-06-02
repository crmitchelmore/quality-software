# Bulkhead

> Partition execution resources so one slow or failing dependency cannot consume every thread, connection, queue slot or worker needed by the rest of the system.

**Scale:** integration · **Category:** resilience · **Maturity:** time-tested

**Also known as:** Resource Partitioning, Isolation Pool

## Description

A bulkhead isolates failure by assigning separate capacity to different workloads, tenants, priorities or dependencies. Like watertight compartments in a ship, each partition has its own concurrency limit, queue and sometimes connection pool. When one dependency stalls, only its compartment fills; unrelated traffic still has reserved capacity. Good bulkheads are explicit about what they protect, expose queue depth and rejection metrics, and choose bounded queues over unbounded buffering. They can be implemented in-process with semaphores and worker pools, at the runtime with separate executors, or operationally with separate pods, pools or clusters.

**Problem.** Shared pools create hidden coupling: a slow analytics API, noisy tenant or blocked queue can occupy every worker and make unrelated critical paths fail. Scaling the shared pool often delays the incident while increasing contention and memory use.

**Context.** Use when an application calls dependencies with different reliability profiles, serves mixed-priority traffic, or processes multiple tenants/workloads through common infrastructure. Bulkheads are especially valuable when the caller cannot control downstream latency.

## Consequences / Trade-offs

- Contains failure and protects critical traffic from noisy neighbours.
- Makes capacity allocation deliberate and measurable by dependency or workload.
- Can reduce average utilisation because reserved capacity may sit idle.
- Requires careful sizing and rejection behaviour; too many partitions add operational complexity.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary unless the app has several unreliable dependencies or mixed-priority workloads. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for APIs and workers sharing pools across important integrations. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical for multi-tenant and microservice estates where noisy neighbours are inevitable. |

## Examples

### Isolating dependency concurrency

**❌ Negative (typescript)**

```typescript
// All dependencies share the same unbounded promise fan-out.
async function renderDashboard(userId: string): Promise<Dashboard> {
  const [account, recommendations, adverts] = await Promise.all([
    accountClient.get(userId),
    recommendationClient.get(userId),
    advertClient.get(userId),
  ]);
  return { account, recommendations, adverts };
}
```

**✅ Positive (typescript)**

```typescript
import { Semaphore } from "async-mutex";

const accounts = new Semaphore(50);
const recommendations = new Semaphore(10);
const adverts = new Semaphore(5);

async function withBulkhead<T>(pool: Semaphore, work: () => Promise<T>): Promise<T> {
  const [release] = await pool.acquire();
  try {
    return await work();
  } finally {
    release();
  }
}

async function renderDashboard(userId: string): Promise<Dashboard> {
  const [account, recs, ads] = await Promise.allSettled([
    withBulkhead(accounts, () => accountClient.get(userId)),
    withBulkhead(recommendations, () => recommendationClient.get(userId)),
    withBulkhead(adverts, () => advertClient.get(userId)),
  ]);
  return composeDashboard(account, recs, ads);
}
```

*The positive version reserves independent concurrency for each downstream path, so a slow advert service cannot consume capacity needed for account data.*

## Relationships

**Synergies**

- [Circuit Breaker](../resilience/circuit-breaker.md) — A breaker fails fast for a sick dependency while the bulkhead ensures it cannot exhaust shared resources first.
- [Timeout](../resilience/timeout.md) — Timeouts drain occupied slots; without them, a bulkhead can still fill permanently.
- [Load Shedding](../resilience/load-shedding.md) — Once a compartment is full, load shedding provides a controlled refusal instead of unbounded queuing.
- [Rate Limiting](../resilience/rate-limiting.md) — Rate limits reduce admitted work while bulkheads reserve capacity for each class of work.

**Alternatives:** [Thread Pool](../concurrency/thread-pool.md), [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md), [Deployment Stamp (Cells)](../cloud-distributed/deployment-stamp.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, typescript
- **Frameworks:** none, spring-boot, dotnet, nodejs, kubernetes
- **Project types:** backend-service, web-api, microservices, distributed-system, high-throughput
- **Tags:** resilience, isolation, resource-management, fault-containment

## References

- Michael T. Nygard, Release It! Design and Deploy Production-Ready Software, (2007)
- [Microsoft Azure Architecture Center; Bulkhead pattern](https://learn.microsoft.com/azure/architecture/patterns/bulkhead)

