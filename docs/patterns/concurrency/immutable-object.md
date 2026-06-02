# Immutable Object

> Represent state with objects whose observable values cannot change after construction, making them inherently safe to share between concurrent readers.

**Scale:** design · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Immutable value, Read-only object

## Description

An Immutable Object is fully initialised at creation time and never changes afterwards. Fields are private and final/readonly, contained collections are defensively copied or persistent, and operations that appear to change state return a new object instead. In concurrent programs this removes entire classes of races because readers never need to coordinate over changing state. The pattern is strongest for values, configuration, messages, snapshots, and domain concepts with identity by value rather than by mutable lifecycle.

**Problem.** Shared mutable objects require locks or careful ownership rules; missing one mutation path creates data races, visibility bugs, and surprising action at a distance.

**Context.** Use for values passed between threads, actors, goroutines, or asynchronous callbacks; configuration snapshots; request/response DTOs; money, time ranges, identifiers, and other domain values.

## Consequences / Trade-offs

- Safe to share freely across threads without locks, defensive copying by callers, or ownership transfer protocols.
- Easier reasoning and testing because methods cannot secretly alter existing instances.
- Updates allocate new objects; large structures may need structural sharing or Copy-on-Write to control cost.
- Construction must validate all invariants up front because invalid state cannot be repaired by later mutation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent default for value types and configuration; usually simpler than locks even in small codebases. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong default for DTOs, domain values, and messages crossing asynchronous boundaries. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential baseline for large concurrent systems; combine with structural sharing where allocation cost matters. |

## Examples

### Sharing configuration safely

**❌ Negative (java)**

```java
final class RetryPolicy {
  int maxAttempts;
  List<Integer> delaysMs;

  RetryPolicy(int maxAttempts, List<Integer> delaysMs) {
    this.maxAttempts = maxAttempts;
    this.delaysMs = delaysMs; // caller can mutate after construction
  }
}
```

**✅ Positive (java)**

```java
public final class RetryPolicy {
  private final int maxAttempts;
  private final List<Integer> delaysMs;

  public RetryPolicy(int maxAttempts, List<Integer> delaysMs) {
    if (maxAttempts < 1) throw new IllegalArgumentException("maxAttempts");
    this.maxAttempts = maxAttempts;
    this.delaysMs = List.copyOf(delaysMs);
  }

  public int maxAttempts() { return maxAttempts; }
  public List<Integer> delaysMs() { return delaysMs; }

  public RetryPolicy withMaxAttempts(int attempts) {
    return new RetryPolicy(attempts, delaysMs);
  }
}
```

*The positive version validates once, stores final fields, and defensively copies the list. Threads can share the policy safely, and changes produce a new instance instead of mutating the one already in use.*

## Relationships

**Synergies**

- [Copy-on-Write](../concurrency/copy-on-write.md) — Copy-on-Write provides efficient update mechanics for immutable-looking collections or snapshots.
- [Value Object](../ddd-tactical/value-object.md) — Value Objects are often immutable so equality, hashing, and domain invariants remain stable.
- [Pure Function](../functional/pure-function.md) — Pure functions compose naturally with immutable inputs and outputs because there is no hidden mutation.
- [Actor Model](../concurrency/actor-model.md) — Immutable messages between actors avoid accidental sharing of mutable state across actor boundaries.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Monitor Object](../concurrency/monitor-object.md), [Copy-on-Write](../concurrency/copy-on-write.md), [Persistent Data Structure](../functional/persistent-data-structure.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, scala, rust
- **Frameworks:** none
- **Project types:** library, backend-service, web-api, distributed-system
- **Tags:** immutability, value-semantics, thread-safety

## References

- Joshua Bloch, Effective Java, (2001)

