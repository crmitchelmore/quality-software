# Testing Trophy

> Weight test investment towards integration tests, with static analysis beneath them and only a few end-to-end tests above, to maximise confidence for frontend applications.

**Discipline:** testing · **Origin:** Kent C. Dodds · *The Testing Trophy and Testing Classifications* · (2021)

**Also known as:** Static-unit-integration-e2e trophy

## Description

The Testing Trophy reframes automated test portfolio design for JavaScript and frontend-heavy systems. It counts static analysis as a cheap confidence layer, keeps unit tests useful but not dominant, makes integration tests the largest investment because they exercise collaborating UI and application units, and reserves end-to-end tests for a small number of critical user journeys.

**In practice.** Use TypeScript and linting as a baseline, write targeted unit tests for complex pure logic, make integration tests the default for component and application behaviour, and keep browser end-to-end tests focused on the most valuable happy paths and high-risk flows.

## Core tenets

- Confidence is the goal; coverage percentages and layer quotas are secondary signals.
- Static analysis such as TypeScript and linting is a legitimate, cheap test layer.
- Integration tests usually give the best confidence-to-cost ratio for UI-heavy codebases.
- Unit tests are valuable for isolated logic, but should not dominate the portfolio by default.
- End-to-end tests should cover the most important journeys, not every branch or variant.

## Key ideas

- **Static analysis as testing** — Types and lint rules catch large classes of errors before runtime, so they form the low-cost base of the trophy.
- **Mostly integration** — Tests that exercise realistic collaboration between components, state, routing and API seams better resemble how users experience frontend software.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Given-When-Then (BDD)](../patterns/testing/given-when-then.md) — Integration tests are strongest when they describe user-visible scenarios rather than internal component wiring.
- [Page Object](../patterns/testing/page-object.md) — Keeps the small end-to-end layer expressed through user capabilities rather than DOM details.
- [Test Pyramid](../patterns/testing/test-pyramid.md) — The trophy deliberately adapts pyramid economics by adding static analysis and widening the integration layer for frontend systems.
- [Arrange-Act-Assert](../patterns/testing/arrange-act-assert.md) — Gives integration and unit tests a readable structure that separates setup, behaviour and expected outcome.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| JavaScript and Testing Library ecosystem | Kent C. Dodds used the trophy to explain why frontend teams should count static checks, prioritise tests that resemble software use, and avoid over-investing in implementation-detail unit tests. | primary source | [The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) |

## Relationships with other philosophies

**Complements:** [Behaviour-Driven Development](behaviour-driven-development.md), [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md)

**In tension with**

- [Testing Honeycomb](testing-honeycomb.md) — Both favour integration confidence, but the trophy is tuned for frontend applications while the honeycomb is tuned for microservices whose deployment unit is the service.

## References

- [Kent C. Dodds, The Testing Trophy and Testing Classifications, (2021)](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Kent C. Dodds, Write tests. Not too many. Mostly integration., (2019)](https://kentcdodds.com/blog/write-tests)

