# Copy-on-Write

> Let readers share an immutable snapshot while writers create and publish a fresh copy, avoiding reader locks for read-mostly data.

**Scale:** concurrency · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** COW, Snapshot-on-write

## Description

Copy-on-Write keeps shared state stable for readers by never mutating the currently published instance. A writer copies the existing state, applies its change to the private copy, then atomically publishes the new version. Existing readers finish on the old snapshot while new readers see the new one. The pattern is excellent for read-mostly collections, routing tables, listener lists, configuration snapshots, and small registries; it is a poor fit for large, frequently updated structures where copying dominates.

**Problem.** Many readers need fast, consistent access to shared data, but conventional read/write locking still adds coordination overhead and exposes readers to writer pauses.

**Context.** Use when reads vastly outnumber writes, snapshots can be slightly stale, the copied data is modest or structurally shared, and writers can tolerate copying cost.

## Consequences / Trade-offs

- Readers run without locks and observe a consistent snapshot.
- Writers are simple and isolated because they mutate only a private copy before publishing.
- Write-heavy workloads suffer from copying cost and garbage pressure.
- Lost updates are possible unless publication uses compare-and-swap, a write lock, or another single-writer discipline.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Good for small read-mostly registries; avoid using it as a generic collection replacement. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong for configuration, listener lists, and routing snapshots where writes are rare and reads are hot. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful in selected low-latency paths, but large data or frequent writes can create unacceptable memory churn. |

## Examples

### Read-mostly listener registry

**❌ Negative (java)**

```java
final class ListenerRegistry {
  private final List<Listener> listeners = new ArrayList<>();

  void add(Listener listener) {
    listeners.add(listener);
  }

  void publish(Event event) {
    for (Listener listener : listeners) { // ConcurrentModificationException or race
      listener.onEvent(event);
    }
  }
}
```

**✅ Positive (java)**

```java
final class ListenerRegistry {
  private final AtomicReference<List<Listener>> listeners =
      new AtomicReference<>(List.of());

  void add(Listener listener) {
    listeners.updateAndGet(current -> {
      ArrayList<Listener> next = new ArrayList<>(current);
      next.add(listener);
      return List.copyOf(next);
    });
  }

  void publish(Event event) {
    for (Listener listener : listeners.get()) {
      listener.onEvent(event);
    }
  }
}
```

*The positive version gives publishers an immutable snapshot to iterate without locks. Adding a listener copies and atomically publishes a new list, so in-flight publication remains stable.*

## Relationships

**Synergies**

- [Immutable Object](../concurrency/immutable-object.md) — Copy-on-Write relies on published snapshots being immutable to readers after publication.
- [Read-Write Lock](../concurrency/read-write-lock.md) — A write lock or CAS can serialise publishers while still allowing lock-free reads of snapshots.
- [Observer](../gof-behavioural/observer.md) — Listener lists are a classic Copy-on-Write use case because iteration is frequent and subscription changes are rare.
- [Value Object](../ddd-tactical/value-object.md) — Value-style elements reduce aliasing surprises when copied collections share references.

**Conflicts with:** [Producer-Consumer](../concurrency/producer-consumer.md)

**Alternatives:** [Read-Write Lock](../concurrency/read-write-lock.md), [Immutable Object](../concurrency/immutable-object.md), [Persistent Data Structure](../functional/persistent-data-structure.md)

## Applicability tags

- **Languages:** language-agnostic, java, cpp, csharp, rust
- **Frameworks:** none
- **Project types:** library, backend-service, low-latency, high-throughput
- **Tags:** snapshots, read-mostly, lock-free-reads

## References

- Goetz, Peierls, Bloch, Bowbeer, Holmes, Lea, Java Concurrency in Practice, (2006)

