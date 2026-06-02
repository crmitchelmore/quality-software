# Registry

> Provide a well-known object for locating shared services or configuration when passing every dependency explicitly is impractical.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

## Description

A Registry is a process-wide or context-wide directory of objects such as configuration, connection factories, mappers, or application services. Unlike arbitrary globals, a disciplined registry has a small purpose, typed accessors, controlled initialisation, and clear lifecycle rules. It is often a pragmatic escape hatch for legacy frameworks, plugins, and code paths that cannot participate in constructor injection.

**Problem.** Deep framework callbacks, legacy entry points, or plugin mechanisms sometimes need access to shared services without a practical way to pass dependencies through every call.

**Context.** Use sparingly where dependency injection cannot reach, or for immutable application context assembled at startup. Prefer explicit dependencies for normal business code.

## Consequences / Trade-offs

- Gives awkward framework or legacy code a single controlled access point for shared collaborators.
- Can simplify bootstrapping when many integrations need common configuration.
- Risks hidden dependencies, global mutable state, and order-dependent tests if overused.
- Needs reset or scoping support for tests and multi-tenant applications.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually worse than explicit construction or simple DI in small codebases. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for framework callbacks and legacy seams; keep it read-only after startup. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful as a constrained escape hatch, but dangerous if it becomes the default dependency mechanism. |

## Examples

### Controlled application registry

**❌ Negative (typescript)**

```typescript
export const globals: Record<string, unknown> = {};

export function renderInvoice(id: string) {
  const db = globals['db'] as Database;
  const tax = globals['taxService'] as TaxService;
  return new InvoiceRenderer(db, tax).render(id);
}
```

**✅ Positive (typescript)**

```typescript
class ApplicationRegistry {
  private static current?: ApplicationRegistry;

  private constructor(
    readonly invoices: InvoiceRepository,
    readonly tax: TaxService
  ) {}

  static initialise(registry: ApplicationRegistry) { this.current = registry; }
  static get(): ApplicationRegistry {
    if (!this.current) throw new Error('registry not initialised');
    return this.current;
  }
}

export function renderInvoice(id: string) {
  const registry = ApplicationRegistry.get();
  return new InvoiceRenderer(registry.invoices, registry.tax).render(id);
}
```

*The positive version is still globally reachable, but it is typed, initialised deliberately, and narrow enough that hidden dependencies can be audited.*

## Relationships

**Synergies**

- [Service Locator](../implementation/service-locator.md) — Registry is often implemented as a constrained Service Locator; the same cautions about hidden dependencies apply.
- [Dependency Injection](../implementation/dependency-injection.md) — DI should populate the registry at composition time when explicit injection is impossible downstream.
- [Metadata Mapping](../enterprise-application/metadata-mapping.md) — Mapper metadata can be registered once at startup and reused by persistence components.
- [Singleton](../gof-creational/singleton.md) — A singleton registry is common, though a scoped registry is safer for tests and tenants.

**Conflicts with:** [Dependency Injection](../implementation/dependency-injection.md)

**Alternatives:** [Dependency Injection](../implementation/dependency-injection.md), [Service Locator](../implementation/service-locator.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript
- **Frameworks:** none, spring-boot, dotnet, nestjs
- **Project types:** backend-service, modular-monolith, monolith, desktop-app
- **Tags:** global-context, bootstrapping, legacy

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

