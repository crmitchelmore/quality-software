# Dummy Object

> Pass a deliberately inert placeholder to satisfy a parameter that the test path must never use.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** Dummy, Placeholder Object

## Description

A Dummy Object exists only to fill an argument slot required by an API. It has no meaningful behaviour for the scenario and should fail loudly if the code unexpectedly calls it. Dummies keep irrelevant setup out of the test, but using them widely can reveal an interface that asks for too many collaborators.

**Problem.** A constructor or method requires a collaborator that is irrelevant to the behaviour under test.

**Context.** Use when the test path provably does not use the parameter and a null value would be ambiguous or unsafe.

## Consequences / Trade-offs

- Signals that a collaborator is intentionally irrelevant to this scenario.
- Can expose over-wide APIs that should be split or simplified.
- If the dummy silently absorbs calls, it hides bugs; make unexpected use fail clearly.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | A simple way to remove irrelevant setup in small APIs. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Helpful, though repeated need for dummies should trigger interface review. |
| Large (>100k LOC) | ●●○○○ 2/5 | Overuse in large suites often signals constructors or service boundaries that are too broad. |

## Examples

### Unused audit sink

**❌ Negative (java)**

```java
var service = new PricingService(null);
assertEquals(90, service.price(goldCustomer));
```

**✅ Positive (java)**

```java
var service = new PricingService(new FailingAuditSink());
assertEquals(90, service.price(goldCustomer));

class FailingAuditSink implements AuditSink {
  public void record(Event e) { throw new AssertionError("unused"); }
}
```

*The dummy makes the unused collaborator explicit and fails if the implementation unexpectedly starts depending on it.*

## Relationships

**Synergies**

- [Test Double](../testing/test-double.md) — Dummy is the simplest member of the test double family.
- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — Dummies minimise irrelevant arrange detail so the act and assertion remain visible.
- [Humble Object](../testing/humble-object.md) — Extracted plain objects often need fewer framework parameters and therefore fewer dummies.

**Conflicts with:** [Fake Object](../testing/fake-object.md)

**Alternatives:** [Stub](../testing/stub.md), [Fake Object](../testing/fake-object.md), [Test Data Builder](../testing/test-data-builder.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** none, nodejs, spring-boot, dotnet, fastapi
- **Project types:** library, web-api, backend-service, monolith, modular-monolith
- **Tags:** test-double, placeholder, fixture-simplification

