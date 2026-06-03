# Mutation-Driven Testing

> Judge test quality by whether the suite kills deliberate code mutations, using mutation score as a stronger signal than line coverage alone.

**Discipline:** testing · **Origin:** Richard Lipton, Henry Coles · *Fault Diagnosis of Computer Programs* · (1971)

**Also known as:** Mutation Testing Driven Quality, Mutation Score

## Description

Mutation-driven testing asks whether tests detect faults, not merely whether they execute code. A mutation tool makes small semantic changes to production code, such as changing comparisons, constants or branch outcomes, and reruns the test suite. Mutants killed by failing tests demonstrate fault detection; surviving mutants reveal missing assertions, weak specifications or untested behaviours. The philosophy treats mutation score as a feedback mechanism for improving tests, especially where correctness matters and simple coverage metrics have become misleading.

**In practice.** Run PIT, Stryker or an equivalent tool first on critical modules or changed lines. Review surviving mutants, add meaningful behavioural assertions, exclude true equivalent mutants narrowly, and avoid turning the score into a vanity metric detached from defect risk.

## Core tenets

- Coverage is only evidence of execution; mutation score measures fault-detection strength.
- Surviving mutants are actionable feedback about underspecified behaviours or weak assertions.
- Use mutation testing incrementally on changed or high-risk code so the cost remains practical.
- Treat equivalent mutants and metric gaming as analysis tasks, not as reasons to ignore the signal.

## Key ideas

- **Mutant killed** — A deliberately changed version of the code is killed when at least one test fails, proving the suite can detect that class of fault.
- **Surviving mutant** — If all tests still pass, the suite either lacks the right assertion or the mutation is equivalent to the original behaviour.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Mutation Testing](../patterns/testing/mutation-testing.md) — Mutation testing is the core practice: inject faults and measure the mutation score to gauge how thoroughly the suite actually exercises behaviour.
- [Arrange-Act-Assert](../patterns/testing/arrange-act-assert.md) — Clear assertions make surviving mutants easier to interpret and fix.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Java projects using PIT | PIT presents mutation testing as a practical tool for measuring test-suite fault detection and reports surviving mutants that ordinary coverage metrics would miss. | primary source | [PIT Mutation Testing](https://pitest.org) |
| JavaScript and TypeScript projects using Stryker | Stryker applies mutation testing to modern JavaScript and TypeScript codebases, producing mutation scores and survivor reports for CI feedback. | primary source | [Stryker Mutator](https://stryker-mutator.io) |

**Best for:** library, financial-calculation, safety-critical-module, legacy-refactoring, domain-model

## Relationships with other philosophies

**Complements:** [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md), [Property-Based Thinking](property-based-thinking.md), [Risk-Based Testing](risk-based-testing.md)

**In tension with**

- [Write Tests. Not Too Many. Mostly Integration.](mostly-integration-testing.md) — Mutation testing is most efficient against fast, focused suites; broad integration tests can make mutation runs too slow unless scoped carefully.

## Criticisms / limits

- Mutation runs can be expensive without incremental or scoped execution.
- Equivalent mutants require human judgement and can create noisy reports.
- Teams can game mutation thresholds with trivial assertions unless reviews focus on behaviour.

## References

- Richard Lipton, Fault Diagnosis of Computer Programs, (1971)
- [Henry Coles and contributors, PIT Mutation Testing](https://pitest.org)
- [Stryker contributors, Stryker Mutator](https://stryker-mutator.io)
- [Ham Vocke, Martin Fowler, Practical Test Pyramid, (2018)](https://martinfowler.com/articles/practical-test-pyramid.html)

