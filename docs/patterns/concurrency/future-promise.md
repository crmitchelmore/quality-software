# Future / Promise

> Represent a result that will be available later, allowing work to run concurrently while callers compose, await, cancel, or observe completion.

**Scale:** concurrency · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Deferred Result, Task

## Description

A Future is a read handle for an eventual value or failure; a Promise is the write side that completes it. The pattern decouples starting work from consuming its result and turns callback-heavy coordination into explicit values that can be awaited, combined, timed out, or cancelled. It is most useful when the result has exactly one completion and many potential observers. Correct use requires handling failures and cancellation as first-class outcomes, avoiding blocking waits on event-loop or pool threads, and keeping ownership of the Promise narrow so completion cannot race or happen twice.

**Problem.** Concurrent work needs to return values, failures, and cancellation to callers without blocking the caller immediately or exposing low-level thread coordination.

**Context.** Use for asynchronous I/O, task execution, fan-out/fan-in, and APIs where clients should compose operations without knowing whether they run on threads, event loops, or remote callbacks.

## Consequences / Trade-offs

- Makes eventual results composable and explicit, including errors and timeouts.
- Can hide where work executes; blocking on futures can deadlock event loops or saturated pools.
- Cancellation and resource cleanup must be designed, not bolted on later.
- Promise completion should be single-owner to avoid double-complete races.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Strong fit whenever a small app already does async work; avoid if a plain synchronous call is clearer. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for composing I/O and background tasks, especially with deadlines and structured error handling. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still foundational, but large systems must standardise cancellation, tracing context propagation, and avoid chains that obscure ownership. |

## Examples

### Returning a result from background work

**❌ Negative (python)**

```python
import threading

result = None
error = None

def load_user(user_id):
    global result, error
    try:
        result = fetch_user(user_id)
    except Exception as exc:
        error = exc

threading.Thread(target=load_user, args=(42,)).start()
# Race: the read may happen before the thread writes; exceptions are out-of-band.
if error:
    raise error
print(result.name)
```

**✅ Positive (python)**

```python
from concurrent.futures import ThreadPoolExecutor, TimeoutError

executor = ThreadPoolExecutor(max_workers=8)
future = executor.submit(fetch_user, 42)

try:
    user = future.result(timeout=0.5)   # waits with a deadline and re-raises failure
    print(user.name)
except TimeoutError:
    future.cancel()
    raise
finally:
    executor.shutdown(wait=False, cancel_futures=True)
```

*The positive version packages completion, failure, and cancellation into one synchronised object. The caller never reads shared mutable globals and can bound waiting with a timeout.*

## Relationships

**Synergies**

- [Thread Pool](../concurrency/thread-pool.md) — Executor submission commonly returns a Future tied to work scheduled on a pool.
- [Actor Model](../concurrency/actor-model.md) — Ask-style actor interactions often return a Future for the eventual reply.
- [Reactor](../concurrency/reactor.md) — Reactor callbacks frequently complete promises so callers can await without blocking the event loop.
- [Timeout](../resilience/timeout.md) — Futures compose naturally with deadlines so callers do not wait forever.

**Conflicts with:** [Active Object](../concurrency/active-object.md)

**Alternatives:** [Observer](../gof-behavioural/observer.md), [Proactor](../concurrency/proactor.md), [Communicating Sequential Processes (CSP)](../concurrency/communicating-sequential-processes.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, go, python, cpp
- **Frameworks:** none, dotnet, spring, tokio, nodejs
- **Project types:** backend-service, web-api, desktop-app, high-throughput
- **Tags:** async, eventual-result, composition

## References

- [Promises/A+, (2012)](https://promisesaplus.com/)

