# Factory Method

> Defer object creation to a method that subclasses or collaborators can override, so clients depend on a product abstraction instead of concrete construction.

**Scale:** design · **Category:** gof-creational · **Maturity:** time-tested

## Description

Factory Method moves the decision about which concrete product to instantiate behind a creation method. The caller works with a stable product interface, while subclasses, configuration-specific factories, or framework hooks supply the concrete implementation. It is valuable when construction has variants, when the creator must remain open for extension, or when creation needs to be aligned with a lifecycle owned by a framework or module.

**Problem.** Client code directly calls constructors for concrete types, so adding a new variant requires editing business logic and scattering construction details.

**Context.** Use when a class or module knows when it needs a product but should not know exactly which concrete product to create.

## Consequences / Trade-offs

- Removes concrete constructor knowledge from clients and keeps them open for extension.
- Localises variant selection, validation, and construction defaults.
- Adds indirection and naming overhead for simple objects with no meaningful variants.
- Can hide dependency graphs if the factory grows into a service locator.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful once there are real variants, but unnecessary for simple constructors in small codebases. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | A good fit for plugin points, provider selection, and framework-owned lifecycles. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable for isolating construction decisions across teams, though overuse can create factory sprawl. |

## Examples

### Creating payment clients

**❌ Negative (typescript)**

```typescript
class CheckoutService {
  async charge(provider: string, amount: number): Promise<void> {
    if (provider === "stripe") {
      await new StripeClient(process.env.STRIPE_KEY!).charge(amount);
    } else if (provider === "adyen") {
      await new AdyenClient(process.env.ADYEN_KEY!).capture(amount);
    } else {
      throw new Error("unsupported provider");
    }
  }
}
```

**✅ Positive (typescript)**

```typescript
interface PaymentClient {
  charge(amount: number): Promise<void>;
}

class PaymentClientFactory {
  create(provider: "stripe" | "adyen"): PaymentClient {
    if (provider === "stripe") return new StripeClient(process.env.STRIPE_KEY!);
    if (provider === "adyen") return new AdyenPaymentAdapter(process.env.ADYEN_KEY!);
    throw new Error("unsupported provider");
  }
}

class CheckoutService {
  constructor(private readonly clients: PaymentClientFactory) {}
  async charge(provider: "stripe" | "adyen", amount: number): Promise<void> {
    await this.clients.create(provider).charge(amount);
  }
}
```

*The positive version confines provider selection and adapter construction to one factory method. CheckoutService depends only on PaymentClient, so adding a provider changes the factory rather than the checkout flow.*

## Relationships

**Synergies**

- [Strategy](../gof-behavioural/strategy.md) — A factory method commonly selects the strategy implementation that a context will use.
- [Dependency Injection](../implementation/dependency-injection.md) — DI supplies factories when construction needs runtime parameters but dependencies are container-owned.
- [Template Method](../gof-behavioural/template-method.md) — Template methods often call factory methods at extension points to create collaborators.
- [Abstract Factory](../gof-creational/abstract-factory.md) — Abstract Factory generalises several related factory methods into a family-level creation interface.

**Conflicts with:** [Service Locator](../implementation/service-locator.md)

**Alternatives:** [Abstract Factory](../gof-creational/abstract-factory.md), [Builder](../gof-creational/builder.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, go
- **Frameworks:** none, spring-boot, dotnet, nestjs
- **Project types:** library, sdk, backend-service, web-api
- **Tags:** creation, polymorphism, open-closed

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

