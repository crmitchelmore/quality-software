# Barrier

> Make a fixed group of concurrent workers wait at a known point until every participant has arrived, then release them together.

**Scale:** concurrency · **Altitude:** low · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Synchronisation barrier, Rendezvous barrier

## Description

A Barrier coordinates phases of parallel work. Each participant performs local work, arrives at the barrier, and blocks until the required number of participants have arrived. Once the barrier opens, all participants continue to the next phase, sometimes after a barrier action aggregates or publishes phase results. Barriers are useful for simulations, batch algorithms, test coordination, and staged startup, but they require a stable participant count and robust failure handling.

**Problem.** Parallel workers must not begin the next phase until every worker has completed the current phase, otherwise they observe incomplete state or race with unfinished work.

**Context.** Use when concurrency is organised into explicit phases with a known number of participants: numerical simulations, parallel graph algorithms, staged initialisation, or deterministic integration tests.

## Consequences / Trade-offs

- Provides a clear phase boundary and makes inter-phase visibility explicit.
- Helps deterministic testing by coordinating workers at known points.
- One slow or failed participant stalls everyone unless timeout/broken-barrier handling exists.
- Dynamic participant counts or irregular work often fit channels, queues, or completion services better.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rare in small applications outside tests or teaching examples; simpler joins usually suffice. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful for phased algorithms, but brittle if participant counts are dynamic or failure handling is weak. |
| Large (>100k LOC) | ●●●○○ 3/5 | Valuable in specialised computation and simulation systems; risky in general services because one participant can stall a fleet of workers. |

## Examples

### Coordinating simulation phases

**❌ Negative (java)**

```java
for (Worker worker : workers) {
  new Thread(() -> {
    while (running.get()) {
      worker.computeNextPosition();
      world.publish(worker.position()); // other workers may still be on the old phase
    }
  }).start();
}
```

**✅ Positive (java)**

```java
CyclicBarrier phaseBarrier = new CyclicBarrier(workers.size(), world::publishAll);

for (Worker worker : workers) {
  new Thread(() -> {
    try {
      while (running.get()) {
        worker.computeNextPosition();
        phaseBarrier.await(1, TimeUnit.SECONDS);
      }
    } catch (TimeoutException e) {
      running.set(false); // fail the simulation rather than wait forever
    } catch (InterruptedException | BrokenBarrierException e) {
      Thread.currentThread().interrupt();
      running.set(false);
    }
  }).start();
}
```

*The positive version makes publication a barrier action that runs only after every worker has computed the phase. Timeouts and broken-barrier handling prevent one failed worker from hanging the simulation indefinitely.*

## Relationships

**Synergies**

- [Fork-Join](../concurrency/fork-join.md) — Joins and barriers both coordinate completion before aggregation; barriers are useful when workers continue through multiple phases.
- [Thread Pool](../concurrency/thread-pool.md) — Fixed-size worker pools are common barrier participants, but the pool must have at least as many runnable workers as the barrier requires.
- [Immutable Object](../concurrency/immutable-object.md) — Immutable phase snapshots prevent workers from mutating data after a barrier has published it to the next phase.

**Conflicts with:** [Producer-Consumer](../concurrency/producer-consumer.md)

**Alternatives:** [Fork-Join](../concurrency/fork-join.md), [Future / Promise](../concurrency/future-promise.md), [Message Channel](../enterprise-integration/message-channel.md)

## Applicability tags

- **Languages:** language-agnostic, java, cpp, csharp, go
- **Frameworks:** none
- **Project types:** data-pipeline, ml-system, game, realtime-system
- **Tags:** synchronisation, phased-execution, coordination

## References

- Herlihy and Shavit, The Art of Multiprocessor Programming, (2008)

