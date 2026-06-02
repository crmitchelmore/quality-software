# Lazy Evaluation

> Delay computing a value until it is demanded, and often compute it at most once.

**Scale:** implementation · **Category:** functional · **Maturity:** time-tested

**Also known as:** Call by Need, Deferred Evaluation

## Description

Lazy Evaluation represents work as a suspended computation. The program can describe potentially expensive, infinite, or conditional data without paying the cost until a consumer asks for it. It is useful for streams, short-circuiting, expensive derived values, and separating production from consumption, but it must be monitored because deferred work can also defer failures and resource use.

**Problem.** Eager code computes values that may never be used or materialises large intermediate collections before consumers know how much they need.

**Context.** Use for streaming data, infinite sequences, expensive derived values, conditional branches, parser input, and producer/consumer boundaries with backpressure.

## Consequences / Trade-offs

- Avoids unnecessary work and supports infinite or very large sequences.
- Pairs well with short-circuiting consumers such as take/find/any.
- Can make performance and failure timing less obvious.
- Careless laziness may retain references and cause space leaks.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for streams and expensive branches, but eager evaluation is simpler for small finite data. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for APIs that process large inputs or optional expensive values. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent in high-throughput pipelines when paired with observability and bounded resource handling. |

## Examples

### Finding the first expensive match

**❌ Negative (typescript)**

```typescript
const values = readLines(file)
  .map(parseRecord)
  .filter((record) => record.score > 90)
  .map(enrichRecord);

const first = values[0]; // parsed and enriched every matching record first
```

**✅ Positive (typescript)**

```typescript
function* matchingRecords(lines: Iterable<string>): Iterable<Record> {
  for (const line of lines) {
    const record = parseRecord(line);
    if (record.score > 90) {
      yield enrichRecord(record);
    }
  }
}

const first = matchingRecords(readLines(file))[Symbol.iterator]().next().value;
```

*The positive version produces records only as demanded; finding the first match stops parsing and enriching the rest of the file.*

## Relationships

**Synergies**

- [Map-Filter-Reduce](../functional/map-filter-reduce.md) — Lazy map/filter/reduce pipelines avoid intermediate collections and stop when consumers stop.
- [Memoization](../functional/memoization.md) — A memoized thunk is lazy work computed at most once.
- [Backpressure](../resilience/backpressure.md) — Lazy producers can respect consumer demand instead of flooding downstream.
- [Iterator](../gof-behavioural/iterator.md) — Iterators are the imperative interface most languages use for lazy traversal.

**Alternatives:** [Lazy Initialization](../implementation/lazy-initialization.md), [Iterator](../gof-behavioural/iterator.md), [Producer-Consumer](../concurrency/producer-consumer.md)

## Applicability tags

- **Languages:** haskell, scala, clojure, typescript, python, rust
- **Frameworks:** none, rxjs
- **Project types:** data-pipeline, etl, backend-service, high-throughput, library
- **Tags:** deferred-work, streaming, performance

## References

- Simon Peyton Jones, The Implementation of Functional Programming Languages, (1987)

