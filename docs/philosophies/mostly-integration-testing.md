# Write Tests. Not Too Many. Mostly Integration.

> Optimise tests for confidence per unit of effort: write automated tests, avoid wasteful coverage maximalism, and prefer realistic integration flows.

**Discipline:** testing · **Origin:** Guillermo Rauch, Kent C. Dodds · *Write tests. Not too many. Mostly integration.* · (2016)

**Also known as:** Mostly Integration Testing, Testing Trophy maxim

## Description

Mostly integration testing is a pragmatic reaction to both no-test cultures and brittle suites that chase 100 percent unit coverage. Its central claim is economic: tests should buy confidence in the way the software is actually used, so realistic collaboration tests often provide better return than isolated tests of every implementation detail. The maxim still keeps a place for unit tests, static analysis and a few end-to-end journeys, but it asks teams to stop when the marginal confidence of another test is lower than its maintenance cost.

**In practice.** Cover high-value flows with integration tests through public APIs or component boundaries, use unit tests for complex pure logic, add static checks where the language supports them, and reserve browser or full-stack tests for the smallest set of critical journeys.

## Core tenets

- Write automated tests because they are the durable feedback loop for change.
- Do not optimise for total coverage; optimise for useful confidence and low maintenance cost.
- Prefer tests that exercise real collaborations and user-visible behaviour over implementation details.
- Keep end-to-end tests few and valuable because they are expensive and failure diagnosis is slower.

## Key ideas

- **Confidence over coverage** — Coverage can show code was executed, but useful tests demonstrate that important behaviours still work for users.
- **Integration as sweet spot** — In many product applications, tests that exercise multiple real units together catch realistic regressions without the cost of full browser or production-like journeys.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Test Pyramid](../patterns/testing/test-pyramid.md) — Provides a portfolio counterweight so mostly integration does not accidentally become a slow, top-heavy end-to-end suite.
- [Consumer-Driven Contract Testing](../patterns/testing/contract-testing.md) — Gives realistic confidence at service boundaries without relying on brittle integrated environments.
- [Fake Object](../patterns/testing/fake-object.md) — Enables integration-style flow tests with realistic collaborator behaviour while keeping the suite fast and deterministic.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| JavaScript and frontend testing communities | Rauch's maxim and Dodds' follow-up writing popularised a confidence-first test portfolio where integration tests form the largest investment for UI-heavy applications. | primary source | [Write tests. Not too many. Mostly integration.](https://x.com/rauchg/status/807626710350839808) |
| Testing Library ecosystem | Dodds connected the maxim to Testing Library's principle that tests should resemble how software is used, encouraging behavioural integration tests over implementation-detail assertions. | primary source | [Write Tests](https://kentcdodds.com/blog/write-tests) |

**Best for:** frontend-application, full-stack-web-app, product-team, component-library

## Relationships with other philosophies

**Complements:** [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md), [Continuous Delivery & Lean Software](continuous-delivery-lean.md)

**In tension with**

- [Property-Based Thinking](property-based-thinking.md) — A mostly-integration suite can miss algebraic edge cases that are cheaper to express as generated properties at a smaller boundary.

## Criticisms / limits

- Integration is an overloaded term and can mean different boundaries to different teams.
- The advice is most natural for product and UI code; domain-heavy libraries may need more small invariant tests.
- Without discipline, mostly integration can drift into slow, flaky integrated tests.

## References

- [Guillermo Rauch, Write tests. Not too many. Mostly integration., (2016)](https://x.com/rauchg/status/807626710350839808)
- [Kent C. Dodds, Write Tests, (2019)](https://kentcdodds.com/blog/write-tests)
- [Kent C. Dodds, The Testing Trophy and Testing Classifications, (2021)](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

