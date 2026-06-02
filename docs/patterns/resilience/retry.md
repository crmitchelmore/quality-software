# Retry with Backoff

> Re-attempt transiently failing operations after increasing delays, usually with jitter, so brief faults can clear without synchronising callers into a retry storm.

**Scale:** integration · **Category:** resilience · **Maturity:** time-tested

**Also known as:** Exponential Backoff, Retry with Jitter

## Description

Retry with backoff treats some failures as temporary rather than immediately fatal. The caller makes a bounded number of additional attempts, waits longer between each attempt, and adds random jitter so many clients do not retry at exactly the same instant. It should only be applied to operations that are safe to repeat or protected by idempotency, and it must be constrained by an overall deadline so retries do not hide latency or consume resources indefinitely. Good retry policies classify errors: network resets, 429s and 503s are often retryable; validation errors and most 4xx responses are not.

**Problem.** Distributed calls often fail for short-lived reasons such as packet loss, leader election, connection reuse races, deploy restarts or rate-limit bursts. A single immediate failure gives poor availability, but retrying immediately and forever amplifies load precisely when the dependency is least able to handle it.

**Context.** Use at process, service, SDK or worker boundaries where the operation has a clear timeout, a small retry budget, observable retry counts, and either natural idempotency or a deduplication mechanism. Avoid it inside tight CPU loops or for non-repeatable side effects such as charging a card without an idempotency key.

## Consequences / Trade-offs

- Masks brief network and dependency blips without involving users or operators.
- Backoff and jitter reduce retry synchronisation and protect an already stressed dependency.
- Increases tail latency and load; every extra attempt consumes caller and callee capacity.
- Requires explicit retryability rules, budgets and telemetry or it becomes an outage amplifier.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for a few external calls, but easy to overuse; prefer a small library policy. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | A good default for service integrations when paired with timeouts and idempotency. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in distributed systems, but must be centrally governed to avoid retry storms. |

## Examples

### Exponential backoff with full jitter

**❌ Negative (typescript)**

```typescript
// Immediate retries form a tight loop during an outage and repeat every error type.
async function fetchInvoice(id: string): Promise<Invoice> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await http.get<Invoice>(`/invoices/${id}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
```

**✅ Positive (typescript)**

```typescript
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isRetryable(error: HttpError): boolean {
  return error.code === "ECONNRESET" || error.status === 429 || error.status === 503;
}

async function fetchInvoice(id: string, signal: AbortSignal): Promise<Invoice> {
  let delayMs = 100;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      return await http.get<Invoice>(`/invoices/${id}`, { signal, timeoutMs: 800 });
    } catch (error) {
      if (!isRetryable(error as HttpError) || attempt === 4) throw error;
      const jitterMs = Math.floor(Math.random() * delayMs);
      await sleep(jitterMs);
      delayMs = Math.min(delayMs * 2, 2_000);
    }
  }
  throw new Error("unreachable");
}
```

*The positive version retries only retryable failures, caps the number of attempts, bounds each call, and uses jittered exponential backoff instead of hammering the dependency.*

## Relationships

**Synergies**

- [Timeout](../resilience/timeout.md) — A timeout bounds each attempt and the overall retry budget so retries cannot wait forever.
- [Circuit Breaker](../resilience/circuit-breaker.md) — The breaker stops retries once failures look systemic rather than transient.
- [Idempotency](../resilience/idempotency.md) — Idempotent operations make repeated attempts safe when the first response is lost.
- [Idempotency Key](../api-design/idempotency-key.md) — API idempotency keys let clients safely retry side-effecting POST requests.

**Alternatives:** [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md), [Fallback](../resilience/fallback.md), [Circuit Breaker](../resilience/circuit-breaker.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, go, python
- **Frameworks:** none, nodejs, spring-boot, dotnet, grpc
- **Project types:** backend-service, web-api, microservices, distributed-system, sdk
- **Tags:** resilience, fault-tolerance, backoff, jitter

## References

- Michael T. Nygard, Release It! Design and Deploy Production-Ready Software, (2007)
- [Marc Brooker, Exponential Backoff and Jitter, (2015)](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

