# Proactor

> Start asynchronous operations and dispatch handlers only when the operating system or runtime reports that each operation has completed.

**Scale:** concurrency · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Asynchronous completion dispatch, Completion event loop

## Description

Proactor inverts the readiness-oriented Reactor flow. Application code initiates an asynchronous read, write, accept, or timer operation and returns immediately. The kernel, runtime, or I/O subsystem performs the operation in the background; when it completes, a completion event containing the result is queued to the proactor, which dispatches the associated completion handler. This removes the handler's responsibility to perform the I/O at readiness time, which is especially useful on platforms with native completion ports or efficient async runtimes.

**Problem.** Readiness notifications still require application handlers to perform the actual I/O and handle partial progress; on completion-oriented platforms that adds complexity and misses available OS support.

**Context.** Use when the platform has true asynchronous I/O or a runtime that presents completion-based APIs, such as Windows I/O Completion Ports, io_uring-style submission/completion queues, or mature async libraries.

## Consequences / Trade-offs

- Completion handlers receive finished results, reducing manual readiness checks and partial-operation bookkeeping.
- The model maps well to futures, promises, async/await, and completion ports.
- Cancellation, ordering, and buffer lifetime become more subtle because operations outlive the initiating call stack.
- Not all platforms provide true async I/O for every resource; thread-backed fake async can hide blocking and exhaust pools.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely justified for ordinary small apps; native async APIs can be useful, but a full proactor architecture adds lifecycle complexity. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for services already built on completion-oriented runtimes where async operation lifetimes are understood. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for high-scale servers on completion-native platforms, provided cancellation, buffer ownership, and observability are designed deliberately. |

## Examples

### Completion handlers own operation results

**❌ Negative (cpp)**

```cpp
// A readiness loop still performs the read and must handle partial progress.
void onReadable(Socket& socket) {
  char buffer[4096];
  int n = socket.read(buffer, sizeof(buffer));
  if (n > 0) handleBytes(std::string_view(buffer, n));
  if (n == EWOULDBLOCK) reactor.waitForRead(socket);
}
```

**✅ Positive (cpp)**

```cpp
struct Session : std::enable_shared_from_this<Session> {
  Socket socket;
  std::array<char, 4096> buffer{};

  void start() { readNext(); }

  void readNext() {
    auto self = shared_from_this();
    socket.asyncRead(buffer.data(), buffer.size(), [self](Result<size_t> result) {
      if (!result.ok()) return self->close();
      self->handleBytes(std::string_view(self->buffer.data(), result.value()));
      self->readNext();
    });
  }
};
```

*The positive version submits a read and resumes only when completion arrives with a byte count. The session owns the buffer for the operation lifetime, avoiding a stack buffer that disappears before async I/O completes.*

## Relationships

**Synergies**

- [Reactor](../concurrency/reactor.md) — Reactor is the main alternative; many frameworks expose a hybrid where readiness drives some resources and completions drive others.
- [Future / Promise](../concurrency/future-promise.md) — Completion events often resolve futures/promises, giving callers a composable handle to the eventual result.
- [Thread Pool](../concurrency/thread-pool.md) — Runtimes may use a bounded pool for completion dispatch or for resources without native async support.
- [Backpressure](../resilience/backpressure.md) — Submission queues must be bounded so callers cannot start unbounded outstanding reads, writes, or accepts.

**Conflicts with:** [Monitor Object](../concurrency/monitor-object.md)

**Alternatives:** [Reactor](../concurrency/reactor.md), [Thread Pool](../concurrency/thread-pool.md), [Active Object](../concurrency/active-object.md)

## Applicability tags

- **Languages:** language-agnostic, cpp, csharp, rust, typescript, java
- **Frameworks:** dotnet, tokio, nodejs, none
- **Project types:** backend-service, realtime-system, high-throughput, distributed-system
- **Tags:** async-io, completion, event-loop

## References

- Schmidt, Stal, Rohnert, Buschmann, Pattern-Oriented Software Architecture Volume 2, (2000)

