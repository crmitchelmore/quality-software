# Fake Object

> Use a lightweight working implementation of a collaborator when tests need realistic behaviour without the real infrastructure.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** In-memory implementation, Fake

## Description

A fake object implements the same interface as a real collaborator but with simplified internals: an in-memory repository, a local queue, a deterministic clock, or a fake payment gateway. Unlike a stub, a fake has behaviour and state; unlike a mock, it is usually asserted through outcomes rather than interaction expectations. Good fakes are intentionally small and contract-compatible, not partial reimplementations of production systems.

**Problem.** Canned stubs are too shallow for multi-step behaviour, while real infrastructure makes tests slow and brittle.

**Context.** Use for domain/application tests that need persistence-like or queue-like behaviour but not the full external system.

## Consequences / Trade-offs

- Supports richer flow tests than stubs while remaining fast and local.
- Encourages stable interfaces because both real and fake implementations share a contract.
- May diverge from production semantics; maintain contract tests for important adapters.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good for small domain-rich projects; avoid if the fake becomes larger than the production adapter. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for fast application flow tests around repositories, queues, and clocks. |
| Large (>100k LOC) | ●●●●○ 4/5 | Useful at scale, but divergence risk rises; invest in shared contracts and a small fake surface. |

## Examples

### In-memory repository fake

**❌ Negative (typescript)**

```typescript
test("prevents duplicate customers", async () => {
  const repo = new PostgresCustomerRepository(pool);
  await repo.save(Customer.register("a@example.com"));

  await expect(register(repo, "a@example.com")).rejects.toThrow("taken");
});
```

**✅ Positive (typescript)**

```typescript
class InMemoryCustomerRepository implements CustomerRepository {
  private customers = new Map<string, Customer>();
  async byEmail(email: string) { return this.customers.get(email) ?? null; }
  async save(customer: Customer) { this.customers.set(customer.email, customer); }
}

test("prevents duplicate customers", async () => {
  const repo = new InMemoryCustomerRepository();
  await repo.save(Customer.register("a@example.com"));

  await expect(register(repo, "a@example.com")).rejects.toThrow("taken");
});
```

*The positive test keeps the duplicate-check flow realistic without needing Postgres. The fake should still be covered by adapter contract tests for database-specific semantics.*

## Relationships

**Synergies**

- [Test Double](../testing/test-double.md) — Fake Object is a behaviour-preserving test double.
- [Repository](../data-persistence/repository.md) — In-memory repositories are a common fake for application-service tests.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Contracts verify that the fake and real adapter honour the same externally visible rules.

**Conflicts with:** [Mock Object](../testing/mock-object.md)

**Alternatives:** [Stub](../testing/stub.md), [Mock Object](../testing/mock-object.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, microservices, modular-monolith
- **Tags:** in-memory, flow-testing, adapter

