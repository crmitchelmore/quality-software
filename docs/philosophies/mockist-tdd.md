# Mockist Test-Driven Development

> Drive design outside-in with mocked collaborators, interaction expectations and role-focused interfaces that specify how objects should talk to each other.

**Discipline:** testing · **Origin:** Steve Freeman, Nat Pryce · *Growing Object-Oriented Software, Guided by Tests* · (2009)

**Also known as:** London school TDD, Outside-in TDD, Need-driven development

## Description

Mockist TDD is the London school of test-driven development associated with outside-in design. It begins from user-facing behaviour, then uses mocks to describe the roles and messages required of not-yet-written collaborators. The test verifies interactions as part of the contract, encouraging tell-don't-ask object design and letting collaborator interfaces emerge from client needs before their implementations exist.

**In practice.** Begin from a failing acceptance-level behaviour, introduce mocks for not-yet-built collaborators, name their roles in domain terms, implement each role from its client's expectations, and add contract or integration checks where mock drift would be dangerous.

## Core tenets

- Start with an outside acceptance or user-facing behaviour and work inward one collaborator at a time.
- Mock collaborators with interesting behaviour so tests specify the messages the design requires.
- Prefer interaction verification where the behaviour is a command or collaboration contract.
- Mock roles, not concrete objects; expectations should describe responsibilities and protocols.
- Let interfaces emerge from what their clients need, rather than designing every layer up front.

## Key ideas

- **Outside-in development** — The first tests describe externally visible behaviour, then each new mock expectation becomes a design demand for the next object inward.
- **Behaviour verification** — Correctness is partly defined by the right messages being sent to collaborators, especially for command-style dependencies.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Mock Object](../patterns/testing/mock-object.md) — Mock objects are the central mechanism for expressing collaborator expectations and verifying command interactions.
- [Test Double](../patterns/testing/test-double.md) — The broader double taxonomy helps distinguish mocks from stubs and fakes when designing outside-in tests.
- [Consumer-Driven Contract Testing](../patterns/testing/contract-testing.md) — Contract tests counter mock drift by checking that real providers honour the interactions mocked by consumers.
- [Given-When-Then (BDD)](../patterns/testing/given-when-then.md) — Outside-in work often begins from behaviour scenarios expressed in a shared Given-When-Then form.
- [Arrange-Act-Assert](../patterns/testing/arrange-act-assert.md) — Keeps interaction tests legible even when the arrange phase includes mock expectations.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| London-school object-oriented TDD practice | Freeman and Pryce present a full outside-in workflow in which tests, mocks and acceptance scenarios guide the growth of object-oriented software. | primary source | Growing Object-Oriented Software, Guided by Tests |
| Mock object literature and Fowler's comparison | Fowler's classical versus mockist discussion documents the interaction-based style and its trade-offs, grounding it in the earlier mock object work by Mackinnon, Freeman and Craig. | secondary source | [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) |

## Relationships with other philosophies

**Complements:** [Behaviour-Driven Development](behaviour-driven-development.md), [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md)

**In tension with**

- [Classicist Test-Driven Development](classicist-tdd.md) — Mockist TDD treats interactions as a primary design contract, while classicist TDD usually prefers real collaborators and state-based assertions.

## References

- Steve Freeman and Nat Pryce, Growing Object-Oriented Software, Guided by Tests, (2009)
- Tim Mackinnon, Steve Freeman and Philip Craig, Mock Roles, not Objects, (2004)
- [Martin Fowler, Mocks Aren't Stubs, (2007)](https://martinfowler.com/articles/mocksArentStubs.html)

