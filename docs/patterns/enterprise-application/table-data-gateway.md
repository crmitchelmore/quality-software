# Table Data Gateway

> Provide one object that contains all SQL operations for a table or view and returns records or DTOs.

**Scale:** data · **Altitude:** medium · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Table gateway

## Description

Table Data Gateway centralises persistence operations for a database table. Callers ask the gateway for rows, inserts, updates, and deletes rather than writing SQL throughout the application. Unlike Active Record, returned data is usually passive; unlike Data Mapper, the gateway often exposes table-shaped operations rather than reconstructing a rich object graph.

**Problem.** Scattered SQL leads to inconsistent predicates, duplicated mapping, missing parameterisation, and hard-to-change table access. Full object mapping may be unnecessary for reporting, simple CRUD, or table-oriented legacy systems.

**Context.** Use when a table or view is the natural boundary, when business logic sits in services or table modules, or when wrapping a legacy schema behind a narrow access point.

## Consequences / Trade-offs

- Centralises SQL and makes access paths auditable and parameterised.
- Simple to test with integration tests and easy to replace behind an interface.
- Can leak table shape into application code and encourage procedural transaction scripts.
- Less suitable for rich Domain Models where behaviour belongs on objects rather than records.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good fit for small services that need explicit SQL without a full ORM. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Works well for table-oriented modules, legacy schemas, and reporting paths. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful at boundaries, but core domains often need Data Mapper, Repository, or richer domain abstractions to avoid table leakage. |

## Examples

### Centralising account SQL

**❌ Negative (typescript)**

```typescript
async function suspendAccount(id: string) {
  await db.query("update accounts set status = 'suspended' where id = $1", [id]);
}

async function activeAccounts() {
  return db.query("select * from accounts where status = 'active'");
}
```

**✅ Positive (typescript)**

```typescript
class AccountTableGateway {
  constructor(private readonly db: Pool) {}

  async findActive(): Promise<AccountRow[]> {
    return (await this.db.query(
      "select id, email, status from accounts where status = $1",
      ["active"]
    )).rows;
  }

  async markSuspended(id: string): Promise<void> {
    await this.db.query(
      "update accounts set status = $1 where id = $2",
      ["suspended", id]
    );
  }
}
```

*The gateway gives one parameterised place for account table access. Callers no longer duplicate SQL strings or accidentally diverge on selected columns and predicates.*

## Relationships

**Synergies**

- [Transaction Script](../enterprise-application/transaction-script.md) — Transaction Scripts can call gateways for persistence while keeping SQL out of use-case orchestration.
- [Table Module](../enterprise-application/table-module.md) — Table Module often uses a gateway as the data access boundary for the table it operates on.
- [Query Object](../enterprise-application/query-object.md) — Complex search criteria can be factored into Query Objects rather than expanding gateway methods endlessly.
- [Gateway](../enterprise-application/gateway.md) — The broader Gateway pattern describes the same boundary idea when the data source is external rather than a local table.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Data Mapper](../enterprise-application/data-mapper.md), [Active Record](../enterprise-application/active-record.md), [Row Data Gateway](../enterprise-application/row-data-gateway.md), [Data Access Object (DAO)](../data-persistence/data-access-object.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, php
- **Frameworks:** spring-boot, dotnet, nodejs, django, laravel
- **Project types:** backend-service, web-api, modular-monolith, monolith, data-pipeline
- **Tags:** sql, data-access, table-oriented, gateway

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

