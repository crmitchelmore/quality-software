# Mutation Testing

> Inject small faults into production code and measure whether the test suite detects them through the mutation score.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** established

**Also known as:** Mutation-Testing-Driven Quality, Fault-Based Testing

## Description

Mutation Testing tools change production code in small ways, such as flipping a comparison or removing a statement, then rerun tests. A killed mutant proves at least one test would catch that fault; a surviving mutant exposes a weak or missing assertion. Mutation score is more meaningful than line coverage because it measures fault detection rather than mere execution.

**Problem.** Coverage reports show code was executed but not whether tests would fail when behaviour is wrong.

**Context.** Use after a meaningful test suite exists, especially for libraries, pricing rules, parsers, safety-critical calculations, and legacy refactoring safety nets.

## Consequences / Trade-offs

- Reveals assertion-free or under-specified tests that coverage misses.
- Provides a rigorous quality signal for critical code paths.
- Can be computationally expensive and produces equivalent mutants that require triage.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Often overkill for tiny apps but valuable for critical functions. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good PR-scoped quality gate for mature test suites. |
| Large (>100k LOC) | ●●●●○ 4/5 | High value on critical modules, but needs incremental execution to control cost. |

## Examples

### Weak assertion exposed by mutation

**❌ Negative (python)**

```python
def test_discount():
    result = apply_discount(100, "gold")
    assert result is not None  # mutants survive
```

**✅ Positive (python)**

```python
def test_discount():
    assert apply_discount(100, "gold") == 90
    assert apply_discount(100, "standard") == 100
```

*The positive assertions kill mutations in the discount calculation; the negative test only proves the function returns something.*

## Relationships

**Synergies**

- [Property-Based Testing](../testing/property-based-testing.md) — Strong properties kill many mutants across generated inputs.
- [Golden Master (Approval)](../testing/golden-master.md) — Characterisation suites can be strengthened by checking whether behavioural mutations are detected.
- [Parameterised Test](../testing/parameterised-test.md) — Explicit boundary rows often kill surviving comparison and constant mutations.

**Conflicts with:** [Snapshot Testing](../testing/snapshot-testing.md)

**Alternatives:** [Property-Based Testing](../testing/property-based-testing.md), [Fuzzing](../testing/fuzzing.md), [Golden Master (Approval)](../testing/golden-master.md)

## Applicability tags

- **Languages:** language-agnostic, java, javascript, typescript, python, csharp
- **Frameworks:** none, nodejs, spring-boot, dotnet
- **Project types:** library, backend-service, web-api, safety-critical, high-throughput
- **Tags:** mutation-score, coverage-quality, pitest, stryker

