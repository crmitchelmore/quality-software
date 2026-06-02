# Monad

> Sequence computations wrapped in a context, where each step can depend on the previous unwrapped value while preserving the context.

**Scale:** design · **Category:** functional · **Maturity:** time-tested

**Also known as:** Bind, FlatMap

## Description

A Monad is a type constructor with operations to put a value into a context and chain context-returning functions. Option carries possible absence, Either carries failure, Future carries asynchrony, and State carries evolving state. The practical value is uniform sequencing: flatMap/bind handles the plumbing while code focuses on the next domain step.

**Problem.** Contextual computations such as absence, failure, async work, or state transitions create nested conditionals and unwrapping boilerplate when composed manually.

**Context.** Use when a language or library provides lawful monadic types and multiple dependent steps share the same context, especially parsing, validation, asynchronous workflows, and error-aware domain pipelines.

## Consequences / Trade-offs

- Flattens nested contextual operations into a linear pipeline.
- Makes effect or failure context explicit in types.
- Requires team familiarity; abstract monad vocabulary can obscure simple business code.
- Different monads compose imperfectly without transformers or explicit boundary conversion.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary as a named abstraction unless the language makes it idiomatic. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Powerful for typed error, async, and parser pipelines in teams fluent with the style. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable in strongly typed functional systems, but standardise on a small set of monads and naming conventions. |

## Examples

### Sequencing optional lookups

**❌ Negative (scala)**

```scala
def cityFor(userId: UserId): Option[String] = {
  findUser(userId) match {
    case Some(user) =>
      findAddress(user.addressId) match {
        case Some(address) => Some(address.city)
        case None => None
      }
    case None => None
  }
}
```

**✅ Positive (scala)**

```scala
def cityFor(userId: UserId): Option[String] =
  for {
    user <- findUser(userId)
    address <- findAddress(user.addressId)
  } yield address.city
```

*The positive version lets Option handle absence at each step, keeping the dependent lookup flow linear and eliminating repeated None plumbing.*

## Relationships

**Synergies**

- [Functor](../functional/functor.md) — Every monad is also a functor; map handles pure transformations inside the context.
- [Either / Result](../functional/either-result.md) — Either/Result is a common monad for fail-fast typed error pipelines.
- [Option / Maybe](../functional/option-maybe.md) — Option/Maybe is a common monad for absence-aware pipelines without null checks.
- [Function Composition](../functional/function-composition.md) — Kleisli composition chains functions that return monadic values.

**Alternatives:** [Guard Clause (Early Return)](../implementation/guard-clause.md), [Fail Fast](../implementation/fail-fast.md), [Chain of Responsibility](../gof-behavioural/chain-of-responsibility.md)

## Applicability tags

- **Languages:** haskell, scala, rust, typescript, clojure
- **Frameworks:** none
- **Project types:** library, sdk, backend-service, data-pipeline
- **Tags:** abstraction, sequencing, effects

## References

- Philip Wadler, Monads for functional programming, (1995)

