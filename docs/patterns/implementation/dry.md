# DRY (Don't Repeat Yourself)

> Keep each piece of knowledge, policy, or rule in one authoritative place so changes are made once and remain consistent.

**Scale:** implementation · **Category:** implementation · **Maturity:** time-tested

**Also known as:** Don't Repeat Yourself, Single Source of Truth

## Description

DRY is about eliminating duplicated knowledge, not blindly removing similar-looking code. Two code blocks can look alike while representing different business rules; merging them too early creates harmful coupling. Applied well, DRY extracts shared validation, calculations, constants, and protocols behind names that express the single concept being reused.

**Problem.** Duplicated rules drift apart over time, causing inconsistent behaviour and expensive changes across multiple call sites.

**Context.** Use when repeated code represents the same reason to change, especially business rules, validation logic, and integration protocol details.

## Consequences / Trade-offs

- Reduces drift by giving shared knowledge one authoritative implementation.
- Makes future changes smaller and easier to review.
- Premature abstraction can couple behaviours that only look similar.
- Over-general helpers can become harder to understand than the original duplication.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good for real duplicated rules; avoid abstracting incidental similarity too soon. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent as duplicated policies start to drift across modules. |
| Large (>100k LOC) | ●●●●○ 4/5 | Necessary for consistency, but abstractions need ownership and clear naming. |

## Examples

### Shared tax rule

**❌ Negative (python)**

```python
def invoice_total(lines):
    subtotal = sum(line.amount for line in lines)
    return subtotal + subtotal * Decimal('0.20')

def preview_total(lines):
    subtotal = sum(line.amount for line in lines)
    return subtotal + subtotal * Decimal('0.19')
```

**✅ Positive (python)**

```python
VAT_RATE = Decimal('0.20')

def apply_vat(subtotal: Decimal) -> Decimal:
    return subtotal + subtotal * VAT_RATE

def invoice_total(lines):
    return apply_vat(sum(line.amount for line in lines))

def preview_total(lines):
    return apply_vat(sum(line.amount for line in lines))
```

*The positive version gives the VAT rule one authoritative implementation, so invoice and preview calculations cannot silently drift.*

## Relationships

**Synergies**

- [Template Method](../gof-behavioural/template-method.md) — Template Method removes duplication in a stable algorithm while preserving overridable steps.
- [Strategy](../gof-behavioural/strategy.md) — Strategy avoids duplicated branching by naming and reusing interchangeable algorithms.
- [Parameter Object](../implementation/parameter-object.md) — Parameter Objects remove repeated parameter clusters and their repeated validation.
- [Repository](../data-persistence/repository.md) — Repository centralises persistence query knowledge that would otherwise be duplicated by services.

**Alternatives:** [Copy-on-Write](../concurrency/copy-on-write.md), [Strategy](../gof-behavioural/strategy.md), [Template Method](../gof-behavioural/template-method.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none
- **Project types:** library, web-api, backend-service, web-frontend, modular-monolith
- **Tags:** abstraction, maintainability, consistency

## References

- Andrew Hunt and David Thomas, The Pragmatic Programmer, (1999)

