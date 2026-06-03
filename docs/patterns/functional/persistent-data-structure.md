# Persistent Data Structure

> Preserve previous versions of a collection after updates by sharing unchanged structure between versions.

**Scale:** design · **Altitude:** low · **Category:** functional · **Maturity:** time-tested

**Also known as:** Structurally Shared Data Structure

## Description

A Persistent Data Structure is immutable yet efficient: update operations return a new version while reusing most nodes from the old version. Hash-array mapped tries, ropes, persistent vectors, and red-black trees make value-oriented state practical without full deep copies. Persistence here means version preservation, not database durability.

**Problem.** Naively copying whole immutable collections on every update is too expensive, while mutable collections lose history and are unsafe to share.

**Context.** Use for editor/document models, undo/redo history, compiler ASTs, concurrent snapshots, reducer state, and systems needing cheap immutable versions of large collections.

## Consequences / Trade-offs

- Old versions remain valid for history, rollback, snapshots, and concurrent readers.
- Structural sharing gives efficient updates without in-place mutation.
- Data structures are more complex than built-in mutable arrays/maps and may have different performance constants.
- Interoperability with mutable APIs requires careful conversion at boundaries.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful in UI state and libraries, but built-in immutable copies are often enough for tiny data. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong for reducers, undo history, ASTs, and concurrent snapshots. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large stateful systems needing versioning, safe sharing, and predictable rollback. |

## Examples

### Keeping an old cart version

**❌ Negative (clojure)**

```clojure
(def cart (atom {:items []}))
(def before @cart)

(swap! cart update :items conj {:sku "A-1" :qty 1})

;; before and after depend on when the atom is dereferenced;
;; callers coordinate around mutable identity.
```

**✅ Positive (clojure)**

```clojure
(def before {:items []})
(def after (update before :items conj {:sku "A-1" :qty 1}))

(:items before) ;; []
(:items after)  ;; [{:sku "A-1" :qty 1}]

;; Clojure maps/vectors share unchanged structure between versions.
```

*The positive version keeps both cart versions as values. The update is cheap because unchanged structure is shared rather than deeply copied.*

## Relationships

**Synergies**

- [Immutability](../functional/immutability.md) — Persistent structures are the implementation technique that makes pervasive immutability efficient.
- [Copy-on-Write](../concurrency/copy-on-write.md) — Both preserve readers from mutation; persistent structures do it through path copying and structural sharing.
- [Memento](../gof-behavioural/memento.md) — Cheap previous versions make undo/redo and snapshots practical.
- [Event Sourcing](../architecture/event-sourcing.md) — Snapshots built from persistent structures can complement event replay without mutating history.

**Alternatives:** [Copy-on-Write](../concurrency/copy-on-write.md), [Memento](../gof-behavioural/memento.md), [Event Sourcing](../architecture/event-sourcing.md)

## Applicability tags

- **Languages:** clojure, scala, haskell, rust, typescript
- **Frameworks:** none, redux
- **Project types:** library, web-frontend, data-pipeline, backend-service, desktop-app
- **Tags:** structural-sharing, history, immutable-collections

## References

- Chris Okasaki, Purely Functional Data Structures, (1998)

