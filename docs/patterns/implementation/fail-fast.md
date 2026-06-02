# Fail Fast

> Detect invalid state, bad input, or missing configuration immediately and stop at the closest responsible boundary.

**Scale:** implementation · **Category:** implementation · **Maturity:** time-tested

**Also known as:** Fast Failure

## Description

Fail Fast turns latent errors into immediate, local failures. Instead of accepting a malformed value and allowing it to break later in a distant subsystem, code validates assumptions at creation, startup, or boundary entry and raises a clear error. The pattern improves diagnosability, but it should be balanced with tolerant input handling where recovery or normalisation is the product requirement.

**Problem.** Delayed failures appear far from their cause, produce misleading symptoms, and may corrupt state before anyone notices.

**Context.** Use for invariants, programmer errors, required configuration, and input that cannot be safely normalised.

## Consequences / Trade-offs

- Produces local, actionable failures with clearer stack traces.
- Prevents invalid state from entering deeper layers.
- Can reduce availability if used for recoverable external conditions.
- Requires clear error messages so fast failure is useful rather than abrupt.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent default for invariants and required configuration. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strongly improves diagnostics across many call paths. |
| Large (>100k LOC) | ●●●●○ 4/5 | Essential internally, but combine with resilience patterns at unreliable external boundaries. |

## Examples

### Required configuration

**❌ Negative (typescript)**

```typescript
const apiKey = process.env.PAYMENTS_API_KEY;

export async function charge(amount: number) {
  return fetch('/payments', {
    headers: { Authorization: `Bearer ${apiKey}` },
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}
```

**✅ Positive (typescript)**

```typescript
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const apiKey = requiredEnv('PAYMENTS_API_KEY');

export async function charge(amount: number) {
  return fetch('/payments', {
    headers: { Authorization: `Bearer ${apiKey}` },
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}
```

*The positive version fails during startup with a precise configuration error instead of sending broken requests later.*

## Relationships

**Synergies**

- [Guard Clause (Early Return)](../implementation/guard-clause.md) — Guard clauses are the common implementation mechanism for failing fast in functions.
- [Smart Constructor](../implementation/smart-constructor.md) — Smart constructors fail fast before invalid domain values can exist.
- [Input Validation (Allow-List)](../security/input-validation.md) — Input validation applies fail-fast thinking at trust boundaries.
- [Lazy Initialization](../implementation/lazy-initialization.md) — Lazy Initialization conflicts when it defers configuration or connection failures until first use.

**Conflicts with:** [Lazy Initialization](../implementation/lazy-initialization.md), [Fallback](../resilience/fallback.md)

**Alternatives:** [Fallback](../resilience/fallback.md), [Lazy Initialization](../implementation/lazy-initialization.md), [Input Validation (Allow-List)](../security/input-validation.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, rust
- **Frameworks:** none, spring, dotnet, nodejs
- **Project types:** library, web-api, backend-service, cli-tool
- **Tags:** validation, invariants, diagnostics

## References

- Andrew Hunt and David Thomas, The Pragmatic Programmer, (1999)

