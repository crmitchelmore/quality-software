# Map-Filter-Reduce

> Transform collections with small pure steps: map values, filter unwanted elements, then reduce the remaining values into a result.

**Scale:** implementation · **Altitude:** low · **Category:** functional · **Maturity:** time-tested

**Also known as:** Map/Filter/Fold, Transform-Select-Aggregate

## Description

Map-Filter-Reduce replaces index-driven loops and mutable accumulators with a declarative pipeline. Each stage has one responsibility: map changes shape, filter decides inclusion, and reduce/fold combines values. The pattern is strongest when each function is pure and the collection is processed as a value rather than as shared mutable state.

**Problem.** Imperative loops often interleave traversal, branching, mutation, and aggregation, making it difficult to verify which rule transformed which value or why a value was skipped.

**Context.** Use when processing finite collections, streams, query results, or events where the operation naturally decomposes into transformation, selection, and aggregation steps.

## Consequences / Trade-offs

- Makes data flow explicit and isolates each operation for testing.
- Encourages pure, reusable transformation functions.
- Can allocate intermediate collections unless the language/runtime fuses or lazily evaluates the pipeline.
- Over-chaining trivial operations can hide performance costs or make debugging harder.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Excellent once collection logic has more than one rule; avoid contorting a simple loop if clarity suffers. |
| Medium (≤100k LOC) | ●●●●● 5/5 | A high-leverage default for business rules, ETL, API mapping, and report generation. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still valuable, but large data volumes require attention to laziness, streaming, and allocation behaviour. |

## Examples

### Invoice totals by active customer

**❌ Negative (typescript)**

```typescript
type Invoice = { customerId: string; active: boolean; cents: number };

function totalActive(invoices: Invoice[]): number {
  let total = 0;
  for (let i = 0; i < invoices.length; i++) {
    const invoice = invoices[i];
    if (invoice.active) {
      total = total + invoice.cents;
    }
  }
  return total;
}
```

**✅ Positive (typescript)**

```typescript
type Invoice = { customerId: string; active: boolean; cents: number };

const isActive = (invoice: Invoice) => invoice.active;
const cents = (invoice: Invoice) => invoice.cents;

function totalActive(invoices: Invoice[]): number {
  return invoices
    .filter(isActive)
    .map(cents)
    .reduce((total, amount) => total + amount, 0);
}
```

*The positive version separates selection, projection, and aggregation, so each rule can be named, tested, and reused without mutable loop state.*

## Relationships

**Synergies**

- [Pure Function](../functional/pure-function.md) — Pure mapping predicates and reducers make the pipeline deterministic and safe to parallelise.
- [Function Composition](../functional/function-composition.md) — Composed transformations keep map stages small without creating deeply nested callbacks.
- [Lazy Evaluation](../functional/lazy-evaluation.md) — Lazy sequences avoid intermediate collections for large or infinite inputs.
- [Pipes and Filters](../architecture/pipes-and-filters.md) — Pipes and Filters is the architectural analogue when the same idea crosses process or component boundaries.

**Alternatives:** [Iterator](../gof-behavioural/iterator.md), [Query Object](../enterprise-application/query-object.md), [Pipes and Filters](../architecture/pipes-and-filters.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, scala, haskell, rust, clojure
- **Frameworks:** none, rxjs
- **Project types:** library, backend-service, web-api, data-pipeline, etl
- **Tags:** collections, declarative, data-transformation

## References

- Harold Abelson, Gerald Jay Sussman, Structure and Interpretation of Computer Programs, (1985)

