# Special Case

> Represent exceptional or boundary cases with objects that obey the normal interface, reducing scattered null checks and exceptional branches.

**Scale:** design · **Altitude:** low · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Special Case creates a concrete object for a known exceptional situation such as an anonymous customer, missing discount, blocked account, or unavailable price. The object implements the same protocol as the normal object and supplies safe, explicit behaviour for that case. It generalises Null Object: not every special case is absence, and the object may carry explanation, audit, or safe defaults.

**Problem.** Client code repeatedly asks whether a value is null, missing, anonymous, unavailable, or otherwise exceptional, then branches inconsistently at every call site.

**Context.** Use when the exceptional condition is expected, domain meaningful, and can be modelled safely. Do not hide real failures that should be visible to operators or callers.

## Consequences / Trade-offs

- Removes duplicated defensive checks and makes the special behaviour part of the model.
- Gives expected absence or boundary states a name that appears in tests and ubiquitous language.
- Can mask defects if used for cases that should fail fast.
- Requires careful design so special cases do not silently violate invariants or security rules.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when absence has behaviour; otherwise an Option or guard clause is simpler. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for domain-heavy services with repeated expected boundary states. |
| Large (>100k LOC) | ●●●●○ 4/5 | Reduces duplicated special-case logic across large codebases, but needs naming discipline. |

## Examples

### Anonymous customer pricing

**❌ Negative (typescript)**

```typescript
function priceFor(customer: Customer | null, basket: Basket): Money {
  if (customer === null) {
    return basket.total();
  }
  if (customer.discountCode === null) {
    return basket.total();
  }
  return basket.total().minus(discounts.valueOf(customer.discountCode));
}
```

**✅ Positive (typescript)**

```typescript
interface CustomerPricingProfile {
  discountFor(basket: Basket): Money;
}

class RegisteredCustomer implements CustomerPricingProfile {
  constructor(private readonly discountCode: DiscountCode | null) {}
  discountFor(basket: Basket): Money {
    return this.discountCode ? discounts.valueOf(this.discountCode) : Money.zero();
  }
}

class AnonymousCustomer implements CustomerPricingProfile {
  discountFor(_basket: Basket): Money { return Money.zero(); }
}

function priceFor(customer: CustomerPricingProfile, basket: Basket): Money {
  return basket.total().minus(customer.discountFor(basket));
}
```

*The positive version gives anonymous customers normal pricing behaviour, so callers do not duplicate null and discount-code checks.*

## Relationships

**Synergies**

- [Null Object](../implementation/null-object.md) — Null Object is a common Special Case where the exceptional condition is absence.
- [Domain Model](../enterprise-application/domain-model.md) — Domain models can encode expected boundary states as meaningful objects rather than primitive flags.
- [Guard Clause (Early Return)](../implementation/guard-clause.md) — Guard clauses still reject invalid input, leaving Special Case for valid but unusual domain states.
- [Option / Maybe](../functional/option-maybe.md) — Option makes absence explicit at boundaries; Special Case is better when behaviour should remain polymorphic.

**Conflicts with:** [Fail Fast](../implementation/fail-fast.md)

**Alternatives:** [Null Object](../implementation/null-object.md), [Option / Maybe](../functional/option-maybe.md), [Guard Clause (Early Return)](../implementation/guard-clause.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript
- **Frameworks:** none, spring-boot, dotnet
- **Project types:** backend-service, web-api, modular-monolith, monolith
- **Tags:** polymorphism, null-safety, domain-modelling

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

