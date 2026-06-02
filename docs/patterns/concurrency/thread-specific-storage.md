# Thread-Specific Storage

> Give each thread its own instance of otherwise global-looking state so code can access per-thread context without sharing mutable data across threads.

**Scale:** concurrency · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Thread-local storage, TLS

## Description

Thread-Specific Storage binds a value to the current thread. Callers retrieve it through a stable accessor, but each thread sees a distinct instance: a formatter, scratch buffer, request context, database session, or legacy library handle. This removes lock contention for state that is naturally scoped to one thread and helps adapt non-thread-safe components. The pattern is powerful but dangerous in pooled, asynchronous, or coroutine-based systems because logical work may move between threads while thread-local state stays behind.

**Problem.** Some state must be convenient to access from many call sites, yet sharing one mutable instance across threads creates races or serialises all callers behind a lock.

**Context.** Use for values genuinely tied to an operating-system thread or a fixed worker thread, especially when adapting legacy APIs, maintaining per-thread buffers, or keeping per-thread statistics.

## Consequences / Trade-offs

- Avoids locks for per-thread state and can reduce allocations for reusable scratch objects.
- Makes implicit dependencies harder to see, test, and clear correctly.
- Leaks context across tasks if thread-pool workers are reused and values are not reset.
- Breaks down when logical execution hops threads under async/await, work stealing, or green-thread schedulers.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Useful for narrow library internals, but usually an unnecessary hidden dependency in small applications. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for per-thread caches or legacy integration; prefer explicit context passing for request data. |
| Large (>100k LOC) | ●●●○○ 3/5 | Can be valuable in infrastructure, but large async systems need strict scoping rules and tests to prevent context leaks. |

## Examples

### Clearing thread-local request context in a pool

**❌ Negative (java)**

```java
final class RequestContext {
  static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
}

void handle(Request request) {
  RequestContext.USER_ID.set(request.userId());
  service.process(request);
  // BUG: pooled worker keeps USER_ID for the next request on this thread.
}
```

**✅ Positive (java)**

```java
final class RequestContext {
  static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
}

void handle(Request request) {
  try {
    RequestContext.USER_ID.set(request.userId());
    service.process(request);
  } finally {
    RequestContext.USER_ID.remove();
  }
}
```

*The positive version treats thread-local state as a scoped resource. Removing it in finally prevents one logical request from inheriting another request's identity when the same worker thread is reused.*

## Relationships

**Synergies**

- [Thread Pool](../concurrency/thread-pool.md) — Thread pools often combine well with per-worker caches, but they also make cleanup mandatory between logical tasks.
- [Immutable Object](../concurrency/immutable-object.md) — Immutable context values reduce the damage when thread-local values are accidentally observed by later work on the same worker.
- [Monitor Object](../concurrency/monitor-object.md) — Monitor Object is an alternative for truly shared mutable state; TLS should be reserved for state that should not be shared.

**Conflicts with:** [Reactor](../concurrency/reactor.md), [Actor Model](../concurrency/actor-model.md)

**Alternatives:** [Immutable Object](../concurrency/immutable-object.md), [Monitor Object](../concurrency/monitor-object.md), [Active Object](../concurrency/active-object.md)

## Applicability tags

- **Languages:** language-agnostic, java, cpp, csharp, go, python
- **Frameworks:** spring-boot, dotnet, none
- **Project types:** backend-service, library, high-throughput, low-latency
- **Tags:** thread-local, context, implicit-state

## References

- Schmidt, Stal, Rohnert, Buschmann, Pattern-Oriented Software Architecture Volume 2, (2000)

