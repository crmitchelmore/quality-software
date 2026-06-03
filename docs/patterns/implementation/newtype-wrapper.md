# Newtype / Wrapper Type

> Wrap a primitive value in a distinct type so the compiler and API signatures carry domain meaning instead of accepting interchangeable strings or numbers.

**Scale:** implementation · **Altitude:** low · **Category:** implementation · **Maturity:** established

**Also known as:** Tiny Type, Domain Primitive

## Description

Newtype / Wrapper Type creates a small type around a primitive representation such as string, UUID, integer, or decimal. The wrapper distinguishes CustomerId from OrderId even if both are strings, and it provides a home for parsing, formatting, and invariants. The aim is not ceremony for every value, but protection for values whose mix-ups would be costly.

**Problem.** Primitive obsession lets unrelated values with the same representation be swapped accidentally and leaves domain rules undocumented.

**Context.** Use for identifiers, money, quantities, external references, and security-sensitive tokens where the primitive alone is too weak.

## Consequences / Trade-offs

- Prevents accidental mixing of domain concepts with identical primitive shapes.
- Gives validation and formatting behaviour an owning type.
- Adds conversion overhead at boundaries and may need serialization support.
- Too many tiny wrappers can make simple code verbose.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Use for high-value concepts; primitives are fine for local throwaway code. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for APIs and domains with many identifiers and external inputs. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical for preventing cross-domain mix-ups; invest in serialization support. |

## Examples

### Distinct identifiers

**❌ Negative (csharp)**

```csharp
public Task<Order> LoadOrder(string customerId, string orderId)
{
    return repository.Load(customerId, orderId);
}

await service.LoadOrder(orderId, customerId); // compiles
```

**✅ Positive (csharp)**

```csharp
public readonly record struct CustomerId(string Value);
public readonly record struct OrderId(string Value);

public Task<Order> LoadOrder(CustomerId customerId, OrderId orderId)
{
    return repository.Load(customerId.Value, orderId.Value);
}

await service.LoadOrder(new CustomerId(customerId), new OrderId(orderId));
```

*The positive version gives customer and order identifiers distinct types, so a swapped call is caught by the compiler instead of becoming a data bug.*

## Relationships

**Synergies**

- [Smart Constructor](../implementation/smart-constructor.md) — Smart constructors ensure wrappers contain only valid primitive values.
- [Value Object](../ddd-tactical/value-object.md) — Many wrappers are small Value Objects with equality by contained value.
- [Parameter Object](../implementation/parameter-object.md) — Wrappers strengthen fields inside a parameter object and prevent swaps.
- [Input Validation (Allow-List)](../security/input-validation.md) — Boundary validation can parse untrusted primitives into safe wrappers.

**Alternatives:** [Value Object](../ddd-tactical/value-object.md), [Parameter Object](../implementation/parameter-object.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, rust, csharp, java
- **Frameworks:** none
- **Project types:** library, sdk, web-api, backend-service, safety-critical
- **Tags:** types, domain-modelling, primitives

## References

- Scott Wlaschin, Domain Modeling Made Functional, (2018)

