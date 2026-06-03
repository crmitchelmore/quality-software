# Tail Recursion

> Structure recursion so the recursive call is the final action, allowing stack-safe optimisation or straightforward loop conversion.

**Scale:** implementation · **Altitude:** low · **Category:** functional · **Maturity:** time-tested

**Also known as:** Tail Call Recursion

## Description

Tail Recursion rewrites a recursive algorithm so it carries accumulated state as parameters and returns the recursive call directly. In runtimes with tail-call optimisation, this runs in constant stack space; elsewhere, the same shape can be safely translated to an explicit loop. The pattern is most useful for structurally recursive algorithms in functional code.

**Problem.** Naive recursion can overflow the call stack or retain pending operations for every element in a large input.

**Context.** Use for recursive traversal, folds, parsers, and algorithms over lists/trees when the language optimises tail calls or when you want a clear route to loop conversion.

## Consequences / Trade-offs

- Preserves recursive structure while avoiding unbounded stack growth in supporting runtimes.
- Makes accumulator state explicit and often easier to test.
- Can be less direct than the mathematical definition for small inputs.
- Not all runtimes optimise tail calls; verify language behaviour before relying on it.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational; loops may be clearer in languages without tail-call guarantees. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for recursive functional modules and parsers when compiler support exists. |
| Large (>100k LOC) | ●●●●○ 4/5 | Important for stack safety in functional services, but enforce with compiler annotations or tests. |

## Examples

### Summing a list stack-safely

**❌ Negative (scala)**

```scala
def sum(values: List[Int]): Int =
  values match {
    case Nil => 0
    case head :: tail => head + sum(tail)
  }
```

**✅ Positive (scala)**

```scala
import scala.annotation.tailrec

@tailrec
def sum(values: List[Int], total: Int = 0): Int =
  values match {
    case Nil => total
    case head :: tail => sum(tail, total + head)
  }
```

*The positive version has no pending addition after the recursive call, and the @tailrec annotation makes the compiler reject regressions that would reintroduce stack growth.*

## Relationships

**Synergies**

- [Map-Filter-Reduce](../functional/map-filter-reduce.md) — A tail-recursive fold is the primitive beneath many reduce operations.
- [Persistent Data Structure](../functional/persistent-data-structure.md) — Recursive traversal over persistent lists/trees often needs tail-recursive helpers for stack safety.
- [Guard Clause (Early Return)](../implementation/guard-clause.md) — Base-case guard clauses make recursive termination conditions obvious.
- [Iterator](../gof-behavioural/iterator.md) — In non-TCO runtimes, an iterator or loop may be the safer alternative.

**Alternatives:** [Iterator](../gof-behavioural/iterator.md), [Fork-Join](../concurrency/fork-join.md), [Map-Filter-Reduce](../functional/map-filter-reduce.md)

## Applicability tags

- **Languages:** scala, haskell, elixir, clojure, haskell, rust
- **Frameworks:** none
- **Project types:** library, data-pipeline, backend-service, cli-tool
- **Tags:** recursion, stack-safety, algorithms

## References

- Harold Abelson, Gerald Jay Sussman, Structure and Interpretation of Computer Programs, (1985)

