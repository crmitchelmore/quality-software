# Thread Pool

> Execute many independent tasks using a bounded set of reusable worker threads rather than creating one thread per task.

**Scale:** concurrency · **Altitude:** low · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Worker Pool

## Description

Thread Pool keeps a managed group of worker threads alive and feeds them tasks from a queue. It amortises thread creation, caps CPU and memory pressure, and centralises lifecycle, naming, metrics, rejection, and shutdown. A good pool is deliberately sized for the dominant bottleneck: CPU-bound pools near core count, I/O-bound pools according to blocking time and latency budget. The pattern fails when treated as an infinite dumping ground; queues must be bounded or paired with rejection/backpressure, and blocking inside a shared pool can starve unrelated work.

**Problem.** Creating a thread per request or job is expensive and unbounded, while uncontrolled concurrency causes context-switch storms, memory exhaustion, and resource contention.

**Context.** Use for large numbers of independent tasks that can be scheduled onto a limited number of OS threads, especially server request handling, background jobs, and blocking I/O wrappers.

## Consequences / Trade-offs

- Reuses threads and caps concurrent execution, improving predictability under load.
- Requires explicit queue, sizing, rejection, and shutdown policies; defaults are often unsafe.
- Task starvation and deadlocks can occur when tasks wait for other tasks scheduled to the same saturated pool.
- Long blocking work should have a separate pool from short latency-sensitive work.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational: use a library executor when you have repeated concurrent jobs, but do not introduce a pool for a handful of simple async operations. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for services doing blocking work; correct sizing and separation of pools are high-leverage design choices. |
| Large (>100k LOC) | ●●●●○ 4/5 | Essential but dangerous if global; large systems need multiple bulkheaded pools, tracing, saturation alerts, and sometimes event-loop alternatives. |

## Examples

### Bounded executor for blocking thumbnail generation

**❌ Negative (csharp)**

```csharp
using System.Threading;

class Thumbnailer {
    public void Enqueue(string path) {
        new Thread(() => Generate(path)).Start(); // unbounded threads under bursts
    }

    private void Generate(string path) { /* CPU and disk work */ }
}
```

**✅ Positive (csharp)**

```csharp
using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

class Thumbnailer : IDisposable {
    private readonly BlockingCollection<string> queue = new(capacity: 500);
    private readonly Task[] workers;
    private readonly CancellationTokenSource stop = new();

    public Thumbnailer(int degreeOfParallelism) {
        workers = new Task[degreeOfParallelism];
        for (int i = 0; i < workers.Length; i++) {
            workers[i] = Task.Run(() => {
                foreach (var path in queue.GetConsumingEnumerable(stop.Token)) {
                    Generate(path);
                }
            });
        }
    }

    public bool Enqueue(string path) => queue.TryAdd(path, millisecondsTimeout: 100);
    private void Generate(string path) { /* CPU and disk work */ }

    public void Dispose() {
        queue.CompleteAdding();
        Task.WaitAll(workers, TimeSpan.FromSeconds(10));
        stop.Cancel();
        queue.Dispose();
        stop.Dispose();
    }
}
```

*The positive version bounds both queued work and active workers, so a burst cannot create unlimited threads. Reuse, shutdown, and rejection are explicit.*

## Relationships

**Synergies**

- [Producer-Consumer](../concurrency/producer-consumer.md) — The pool's task queue is a producer-consumer handoff where submitters produce and workers consume.
- [Future / Promise](../concurrency/future-promise.md) — Submitting to a pool commonly returns a Future that represents the eventual result or failure.
- [Bulkhead](../resilience/bulkhead.md) — Separate pools per dependency or workload isolate saturation instead of sharing one exhausted executor.
- [Backpressure](../resilience/backpressure.md) — Bounded queues and rejection handlers turn pool saturation into a caller-visible pressure signal.

**Conflicts with:** [Thread-Specific Storage](../concurrency/thread-specific-storage.md)

**Alternatives:** [Fork-Join](../concurrency/fork-join.md), [Reactor](../concurrency/reactor.md), [Actor Model](../concurrency/actor-model.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, python, cpp
- **Frameworks:** none, spring, dotnet, tokio
- **Project types:** backend-service, web-api, high-throughput, desktop-app
- **Tags:** executor, worker-pool, resource-control

## References

- Brian Goetz et al., Java Concurrency in Practice, (2006)

