# Immutability

> Model state as values that are not changed in place; every update returns a new value preserving the old one.

**Scale:** design · **Altitude:** low · **Category:** functional · **Maturity:** time-tested

**Also known as:** Immutable State, Value-Oriented Design

## Description

Immutability makes object or data structure state stable after construction. Instead of changing a record in place, code creates a revised value that shares unchanged parts where possible. This protects invariants, supports reasoning over time, and reduces accidental coupling between callers that hold references to the same object.

**Problem.** Shared mutable state lets distant code change values unexpectedly, creating order-dependent bugs, defensive copying, and difficult concurrency failures.

**Context.** Use for domain values, configuration, events, reducer state, messages, and concurrent or asynchronous workflows where many components observe the same data.

## Consequences / Trade-offs

- Eliminates accidental aliasing and makes historical states safe to retain.
- Simplifies concurrency because readers do not need locks for stable values.
- May allocate more unless structural sharing, copy-on-write, or compiler optimisations apply.
- Requires explicit update APIs; naive deep copying can be slow and noisy.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Usually worth it for value objects and UI state; do not over-engineer tiny throwaway scripts. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for domain state, reducers, and configuration. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical for concurrent systems and large teams because it removes whole classes of aliasing bugs. |

## Examples

### Updating an order without mutating the original

**❌ Negative (typescript)**

```typescript
type Order = { id: string; lines: string[]; status: "draft" | "submitted" };

function submit(order: Order): Order {
  order.status = "submitted";
  order.lines.push("audit-line");
  return order;
}
```

**✅ Positive (typescript)**

```typescript
type Order = Readonly<{
  id: string;
  lines: readonly string[];
  status: "draft" | "submitted";
}>;

function submit(order: Order): Order {
  return {
    ...order,
    status: "submitted",
    lines: [...order.lines, "audit-line"],
  };
}
```

*The positive version returns a new order and leaves existing references untouched, so callers holding the draft cannot observe a surprise mutation.*

## Relationships

**Synergies**

- [Immutable Object](../concurrency/immutable-object.md) — Immutable Object is the object-oriented formulation of the same invariant.
- [Copy-on-Write](../concurrency/copy-on-write.md) — Copy-on-Write delays copying until mutation is required, reducing the cost of immutable snapshots.
- [Persistent Data Structure](../functional/persistent-data-structure.md) — Persistent structures make immutable updates efficient through structural sharing.
- [Pure Function](../functional/pure-function.md) — Pure functions depend on immutable inputs to remain referentially transparent.

**Alternatives:** [Memento](../gof-behavioural/memento.md), [Copy-on-Write](../concurrency/copy-on-write.md), [Event Sourcing](../architecture/event-sourcing.md)

## Applicability tags

- **Languages:** language-agnostic, haskell, clojure, scala, rust, typescript
- **Frameworks:** none, react, redux
- **Project types:** library, web-frontend, backend-service, distributed-system, safety-critical
- **Tags:** state, concurrency, value-semantics

## References

- Chris Okasaki, Purely Functional Data Structures, (1998)

