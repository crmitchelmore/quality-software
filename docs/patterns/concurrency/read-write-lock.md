# Read-Write Lock

> Allow many concurrent readers or one exclusive writer for shared state whose reads are frequent and writes are comparatively rare.

**Scale:** concurrency · **Altitude:** low · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Shared-Exclusive Lock

## Description

Read-Write Lock splits access into shared read mode and exclusive write mode. It improves throughput when protected data is read often, writes are short, and reads are long enough for parallelism to matter. Correctness still requires every access to use the appropriate lock and writers to publish complete updates before releasing it. The pattern is often overused: on small critical sections a plain mutex can be faster, and unfair policies can starve writers behind a constant stream of readers.

**Problem.** A single mutex serialises all access to mostly-read state, while no lock permits readers to observe partial writes or data structures being mutated underneath them.

**Context.** Use for in-memory indexes, routing tables, configuration snapshots, or caches where reads dominate writes and stale immutable snapshots are not sufficient.

## Consequences / Trade-offs

- Increases read-side concurrency for read-heavy workloads with meaningful critical sections.
- More complex than a mutex; lock upgrading/downgrading can deadlock if not carefully supported.
- Writer starvation or reader latency spikes depend on fairness policy.
- Does not protect mutable objects returned to callers unless copied or immutable.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely worth the complexity for small code; a mutex or immutable replacement is usually clearer. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good when profiling shows read-heavy contention and critical sections are not tiny. |
| Large (>100k LOC) | ●●●○○ 3/5 | Situational: useful in hot local structures, but large systems should consider sharding, immutable snapshots, or lock-free read paths. |

## Examples

### Protecting a routing table

**❌ Negative (go)**

```go
package routes

var table = map[string]string{}

func Lookup(path string) string {
    return table[path] // races with Update; Go may panic on concurrent map access
}

func Update(path, backend string) {
    table[path] = backend
}
```

**✅ Positive (go)**

```go
package routes

import "sync"

type Table struct {
    mu    sync.RWMutex
    table map[string]string
}

func NewTable() *Table {
    return &Table{table: map[string]string{}}
}

func (t *Table) Lookup(path string) (string, bool) {
    t.mu.RLock()
    backend, ok := t.table[path]
    t.mu.RUnlock()
    return backend, ok
}

func (t *Table) Update(path, backend string) {
    t.mu.Lock()
    t.table[path] = backend
    t.mu.Unlock()
}
```

*The positive version lets concurrent lookups proceed while updates remain exclusive. Every access is inside the lock, so readers never race with map mutation.*

## Relationships

**Synergies**

- [Immutable Object](../concurrency/immutable-object.md) — Writers can swap immutable snapshots so readers hold the lock briefly or not at all.
- [Copy-on-Write](../concurrency/copy-on-write.md) — Copy-on-Write is an alternative for very read-heavy data where writes can clone and publish a new version.
- [Monitor Object](../concurrency/monitor-object.md) — A monitor may use a read-write lock internally while still hiding synchronisation from clients.
- [Cache-Aside](../cloud-distributed/cache-aside.md) — Read-heavy caches sometimes protect local maps with read-write locks when cache misses update entries.

**Conflicts with:** [Active Object](../concurrency/active-object.md)

**Alternatives:** [Monitor Object](../concurrency/monitor-object.md), [Copy-on-Write](../concurrency/copy-on-write.md), [Immutable Object](../concurrency/immutable-object.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, cpp
- **Frameworks:** none
- **Project types:** backend-service, web-api, high-throughput, realtime-system
- **Tags:** shared-exclusive, read-heavy, lock

## References

- [The Go sync Package; RWMutex](https://pkg.go.dev/sync#RWMutex)

