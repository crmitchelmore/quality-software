# Reactor

> Demultiplex readiness events from many I/O handles and dispatch each ready event to a short, non-blocking handler on one or more event-loop threads.

**Scale:** concurrency · **Altitude:** medium · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Event demultiplexer, Non-blocking event loop

## Description

Reactor structures concurrent I/O around readiness notification. The application registers handles such as sockets, timers, and signals with an event demultiplexer, then the loop waits until a handle can be read or written without blocking. When readiness is reported, the loop invokes the matching handler, which performs the small non-blocking operation and returns quickly. The pattern is the foundation of select/epoll/kqueue based servers, GUI loops, and many runtime event loops: concurrency comes from interleaving many short actions rather than dedicating a thread per connection.

**Problem.** A server must manage thousands of mostly idle connections without allocating a blocking thread to each one, but ordinary synchronous code ties up threads while waiting for network I/O.

**Context.** Use when the operating system can notify readiness for many handles and each handler can be written as non-blocking, bounded work. It fits network gateways, proxies, chat servers, and runtimes where latency and connection count matter more than CPU-bound parallelism.

## Consequences / Trade-offs

- Handles very high connection counts with few threads because idle clients consume descriptors rather than stacks and schedulable threads.
- Makes backpressure and scheduling explicit: handlers must avoid blocking and must offload CPU-heavy work to worker pools.
- Control flow is harder than blocking code; state often moves into callbacks, continuations, or small state machines.
- A slow handler can stall every other connection on the same loop, so instrumentation and strict handler budgets are essential.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually overkill unless the small project is specifically an event-loop library or high-connection server. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | A strong fit for network services where connection count and predictable resource use matter; use a proven framework when possible. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational for large gateways, brokers, and runtimes, but requires operational discipline around handler latency and backpressure. |

## Examples

### Keeping a reactor handler non-blocking

**❌ Negative (cpp)**

```cpp
// Readiness callback blocks on disk and monopolises the event loop.
void onReadable(int fd) {
  std::string request = readAvailable(fd);
  std::string profile = loadProfileFromDisk(request); // may block for milliseconds
  send(fd, render(profile));
}
```

**✅ Positive (cpp)**

```cpp
class Server {
 public:
  void onReadable(int fd) {
    Request request = readAvailable(fd);          // bounded non-blocking read
    workers.submit([this, fd, request] {
      Response response = buildResponse(request); // may block or use CPU
      loop.post([this, fd, response] {
        writeBuffers[fd].append(response.bytes());
        loop.enableWrite(fd);
      });
    });
  }

  void onWritable(int fd) {
    writeSome(fd, writeBuffers[fd]);              // bounded non-blocking write
    if (writeBuffers[fd].empty()) loop.disableWrite(fd);
  }

 private:
  EventLoop loop;
  ThreadPool workers;
  std::unordered_map<int, Buffer> writeBuffers;
};
```

*The positive version keeps the reactor thread responsible only for readiness-driven I/O and dispatch. Potentially blocking work runs in a pool, then posts the result back to the loop for a bounded write.*

## Relationships

**Synergies**

- [Proactor](../concurrency/proactor.md) — Proactor solves the same I/O multiplexing problem with completion events; comparing the two clarifies whether the platform reports readiness or completed operations.
- [Thread Pool](../concurrency/thread-pool.md) — Reactor loops commonly delegate CPU-heavy or blocking operations to a bounded pool so the event loop remains responsive.
- [Backpressure](../resilience/backpressure.md) — Readiness handlers need explicit queue limits and write-interest management to stop fast producers overrunning slow consumers.
- [Message Channel](../enterprise-integration/message-channel.md) — Channels or queues give handlers a safe hand-off point to other parts of the application without blocking the loop.

**Conflicts with:** [Thread-Specific Storage](../concurrency/thread-specific-storage.md)

**Alternatives:** [Proactor](../concurrency/proactor.md), [Thread Pool](../concurrency/thread-pool.md), [Half-Sync/Half-Async](../concurrency/half-sync-half-async.md)

## Applicability tags

- **Languages:** language-agnostic, cpp, c, java, go, typescript
- **Frameworks:** nodejs, tokio, none
- **Project types:** backend-service, realtime-system, high-throughput, low-latency
- **Tags:** event-loop, non-blocking-io, readiness

## References

- Schmidt, Stal, Rohnert, Buschmann, Pattern-Oriented Software Architecture Volume 2, (2000)

