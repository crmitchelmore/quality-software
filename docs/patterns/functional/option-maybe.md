# Option / Maybe

> Represent possible absence explicitly as Some(value) or None instead of using null or undefined.

**Scale:** design · **Category:** functional · **Maturity:** time-tested

**Also known as:** Optional, Maybe

## Description

Option/Maybe makes absence part of a function signature. A caller cannot accidentally ignore it because the type must be inspected, mapped, defaulted, or chained. This moves missing-value handling from scattered null checks into explicit operations and prevents null from being a hidden member of every type.

**Problem.** Null and undefined values travel invisibly through APIs until a distant dereference fails, often far from the function that introduced absence.

**Context.** Use when a value may legitimately be absent: lookups, optional configuration, parsing, partial user input, cache misses, and nullable database fields after they cross into domain code.

## Consequences / Trade-offs

- Makes absence explicit and type-checkable.
- Encourages local handling via map, flatMap, match, or default values.
- Can be overused for validation failures that need error details; use Either/Result there.
- Interoperability with null-heavy libraries requires boundary normalisation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Great fit where the language supports it; prevents many low-cost null bugs. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for lookup and parsing APIs. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for stable contracts across teams; removes ambiguous sentinel values from public APIs. |

## Examples

### Finding a user email

**❌ Negative (rust)**

```rust
fn email_for(users: &[User], id: UserId) -> String {
    for user in users {
        if user.id == id {
            return user.email.clone();
        }
    }
    "".to_string() // empty string now means not found
}
```

**✅ Positive (rust)**

```rust
fn email_for(users: &[User], id: UserId) -> Option<String> {
    users
        .iter()
        .find(|user| user.id == id)
        .map(|user| user.email.clone())
}

let label = email_for(&users, id).unwrap_or_else(|| "unknown".to_string());
```

*The positive version distinguishes a real empty email from absence and forces the caller to decide how to handle the missing user.*

## Relationships

**Synergies**

- [Null Object](../implementation/null-object.md) — Null Object is better when absence should still provide behaviour; Option is better when callers must choose.
- [Smart Constructor](../implementation/smart-constructor.md) — Smart constructors can return Option when invalid input simply means no value.
- [Pattern Matching](../functional/pattern-matching.md) — Pattern matching forces exhaustive handling of Some and None.
- [Either / Result](../functional/either-result.md) — Either/Result extends the idea when absence needs an explanation.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Null Object](../implementation/null-object.md), [Special Case](../enterprise-application/special-case.md), [Guard Clause (Early Return)](../implementation/guard-clause.md)

## Applicability tags

- **Languages:** haskell, scala, rust, typescript, java, csharp
- **Frameworks:** none
- **Project types:** library, backend-service, web-api, web-frontend
- **Tags:** absence, null-safety, types

## References

- Tony Hoare, Tony Hoare: Null References, The Billion Dollar Mistake, (2009)

