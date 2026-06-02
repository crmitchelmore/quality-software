# Strategy

> Define a family of interchangeable algorithms behind a common interface and let the client select one at runtime, decoupling the algorithm from the code that uses it.

**Scale:** design · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Policy

## Description

Strategy encapsulates each variant of an algorithm in its own type implementing a shared interface. The context holds a reference to a strategy and delegates the varying behaviour to it, so new variants can be added without modifying the context (open/closed). It replaces sprawling conditional logic that switches on a "kind" with polymorphic dispatch.

**Problem.** A class needs different variants of a behaviour, and encoding them as branching conditionals makes the class large, rigid, and hard to extend.

**Context.** When you have multiple ways to perform a task (pricing, routing, compression, validation) chosen at runtime or by configuration.

## Consequences / Trade-offs

- New algorithms are added without touching existing code (open/closed).
- Eliminates conditionals and isolates each algorithm for testing.
- Clients must understand the available strategies to choose one.
- Overhead of extra objects/interfaces for trivial variation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Cheap and valuable even in small code once you have 2+ real variants; avoid for single-use logic. |
| Medium (≤100k LOC) | ●●●●● 5/5 | A workhorse for taming conditionals and enabling configuration-driven behaviour. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for extensibility; pairs with DI to keep large systems open for extension. |

## Examples

### Shipping cost calculation

**❌ Negative (typescript)**

```typescript
class Checkout {
  shipping(method: string, weight: number): number {
    if (method === "standard") return weight * 1.5;
    else if (method === "express") return weight * 1.5 + 10;
    else if (method === "drone") return weight * 4 + 25;
    throw new Error("unknown method");
  }
}
```

**✅ Positive (typescript)**

```typescript
interface ShippingStrategy {
  cost(weightKg: number): number;
}
const standard: ShippingStrategy = { cost: (w) => w * 1.5 };
const express: ShippingStrategy = { cost: (w) => w * 1.5 + 10 };
const drone: ShippingStrategy = { cost: (w) => w * 4 + 25 };

class Checkout {
  constructor(private readonly shipping: ShippingStrategy) {}
  total(weightKg: number): number {
    return this.shipping.cost(weightKg);
  }
}
// adding "courier" is a new object, not an edit to Checkout
```

*The positive version isolates each algorithm and lets new shipping methods be added without editing Checkout, removing the growing conditional.*

## Relationships

**Synergies**

- [Dependency Injection](../implementation/dependency-injection.md) — The chosen strategy is typically injected into the context.
- [Factory Method](../gof-creational/factory-method.md) — A factory can select and create the appropriate strategy.
- [Null Object](../implementation/null-object.md) — A no-op strategy provides a safe default with no conditionals.

**Alternatives:** [Template Method](../gof-behavioural/template-method.md), [State](../gof-behavioural/state.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, go
- **Frameworks:** none
- **Project types:** library, backend-service, web-api, cli-tool
- **Tags:** polymorphism, open-closed, composition

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

