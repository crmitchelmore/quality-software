# Pattern Matching

> Branch by matching data shape and variants, often with exhaustive compiler checking.

**Scale:** implementation · **Category:** functional · **Maturity:** time-tested

**Also known as:** Destructuring Match, Algebraic Matching

## Description

Pattern Matching selects behaviour by the structure of data: union variants, tuples, lists, records, literals, and guards. Unlike ad hoc if/else chains, a match can destructure values and require every variant to be handled. It is especially valuable with algebraic data types such as Option, Result, and domain events.

**Problem.** Conditionals that inspect tags and then manually cast or dereference fields are verbose, unsafe, and easy to leave non-exhaustive when variants change.

**Context.** Use with sealed unions, enums, algebraic data types, command variants, parser ASTs, domain events, and typed error models.

## Consequences / Trade-offs

- Makes branching over variants explicit and often exhaustively checked.
- Destructures data close to the branch that uses it.
- Can become unwieldy if each branch contains large business workflows; delegate after matching.
- In languages without exhaustiveness checking, it may be mostly syntactic convenience.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Very clear for small unions and errors where language support exists. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for domain events, command handling, typed errors, and parsers. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large typed functional systems because variant additions become compiler-guided changes. |

## Examples

### Handling payment results

**❌ Negative (rust)**

```rust
enum PaymentResult {
    Paid { receipt: String },
    Declined { reason: String },
    Pending,
}

fn message(result: PaymentResult) -> String {
    // imagine this was encoded as strings and nullable fields
    "payment status changed".to_string()
}
```

**✅ Positive (rust)**

```rust
enum PaymentResult {
    Paid { receipt: String },
    Declined { reason: String },
    Pending,
}

fn message(result: PaymentResult) -> String {
    match result {
        PaymentResult::Paid { receipt } => format!("paid: {}", receipt),
        PaymentResult::Declined { reason } => format!("declined: {}", reason),
        PaymentResult::Pending => "pending".to_string(),
    }
}
```

*The positive version binds only fields valid for each variant and the compiler requires every PaymentResult case to be handled.*

## Relationships

**Synergies**

- [Option / Maybe](../functional/option-maybe.md) — Matching Some/None forces callers to handle missing values.
- [Either / Result](../functional/either-result.md) — Matching Ok/Err makes recoverable failures explicit at the use site.
- [Visitor](../gof-behavioural/visitor.md) — Visitor is the object-oriented alternative for exhaustive operations over variants.
- [Type State](../implementation/type-state.md) — Pattern matching over states keeps allowed transitions visible and typed.

**Alternatives:** [Visitor](../gof-behavioural/visitor.md), [Strategy](../gof-behavioural/strategy.md), [State](../gof-behavioural/state.md)

## Applicability tags

- **Languages:** rust, scala, haskell, elixir, scala, typescript
- **Frameworks:** none
- **Project types:** library, backend-service, web-api, cli-tool
- **Tags:** control-flow, algebraic-data-types, exhaustiveness

## References

- Lawrence C. Paulson, ML for the Working Programmer, (1991)

