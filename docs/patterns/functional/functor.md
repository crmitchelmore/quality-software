# Functor

> Provide a lawful map operation that transforms values inside a context without changing the context shape.

**Scale:** design · **Altitude:** low · **Category:** functional · **Maturity:** time-tested

**Also known as:** Mappable Context

## Description

A Functor is a type that supports map: apply a pure function to the value or values it contains, returning the same kind of context. Arrays map over many values, Option maps over a present value, Result maps over success, and Future maps over eventual success. The abstraction is small but powerful: transform what is inside without knowing how the context is represented.

**Problem.** Code often unwraps containers just to transform their contents, duplicating empty/error/async/container handling around simple pure functions.

**Context.** Use when designing generic wrappers, collection-like types, optional values, results, parser values, or async abstractions that should support transformation without unwrapping.

## Consequences / Trade-offs

- Separates content transformation from context handling.
- Gives a common vocabulary for Option, Result, collections, and futures.
- Only handles independent transformations; dependent contextual steps require Monad/flatMap.
- Lawfulness matters: map(identity) and map(f).map(g) should behave predictably.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when language libraries already expose map; rarely worth teaching as an abstraction for tiny apps. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good vocabulary for generic domain wrappers and collection-like APIs. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong for API consistency across many contextual types if laws and naming are standardised. |

## Examples

### Mapping over optional configuration

**❌ Negative (rust)**

```rust
fn port_text(port: Option<u16>) -> Option<String> {
    match port {
        Some(value) => Some(format!("port={}", value)),
        None => None,
    }
}
```

**✅ Positive (rust)**

```rust
fn port_text(port: Option<u16>) -> Option<String> {
    port.map(|value| format!("port={}", value))
}
```

*The positive version transforms the present value and lets Option preserve the None case, which is exactly the functor contract.*

## Relationships

**Synergies**

- [Monad](../functional/monad.md) — Monads extend functors with dependent sequencing via flatMap/bind.
- [Option / Maybe](../functional/option-maybe.md) — Option maps a function only when a value is present.
- [Either / Result](../functional/either-result.md) — Result maps success while preserving error context.
- [Map-Filter-Reduce](../functional/map-filter-reduce.md) — Collection map is the everyday functor operation over lists and arrays.

**Alternatives:** [Iterator](../gof-behavioural/iterator.md), [Visitor](../gof-behavioural/visitor.md)

## Applicability tags

- **Languages:** haskell, scala, rust, typescript, clojure
- **Frameworks:** none, rxjs
- **Project types:** library, sdk, web-frontend, backend-service
- **Tags:** map, abstraction, containers

## References

- Saunders Mac Lane, Categories for the Working Mathematician, (1971)

