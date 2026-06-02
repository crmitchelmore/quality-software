# Currying

> Represent a multi-argument function as a chain of one-argument functions, enabling staged configuration and reuse.

**Scale:** implementation · **Category:** functional · **Maturity:** time-tested

**Also known as:** Curried Functions

## Description

Currying turns f(a, b, c) into f(a)(b)(c). The first calls capture context and return specialised functions, so dependencies, policies, or validation rules can be supplied once and reused many times. It is an interface design choice: callers gain composability, but APIs become less familiar in languages without native support.

**Problem.** Repeatedly passing the same leading arguments clutters call sites and makes it hard to build small reusable functions from a general operation.

**Context.** Use in functional languages or typed JavaScript/TypeScript modules where functions are composed and configured in stages, especially for validators, parsers, formatters, and dependency-free domain rules.

## Consequences / Trade-offs

- Creates specialised functions without classes or mutable configuration objects.
- Works well with point-free composition in languages that support it.
- Can be surprising in mainstream codebases; error messages around partial inference may be poor.
- Over-currying domain APIs can obscure required inputs and make stack traces less direct.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful in libraries and functional modules, but may be unfamiliar overhead in ordinary application code. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for reusable validation, formatting, and policy functions when team conventions support it. |
| Large (>100k LOC) | ●●●○○ 3/5 | Apply selectively; explicit parameter objects may communicate intent better across large mixed-experience teams. |

## Examples

### Configuring a price formatter

**❌ Negative (typescript)**

```typescript
function formatPrice(currency: string, locale: string, cents: number): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency })
    .format(cents / 100);
}

const a = formatPrice("GBP", "en-GB", 1299);
const b = formatPrice("GBP", "en-GB", 2599);
```

**✅ Positive (typescript)**

```typescript
const formatPrice = (currency: string) => (locale: string) => (cents: number): string =>
  new Intl.NumberFormat(locale, { style: "currency", currency })
    .format(cents / 100);

const formatSterling = formatPrice("GBP")("en-GB");
const a = formatSterling(1299);
const b = formatSterling(2599);
```

*The positive version captures stable configuration once and returns a focused unary formatter that is easy to pass to map, compose, or inject.*

## Relationships

**Synergies**

- [Partial Application](../functional/partial-application.md) — Currying makes partial application automatic because each argument returns the next function.
- [Function Composition](../functional/function-composition.md) — Unary functions produced by currying compose cleanly from right to left or left to right.
- [Higher-Order Function](../functional/higher-order-function.md) — A curried function is a higher-order function at every stage except the final result.
- [Pure Function](../functional/pure-function.md) — Pure curried functions are safe to specialise and reuse without hidden state.

**Alternatives:** [Options Object](../implementation/options-object.md), [Parameter Object](../implementation/parameter-object.md), [Fluent Interface](../implementation/fluent-interface.md)

## Applicability tags

- **Languages:** haskell, scala, clojure, typescript, javascript
- **Frameworks:** none
- **Project types:** library, sdk, web-frontend, backend-service
- **Tags:** function-interface, composition, reuse

## References

- Raymond Smullyan, To Mock a Mockingbird, (1985)

