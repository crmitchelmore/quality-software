# Singleton

> Ensure a type has exactly one process-local instance and provide a controlled access point to it, usually for coordinating shared infrastructure.

**Scale:** design · **Altitude:** low · **Category:** gof-creational · **Maturity:** time-tested

**Also known as:** Single Instance

## Description

Singleton constrains construction so all callers use the same instance of a class or module-level object. It is most defensible for process-wide infrastructure with real identity, such as a configuration snapshot, metric registry, or hardware handle, where duplicate instances would be incorrect. In modern application code it is often implemented through the composition root or dependency-injection container rather than a hard-coded global accessor, so lifetime is explicit and tests can replace the dependency.

**Problem.** Some resources must be unique within a process, but ad-hoc globals and repeated construction make ownership, lifetime, and test replacement unclear.

**Context.** Use when uniqueness is part of the domain or infrastructure invariant, not merely because constructing the object is inconvenient. Prefer explicit injection when consumers need the object.

## Consequences / Trade-offs

- Enforces one coordinated process-local instance for resources that cannot safely be duplicated.
- Gives a single place to initialise and tear down expensive shared infrastructure.
- Easily degenerates into hidden global state, order-dependent tests, and tight coupling.
- Does not solve distributed uniqueness; multiple processes still get multiple instances.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually avoid; simple module instances or constructor parameters are clearer. Use only for real process-wide resources. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for infrastructure lifetimes when backed by DI. Static singleton accessors become painful as tests and modules multiply. |
| Large (>100k LOC) | ●●○○○ 2/5 | Risky in large systems because hidden global state creates coupling across teams. Prefer DI-managed singleton scope with explicit interfaces. |

## Examples

### Process metrics registry

**❌ Negative (typescript)**

```typescript
class MetricsRegistry {
  private counters = new Map<string, number>();
  increment(name: string): void {
    this.counters.set(name, (this.counters.get(name) ?? 0) + 1);
  }
}

export function recordCheckout(): void {
  const metrics = new MetricsRegistry();
  metrics.increment("checkout.started");
}

export function recordPayment(): void {
  const metrics = new MetricsRegistry();
  metrics.increment("payment.started");
}
```

**✅ Positive (typescript)**

```typescript
class MetricsRegistry {
  private counters = new Map<string, number>();
  increment(name: string): void {
    this.counters.set(name, (this.counters.get(name) ?? 0) + 1);
  }
}

const sharedMetrics = new MetricsRegistry();

export function recordCheckout(metrics = sharedMetrics): void {
  metrics.increment("checkout.started");
}

export function recordPayment(metrics = sharedMetrics): void {
  metrics.increment("payment.started");
}
```

*The negative version accidentally fragments process metrics across multiple registries. The positive version has a single process-local registry but still accepts an injected replacement in tests instead of forcing every caller through a static global.*

## Relationships

**Synergies**

- [Dependency Injection](../implementation/dependency-injection.md) — DI can own singleton lifetime while keeping consumers dependent on interfaces rather than static accessors.
- [Lazy Initialization](../implementation/lazy-initialization.md) — Lazy creation avoids paying startup cost for expensive singleton resources until they are first needed.
- [Registry](../enterprise-application/registry.md) — A registry may expose named singleton-like services, though it must avoid becoming a service locator.
- [Facade](../gof-structural/facade.md) — A singleton facade can centralise access to a process-wide subsystem while hiding its internal collaborators.

**Conflicts with:** [Service Locator](../implementation/service-locator.md)

**Alternatives:** [Dependency Injection](../implementation/dependency-injection.md), [Registry](../enterprise-application/registry.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** none, spring-boot, dotnet, nestjs
- **Project types:** library, backend-service, cli-tool, desktop-app
- **Tags:** lifetime, global-state, identity

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

