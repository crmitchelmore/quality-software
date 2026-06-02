# Memoization

> Cache the result of a pure function by its inputs so repeated calls return immediately without recomputation.

**Scale:** implementation · **Category:** functional · **Maturity:** time-tested

**Also known as:** Result Caching

## Description

Memoization stores a mapping from argument values to results. It is safe only when the function is referentially transparent: the same inputs always produce the same output and no observable side effects are skipped. It is most useful for expensive recursive functions, derived view data, parsing, and deterministic calculations with repeated inputs.

**Problem.** Expensive pure computations may be repeated with identical inputs, wasting CPU and sometimes turning otherwise simple recursive algorithms exponential.

**Context.** Use when inputs are hashable or can be canonicalised, outputs are stable, and memory growth can be bounded or deliberately accepted.

## Consequences / Trade-offs

- Can change exponential repeated subproblems into linear work.
- Keeps callers simple because caching is local to the function boundary.
- Consumes memory and may require eviction for unbounded input domains.
- Unsafe for impure functions because it can hide I/O, time, randomness, or mutable state changes.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational; excellent for repeated expensive calculations but unnecessary for cheap code. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for derived data, parser tables, and dynamic programming if cache size is controlled. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful but risky when caches become hidden state; prefer explicit observability and eviction policies. |

## Examples

### Fibonacci with repeated subproblems

**❌ Negative (typescript)**

```typescript
function fib(n: number): number {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

fib(42); // recomputes the same subtrees many times
```

**✅ Positive (typescript)**

```typescript
function memoize<A extends string | number, R>(fn: (arg: A) => R): (arg: A) => R {
  const cache = new Map<A, R>();
  return (arg: A) => {
    if (cache.has(arg)) return cache.get(arg)!;
    const value = fn(arg);
    cache.set(arg, value);
    return value;
  };
}

const fib: (n: number) => number = memoize((n) => {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
});
```

*The positive version relies on fib being pure: once a value is computed for n, returning it from the cache is indistinguishable from recomputing it.*

## Relationships

**Synergies**

- [Pure Function](../functional/pure-function.md) — Purity is the precondition that makes cached results semantically equivalent to recomputation.
- [Lazy Evaluation](../functional/lazy-evaluation.md) — Lazy values and memoized thunks compute at most once, when demanded.
- [Materialized View](../cloud-distributed/materialized-view.md) — Materialized View applies the same reuse-of-derived-results idea at data-store scale rather than function scope.
- [Cache-Aside](../cloud-distributed/cache-aside.md) — Cache-aside is the distributed/data-access analogue when cached values cross process boundaries.

**Conflicts with:** [Event Sourcing](../architecture/event-sourcing.md)

**Alternatives:** [Cache-Aside](../cloud-distributed/cache-aside.md), [Lazy Initialization](../implementation/lazy-initialization.md), [Materialized View](../cloud-distributed/materialized-view.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, python, haskell, scala, clojure
- **Frameworks:** none, react, redux
- **Project types:** library, web-frontend, backend-service, data-pipeline
- **Tags:** caching, performance, referential-transparency

## References

- Donald Knuth, The Art of Computer Programming, Volume 1, (1968)

