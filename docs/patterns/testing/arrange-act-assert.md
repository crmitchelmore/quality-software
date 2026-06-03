# Arrange-Act-Assert

> Structure each test into setup, one behaviour trigger, and observable assertions so the reader can see cause and effect immediately.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** Given-When-Then at test level

## Description

Arrange-Act-Assert divides a test into three explicit phases: arrange the fixture and collaborators, act by invoking exactly the behaviour under test, then assert the externally visible outcome. The pattern is not just formatting; it disciplines tests to have one reason to fail, discourages incidental assertions during setup, and makes later refactoring safer because failures point to the behaviour being exercised rather than to hidden test wiring.

**Problem.** Tests that mix fixture construction, behaviour execution, and checks become hard to scan and fail for ambiguous reasons.

**Context.** Use for unit, component, and integration tests where a single behaviour or contract should be demonstrated clearly.

## Consequences / Trade-offs

- Improves readability and reviewability by making the tested behaviour explicit.
- Encourages one meaningful act per test and reduces mystery failures from setup code.
- Can feel artificial for long scenario tests; combine with Given-When-Then when business language matters.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Cheap and valuable even for tiny libraries; it is mostly naming and ordering discipline. |
| Medium (≤100k LOC) | ●●●●● 5/5 | A default testing convention that keeps growing suites readable across contributors. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still useful, but large suites also need higher-level scenario organisation and good fixtures. |

## Examples

### Jest service test with one act

**❌ Negative (javascript)**

```javascript
test("activates a user", async () => {
  const repo = new InMemoryUserRepository();
  const user = await repo.save({ email: "a@example.com", active: false });
  expect(user.active).toBe(false);
  await new ActivateUser(repo).run(user.id);
  const saved = await repo.find(user.id);
  expect(saved.active).toBe(true);
  expect(await repo.count()).toBe(1);
});
```

**✅ Positive (javascript)**

```javascript
test("activates a user", async () => {
  // arrange
  const repo = new InMemoryUserRepository();
  const user = await repo.save({ email: "a@example.com", active: false });
  const service = new ActivateUser(repo);

  // act
  await service.run(user.id);

  // assert
  await expect(repo.find(user.id)).resolves.toMatchObject({ active: true });
});
```

*The positive test separates fixture setup from the single behaviour trigger and the outcome check; it does not assert incidental setup details that would make the failure less diagnostic.*

## Relationships

**Synergies**

- [Test Data Builder](../testing/test-data-builder.md) — Builders keep Arrange concise without hiding the values relevant to the assertion.
- [Mock Object](../testing/mock-object.md) — Mocks fit naturally in Arrange and should be verified only in Assert.
- [Given-When-Then (BDD)](../testing/given-when-then.md) — BDD scenario wording maps directly to the same three-phase test flow.

**Alternatives:** [Given-When-Then (BDD)](../testing/given-when-then.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, microservices, modular-monolith
- **Tags:** test-structure, readability, unit-testing

