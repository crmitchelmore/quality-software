# Guard Clause (Early Return)

> Handle preconditions and edge cases up front with early returns, so the main logic runs at minimal indentation without deep nesting.

**Scale:** implementation · **Category:** implementation · **Maturity:** time-tested

**Also known as:** Early Return, Bouncer Pattern

## Description

A guard clause checks an invalid or exceptional condition at the top of a function and returns (or throws) immediately, rejecting bad input before the core logic. Replacing nested if/else "arrow code" with a sequence of flat guards reduces cognitive load, makes the happy path obvious, and keeps each precondition close to the reason it exists.

**Problem.** Deeply nested conditionals ("arrow code") obscure the main flow and make it hard to see which branch handles the real work.

**Context.** Any function with preconditions, validation, or edge cases to reject.

## Consequences / Trade-offs

- Flattens nesting and makes the happy path linear and obvious.
- Each precondition is local and independently readable.
- Many scattered returns can hurt if cleanup is required (prefer RAII/defer/finally).

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Always appropriate; pure readability win with no structural cost. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Universally beneficial; a baseline habit for clean functions. |
| Large (>100k LOC) | ●●●●● 5/5 | Scales perfectly; reduces review friction across large codebases. |

## Examples

### Discount eligibility

**❌ Negative (javascript)**

```javascript
function discount(user) {
  if (user) {
    if (user.isActive) {
      if (user.orders.length > 10) {
        return 0.2;
      } else {
        return 0.1;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}
```

**✅ Positive (javascript)**

```javascript
function discount(user) {
  if (!user) return 0;
  if (!user.isActive) return 0;
  if (user.orders.length <= 10) return 0.1;
  return 0.2;
}
```

*The positive version rejects each disqualifying case first, leaving the meaningful result unindented and easy to read.*

## Relationships

**Synergies**

- [Null Object](../implementation/null-object.md) — Guards and null objects both remove defensive branching from core logic.
- [Fail Fast](../implementation/fail-fast.md) — Guard clauses are the concrete mechanism for failing fast on bad input.

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, go, java, csharp, rust
- **Frameworks:** none
- **Project types:** library, cli-tool, web-api, backend-service, web-frontend
- **Tags:** readability, control-flow, validation

## References

- Martin Fowler, Refactoring; "Replace Nested Conditional with Guard Clauses", (2018)

