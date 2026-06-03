# Half-Sync/Half-Async

> Separate asynchronous event demultiplexing from synchronous application processing using a queue boundary between event-loop code and worker threads.

**Scale:** concurrency · **Altitude:** medium · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Async Boundary with Synchronous Workers

## Description

Half-Sync/Half-Async divides a concurrent system into an asynchronous layer that handles readiness events, non-blocking I/O, or interrupts, and a synchronous layer that performs easier-to-write blocking or sequential application logic. A queue bridges the layers: the async side enqueues work quickly and returns to event handling; worker threads dequeue and process using conventional blocking code. The pattern preserves event-loop responsiveness while avoiding fully callback-driven business logic. Its success depends on a bounded queue, clear ownership of buffers after handoff, and never blocking the async half.

**Problem.** Pure event-loop code can become callback-heavy and must never block, while thread-per-connection code wastes resources and scales poorly for many mostly-idle connections.

**Context.** Use in network servers, gateways, device controllers, and high-throughput services where readiness handling must remain non-blocking but request processing benefits from synchronous code.

## Consequences / Trade-offs

- Keeps the async layer small and responsive while letting business logic use simpler synchronous flow.
- Queue boundaries make overload and latency measurable but require backpressure or shedding.
- Crossing the boundary adds copying, context switches, and ordering considerations.
- Blocking accidentally in the async half can stall every connection handled by that loop.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually overkill for small services; a plain framework executor or fully synchronous server is simpler. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for services that need non-blocking I/O but have blocking libraries or business logic. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for high-throughput network systems when paired with backpressure, instrumentation, and bulkheaded worker pools. |

## Examples

### Keeping event-loop I/O non-blocking

**❌ Negative (java)**

```java
class EventLoopHandler {
  void onReadable(SocketChannel channel) throws Exception {
    Request request = decode(channel);
    Response response = blockingDatabaseCall(request); // stalls the event loop
    channel.write(encode(response));                   // all other sockets wait
  }
}
```

**✅ Positive (java)**

```java
import java.nio.channels.SocketChannel;
import java.util.concurrent.*;

class EventLoopHandler {
  private final BlockingQueue<RequestContext> work = new ArrayBlockingQueue<>(10_000);
  private final ExecutorService workers = Executors.newFixedThreadPool(32);

  EventLoopHandler() {
    for (int i = 0; i < 32; i++) {
      workers.submit(() -> {
        while (!Thread.currentThread().isInterrupted()) {
          RequestContext ctx = work.take();
          Response response = blockingDatabaseCall(ctx.request());
          ctx.eventLoop().execute(() -> ctx.write(response));
        }
        return null;
      });
    }
  }

  void onReadable(SocketChannel channel, EventLoop eventLoop) throws Exception {
    Request request = decode(channel);
    if (!work.offer(new RequestContext(channel, eventLoop, request))) {
      channel.close(); // overload policy; could also stop reading or return 503
    }
  }
}
```

*The positive version confines readiness handling to the async half and moves blocking database work to synchronous workers. The bounded queue makes overload explicit instead of silently freezing the event loop.*

## Relationships

**Synergies**

- [Reactor](../concurrency/reactor.md) — The asynchronous half is often a Reactor that demultiplexes readiness events and enqueues work.
- [Thread Pool](../concurrency/thread-pool.md) — The synchronous half is commonly a worker pool consuming queued requests.
- [Producer-Consumer](../concurrency/producer-consumer.md) — The inter-layer queue is a producer-consumer boundary between event loop and workers.
- [Backpressure](../resilience/backpressure.md) — A bounded boundary queue lets the async side stop reading, shed load, or signal upstream when workers fall behind.

**Conflicts with:** [Proactor](../concurrency/proactor.md)

**Alternatives:** [Reactor](../concurrency/reactor.md), [Proactor](../concurrency/proactor.md), [Actor Model](../concurrency/actor-model.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, cpp, python
- **Frameworks:** none, nodejs, tokio, grpc
- **Project types:** backend-service, web-api, high-throughput, low-latency
- **Tags:** event-loop, worker-boundary, non-blocking-io

## References

- Schmidt, Stal, Rohnert, Buschmann, Pattern-Oriented Software Architecture Volume 2, (2000)

