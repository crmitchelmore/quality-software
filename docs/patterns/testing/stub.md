# Stub

> Use a simple double that returns predetermined values so the test can drive a branch or scenario deterministically.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** Canned response

## Description

A stub supplies controlled answers to the system under test. Unlike a mock, it does not assert that it was called in a particular way; the test asserts the resulting behaviour. Stubs work best for query-style dependencies such as feature flags, exchange rates, permissions, or clocks, where the dependency answers a question and the unit under test decides what to do next.

**Problem.** Tests need to exercise branches that depend on external data without relying on live systems or complex fake implementations.

**Context.** Use when a collaborator is read-only from the test perspective and a small set of canned responses is enough.

## Consequences / Trade-offs

- Makes branch-driving inputs explicit and deterministic.
- Keeps tests simpler than mocks when interactions are not the behaviour under test.
- Canned answers can be unrealistic; upgrade to a fake or contract test when rules grow.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent for small tests that need deterministic query answers. |
| Medium (≤100k LOC) | ●●●●● 5/5 | A workhorse for service tests; prefer explicit local stubs over shared global fixtures. |
| Large (>100k LOC) | ●●●●○ 4/5 | Useful but should be balanced with integration coverage for the real data sources being stubbed. |

## Examples

### Feature flag branch

**❌ Negative (typescript)**

```typescript
test("uses new pricing", async () => {
  const flags = new RemoteFlagClient(process.env.FLAG_URL!);
  const total = await priceBasket(cart, flags);
  expect(total).toBe(900);
});
```

**✅ Positive (typescript)**

```typescript
test("uses new pricing", async () => {
  const flags = { enabled: async (name: string) => name === "new-pricing" };

  const total = await priceBasket(cart, flags);

  expect(total).toBe(900);
});
```

*The positive test stubs the feature flag answer directly, so the branch is deterministic and the assertion remains about pricing behaviour rather than remote flag availability.*

## Relationships

**Synergies**

- [Test Double](../testing/test-double.md) — Stub is one of the simplest concrete test doubles.
- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — Stub data belongs in Arrange so the Act remains a single behaviour trigger.
- [Test Data Builder](../testing/test-data-builder.md) — Builders can create rich stub return values without noisy literals.

**Alternatives:** [Mock Object](../testing/mock-object.md), [Fake Object](../testing/fake-object.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, microservices, modular-monolith
- **Tags:** canned-response, determinism, unit-testing

