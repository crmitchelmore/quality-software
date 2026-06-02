# Mock Object

> Use a test double with explicit interaction expectations when the behaviour is the collaboration itself rather than a returned state.

**Scale:** implementation · **Category:** testing · **Maturity:** time-tested

**Also known as:** Mock

## Description

A mock object verifies that the system under test sends the right command to a collaborator: for example publishing an event, charging a gateway, or invalidating a cache. It is strongest for command-style ports where there is no local state to inspect. Mocks should specify behaviourally significant interactions only; asserting every internal call couples the test to implementation and makes refactoring painful.

**Problem.** Some behaviours are observable only through calls to another component, but verifying every internal call makes tests brittle.

**Context.** Use for outbound commands and side-effect boundaries whose contract is a call, not for ordinary query collaborators where returned state can be asserted.

## Consequences / Trade-offs

- Makes side-effect contracts explicit and fast to verify.
- Can precisely check security-sensitive or money-moving commands.
- Over-specified mocks break during harmless refactors; prefer stubs/fakes when state assertions are clearer.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for side effects but easy to overuse in small codebases where state assertions are simpler. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit around ports, queues, email, and payment boundaries with clear interaction contracts. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful, but large systems need contract tests and fakes to prevent mock-driven fantasy integrations. |

## Examples

### JUnit payment command

**❌ Negative (java)**

```java
@Test
void chargesCustomer() {
  PaymentGateway gateway = mock(PaymentGateway.class);
  Checkout checkout = new Checkout(gateway);

  checkout.pay(new Order("o1", Money.usd(42)));

  verify(gateway).connect();
  verify(gateway).setCurrency("USD");
  verify(gateway).charge("o1", 4200);
  verify(gateway).disconnect();
}
```

**✅ Positive (java)**

```java
@Test
void chargesCustomer() {
  PaymentGateway gateway = mock(PaymentGateway.class);
  Checkout checkout = new Checkout(gateway);

  checkout.pay(new Order("o1", Money.usd(42)));

  verify(gateway).charge("o1", Money.usd(42));
  verifyNoMoreInteractions(gateway);
}
```

*The positive mock verifies the business interaction only: the gateway is asked to charge the order. It avoids coupling the test to connection-management details that may legitimately change.*

## Relationships

**Synergies**

- [Test Double](../testing/test-double.md) — Mock Object is a specialised test double focused on interaction verification.
- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — Expectations are arranged before the act and verified in the assert phase.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Provider or consumer contracts ensure mocked remote interactions still match reality.

**Conflicts with:** [Fake Object](../testing/fake-object.md)

**Alternatives:** [Stub](../testing/stub.md), [Fake Object](../testing/fake-object.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, microservices, modular-monolith
- **Tags:** interaction-testing, side-effects, collaboration

