# Risk-Based Testing

> Allocate test effort by risk and value, concentrating depth where probability multiplied by impact is highest instead of spreading tests uniformly.

**Discipline:** testing · **Origin:** James Bach, Rex Black, Michael Bolton · *Risk-based and context-driven testing tradition* · 1990s-2000s

**Also known as:** Value-Based Testing

## Description

Risk-based testing treats testing as a scarce resource allocation problem. Since exhaustive testing is impossible, the team identifies what could fail, estimates likelihood and impact, and spends the most design, automation and exploratory effort where failures would hurt users, safety, revenue or trust. Low-impact stable areas may receive lighter coverage by explicit choice. The philosophy fits both traditional QA and continuous delivery when risk analysis is kept visible and revisited as the product and architecture change.

**In practice.** Maintain a lightweight risk register or risk map, tag automated tests by risk area, strengthen coverage after production defects, and use exploratory sessions for high-risk behaviours where a test oracle is difficult to encode.

## Core tenets

- Identify product, technical, safety, security and business risks before choosing test depth.
- Prioritise scenarios by probability of failure multiplied by impact of failure.
- Make accepted under-testing explicit rather than pretending all areas receive equal confidence.
- Revisit the risk model when incidents, architecture changes or new usage patterns alter exposure.

## Key ideas

- **Risk exposure** — Testing effort follows the expected harm of failure, not the number of lines of code or the ease of automating a path.
- **Context-driven judgement** — Test choices depend on product context, domain expertise and observed failures rather than fixed universal ratios.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Test Pyramid](../patterns/testing/test-pyramid.md) — Helps allocate risk coverage across cheap and expensive layers instead of overusing end-to-end tests for every scenario.
- [Given-When-Then (BDD)](../patterns/testing/given-when-then.md) — Makes high-risk business scenarios explicit and reviewable with stakeholders.
- [Consumer-Driven Contract Testing](../patterns/testing/contract-testing.md) — Targets high-impact service compatibility risks before provider or consumer deployments.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| ISTQB testing curriculum and certification practice | Risk-based testing is embedded as a standard approach for prioritising test analysis, design and execution when exhaustive testing is not possible. | secondary source | [ISTQB Foundation Level Syllabus](https://www.istqb.org/certifications/certified-tester-foundation-level) |
| Context-driven testing practice | Bach and Bolton's rapid software testing tradition uses risk and context to guide exploratory and scripted testing effort rather than applying a single universal process. | primary source | [Risk-Based Testing](https://www.satisfice.com/articles/risk-based-testing) |

**Best for:** regulated-system, safety-critical-system, fintech, large-product-suite, legacy-modernisation

## Relationships with other philosophies

**Complements:** [Continuous Delivery & Lean Software](continuous-delivery-lean.md), [Write Tests. Not Too Many. Mostly Integration.](mostly-integration-testing.md)

**In tension with**

- [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) — TDD encourages testing each next behaviour as part of design, while risk-based testing may deliberately leave low-impact behaviours with lighter automated coverage.

## Criticisms / limits

- Risk scoring is subjective and can be distorted by missing domain knowledge or organisational incentives.
- It says where to test more than how to design the tests.
- Informal risk-based testing can become invisible intuition unless risks are documented and reviewed.

## References

- Rex Black, Critical Testing Processes, (2003)
- [James Bach, Risk-Based Testing](https://www.satisfice.com/articles/risk-based-testing)
- [ISTQB, ISTQB Foundation Level Syllabus](https://www.istqb.org/certifications/certified-tester-foundation-level)
- [Martin Fowler, TestPyramid, (2012)](https://martinfowler.com/bliki/TestPyramid.html)

