# Lazy Initialization

> Delay creating an expensive value until the first time it is actually needed, then reuse the result for later calls.

**Scale:** implementation · **Category:** implementation · **Maturity:** time-tested

**Also known as:** Lazy Loading, Deferred Initialization

## Description

Lazy Initialization replaces eager construction with a demand-driven boundary. The object starts with a missing cached value; the first access computes or loads it, stores it, and subsequent access returns the cached instance. The idiom is useful for expensive optional work, but it must define error, concurrency, and invalidation behaviour explicitly.

**Problem.** Eager setup can slow startup or allocate resources that a process may never use.

**Context.** Use when construction is expensive, the value may not be needed, and delayed failure is acceptable to callers.

## Consequences / Trade-offs

- Improves startup time and avoids unused work.
- Keeps expensive creation close to the access path that needs it.
- Can move failures from startup to runtime, surprising operators.
- Thread safety and cache invalidation must be designed deliberately.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for CLI startup and optional integrations; avoid premature use. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for expensive optional collaborators if delayed errors are documented. |
| Large (>100k LOC) | ●●●○○ 3/5 | Valuable but risky; startup validation and concurrency semantics matter more. |

## Examples

### Delayed client creation

**❌ Negative (typescript)**

```typescript
class ReportService {
  private readonly client = new AnalyticsClient(process.env.ANALYTICS_URL!);

  async renderSummary() {
    return this.client.query('summary');
  }
}
```

**✅ Positive (typescript)**

```typescript
class ReportService {
  private client?: AnalyticsClient;

  private analytics(): AnalyticsClient {
    if (!this.client) {
      this.client = new AnalyticsClient(process.env.ANALYTICS_URL!);
    }
    return this.client;
  }

  async renderSummary() {
    return this.analytics().query('summary');
  }
}
```

*The positive version avoids creating the analytics client until reports are requested, while still reusing the same client after the first access.*

## Relationships

**Synergies**

- [Proxy](../gof-structural/proxy.md) — Proxies often hide lazy creation behind the same interface as the real object.
- [Memoization](../functional/memoization.md) — Memoization is the functional cousin that caches computed results by input.
- [Object Pool](../implementation/object-pool.md) — Lazy pools can create resources on first demand instead of at process startup.
- [Fail Fast](../implementation/fail-fast.md) — Fail Fast is the alternative when misconfiguration should be detected during startup.

**Conflicts with:** [Fail Fast](../implementation/fail-fast.md)

**Alternatives:** [Fail Fast](../implementation/fail-fast.md), [Memoization](../functional/memoization.md), [Proxy](../gof-structural/proxy.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, spring, dotnet, nodejs
- **Project types:** cli-tool, web-api, backend-service, desktop-app
- **Tags:** performance, startup, caching

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

