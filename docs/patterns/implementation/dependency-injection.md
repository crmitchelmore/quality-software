# Dependency Injection

> Provide an object's dependencies from the outside rather than constructing them internally, making collaborators explicit, replaceable, and testable.

**Scale:** design · **Altitude:** low · **Category:** implementation · **Maturity:** time-tested

**Also known as:** DI, Constructor Injection

## Description

Dependency Injection moves object wiring out of business logic. A class declares the services it needs through its constructor, method, or configuration boundary, and composition code supplies concrete implementations. This keeps policies from knowing how to create infrastructure, supports test doubles without global state, and makes runtime variation a configuration concern rather than a hidden branch.

**Problem.** Classes that instantiate their own collaborators become tightly coupled to concrete infrastructure and are difficult to test or reconfigure.

**Context.** Use when modules depend on behaviours that vary by environment, test, adapter, or deployment but should remain explicit at the module boundary.

## Consequences / Trade-offs

- Makes dependencies visible in type signatures and constructor contracts.
- Improves testability because tests can pass focused substitutes.
- Can produce large constructors if a class has too many responsibilities.
- Container-heavy use can obscure wiring unless composition roots remain clear.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good for tests and adapters, but manual wiring is usually enough. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent fit as application services and adapters multiply. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for clear boundaries; enforce composition roots to avoid container magic. |

## Examples

### Injecting a payment gateway

**❌ Negative (csharp)**

```csharp
public sealed class CheckoutService
{
    public Receipt Checkout(Cart cart)
    {
        var gateway = new StripeGateway();
        var chargeId = gateway.Charge(cart.Total);
        return new Receipt(chargeId);
    }
}
```

**✅ Positive (csharp)**

```csharp
public interface PaymentGateway
{
    string Charge(decimal amount);
}

public sealed class CheckoutService
{
    private readonly PaymentGateway gateway;

    public CheckoutService(PaymentGateway gateway)
    {
        this.gateway = gateway;
    }

    public Receipt Checkout(Cart cart)
    {
        var chargeId = gateway.Charge(cart.Total);
        return new Receipt(chargeId);
    }
}
```

*The positive version declares the payment dependency at construction time, so production can supply Stripe while tests supply a deterministic fake.*

## Relationships

**Synergies**

- [Inversion of Control](../implementation/inversion-of-control.md) — Dependency Injection is a concrete mechanism for IoC; construction control moves to the composition root.
- [Strategy](../gof-behavioural/strategy.md) — Strategies are commonly injected so algorithms can vary without changing the consumer.
- [Hexagonal Architecture (Ports & Adapters)](../architecture/hexagonal-architecture.md) — Ports and adapters rely on injecting adapter implementations into application services.
- [Service Locator](../implementation/service-locator.md) — Service Locator is an alternative that centralises lookup but hides dependencies from callers.

**Conflicts with:** [Service Locator](../implementation/service-locator.md)

**Alternatives:** [Service Locator](../implementation/service-locator.md), [Factory Method](../gof-creational/factory-method.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, spring, nestjs, dotnet, fastapi
- **Project types:** web-api, backend-service, modular-monolith, microservices, library
- **Tags:** coupling, testability, composition

## References

- Martin Fowler, Inversion of Control Containers and the Dependency Injection pattern, (2004)

