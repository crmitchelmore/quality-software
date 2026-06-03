# Hexagonal Test Boundaries

> Test application logic through ports with in-memory fakes, and test real adapters separately at infrastructure boundaries.

**Scale:** integration · **Altitude:** medium · **Category:** testing · **Maturity:** established

**Also known as:** Ports and Adapters Testing, In-Memory Fakes for Ports

## Description

Hexagonal Test Boundaries make the architecture boundary the test boundary. Application service tests run in-process against fakes for repositories, clocks, buses, and gateways. Adapter tests separately verify the production implementations against real infrastructure. This preserves fast feedback for business rules while still checking the database, broker, and HTTP semantics that fakes cannot model perfectly.

**Problem.** Every application test hitting real infrastructure is slow and brittle, but pure mocks can drift from real adapter behaviour.

**Context.** Use in hexagonal, DDD, or functional-core systems where business logic can depend on ports instead of concrete infrastructure.

## Consequences / Trade-offs

- Application tests become fast and deterministic with realistic port-level behaviour.
- Adapter tests stay focused on infrastructure semantics and contract drift.
- Requires disciplined interfaces and contract checks so in-memory fakes do not lie.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Good for domain-rich small services but unnecessary for simple CRUD. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent balance of fast application tests and realistic adapter checks. |
| Large (>100k LOC) | ●●●●● 5/5 | Strong architectural testing pattern for independently evolving services and adapters. |

## Examples

### Fake port with real adapter test

**❌ Negative (python)**

```python
service = OrderService(PostgresOrderRepository(os.environ["DB_URL"]), SystemClock())
assert service.place(request).accepted
```

**✅ Positive (python)**

```python
repo = InMemoryOrderRepository()
clock = FakeClock("2024-01-01T00:00:00Z")
service = OrderService(repo, clock)
assert service.place(request).placed_at == clock.now()

def test_postgres_repo_constraints(postgres_container):
    repo = PostgresOrderRepository(postgres_container.url)
    assert repo.enforces_unique_order_ids()
```

*The application rule is tested quickly through ports; the adapter has its own focused test against real Postgres behaviour.*

## Relationships

**Synergies**

- [Fake Object](../testing/fake-object.md) — In-memory fakes implement ports for fast application tests.
- [Test Containers](../testing/test-containers.md) — Real adapters can be tested against containerised dependencies.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Contracts keep port and adapter behaviour aligned across boundaries.

**Conflicts with:** [Mock Object](../testing/mock-object.md)

**Alternatives:** [Test Containers](../testing/test-containers.md), [Consumer-Driven Contract Testing](../testing/contract-testing.md), [Sociable and Solitary Tests](../testing/sociable-and-solitary-tests.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, go
- **Frameworks:** none, spring-boot, dotnet, nodejs, fastapi, django
- **Project types:** backend-service, web-api, microservices, modular-monolith, monolith
- **Tags:** hexagonal-architecture, ports-and-adapters, fakes, integration-boundary

