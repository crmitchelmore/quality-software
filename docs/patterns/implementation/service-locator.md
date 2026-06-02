# Service Locator

> Retrieve dependencies from a central registry at runtime, trading explicit constructor wiring for dynamic lookup and late binding.

**Scale:** design · **Category:** implementation · **Maturity:** established

**Also known as:** Registry Lookup

## Description

Service Locator provides a registry that maps service contracts to concrete instances. Consumers ask the locator for what they need instead of receiving it directly. This can simplify plugin-style bootstrapping and legacy integration, but it hides dependencies inside method bodies and shifts missing-wiring failures from construction time to runtime lookup.

**Problem.** Some systems need late-bound services where passing every dependency explicitly is awkward, especially in legacy code or plugin hosts.

**Context.** Use sparingly at boundaries that genuinely require dynamic lookup; avoid using it as the default application wiring style.

## Consequences / Trade-offs

- Centralises service discovery and can ease migration from global singletons.
- Supports runtime plugin lookup when the set of services is not known statically.
- Hides dependencies from constructors, making code harder to read and test.
- Missing registrations fail at lookup time and may be far from startup.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary; explicit construction is simpler. |
| Medium (≤100k LOC) | ●●○○○ 2/5 | Occasionally helpful for legacy migration, but DI is normally better. |
| Large (>100k LOC) | ●●●○○ 3/5 | Situational for plugin hosts; dangerous as a general dependency strategy. |

## Examples

### Hidden service lookup

**❌ Negative (typescript)**

```typescript
class InvoiceController {
  async send(id: string) {
    const mailer = Services.get<Mailer>('mailer');
    const invoice = await Services.get<InvoiceStore>('invoiceStore').load(id);
    await mailer.send(invoice.customerEmail, invoice.render());
  }
}
```

**✅ Positive (typescript)**

```typescript
class InvoiceController {
  constructor(
    private readonly mailer: Mailer,
    private readonly invoices: InvoiceStore,
  ) {}

  async send(id: string) {
    const invoice = await this.invoices.load(id);
    await this.mailer.send(invoice.customerEmail, invoice.render());
  }
}
```

*The positive version shows why Service Locator is often a smell: constructor injection makes the controller's requirements visible and easier to test.*

## Relationships

**Synergies**

- [Registry](../enterprise-application/registry.md) — Service Locator is a specialised registry for service instances and factories.
- [Microkernel (Plugin) Architecture](../architecture/microkernel.md) — Dynamic plugin hosts may need lookup of capabilities discovered after startup.
- [Dependency Injection](../implementation/dependency-injection.md) — DI is the preferred alternative when dependencies are known at construction time.
- [Inversion of Control](../implementation/inversion-of-control.md) — A framework may own the locator, but overuse weakens IoC's explicit extension contracts.

**Conflicts with:** [Dependency Injection](../implementation/dependency-injection.md)

**Alternatives:** [Dependency Injection](../implementation/dependency-injection.md), [Registry](../enterprise-application/registry.md), [Factory Method](../gof-creational/factory-method.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, php
- **Frameworks:** none, spring, dotnet, laravel
- **Project types:** backend-service, modular-monolith, desktop-app, sdk
- **Tags:** lookup, coupling, legacy

## References

- Martin Fowler, Inversion of Control Containers and the Dependency Injection pattern, (2004)

