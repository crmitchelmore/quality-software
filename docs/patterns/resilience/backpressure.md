# Backpressure

> Let consumers signal available capacity to producers so work enters the system only as fast as it can be processed safely.

**Scale:** concurrency · **Category:** resilience · **Maturity:** established

**Also known as:** Flow Control, Demand Signalling

## Description

Backpressure is flow control for concurrent and distributed workloads. Rather than letting producers push unlimited work into queues, streams, sockets or worker pools, the consumer exposes demand, credits, bounded buffers or awaitable writes. Producers then slow down, batch, pause or fail early when downstream capacity is exhausted. This is distinct from merely dropping excess load: backpressure attempts to preserve work by regulating admission at the source. It works best when every stage in a pipeline respects the signal; one unbounded buffer can defeat the whole design.

**Problem.** Fast producers can overwhelm slower consumers, causing memory growth, long queues, stale work and eventual crashes. Without a feedback signal, the producer keeps creating work after the useful processing window has already passed.

**Context.** Apply to streams, message processing, async pipelines, file ingestion, websocket fan-out and any producer-consumer system where capacity varies over time. The work must be deferrable or paceable; urgent overload may require load shedding instead.

## Consequences / Trade-offs

- Prevents unbounded memory and queue growth by aligning production with consumption.
- Preserves useful work better than blind dropping when producers can slow down.
- Increases coupling between pipeline stages because producers must honour demand signals.
- Can propagate slowness upstream; user-facing producers may still need timeouts or shedding.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often unnecessary outside streaming, async or producer-consumer code. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Important for pipelines, websocket services and workers where bursts are common. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational for high-throughput distributed systems with multiple asynchronous stages. |

## Examples

### Respecting stream backpressure

**❌ Negative (typescript)**

```typescript
// Ignores the return value from write(); memory grows if the socket is slow.
async function sendEvents(events: AsyncIterable<Event>, socket: NodeJS.WritableStream) {
  for await (const event of events) {
    socket.write(JSON.stringify(event) + "\n");
  }
}
```

**✅ Positive (typescript)**

```typescript
import { once } from "events";

async function sendEvents(events: AsyncIterable<Event>, socket: NodeJS.WritableStream) {
  for await (const event of events) {
    const accepted = socket.write(JSON.stringify(event) + "\n");
    if (!accepted) {
      await once(socket, "drain");
    }
  }
}
```

*The positive version waits for the consumer's drain signal before producing more output, preventing unbounded buffering when the downstream socket slows.*

## Relationships

**Synergies**

- [Producer-Consumer](../concurrency/producer-consumer.md) — Backpressure makes producer-consumer queues bounded and demand-aware rather than infinite buffers.
- [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md) — Queues absorb bursts while backpressure prevents the queue itself becoming the failure point.
- [Load Shedding](../resilience/load-shedding.md) — When producers cannot slow down enough, shedding is the controlled failure mode after backpressure saturates.
- [Bulkhead](../resilience/bulkhead.md) — Separate backpressure signals per compartment prevent one stream from slowing all work.

**Alternatives:** [Load Shedding](../resilience/load-shedding.md), [Throttling](../cloud-distributed/throttling.md), [Rate Limiting](../resilience/rate-limiting.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, go, rust
- **Frameworks:** none, nodejs, rxjs, akka, kafka
- **Project types:** backend-service, data-pipeline, realtime-system, high-throughput, distributed-system
- **Tags:** resilience, concurrency, flow-control, bounded-buffer

## References

- [Reactive Streams Specification](https://www.reactive-streams.org/)
- [Node.js Streams API](https://nodejs.org/api/stream.html)

