# Behaviour-Driven Development

> Express tests as shared descriptions of behaviour, using ubiquitous language and Given-When-Then scenarios to turn acceptance criteria into executable specifications.

**Discipline:** testing · **Origin:** Dan North · *Introducing BDD* · (2006)

**Also known as:** BDD, Behaviour-driven design

## Description

Behaviour-Driven Development reframes TDD around behaviour rather than tests. Dan North observed that the word "test" led teams to focus on implementation verification instead of the next useful behaviour. BDD uses sentence-like names, ubiquitous language and Given-When-Then scenarios so product, testing and engineering participants can agree on examples that become executable specifications.

**In practice.** Collaborate on concrete examples before building a story, write scenarios in Given-When-Then form, automate only examples that provide lasting confidence, and use lower-level tests to support the same behaviour without duplicating every acceptance scenario through the UI.

## Core tenets

- Describe what the system should do next in language the whole team can understand.
- Use Given-When-Then to connect context, action and observable outcome.
- Treat acceptance criteria as executable specifications, not separate documents to be reinterpreted.
- Work outside-in from business behaviour towards supporting implementation.
- Name examples so failures explain the behaviour that has regressed.

## Key ideas

- **Ubiquitous language** — Examples use domain terms shared by customers, testers and developers, reducing translation loss between requirements and implementation.
- **Executable specification** — A scenario is both a requirement example and an automated check, keeping documentation and behaviour aligned.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Given-When-Then (BDD)](../patterns/testing/given-when-then.md) — Given-When-Then is the scenario grammar that makes behaviour examples readable and executable.
- [Arrange-Act-Assert](../patterns/testing/arrange-act-assert.md) — AAA provides the same three-phase structure for lower-level examples that do not need Gherkin.
- [Page Object](../patterns/testing/page-object.md) — Keeps automated acceptance tests expressed through user-visible capabilities rather than UI implementation details.
- [Object Mother](../patterns/testing/object-mother.md) — Named domain fixtures can make examples read in the ubiquitous language when the catalogue of canonical cases is small.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| JBehave and early BDD practice | Dan North introduced BDD through the should-style naming shift and JBehave, showing how behaviour language helped teams understand what to specify next. | primary source | [Introducing BDD](https://dannorth.net/blog/introducing-bdd/) |
| Specification by Example and Given-When-Then practice | Fowler documents Given-When-Then as a readable structure for examples and connects executable examples with specification-by-example practice. | secondary source | [GivenWhenThen](https://martinfowler.com/bliki/GivenWhenThen.html) |

## Relationships with other philosophies

**Complements:** [Mockist Test-Driven Development](mockist-tdd.md), [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md), [Classicist Test-Driven Development](classicist-tdd.md)

## References

- [Dan North, Introducing BDD, (2006)](https://dannorth.net/blog/introducing-bdd/)
- [Martin Fowler, GivenWhenThen](https://martinfowler.com/bliki/GivenWhenThen.html)
- [Martin Fowler, SpecificationByExample](https://martinfowler.com/bliki/SpecificationByExample.html)

