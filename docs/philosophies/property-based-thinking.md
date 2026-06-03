# Property-Based Thinking

> Specify general properties and invariants, let generators search the input space, and shrink any counterexample to the smallest reproducible failure.

**Discipline:** testing · **Origin:** Koen Claessen, John Hughes · *QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs* · (2000)

**Also known as:** Property-Based Testing, QuickCheck lineage

## Description

Property-based thinking changes testing from enumerating remembered examples to specifying rules that should hold for every valid input. The team describes invariants, algebraic laws, round trips, ordering guarantees or state-machine rules, then uses generators to create many concrete cases. When a property fails, shrinking turns the random failure into a minimal example that developers can understand and fix. The philosophy rewards clear domain invariants and deterministic code because tests become executable statements of what must never be violated.

**In practice.** Start with laws such as round trips, idempotence, ordering, conservation of money, parser stability or state-machine transitions. Build generators that create valid domain objects, keep seeds in CI output, and add example tests for important named cases that properties do not explain well.

## Core tenets

- Describe domain properties and invariants rather than only hand-picked examples.
- Use generators to explore normal, boundary and surprising inputs automatically.
- Record seeds and shrink failures so every discovered counterexample is reproducible and small.
- Treat weak properties as a design smell; a property should encode meaningful domain knowledge.

## Key ideas

- **Generative search** — The framework supplies many concrete inputs from a generator, widening the case space beyond what a developer would manually remember.
- **Shrinking** — A failing input is reduced to a smaller equivalent failure so the bug is easier to diagnose and keep as a regression test.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Property-Based Testing](../patterns/testing/property-based-testing.md) — This is the direct implementation pattern: define properties, generate inputs and shrink failures into minimal counterexamples.
- [Arrange-Act-Assert](../patterns/testing/arrange-act-assert.md) — Even generated tests benefit from a clear setup, operation and property assertion structure.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Haskell QuickCheck ecosystem | Claessen and Hughes demonstrated a lightweight library for randomly testing Haskell properties, establishing the generator-and-shrinker lineage copied by later tools. | primary source | [QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs](https://dl.acm.org/doi/10.1145/351240.351266) |
| Python Hypothesis users | Hypothesis brought property-based testing to Python with explicit generation, shrinking and reproducible examples for mainstream application code. | primary source | [Hypothesis documentation](https://hypothesis.readthedocs.io) |

**Best for:** parser, serializer, validator, financial-calculation, state-machine

## Relationships with other philosophies

**Complements:** [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md), [Design by Contract](design-by-contract.md)

**In tension with**

- [Write Tests. Not Too Many. Mostly Integration.](mostly-integration-testing.md) — Property-based thinking often pays off at deterministic function or model boundaries, while a mostly-integration strategy may under-invest in those smaller invariant checks.

## Criticisms / limits

- Meaningful properties are harder to invent than examples and require domain understanding.
- Poor generators can miss important regions of the input space or create unrealistic data.
- Stateful workflows need careful modelling before property-based tests remain understandable.

## References

- [Koen Claessen, John Hughes, QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs, (2000)](https://dl.acm.org/doi/10.1145/351240.351266)
- [Hypothesis contributors, Hypothesis documentation](https://hypothesis.readthedocs.io)
- [Hillel Wayne, Property Testing is not Fuzz Testing](https://www.hillelwayne.com/post/property-testing-is-not-fuzz-testing/)

