# Monitor Object

> Encapsulate shared mutable state inside an object whose methods acquire a mutual-exclusion lock and coordinate condition waits internally.

**Scale:** concurrency · **Altitude:** low · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Synchronized Object

## Description

Monitor Object makes the object the owner of both state and synchronisation. Public methods enter the monitor, check and mutate invariants while holding the lock, and use condition variables to wait for state changes without busy spinning. Clients call intention-revealing methods rather than managing locks themselves. The pattern works best when the critical section is small and all mutable state is private; it fails if methods call out to untrusted code while locked, expose internal collections, or split one invariant across several monitors.

**Problem.** Shared mutable state protected by ad-hoc external locks is easy to misuse: clients forget to lock, lock in inconsistent order, or wait using unsafe check-then-sleep loops.

**Context.** Use when a single object owns a small set of mutable invariants that must be read or updated atomically by multiple threads.

## Consequences / Trade-offs

- Centralises locking discipline and keeps invariants close to the state they protect.
- Condition waits avoid busy loops and lost wakeups when used in while loops.
- Coarse monitor locks can reduce concurrency and create contention hotspots.
- Calling external code under the monitor risks deadlock or long lock hold times.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good for small libraries with shared state; the discipline is simple if critical sections stay tiny. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for encapsulated mutable components, though contention should be measured before adding more elaborate locks. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful internally, but large systems often prefer immutability, actors, or partitioning to avoid coarse shared monitors. |

## Examples

### Coordinating a bounded buffer

**❌ Negative (cpp)**

```cpp
#include <queue>

class Buffer {
  std::queue<int> items;
public:
  void put(int value) { items.push(value); }     // data race
  int take() {
    while (items.empty()) {}                     // busy wait and data race
    int value = items.front();
    items.pop();
    return value;
  }
};
```

**✅ Positive (cpp)**

```cpp
#include <condition_variable>
#include <mutex>
#include <queue>

class Buffer {
  std::mutex mutex;
  std::condition_variable not_empty;
  std::queue<int> items;
public:
  void put(int value) {
    {
      std::lock_guard<std::mutex> lock(mutex);
      items.push(value);
    }
    not_empty.notify_one();
  }

  int take() {
    std::unique_lock<std::mutex> lock(mutex);
    not_empty.wait(lock, [&] { return !items.empty(); });
    int value = items.front();
    items.pop();
    return value;
  }
};
```

*The positive version hides the queue and synchronises every access through the monitor. The condition wait is predicate-based, so spurious wakeups and lost notifications do not break correctness.*

## Relationships

**Synergies**

- [Guarded Suspension](../concurrency/guarded-suspension.md) — Guarded Suspension is commonly implemented as a monitor method that waits until a predicate becomes true.
- [Balking](../concurrency/balking.md) — A monitor can atomically test state and return immediately when an operation is inappropriate.
- [Immutable Object](../concurrency/immutable-object.md) — Immutable values can be safely returned from monitor methods without leaking protected mutable state.
- [Active Object](../concurrency/active-object.md) — Active Object is an asynchronous alternative when callers should not block on the monitor.

**Conflicts with:** [Thread-Specific Storage](../concurrency/thread-specific-storage.md)

**Alternatives:** [Active Object](../concurrency/active-object.md), [Read-Write Lock](../concurrency/read-write-lock.md), [Semaphore](../concurrency/semaphore.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, cpp, python
- **Frameworks:** none
- **Project types:** library, backend-service, desktop-app, embedded
- **Tags:** mutex, condition-variable, encapsulation

## References

- Doug Lea, Concurrent Programming in Java, (1999)

