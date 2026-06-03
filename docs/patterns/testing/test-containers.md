# Test Containers

> Run real infrastructure dependencies in ephemeral Docker containers controlled by the test lifecycle.

**Scale:** integration · **Altitude:** medium · **Category:** testing · **Maturity:** established

**Also known as:** Testcontainers, Containerised Integration Tests

## Description

Test Containers use libraries such as Testcontainers to start real databases, queues, browsers, or brokers before integration tests and destroy them afterwards. Tests gain realism without relying on shared staging services. The pattern works best when containers are scoped, seeded, and cleaned consistently so tests remain hermetic and parallelisable.

**Problem.** Integration tests need real dependency behaviour, but shared test environments are flaky, slow, and polluted by other runs.

**Context.** Use for repository, adapter, and service integration tests where the real database, cache, broker, or external protocol semantics matter.

## Consequences / Trade-offs

- Catches adapter and infrastructure behaviour that fakes or mocks miss.
- Makes integration tests self-contained in CI when Docker is available.
- Adds startup cost and requires careful lifecycle management for speed and isolation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when dependency semantics matter, though startup cost can dominate tiny projects. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for adapter and repository integration tests. |
| Large (>100k LOC) | ●●●●● 5/5 | High value when paired with reusable fixtures, sharding, and CI container capacity. |

## Examples

### Postgres repository test

**❌ Negative (java)**

```java
var repo = new OrderRepository(stagingDataSource());
repo.save(order);
assertThat(repo.find(order.id())).isPresent();
```

**✅ Positive (java)**

```java
@Container
static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:15");

@Test
void savesOrder() {
  var repo = new OrderRepository(dataSourceFrom(pg));
  repo.save(order);
  assertThat(repo.find(order.id())).isPresent();
}
```

*The positive test owns its database lifecycle; the negative test depends on shared staging state and availability.*

## Relationships

**Synergies**

- [Hexagonal Test Boundaries](../testing/hexagonal-test-boundaries.md) — Real adapters can be verified against containers while application tests use in-memory fakes.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Provider verification can run against realistic infrastructure without shared environments.
- [Test Sharding](../testing/test-sharding.md) — Container isolation helps parallel workers avoid shared mutable state.

**Conflicts with:** [Fake Object](../testing/fake-object.md)

**Alternatives:** [Fake Object](../testing/fake-object.md), [Ephemeral Environment](../testing/ephemeral-environment.md), [Consumer-Driven Contract Testing](../testing/contract-testing.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, javascript, python, go
- **Frameworks:** none, nodejs, spring-boot, fastapi, django, kafka, redis
- **Project types:** web-api, backend-service, microservices, data-pipeline, modular-monolith
- **Tags:** integration-testing, docker, infrastructure, hermetic

