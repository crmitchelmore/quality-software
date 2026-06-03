# Repository

> Mediate between the domain and data mapping layers using a collection-like interface for accessing aggregates, hiding the persistence mechanism from the domain.

**Scale:** design · **Altitude:** medium · **Category:** data-persistence · **Maturity:** time-tested

## Description

A repository presents the illusion of an in-memory collection of domain objects. Clients add, remove, and query aggregates through a narrow interface (e.g. findById, save, byCustomer) while the implementation handles the database, ORM, caching, and query construction. This keeps persistence concerns out of the domain and gives a single, testable seam for data access.

**Problem.** Domain and application code littered with SQL/ORM calls becomes coupled to the storage technology, hard to test, and inconsistent in how it loads/saves objects.

**Context.** Domain-centric applications (especially DDD) where aggregates have clear boundaries and you want persistence abstracted behind a collection-like API.

## Consequences / Trade-offs

- Centralises and standardises data access; domain stays persistence-ignorant.
- Trivially mockable, enabling fast domain tests with in-memory implementations.
- Risk of leaky/generic repositories that just wrap the ORM and add no value.
- Can hide expensive queries; needs care to avoid N+1 and over-fetching.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful but can be overkill for tiny apps; a thin data layer may suffice. Avoid generic repos that just wrap an ORM. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good default for domain-centric services; pairs with Unit of Work and DI. |
| Large (>100k LOC) | ●●●●● 5/5 | Strong fit for large DDD systems; standardises access and protects the domain from storage churn. |

## Examples

### Customer data access

**❌ Negative (typescript)**

```typescript
// Application service builds SQL inline; coupled to the driver and untestable.
class RegisterService {
  async register(email: string) {
    const db = await pool.connect();
    const dup = await db.query("SELECT 1 FROM customers WHERE email=$1", [email]);
    if (dup.rowCount) throw new Error("exists");
    await db.query("INSERT INTO customers(email, status) VALUES($1,'active')", [email]);
  }
}
```

**✅ Positive (typescript)**

```typescript
interface CustomerRepository {
  byEmail(email: Email): Promise<Customer | null>;
  save(customer: Customer): Promise<void>;
}

class RegisterService {
  constructor(private readonly customers: CustomerRepository) {}
  async register(email: Email): Promise<void> {
    if (await this.customers.byEmail(email)) throw new EmailTaken(email);
    await this.customers.save(Customer.register(email));
  }
}
// SqlCustomerRepository implements CustomerRepository; tests use an in-memory one.
```

*The positive version expresses intent (byEmail/save) and lets the service be tested with an in-memory repository, with storage details confined to one adapter.*

## Relationships

**Synergies**

- [Unit of Work](../enterprise-application/unit-of-work.md) — Unit of Work coordinates saving changes tracked across repositories in one transaction.
- [Aggregate](../ddd-tactical/aggregate.md) — Repositories are defined per aggregate root, preserving consistency boundaries.
- [Hexagonal Architecture (Ports & Adapters)](../architecture/hexagonal-architecture.md) — The repository interface is the canonical outbound persistence port.
- [Specification](../ddd-tactical/specification.md) — Specifications express query criteria passed to the repository without leaking SQL.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Active Record](../enterprise-application/active-record.md), [Data Mapper](../enterprise-application/data-mapper.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript, python, go
- **Frameworks:** spring-boot, dotnet, entity-framework, hibernate, typeorm, prisma, sqlalchemy
- **Project types:** backend-service, microservices, modular-monolith, web-api
- **Tags:** persistence-ignorance, ddd, testability, data-access

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)
- Eric Evans, Domain-Driven Design, (2003)

