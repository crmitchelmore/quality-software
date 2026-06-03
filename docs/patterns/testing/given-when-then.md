# Given-When-Then (BDD)

> Describe behaviour as preconditions, user action, and expected outcome in business language that stakeholders and tests can share.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** established

**Also known as:** BDD scenario format, Specification by example

## Description

Given-When-Then is the behavioural testing grammar popularised by BDD. Given establishes the relevant context, When describes the event or action, and Then states the observable outcome. It is most valuable when scenario text becomes a shared specification; it is less useful if teams merely wrap low-level UI clicks in verbose ceremony. Keep scenarios declarative, with technical detail delegated to step implementations or helper APIs.

**Problem.** Tests written in implementation language often fail to communicate the business rule they protect.

**Context.** Use for acceptance tests, executable specifications, and cross-functional discussions where examples clarify requirements.

## Consequences / Trade-offs

- Creates a shared language between product, QA, and engineering.
- Keeps acceptance tests focused on externally observable behaviour.
- Can become slow and brittle if every unit test is forced into BDD tooling or if steps hide too much logic.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for key behaviours; too much ceremony for tiny libraries. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong for acceptance criteria and regression scenarios shared with non-engineers. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at scale when used selectively for important journeys, not every low-level test. |

## Examples

### Scenario-shaped acceptance test

**❌ Negative (javascript)**

```javascript
test("discount", async () => {
  const u = await api.post("/users", { tier: "gold", orders: 10 });
  const r = await api.post("/checkout", { userId: u.id, sku: "book" });
  expect(r.body.total).toBe(900);
});
```

**✅ Positive (javascript)**

```javascript
test("Given a gold customer, when they buy an eligible book, then the loyalty discount is applied", async () => {
  const customer = await givenGoldCustomer({ previousOrders: 10 });

  const checkout = await whenCustomerChecksOut(customer, { sku: "book" });

  expect(checkout.total).toEqual(money(900, "GBP"));
});
```

*The positive version states the rule in business terms while still executing real code. Helper names carry the scenario language instead of exposing HTTP mechanics in the test body.*

## Relationships

**Synergies**

- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — The same mental model maps to code-level Arrange, Act, Assert tests.
- [Page Object](../testing/page-object.md) — Page objects keep UI step implementations declarative and selector-free.
- [Object Mother](../testing/object-mother.md) — Named fixtures make Given clauses concise and domain-specific.

**Alternatives:** [Arrange-Act-Assert](../testing/arrange-act-assert.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** web-api, web-frontend, backend-service, microservices, monolith
- **Tags:** bdd, acceptance-testing, specification

