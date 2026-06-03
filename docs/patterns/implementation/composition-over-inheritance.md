# Composition over Inheritance

> Build behaviour by combining small collaborators instead of relying on deep class hierarchies and inherited implementation.

**Scale:** design · **Altitude:** low · **Category:** implementation · **Maturity:** time-tested

**Also known as:** Prefer Composition

## Description

Composition over Inheritance favours objects that delegate to explicit capabilities rather than subclasses that inherit broad behaviour. Composition keeps variation orthogonal: logging, pricing, persistence, and validation can be combined without multiplying subclasses. Inheritance remains useful for stable taxonomies and framework hooks, but it is a poor default for sharing mutable implementation.

**Problem.** Deep inheritance trees couple unrelated behaviours, make changes ripple through subclasses, and produce fragile base class dependencies.

**Context.** Use when behaviour varies independently or when subclasses are being created mainly to reuse code rather than model a true is-a relationship.

## Consequences / Trade-offs

- Encourages small interfaces and replaceable capabilities.
- Avoids subclass explosion when multiple behaviours vary independently.
- Can introduce more objects and delegation wiring.
- Explicitly conflicts with inheritance-heavy reuse; inheritance may still be simpler for closed, stable hierarchies with shared contracts.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good default, though one or two simple subclasses may be harmless. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent at preventing subclass explosion as feature combinations grow. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical for maintainability; pair with clear interfaces and DI. |

## Examples

### Pricing by capability

**❌ Negative (python)**

```python
class DiscountedExpressOrder(ExpressOrder):
    def total(self):
        return super().total() * 0.9 + self.express_fee()

class DiscountedGiftExpressOrder(DiscountedExpressOrder):
    def total(self):
        return super().total() + self.gift_wrap_fee()
```

**✅ Positive (python)**

```python
class Order:
    def __init__(self, pricing_rules):
        self.pricing_rules = pricing_rules

    def total(self):
        total = sum(line.amount for line in self.lines)
        for rule in self.pricing_rules:
            total = rule.apply(total)
        return total
```

*The positive version composes independent pricing rules instead of creating a subclass for every combination of delivery, discount, and wrapping behaviour.*

## Relationships

**Synergies**

- [Strategy](../gof-behavioural/strategy.md) — Strategy is a composition technique for varying an algorithm behind an interface.
- [Decorator](../gof-structural/decorator.md) — Decorator composes responsibilities dynamically instead of subclassing combinations.
- [Dependency Injection](../implementation/dependency-injection.md) — DI supplies composed collaborators without the consumer constructing them.
- [Template Method](../gof-behavioural/template-method.md) — Template Method is an inheritance-based alternative when a stable skeleton algorithm is intended.

**Alternatives:** [Template Method](../gof-behavioural/template-method.md), [Strategy](../gof-behavioural/strategy.md), [Decorator](../gof-structural/decorator.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** none
- **Project types:** library, backend-service, web-api, desktop-app, game
- **Tags:** coupling, polymorphism, reuse

## References

- Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, Design Patterns, (1994)

