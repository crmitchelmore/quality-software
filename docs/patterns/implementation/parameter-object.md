# Parameter Object

> Replace repeated groups of related parameters with a named object that carries the concept and its invariants together.

**Scale:** implementation · **Category:** implementation · **Maturity:** time-tested

**Also known as:** Introduce Parameter Object

## Description

Parameter Object turns a recurring parameter cluster into a domain-shaped value. Instead of passing start/end/currency/locale through many methods, a named object such as ReportingPeriod or MoneyFormat captures what those values mean. The object can validate combinations, provide helper behaviour, and reduce call-site mistakes caused by argument ordering.

**Problem.** Long argument lists and repeated parameter clusters make APIs hard to call correctly and scatter validation across functions.

**Context.** Use when several parameters travel together, share validation rules, or represent a concept that deserves a name.

## Consequences / Trade-offs

- Clarifies method signatures by naming the grouped concept.
- Centralises validation for related fields and prevents swapped primitive values.
- Can become a vague bag of options if fields are unrelated.
- May be overkill for a single local call with two obvious parameters.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Useful as soon as a parameter cluster repeats or has validation. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for reducing API noise and primitive obsession across services. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still valuable, but avoid creating overly broad request-shaped buckets. |

## Examples

### Grouping a reporting period

**❌ Negative (java)**

```java
List<Invoice> findInvoices(LocalDate start, LocalDate end, Currency currency, ZoneId zone) {
    if (end.isBefore(start)) {
        throw new IllegalArgumentException("end before start");
    }
    return store.query(start, end, currency, zone);
}
```

**✅ Positive (java)**

```java
public record ReportScope(LocalDate start, LocalDate end, Currency currency, ZoneId zone) {
    public ReportScope {
        if (end.isBefore(start)) {
            throw new IllegalArgumentException("end before start");
        }
    }
}

List<Invoice> findInvoices(ReportScope scope) {
    return store.query(scope.start(), scope.end(), scope.currency(), scope.zone());
}
```

*The positive version gives the parameter group a name and validates date order once, so every caller shares the same invariant.*

## Relationships

**Synergies**

- [Value Object](../ddd-tactical/value-object.md) — A strong Parameter Object is often a Value Object with equality and invariants.
- [Smart Constructor](../implementation/smart-constructor.md) — Smart constructors keep invalid parameter combinations out of the object.
- [Newtype / Wrapper Type](../implementation/newtype-wrapper.md) — Wrapping primitive fields prevents accidental argument swaps inside the parameter object.
- [Options Object](../implementation/options-object.md) — Options Object is better for optional configuration knobs rather than a cohesive domain concept.

**Alternatives:** [Options Object](../implementation/options-object.md), [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none
- **Project types:** library, web-api, backend-service, sdk
- **Tags:** parameters, domain-modelling, validation

## References

- Martin Fowler, Refactoring; Introduce Parameter Object, (2018)

