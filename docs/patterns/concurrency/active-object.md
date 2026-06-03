# Active Object

> Give an object its own execution context and request queue so callers invoke methods asynchronously while the object's state is mutated serially.

**Scale:** concurrency · **Altitude:** low · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Serialized Method Invocation

## Description

Active Object combines encapsulated state, a request queue, a scheduler, and a worker thread or event loop. Public methods do not mutate state directly; they package method calls as commands, enqueue them, and often return Futures for results. The active object's private thread executes requests one at a time, preserving invariants without exposing locks to callers. It is a good fit for stateful components with slow operations or thread-affinity constraints, but it adds lifecycle and queue-management responsibilities and can become a bottleneck if all operations are forced through one serial lane.

**Problem.** Multiple callers need to interact with a stateful object concurrently, but direct locking scatters synchronisation through clients or allows races in the object's invariants.

**Context.** Use for stateful services, device/session controllers, GUI models, or actors-in-miniature where serialising access behind an asynchronous API is simpler than exposing locks.

## Consequences / Trade-offs

- Object invariants are protected because only the worker touches private mutable state.
- Callers are decoupled from slow work and receive explicit futures for results.
- Queue growth, shutdown, ordering, and error propagation become part of the object's contract.
- A single active object can bottleneck; shard or partition when independent state exists.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often too much machinery for small code unless there is clear state affinity or slow operations that must not block callers. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for stateful components with complex invariants; the asynchronous API keeps callers honest about latency. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful as a building block, but large systems usually need actor supervision, partitioning, and observability around mailboxes. |

## Examples

### Serialising account mutations

**❌ Negative (java)**

```java
class Account {
  private int balance;

  void deposit(int amount) { balance += amount; }
  void withdraw(int amount) {
    if (balance < amount) throw new IllegalStateException("insufficient");
    balance -= amount;              // races with other deposits/withdrawals
  }
  int balance() { return balance; }
}
```

**✅ Positive (java)**

```java
import java.util.concurrent.*;
import java.util.function.Supplier;

class ActiveAccount implements AutoCloseable {
  private int balance;
  private final ExecutorService lane = Executors.newSingleThreadExecutor();

  CompletableFuture<Void> deposit(int amount) {
    return call(() -> { balance += amount; return null; });
  }

  CompletableFuture<Void> withdraw(int amount) {
    return call(() -> {
      if (balance < amount) throw new IllegalStateException("insufficient");
      balance -= amount;
      return null;
    });
  }

  CompletableFuture<Integer> balance() {
    return call(() -> balance);
  }

  private <T> CompletableFuture<T> call(Supplier<T> action) {
    return CompletableFuture.supplyAsync(action, lane);
  }

  public void close() { lane.shutdown(); }
}
```

*The positive version ensures every balance read and write happens on the same serial executor. Callers compose futures instead of taking locks or observing torn invariants.*

## Relationships

**Synergies**

- [Future / Promise](../concurrency/future-promise.md) — Asynchronous method calls usually return Futures completed by the active object's worker.
- [Command](../gof-behavioural/command.md) — Each enqueued method request is naturally represented as a Command.
- [Actor Model](../concurrency/actor-model.md) — Active Object is a local object-oriented cousin of an actor with a mailbox and serial state.
- [Monitor Object](../concurrency/monitor-object.md) — Monitor Object is a synchronous alternative when callers should block rather than enqueue.

**Conflicts with:** [Read-Write Lock](../concurrency/read-write-lock.md)

**Alternatives:** [Actor Model](../concurrency/actor-model.md), [Monitor Object](../concurrency/monitor-object.md), [Thread Pool](../concurrency/thread-pool.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, cpp, python, go
- **Frameworks:** none, akka, dotnet
- **Project types:** desktop-app, backend-service, realtime-system, embedded
- **Tags:** mailbox, serialisation, asynchronous-method

## References

- Schmidt, Stal, Rohnert, Buschmann, Pattern-Oriented Software Architecture Volume 2, (2000)

