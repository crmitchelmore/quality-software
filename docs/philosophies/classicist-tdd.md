# Classicist Test-Driven Development

> Drive design with red-green-refactor tests that prefer state verification and real collaborators, using doubles only where dependencies are awkward.

**Discipline:** testing · **Origin:** Kent Beck · *Test-Driven Development by Example* · (2002)

**Also known as:** Detroit school TDD, Chicago school TDD, Classical TDD

## Description

Classicist TDD is the Detroit or Chicago school of test-driven development. It uses the red-green-refactor loop to design behaviour incrementally, but generally lets the object under test collaborate with real, fast, deterministic neighbours. Tests primarily verify resulting state and observable outcomes. Test doubles are still useful, but mainly at awkward boundaries such as time, networks, databases, non-determinism or expensive infrastructure.

**In practice.** Write small behavioural examples, use real domain collaborators by default, replace only slow or non-deterministic collaborators with stubs or fakes, and refactor once the test is green without preserving accidental call sequences.

## Core tenets

- Write the next failing test before implementation, then make it pass and refactor safely.
- Prefer real collaborators when they are fast, deterministic and part of the same design surface.
- Verify state and observable outcomes rather than internal message sequences.
- Use test doubles at awkward boundaries, not as the default for every collaborator.
- Treat tests as design feedback about interface usability and coupling.

## Key ideas

- **Sociable tests** — The system under test can collaborate with real domain objects, which increases confidence that the behaviour works as a composed design.
- **State verification** — The assertion focuses on the final observable result, leaving implementation steps free to change during refactoring.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Arrange-Act-Assert](../patterns/testing/arrange-act-assert.md) — Makes red-green-refactor examples readable by separating fixture setup, exercised behaviour and state assertion.
- [Fake Object](../patterns/testing/fake-object.md) — Keeps awkward infrastructure out of tests while preserving real behaviour behind a simplified implementation.
- [Stub](../patterns/testing/stub.md) — Supplies deterministic answers from query-style dependencies without asserting internal calls.
- [Test Data Builder](../patterns/testing/test-data-builder.md) — Keeps sociable tests focused on relevant domain variation while hiding incidental fixture detail.
- [Test Double](../patterns/testing/test-double.md) — Provides the vocabulary for choosing a double only when a real collaborator would make the test slow, unreliable or hard to control.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| xUnit and Extreme Programming practice | Beck's TDD by Example and XP work made red-green-refactor, programmer tests and refactoring safety a mainstream agile development discipline. | primary source | Test-Driven Development by Example |
| Fowler's classical TDD description | Fowler documents classical TDD as the style that usually avoids mocks unless they are necessary, contrasting it with mockist test-driven development. | secondary source | [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) |

## Relationships with other philosophies

**Complements:** [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md), [Behaviour-Driven Development](behaviour-driven-development.md)

**In tension with**

- [Mockist Test-Driven Development](mockist-tdd.md) — Classicist TDD prefers state verification and real collaborators, while mockist TDD uses mock expectations to specify collaborator interactions outside-in.

## References

- Kent Beck, Test-Driven Development by Example, (2002)
- [Martin Fowler, TestDrivenDevelopment, (2023)](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Martin Fowler, Mocks Aren't Stubs, (2007)](https://martinfowler.com/articles/mocksArentStubs.html)

