# Function Composition

> Build larger behaviours by connecting small functions where each output becomes the next input.

**Scale:** implementation · **Altitude:** low · **Category:** functional · **Maturity:** time-tested

**Also known as:** Compose, Pipe

## Description

Function Composition creates a pipeline of transformations without naming every intermediate variable or nesting calls. It works best with small, pure, single-purpose functions whose input and output types line up. Composition can be mathematical right-to-left compose or pragmatic left-to-right pipe; the important property is explicit data flow.

**Problem.** Nested calls and temporary variables obscure the transformation path, while large functions mix steps that would be clearer and more testable separately.

**Context.** Use for validation, parsing, formatting, request mapping, data cleanup, and UI state derivation where the flow is a sequence of deterministic transformations.

## Consequences / Trade-offs

- Encourages small reusable functions and visible data flow.
- Makes pipelines easy to test step by step or as a whole.
- Type mismatches surface at composition boundaries.
- Excessive point-free style can become unreadable; name important intermediate concepts.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good for concise transformations; avoid abstract pipe helpers if a direct expression is clearer. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for validation, mapping, and formatting pipelines. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong with naming discipline; overly clever point-free chains can reduce maintainability. |

## Examples

### Normalising a username

**❌ Negative (typescript)**

```typescript
function normaliseUsername(input: string): string {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  const collapsed = lower.replace(/\s+/g, "-");
  return collapsed.replace(/[^a-z0-9-]/g, "");
}
```

**✅ Positive (typescript)**

```typescript
const trim = (s: string) => s.trim();
const lower = (s: string) => s.toLowerCase();
const collapseWhitespace = (s: string) => s.replace(/\s+/g, "-");
const removeUnsafe = (s: string) => s.replace(/[^a-z0-9-]/g, "");

const pipe = <A>(value: A, ...steps: Array<(value: A) => A>): A =>
  steps.reduce((current, step) => step(current), value);

const normaliseUsername = (input: string): string =>
  pipe(input, trim, lower, collapseWhitespace, removeUnsafe);
```

*The positive version exposes the transformation sequence and gives each rule a reusable name while keeping the overall flow linear.*

## Relationships

**Synergies**

- [Currying](../functional/currying.md) — Currying turns multi-argument functions into unary functions that compose naturally.
- [Partial Application](../functional/partial-application.md) — Partial application adapts general functions to the input shape required by a composition.
- [Pure Function](../functional/pure-function.md) — Pure functions compose safely because there are no hidden effects between stages.
- [Map-Filter-Reduce](../functional/map-filter-reduce.md) — Map/filter/reduce pipelines are a collection-oriented form of composition.

**Alternatives:** [Pipes and Filters](../architecture/pipes-and-filters.md), [Template Method](../gof-behavioural/template-method.md), [Strategy](../gof-behavioural/strategy.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, haskell, scala, clojure, elixir
- **Frameworks:** none, rxjs, redux
- **Project types:** library, web-frontend, backend-service, data-pipeline
- **Tags:** pipe, compose, data-flow

## References

- John Backus, Can Programming Be Liberated from the von Neumann Style?, (1978)

