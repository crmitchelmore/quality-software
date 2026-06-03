# Semaphore

> Control access to a finite set of permits so only a bounded number of concurrent operations can enter a critical or resource-limited section.

**Scale:** concurrency · **Altitude:** low · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Permit counter, Counting semaphore

## Description

A Semaphore is a concurrency primitive built around a counter of available permits. Acquiring a permit decrements the counter or waits/fails when none are available; releasing a permit increments it and may wake a waiter. Binary semaphores can act like simple mutexes, but counting semaphores are most valuable for bounding concurrency around scarce resources such as database connections, external API calls, file descriptors, GPU slots, or in-flight jobs. Correct use requires release in all paths and clear ownership of each acquired permit.

**Problem.** Without an explicit concurrency bound, bursts of work can overwhelm a shared resource even when each individual operation is correct.

**Context.** Use when a resource has a known capacity or when a subsystem must be protected from too many concurrent callers. Prefer higher-level pools or rate limiters when they directly model the resource.

## Consequences / Trade-offs

- Provides a simple, local concurrency limit independent of the caller count.
- Can protect downstream resources and make overload visible as waiting, timeout, or rejection.
- Missing releases leak permits and eventually deadlock the workload.
- Semaphores do not provide fairness, cancellation, or ownership tracking unless the implementation explicitly supports them.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for protecting a single scarce resource, but higher-level queues or pools are often clearer. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for service hotspots such as external calls, decoders, and limited worker slots when releases are well scoped. |
| Large (>100k LOC) | ●●●●○ 4/5 | Important building block for bulkheads and overload control, though observability and cancellation semantics become mandatory. |

## Examples

### Bounding concurrent calls and releasing permits reliably

**❌ Negative (java)**

```java
final class ThumbnailService {
  Image render(Path path) throws IOException {
    // Hundreds of requests can enter native image decoding at once.
    return decoder.decode(path);
  }
}
```

**✅ Positive (java)**

```java
final class ThumbnailService {
  private final Semaphore decodePermits = new Semaphore(8, true);

  Image render(Path path) throws IOException, InterruptedException {
    if (!decodePermits.tryAcquire(250, TimeUnit.MILLISECONDS)) {
      throw new RejectedExecutionException("too many concurrent decodes");
    }
    try {
      return decoder.decode(path);
    } finally {
      decodePermits.release();
    }
  }
}
```

*The positive version caps native decodes at the capacity the process can sustain, times out rather than queueing forever, and releases the permit in finally so exceptions do not leak capacity.*

## Relationships

**Synergies**

- [Producer-Consumer](../concurrency/producer-consumer.md) — Semaphores can bound the number of in-flight jobs between producers and consumers when a queue alone is not enough.
- [Bulkhead](../resilience/bulkhead.md) — A semaphore is a common implementation mechanism for bulkheads that cap concurrent calls to one dependency.
- [Rate Limiting](../resilience/rate-limiting.md) — Rate limits bound work over time; semaphores bound simultaneous work, and robust systems often need both.
- [Guarded Suspension](../concurrency/guarded-suspension.md) — Semaphore acquisition is a guard that suspends callers until a permit-backed condition is true.

**Conflicts with:** [Reactor](../concurrency/reactor.md)

**Alternatives:** [Thread Pool](../concurrency/thread-pool.md), [Rate Limiting](../resilience/rate-limiting.md), [Bulkhead](../resilience/bulkhead.md)

## Applicability tags

- **Languages:** language-agnostic, java, cpp, csharp, go, python
- **Frameworks:** none, spring-boot, dotnet
- **Project types:** backend-service, web-api, high-throughput, distributed-system
- **Tags:** permits, resource-bounds, throttling

## References

- Allen B. Downey, The Little Book of Semaphores, (2008)

