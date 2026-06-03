# Producer-Consumer

> Decouple work creation from work execution by passing items through a thread-safe queue, often bounded so producers cannot outrun consumers indefinitely.

**Scale:** concurrency · **Altitude:** low · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Bounded Buffer, Work Queue

## Description

Producer-Consumer separates the rate and responsibility of creating work from the rate and responsibility of processing it. Producers enqueue immutable or safely-owned work items; one or more consumers dequeue and execute them. The queue is the synchronisation boundary: it serialises handoff, provides visibility guarantees, and, when bounded, turns overload into waiting, rejection, or backpressure rather than memory growth. The pattern is not merely "use a queue"; it requires clear ownership of item state, explicit shutdown semantics, error handling for failed items, and capacity choices aligned with latency and throughput goals.

**Problem.** Directly invoking slow work from producing threads couples lifetimes and rates, while sharing an unsynchronised list between producers and workers causes races, lost work, busy waiting, and unbounded memory use under bursts.

**Context.** Use when work arrives from one context (requests, file watchers, sockets, sensors) but should be processed by a controlled set of workers, especially when producers and consumers have different throughput profiles.

## Consequences / Trade-offs

- Smooths short bursts and lets producers remain responsive while consumers process at sustainable throughput.
- A bounded queue makes overload explicit but forces a policy: block, drop, shed, or reject.
- The queue becomes an operational boundary that must be observed for depth, age, failures, and shutdown drain.
- Mutable work items shared after enqueue can still race; ownership must transfer or the item must be immutable.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for small tools with background work, but often unnecessary if direct synchronous execution is simpler and latency is acceptable. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for services and pipelines with bursty ingress; it gives a clear concurrency boundary and pairs naturally with metrics. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still valuable, but large systems often need distributed queues, partitioning, and explicit backpressure policies beyond an in-process queue. |

## Examples

### Bounded handoff between request threads and workers

**❌ Negative (java)**

```java
import java.util.*;

class UnsafeJobs {
  private final List<Runnable> jobs = new ArrayList<>();

  void submit(Runnable job) {
    jobs.add(job);              // races with worker iteration; ArrayList is not safe
  }

  void workerLoop() {
    while (true) {
      if (!jobs.isEmpty()) {     // check-then-act race
        Runnable job = jobs.remove(0);
        job.run();
      }
    }
  }
}
```

**✅ Positive (java)**

```java
import java.util.concurrent.*;

class JobQueue implements AutoCloseable {
  private final BlockingQueue<Runnable> queue = new ArrayBlockingQueue<>(1_000);
  private final ExecutorService workers = Executors.newFixedThreadPool(8);
  private volatile boolean accepting = true;

  JobQueue() {
    for (int i = 0; i < 8; i++) {
      workers.submit(() -> {
        while (!Thread.currentThread().isInterrupted()) {
          queue.take().run();     // atomic wait + remove with visibility guarantees
        }
        return null;
      });
    }
  }

  boolean submit(Runnable job) throws InterruptedException {
    if (!accepting) return false;
    return queue.offer(job, 200, TimeUnit.MILLISECONDS); // bounded backpressure
  }

  public void close() {
    accepting = false;
    workers.shutdownNow();
  }
}
```

*The positive version uses a bounded BlockingQueue as the only handoff point. It removes the data race, avoids busy waiting, caps memory, and makes overload visible through a timed offer result.*

## Relationships

**Synergies**

- [Thread Pool](../concurrency/thread-pool.md) — Consumers are commonly fixed pool workers pulling from the queue, which caps concurrency and amortises thread creation.
- [Semaphore](../concurrency/semaphore.md) — Semaphores can represent queue slots or external resource permits when capacity must be coordinated outside the queue implementation.
- [Backpressure](../resilience/backpressure.md) — A bounded queue is the concrete signal that producers must slow down or be rejected before memory is exhausted.
- [Competing Consumers](../cloud-distributed/competing-consumers.md) — Multiple consumers can safely compete for independent messages when horizontal scaling is needed.

**Conflicts with:** [Thread-Specific Storage](../concurrency/thread-specific-storage.md)

**Alternatives:** [Reactor](../concurrency/reactor.md), [Actor Model](../concurrency/actor-model.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, python, cpp
- **Frameworks:** none, spring-boot, dotnet, celery, kafka, rabbitmq
- **Project types:** backend-service, data-pipeline, high-throughput, realtime-system
- **Tags:** queue, bounded-buffer, workload-smoothing, handoff

## References

- Brian Goetz et al., Java Concurrency in Practice, (2006)
- Schmidt, Stal, Rohnert, Buschmann, Pattern-Oriented Software Architecture Volume 2, (2000)

