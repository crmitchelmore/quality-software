# Sociable and Solitary Tests

> Choose deliberately between tests that use real fast collaborators and tests that isolate the subject with doubles.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** Sociable Unit Test, Solitary Unit Test, Classicist vs Mockist Unit Tests

## Description

Fowler and Jay Fields distinguish sociable unit tests, which let the subject collaborate with real in-process objects, from solitary unit tests, which replace collaborators with doubles. Sociable tests often give more design freedom and confidence; solitary tests isolate failures and can specify outbound interactions. The pattern is the explicit choice, not treating one style as universally correct.

**Problem.** Teams argue about whether unit tests may use real collaborators, leading to dogmatic over-mocking or overly broad slow tests.

**Context.** Use when defining test strategy for domain logic, application services, and collaborator-heavy code where both confidence and failure localisation matter.

## Consequences / Trade-offs

- Makes collaborator choices intentional and reviewable.
- Encourages real collaborators when they are fast and deterministic.
- Supports doubles for slow, non-deterministic, external, or behaviourally significant boundaries.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Useful vocabulary that prevents premature over-mocking. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent strategy distinction for teams balancing confidence and isolation. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at scale when documented in testing guidelines and paired with boundary patterns. |

## Examples

### Real domain collaborator vs slow boundary

**❌ Negative (language-agnostic)**

```language-agnostic
tax_rules = mock()
expect(tax_rules.rate_for("GB")).and_return(0.20)
assert checkout.total(order, tax_rules) == 120
```

**✅ Positive (language-agnostic)**

```language-agnostic
tax_rules = RealTaxRules.standard()
assert checkout.total(order, tax_rules) == 120

# Still replace slow external gateways with doubles.
```

*A real deterministic domain collaborator gives more confidence than a mock; doubles remain appropriate at slow or external boundaries.*

## Relationships

**Synergies**

- [Fake Object](../testing/fake-object.md) — Fakes enable sociable tests without external infrastructure.
- [Stub](../testing/stub.md) — Stubs support solitary tests for query-style dependencies.
- [Mock Object](../testing/mock-object.md) — Mocks support solitary interaction tests for command-style collaborators.

**Conflicts with:** [Test Double](../testing/test-double.md)

**Alternatives:** [Hexagonal Test Boundaries](../testing/hexagonal-test-boundaries.md), [Mock Object](../testing/mock-object.md), [Fake Object](../testing/fake-object.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, python, typescript, javascript
- **Frameworks:** none, nodejs, spring-boot, dotnet, django, fastapi
- **Project types:** library, web-api, backend-service, monolith, modular-monolith
- **Tags:** unit-testing, classicist, mockist, collaborators

