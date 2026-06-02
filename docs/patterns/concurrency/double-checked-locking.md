# Double-Checked Locking

> Lazily initialise a shared object by checking before and after acquiring a lock, using the language's safe-publication rules to avoid partially constructed reads.

**Scale:** concurrency · **Category:** concurrency · **Maturity:** established

**Also known as:** DCL

## Description

Double-Checked Locking avoids taking a lock on every access to a lazily-created singleton or expensive value. A fast path reads the shared reference; only when it is absent does the caller acquire a lock and check again before constructing. The second check prevents duplicate creation after another thread wins the race. The pattern is correct only when the reference is safely published: for example Java volatile, C# volatile/lock memory barriers, C++ atomics, or language-provided lazy initialisation. Without those memory-ordering guarantees, another thread may observe a non-null reference to a partially constructed object.

**Problem.** Lazy initialisation needs to be thread-safe without paying lock overhead on every read, but naive check-then-create races and can publish broken objects.

**Context.** Use sparingly for expensive, shared, lazily-created values on hot paths when simpler static initialisation or Lazy<T>-style facilities cannot be used.

## Consequences / Trade-offs

- Avoids lock overhead after initialisation while preserving single creation when implemented with safe publication.
- Easy to get subtly wrong in languages with weak memory models; prefer library lazy primitives when available.
- Couples callers to global lifetime and complicates testing if used for service location.
- The object should be immutable or internally thread-safe once published.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually avoid; static initialisers or simple synchronisation are clearer and fast enough. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for hot lazy values when language memory semantics are well understood; prefer built-in lazy primitives. |
| Large (>100k LOC) | ●●○○○ 2/5 | Risky as a catalogue-wide habit; large systems should prefer dependency injection, explicit lifecycle, or proven Lazy abstractions. |

## Examples

### Safe lazy singleton publication

**❌ Negative (java)**

```java
class Config {
  private static Config instance; // not volatile: unsafe publication
  private final Map<String, String> values;

  private Config() { values = loadValues(); }

  static Config get() {
    if (instance == null) {
      synchronized (Config.class) {
        if (instance == null) instance = new Config();
      }
    }
    return instance; // another thread may observe a partially constructed Config
  }
}
```

**✅ Positive (java)**

```java
class Config {
  private static volatile Config instance;
  private final Map<String, String> values;

  private Config() { values = loadValues(); }

  static Config get() {
    Config local = instance;
    if (local == null) {
      synchronized (Config.class) {
        local = instance;
        if (local == null) {
          local = new Config();
          instance = local; // volatile write safely publishes final state
        }
      }
    }
    return local;
  }
}
```

*The positive version uses volatile and a local fast-path read, so construction is safely published and only one thread performs initialisation. Without volatile, the reference write can become visible before construction effects are visible.*

## Relationships

**Synergies**

- [Singleton](../gof-creational/singleton.md) — DCL is often used to lazily create a Singleton while keeping subsequent access lock-free.
- [Immutable Object](../concurrency/immutable-object.md) — Publishing an immutable object avoids later races after the safely-published reference becomes visible.
- [Factory Method](../gof-creational/factory-method.md) — The locked slow path can delegate construction to a factory while preserving lazy access.
- [Monitor Object](../concurrency/monitor-object.md) — The slow path relies on monitor-style mutual exclusion for the second check and construction.

**Conflicts with:** [Registry](../enterprise-application/registry.md)

**Alternatives:** [Singleton](../gof-creational/singleton.md), [Immutable Object](../concurrency/immutable-object.md), [Factory Method](../gof-creational/factory-method.md)

## Applicability tags

- **Languages:** java, csharp, cpp
- **Frameworks:** none, spring, dotnet
- **Project types:** library, backend-service, desktop-app
- **Tags:** lazy-initialisation, safe-publication, memory-model

## References

- [The Double-Checked Locking is Broken Declaration, (2004)](https://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html)

