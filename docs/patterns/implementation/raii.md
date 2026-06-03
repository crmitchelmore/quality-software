# RAII (Resource Acquisition Is Initialization)

> Bind resource lifetime to object lifetime so acquisition happens during construction and release happens automatically when scope exits.

**Scale:** implementation · **Altitude:** low · **Category:** implementation · **Maturity:** time-tested

**Also known as:** Scope-Bound Resource Management

## Description

RAII wraps resources such as locks, files, sockets, and transactions in objects whose destructors or scope-exit hooks release them. The caller cannot forget the cleanup path because normal return, early return, and exception paths all leave the scope. In languages without deterministic destructors, the same idiom appears as using/try-with-resources/context managers.

**Problem.** Manual open/close or lock/unlock pairs are easy to skip on error paths, causing leaks, deadlocks, and partially committed work.

**Context.** Use whenever a resource has a strict acquire/release lifecycle and the language or framework supports deterministic scope cleanup.

## Consequences / Trade-offs

- Makes cleanup reliable across success, early return, and exceptions.
- Keeps ownership local and visible in the scope that acquired the resource.
- Requires careful move/copy semantics in systems languages.
- Less direct in garbage-collected languages without deterministic finalisation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent whenever resources exist; low ceremony and high safety. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Essential for locks, files, and transactions as error paths multiply. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational in systems code; document ownership conventions consistently. |

## Examples

### Lock release on every path

**❌ Negative (cpp)**

```cpp
void update(Cache& cache, std::mutex& mutex, const Item& item) {
    mutex.lock();
    if (!item.valid()) {
        return; // mutex is never unlocked
    }
    cache.store(item);
    mutex.unlock();
}
```

**✅ Positive (cpp)**

```cpp
void update(Cache& cache, std::mutex& mutex, const Item& item) {
    std::lock_guard<std::mutex> lock(mutex);
    if (!item.valid()) {
        return;
    }
    cache.store(item);
}
```

*The lock guard releases the mutex when the function scope exits, so the guard clause cannot accidentally leave the cache permanently locked.*

## Relationships

**Synergies**

- [Guard Clause (Early Return)](../implementation/guard-clause.md) — RAII makes early returns safe because cleanup is tied to scope exit.
- [Fail Fast](../implementation/fail-fast.md) — Fail-fast exceptions become safer when resources still release deterministically.
- [Unit of Work](../enterprise-application/unit-of-work.md) — Transaction guards can commit or roll back at scope boundaries.

**Alternatives:** [Unit of Work](../enterprise-application/unit-of-work.md), [Template Method](../gof-behavioural/template-method.md)

## Applicability tags

- **Languages:** cpp, rust, csharp, java, python
- **Frameworks:** none, dotnet, spring
- **Project types:** library, backend-service, cli-tool, embedded, safety-critical
- **Tags:** resources, cleanup, lifecycle

## References

- Bjarne Stroustrup, The C++ Programming Language, (2013)

