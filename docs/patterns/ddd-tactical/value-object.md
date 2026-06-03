# Value Object

> Model a descriptive domain concept by its value, making it immutable, validated, and equality-by-contents rather than equality-by-identity.

**Scale:** design · **Altitude:** low · **Category:** ddd-tactical · **Maturity:** time-tested

## Description

A Value Object captures a concept such as Money, DateRange, EmailAddress, Address, SKU, or Quantity where identity is irrelevant: two instances with the same values are interchangeable. It validates its invariants at construction, exposes behaviour that belongs to the concept, and is usually immutable so it can be freely shared. Value objects reduce primitive obsession by replacing scattered strings, decimals, and tuples with domain-specific types that make invalid states harder to represent.

**Problem.** Primitive values let invalid or semantically confused data flow through the system: dollars and cents are added as decimals, dates are passed in the wrong order, and email strings are repeatedly revalidated at every boundary.

**Context.** Use value objects whenever a small cluster of attributes has domain meaning, validation rules, or operations, but no independent lifecycle. They are especially effective inside entities and aggregates.

## Consequences / Trade-offs

- Encapsulates validation and domain operations close to the data.
- Improves equality semantics and test readability.
- Encourages immutability and safer sharing across threads and layers.
- Can add mapping overhead with ORMs and serializers that prefer primitives.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Worth using for high-risk values such as money or identifiers; avoid modelling every trivial string in tiny prototypes. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for domain-rich services because it removes repeated validation and primitive confusion. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical at scale: value objects carry ubiquitous language through code and prevent subtle cross-team semantic drift. |

## Examples

### Money as a value object

**❌ Negative (typescript)**

```typescript
function applyDiscount(total: number, discount: number): number {
  return total - discount;
}

const payable = applyDiscount(10, 25); // negative money now exists
```

**✅ Positive (typescript)**

```typescript
class Money {
  private constructor(readonly cents: number, readonly currency: string) {}

  static of(cents: number, currency: string): Money {
    if (!Number.isInteger(cents) || cents < 0) throw new Error("money must be non-negative cents");
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error("currency must be ISO-4217");
    return new Money(cents, currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) throw new Error("currency mismatch");
    if (other.cents > this.cents) throw new Error("discount exceeds total");
    return Money.of(this.cents - other.cents, this.currency);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency;
  }
}

const payable = Money.of(1000, "GBP").subtract(Money.of(250, "GBP"));
```

*The positive version makes currency and non-negative amount part of the type's invariant. Invalid arithmetic fails at the operation that would create the bad value.*

## Relationships

**Synergies**

- [Entity](../ddd-tactical/entity.md) — Entities stay focused on lifecycle while value objects handle descriptive details such as Money or Address.
- [Aggregate](../ddd-tactical/aggregate.md) — Aggregates use value objects to enforce invariants without proliferating child entity identities.
- [Specification](../ddd-tactical/specification.md) — Specifications can compose richer predicates over value-object behaviour instead of raw primitive comparisons.
- [Smart Constructor](../implementation/smart-constructor.md) — Smart constructors are a natural way to create validated value objects without exposing invalid states.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Parameter Object](../implementation/parameter-object.md), [Newtype / Wrapper Type](../implementation/newtype-wrapper.md), [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript, kotlin
- **Frameworks:** none, dotnet, spring-boot, hibernate, entity-framework
- **Project types:** backend-service, modular-monolith, microservices, web-api, library
- **Tags:** ddd, immutability, validation, primitive-obsession

## References

- Eric Evans, Domain-Driven Design, (2003)
- Vaughn Vernon, Implementing Domain-Driven Design, (2013)

