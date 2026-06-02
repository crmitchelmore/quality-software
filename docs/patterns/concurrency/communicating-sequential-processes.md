# Communicating Sequential Processes (CSP)

> Compose independent sequential processes that synchronise and exchange values through explicit channels rather than shared mutable memory.

**Scale:** concurrency · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** CSP, Channel-oriented concurrency

## Description

Communicating Sequential Processes models a concurrent program as a network of simple sequential processes linked by channels. Each process owns its local state and communicates by sending or receiving messages; depending on the channel semantics, communication may rendezvous synchronously or use bounded buffering. In practical languages such as Go, CSP encourages pipelines, fan-out/fan-in, cancellation propagation, and select-style waiting over multiple events. The topology of channels becomes the concurrency design.

**Problem.** Shared-memory coordination scatters locks and condition variables across the code, making ownership, cancellation, and shutdown hard to reason about.

**Context.** Use when work can be decomposed into stages or cooperating goroutines/processes with clear data flow, especially pipelines, stream processing, fan-out/fan-in, and services that need cancellation-aware background workers.

## Consequences / Trade-offs

- Makes communication paths explicit and testable; ownership moves with messages rather than being shared implicitly.
- Bounded channels provide natural backpressure between producers and consumers.
- Goroutine or process leaks occur if cancellation, channel closing, and draining rules are not designed.
- Cyclic channel topologies and unbuffered rendezvous can deadlock if protocols are unclear.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Good for small Go tools with pipelines, but over-abstracting every function into goroutines causes leaks and complexity. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for services and data flows where channel ownership, cancellation, and backpressure can be documented clearly. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still valuable, but large systems need conventions for topology, observability, and avoiding hidden goroutine leaks. |

## Examples

### Cancellation-aware worker pipeline

**❌ Negative (go)**

```go
var queue []Job
var mu sync.Mutex

func produce(job Job) {
  mu.Lock()
  queue = append(queue, job) // unbounded growth under load
  mu.Unlock()
}

func consume() {
  for {
    mu.Lock()
    if len(queue) == 0 {
      mu.Unlock()
      continue // busy spin and no shutdown path
    }
    job := queue[0]
    queue = queue[1:]
    mu.Unlock()
    process(job)
  }
}
```

**✅ Positive (go)**

```go
func produce(ctx context.Context, jobs chan<- Job, input <-chan Job) error {
  for {
    select {
    case <-ctx.Done():
      return ctx.Err()
    case job, ok := <-input:
      if !ok {
        close(jobs)
        return nil
      }
      select {
      case jobs <- job: // bounded channel applies backpressure
      case <-ctx.Done():
        return ctx.Err()
      }
    }
  }
}

func consume(ctx context.Context, jobs <-chan Job) error {
  for {
    select {
    case <-ctx.Done():
      return ctx.Err()
    case job, ok := <-jobs:
      if !ok {
        return nil
      }
      if err := process(job); err != nil {
        return err
      }
    }
  }
}
```

*The positive version replaces a shared mutable queue and busy spin with a bounded channel, explicit ownership transfer, and cancellation-aware shutdown semantics.*

## Relationships

**Synergies**

- [Actor Model](../concurrency/actor-model.md) — Actors and CSP both avoid shared mutable state; CSP focuses on channel topology while actors focus on addressable entities and mailboxes.
- [Message Channel](../enterprise-integration/message-channel.md) — CSP channels are the in-process form of Message Channel, with explicit direction, buffering, and closing semantics.
- [Producer-Consumer](../concurrency/producer-consumer.md) — Producer-Consumer is the simplest CSP pipeline stage: one side sends work, the other receives and processes it.
- [Backpressure](../resilience/backpressure.md) — Bounded channels turn overload into blocking, selection, or rejection instead of unbounded memory growth.

**Conflicts with:** [Thread-Specific Storage](../concurrency/thread-specific-storage.md)

**Alternatives:** [Actor Model](../concurrency/actor-model.md), [Monitor Object](../concurrency/monitor-object.md), [Future / Promise](../concurrency/future-promise.md)

## Applicability tags

- **Languages:** language-agnostic, go, clojure, rust, java
- **Frameworks:** none, tokio
- **Project types:** backend-service, data-pipeline, high-throughput, realtime-system
- **Tags:** channels, message-passing, pipelines

## References

- C. A. R. Hoare, Communicating Sequential Processes, (1978)

