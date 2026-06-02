# Either / Result

> Represent success or failure as a value, carrying either the successful result or typed error information.

**Scale:** design · **Category:** functional · **Maturity:** time-tested

**Also known as:** Result Type, Either Type, Expected

## Description

Either/Result makes recoverable failure explicit in the return type. Instead of throwing through invisible control flow, a function returns Ok(value) or Err(error), and callers compose or pattern-match on the result. It is strongest when errors are expected domain outcomes, not programmer defects or truly exceptional infrastructure failure.

**Problem.** Exceptions and sentinel values make recoverable failure paths implicit, easy to forget, and hard to document in function signatures.

**Context.** Use for validation, parsing, command handling, service boundaries, and domain operations where callers are expected to branch on known failure reasons.

## Consequences / Trade-offs

- Documents failure modes in the type signature and supports exhaustive handling.
- Composes with map/flatMap so success paths remain linear.
- Can become noisy in languages without ergonomic syntax or union types.
- Do not replace all exceptions: bugs, cancellation, and unrecoverable infrastructure failures may still be better as exceptions or process-level failures.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for libraries and parsing, but may feel heavy for throwaway scripts. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for domain validation and API command flows with known recoverable failures. |
| Large (>100k LOC) | ●●●●● 5/5 | Strong fit for public contracts and safety-critical code because failure modes are reviewable and typed. |

## Examples

### Parsing a payment amount

**❌ Negative (typescript)**

```typescript
function parseCents(input: string): number {
  const value = Number(input);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("amount must be a positive integer");
  }
  return value;
}

const cents = parseCents(form.amount); // failure is invisible in the type
```

**✅ Positive (typescript)**

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

type AmountError = "not-an-integer" | "not-positive";

function parseCents(input: string): Result<number, AmountError> {
  const value = Number(input);
  if (!Number.isInteger(value)) return { ok: false, error: "not-an-integer" };
  if (value <= 0) return { ok: false, error: "not-positive" };
  return { ok: true, value };
}

const parsed = parseCents(form.amount);
const response = parsed.ok ? charge(parsed.value) : showAmountError(parsed.error);
```

*The positive version makes expected validation failures explicit and typed; the caller cannot use the amount until it handles the Err case.*

## Relationships

**Synergies**

- [Option / Maybe](../functional/option-maybe.md) — Option handles missing values; Result handles missing or invalid values with a reason.
- [Smart Constructor](../implementation/smart-constructor.md) — Smart constructors can return Result to explain invariant violations.
- [Pattern Matching](../functional/pattern-matching.md) — Pattern matching makes Ok and Err handling exhaustive and readable.
- [Problem Details (RFC 7807 Errors)](../api-design/problem-details.md) — Result errors can map cleanly to RFC 7807 API responses at the boundary.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Guard Clause (Early Return)](../implementation/guard-clause.md), [Problem Details (RFC 7807 Errors)](../api-design/problem-details.md), [Fail Fast](../implementation/fail-fast.md)

## Applicability tags

- **Languages:** rust, scala, typescript, haskell, csharp
- **Frameworks:** none, actix, nodejs
- **Project types:** library, web-api, backend-service, sdk, safety-critical
- **Tags:** errors, validation, typed-failure

## References

- Scott Wlaschin, Railway Oriented Programming, (2013)

