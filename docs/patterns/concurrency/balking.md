# Balking

> Check an object's state under synchronisation and immediately return or reject when the requested operation is not currently valid.

**Scale:** concurrency · **Altitude:** low · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Return If Not Ready

## Description

Balking is the non-blocking sibling of Guarded Suspension. A method enters the object's synchronisation boundary, checks whether the state permits the operation, and if not, exits immediately with a boolean, no-op, or domain-specific rejection. It is appropriate when waiting would be wasteful, dangerous, or semantically wrong: starting an already-started service, saving an unchanged document, or enqueueing after shutdown. The guard must be checked atomically with any state transition, otherwise two callers can both see "not started" and both perform the operation.

**Problem.** Operations that are valid only in certain states can be executed twice or at the wrong time when state checks happen outside the lock or are separated from mutation.

**Context.** Use for lifecycle methods, idempotent-ish operations, dirty flags, and capacity checks where callers should receive immediate feedback instead of blocking.

## Consequences / Trade-offs

- Makes invalid timing explicit and avoids tying up threads waiting for a state that should not be awaited.
- Simplifies lifecycle APIs by atomically coupling guard checks and state transitions.
- Callers must handle the balk result; silent no-ops can hide lost work if the contract is unclear.
- Not suitable when the caller genuinely needs the operation to happen eventually; use guarded suspension or a queue then.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Simple and effective for lifecycle and dirty-state code; document whether false means no-op or rejection. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for services and components with concurrent lifecycle calls or state-dependent operations. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful locally, but large systems need consistent error semantics and telemetry so balked operations are visible. |

## Examples

### Starting a service once

**❌ Negative (go)**

```go
package service

type Service struct { running bool }

func (s *Service) Start() {
    if s.running { return } // race: two goroutines can both pass
    initialiseSockets()
    s.running = true
}
```

**✅ Positive (go)**

```go
package service

import "sync"

type Service struct {
    mu      sync.Mutex
    running bool
}

func (s *Service) Start() bool {
    s.mu.Lock()
    if s.running {
        s.mu.Unlock()
        return false
    }
    s.running = true
    s.mu.Unlock()

    initialiseSockets()
    return true
}
```

*The positive version atomically claims the transition to running before performing the side effect, so exactly one caller starts the service and others receive an immediate false result.*

## Relationships

**Synergies**

- [Monitor Object](../concurrency/monitor-object.md) — A monitor provides the atomic state check and transition that balking requires.
- [Guarded Suspension](../concurrency/guarded-suspension.md) — Balking is the immediate-return alternative when waiting for the guard would be wrong.
- [Idempotency](../resilience/idempotency.md) — Balking can enforce idempotent lifecycle transitions such as "start only once".
- [State](../gof-behavioural/state.md) — State objects can encode which operations balk in each lifecycle state.

**Conflicts with:** [Retry with Backoff](../resilience/retry.md)

**Alternatives:** [Guarded Suspension](../concurrency/guarded-suspension.md), [Producer-Consumer](../concurrency/producer-consumer.md), [State](../gof-behavioural/state.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, python
- **Frameworks:** none
- **Project types:** library, backend-service, desktop-app, embedded
- **Tags:** lifecycle, non-blocking, state-guard

## References

- Schmidt, Stal, Rohnert, Buschmann, Pattern-Oriented Software Architecture Volume 2, (2000)

