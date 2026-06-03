# Test Data Builder

> Create test fixtures with intention-revealing defaults and fluent overrides so each test states only the data that matters.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** Fixture builder, Object builder

## Description

A Test Data Builder creates valid default objects and lets each test override the fields relevant to the scenario. It keeps tests resilient to constructor growth, avoids copy-pasted object literals, and makes the important variation visible. Builders are strongest when domain objects have invariants: the builder knows how to produce a valid object, while tests communicate the exceptional detail.

**Problem.** Large fixture literals obscure the reason for a test and break whenever constructors or required fields change.

**Context.** Use when many tests need similar domain objects, API payloads, or database records with small scenario-specific differences.

## Consequences / Trade-offs

- Reduces noisy fixture setup and makes relevant data stand out.
- Protects tests from unrelated constructor and schema changes.
- Can hide important defaults; name builders and overrides clearly and keep generated data realistic.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Valuable as soon as fixtures have more than a handful of fields. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for domain and API tests with repeated valid objects. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large suites to avoid fixture drift and broad rewrite churn. |

## Examples

### JUnit order fixture

**❌ Negative (java)**

```java
@Test
void premiumCustomersGetFreeShipping() {
  Customer customer = new Customer("c1", "Ada", "ada@example.com", true, 12, "GB");
  Order order = new Order("o1", customer, List.of(new Line("sku", 2, 500)), "GBP", false);
  assertEquals(Money.zero("GBP"), shippingFor(order));
}
```

**✅ Positive (java)**

```java
@Test
void premiumCustomersGetFreeShipping() {
  Order order = anOrder()
      .forCustomer(aCustomer().premium().build())
      .withCurrency("GBP")
      .build();

  assertEquals(Money.zero("GBP"), shippingFor(order));
}
```

*The positive test names only the facts that matter to the behaviour: premium customer and currency. Valid defaults live in the builders and can evolve with the domain model.*

## Relationships

**Synergies**

- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — Builders make the Arrange phase concise without burying the Act or Assert.
- [Object Mother](../testing/object-mother.md) — Object Mother can delegate to builders for named common cases instead of returning rigid fixtures.
- [Stub](../testing/stub.md) — Builder-created return values make stubs more readable and realistic.

**Conflicts with:** [Object Mother](../testing/object-mother.md)

**Alternatives:** [Object Mother](../testing/object-mother.md), [Builder](../gof-creational/builder.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, microservices, modular-monolith
- **Tags:** fixtures, test-data, readability

