# Data Access Object (DAO)

> Encapsulate table- or query-oriented persistence operations behind an object dedicated to data access, distinct from domain repositories.

**Scale:** design · **Category:** data-persistence · **Maturity:** time-tested

## Description

A Data Access Object centralises SQL, driver calls, row mapping, and low-level persistence concerns for a particular table, query family, or external data source. Unlike a Repository, which usually exposes aggregate-oriented collection semantics to a domain model, a DAO often works closer to records and data transfer shapes. It is especially useful in transaction scripts, reporting, ETL, and services where the database schema is the main contract.

**Problem.** Scattered SQL and row mapping produce inconsistent parameters, duplicated queries, unsafe string construction, and hard-to-change schema knowledge.

**Context.** Use when application code needs a clear seam around database access but a full domain repository would pretend there are aggregates or behaviours that do not exist.

## Consequences / Trade-offs

- Centralises query construction, parameterisation, mapping, and connection handling.
- Keeps service code readable without forcing a domain model onto data-centric flows.
- Can become an anemic dumping ground if every query in the system lands in one DAO.
- Less protective than Repository for domain invariants because it often exposes record-shaped operations.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good small-system seam for SQL without inventing a domain model. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Solid for CRUD and reporting services; split DAOs by cohesive query families. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful, but large domain systems often need repositories, mappers, and stronger aggregate boundaries. |

## Examples

### Centralise SQL and mapping

**❌ Negative (typescript)**

```typescript
async function handler(req: Request) {
  const rows = await db.query(`SELECT * FROM users WHERE email='${req.email}'`);
  return rows.rows.map(r => ({ id: r.id, email: r.email, active: r.status === "A" }));
}
```

**✅ Positive (typescript)**

```typescript
class UserDao {
  constructor(private readonly db: Pool) {}

  async findActiveByEmail(email: string): Promise<UserRow[]> {
    const result = await this.db.query(
      "SELECT id,email,status FROM users WHERE email=$1 AND status=$2",
      [email, "A"]
    );
    return result.rows.map(r => ({ id: r.id, email: r.email, active: true }));
  }
}
```

*The positive version parameterises SQL and keeps record mapping in one data-access component instead of scattering it through handlers.*

## Relationships

**Synergies**

- [Table Data Gateway](../enterprise-application/table-data-gateway.md) — DAO often looks like a typed, application-local form of Table Data Gateway.
- [Transaction Script](../enterprise-application/transaction-script.md) — Transaction scripts pair well with DAOs because the business flow remains procedural while SQL stays encapsulated.
- [Repository](../data-persistence/repository.md) — Repository is the domain-oriented alternative; DAO is better when records and queries are the real abstraction.
- [Query Object](../enterprise-application/query-object.md) — Complex filtering can be moved from DAO method explosions into explicit query objects.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Repository](../data-persistence/repository.md), [Table Data Gateway](../enterprise-application/table-data-gateway.md), [Row Data Gateway](../enterprise-application/row-data-gateway.md), [Data Mapper](../enterprise-application/data-mapper.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, python, csharp
- **Frameworks:** spring-boot, dotnet, sqlalchemy, nodejs, none
- **Project types:** backend-service, web-api, monolith, modular-monolith
- **Tags:** data-access, sql, crud

