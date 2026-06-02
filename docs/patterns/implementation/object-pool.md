# Object Pool

> Reuse a bounded set of expensive objects instead of creating and destroying them for every operation.

**Scale:** design · **Category:** implementation · **Maturity:** established

**Also known as:** Resource Pool

## Description

Object Pool manages a lifecycle for reusable objects such as database connections, buffers, parser instances, or worker contexts. Clients borrow an item, use it for a short period, reset any mutable state, and return it to the pool. The pattern is a performance and capacity-control tool, not a general allocation strategy.

**Problem.** Creating expensive objects per request wastes latency and resources, while unbounded creation can exhaust external systems.

**Context.** Use when object creation is measurably expensive, reuse is safe after reset, and a bounded concurrency limit is desirable.

## Consequences / Trade-offs

- Reduces allocation or connection setup cost on hot paths.
- Provides backpressure by bounding concurrent resource usage.
- Requires rigorous reset and return discipline to avoid state leaks.
- Can make performance worse for cheap objects due to contention and complexity.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely worth it unless profiling identifies an expensive resource. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful for connections or large buffers, but only with clear ownership rules. |
| Large (>100k LOC) | ●●●●○ 4/5 | Important in high-throughput services; pool sizing and observability are critical. |

## Examples

### Reusing buffers safely

**❌ Negative (java)**

```java
byte[] encode(Event event) {
    byte[] buffer = new byte[1024 * 1024];
    return encoder.write(event, buffer);
}
```

**✅ Positive (java)**

```java
byte[] encode(Event event, BlockingQueue<byte[]> pool) throws InterruptedException {
    byte[] buffer = pool.take();
    try {
        Arrays.fill(buffer, (byte) 0);
        return encoder.write(event, buffer);
    } finally {
        pool.offer(buffer);
    }
}
```

*The positive version reuses a bounded number of large buffers and guarantees return in a finally block, avoiding unbounded allocation on the hot path.*

## Relationships

**Synergies**

- [Connection Pool](../data-persistence/connection-pool.md) — Connection Pool is the data-access specialisation of Object Pool.
- [Flyweight](../gof-structural/flyweight.md) — Both reduce allocation pressure, but Flyweight shares immutable intrinsic state rather than leasing mutable objects.
- [Backpressure](../resilience/backpressure.md) — A bounded pool naturally forces callers to wait, fail, or shed load.
- [RAII (Resource Acquisition Is Initialization)](../implementation/raii.md) — RAII-style leases ensure borrowed objects are returned even on error paths.

**Alternatives:** [Flyweight](../gof-structural/flyweight.md), [Lazy Initialization](../implementation/lazy-initialization.md), [Connection Pool](../data-persistence/connection-pool.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, rust
- **Frameworks:** none, dotnet, spring, tokio
- **Project types:** backend-service, high-throughput, low-latency, game, data-pipeline
- **Tags:** performance, resources, reuse

## References

- Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, Design Patterns, (1994)

