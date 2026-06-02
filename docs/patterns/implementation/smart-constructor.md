# Smart Constructor

> Hide raw construction behind a named function that validates inputs and only returns a value when its invariants hold.

**Scale:** implementation · **Category:** implementation · **Maturity:** established

**Also known as:** Named Constructor with Validation, Factory Function

## Description

Smart Constructor prevents invalid domain values from being created. The raw constructor is private, internal, or conventional-only, while a named creation function parses, validates, normalises, and returns either a valid instance or an explicit error. It is a small but powerful way to move validation from scattered consumers into the type that owns the invariant.

**Problem.** Public constructors let callers create values that violate domain rules, forcing every later consumer to defensively revalidate.

**Context.** Use for value objects, identifiers, ranges, money, emails, and any type with invariants beyond its primitive representation.

## Consequences / Trade-offs

- Centralises validation at the creation boundary.
- Makes invalid states difficult or impossible to represent.
- Requires callers to handle creation failure explicitly.
- Overuse around trivial values can add noise without meaningful safety.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Great for domain primitives with real invariants; skip for throwaway DTOs. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for keeping validation close to types used across many flows. |
| Large (>100k LOC) | ●●●●● 5/5 | Strongly improves model integrity when paired with value objects and wrappers. |

## Examples

### Validated email value

**❌ Negative (typescript)**

```typescript
class EmailAddress {
  constructor(public readonly value: string) {}
}

const email = new EmailAddress(request.body.email);
```

**✅ Positive (typescript)**

```typescript
class EmailAddress {
  private constructor(public readonly value: string) {}

  static parse(value: string): EmailAddress {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      throw new Error('Invalid email address');
    }
    return new EmailAddress(value.toLowerCase());
  }
}

const email = EmailAddress.parse(request.body.email);
```

*The positive version ensures every EmailAddress is validated and normalised at creation, so downstream code can trust the type.*

## Relationships

**Synergies**

- [Value Object](../ddd-tactical/value-object.md) — Value Objects rely on smart constructors to enforce equality-relevant invariants.
- [Newtype / Wrapper Type](../implementation/newtype-wrapper.md) — Wrappers become meaningful when their constructors prevent invalid primitive values.
- [Input Validation (Allow-List)](../security/input-validation.md) — Boundary validation can delegate domain-specific checks to smart constructors.
- [Fail Fast](../implementation/fail-fast.md) — Smart constructors fail fast at the point invalid data attempts to enter the model.

**Alternatives:** [Factory Method](../gof-creational/factory-method.md), [Guard Clause (Early Return)](../implementation/guard-clause.md), [Input Validation (Allow-List)](../security/input-validation.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, rust, csharp, java
- **Frameworks:** none
- **Project types:** library, web-api, backend-service, sdk, safety-critical
- **Tags:** validation, invariants, domain-modelling

## References

- Scott Wlaschin, Domain Modeling Made Functional, (2018)

