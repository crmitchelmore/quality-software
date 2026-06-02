# Query Object

> Represent a database query as an object so selection criteria, ordering, paging, and joins can be composed and reused without scattering SQL strings.

**Scale:** data · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Query Object packages query intent as a first-class object. It can expose a fluent API, immutable criteria, or a specification-like structure that a repository, mapper, or gateway translates to SQL, ORM criteria, or search DSL. The pattern is strongest when many callers need variations of the same query and when raw SQL in application code would leak persistence details.

**Problem.** Ad hoc SQL strings and ORM predicates spread through services, duplicating filters and making security, paging, and performance rules inconsistent.

**Context.** Use when query composition is domain meaningful and needs reuse. Prefer named repository methods for a small number of stable queries, and prefer raw SQL for highly tuned reporting queries where object abstraction obscures intent.

## Consequences / Trade-offs

- Reuses common filters, sorting, and paging rules while keeping callers persistence-agnostic.
- Gives repositories a typed input instead of many optional parameters or string fragments.
- Can become a leaky general-purpose SQL builder if it exposes database concepts indiscriminately.
- Requires care to avoid injection, unexpected joins, and unbounded result sets.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for complex searches; named repository methods are simpler for a few queries. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for APIs with reusable filtering, sorting, and paging rules. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable for standardising query construction, but reporting workloads may need explicit SQL instead. |

## Examples

### Reusable customer search

**❌ Negative (typescript)**

```typescript
async function findCustomers(region?: string, overdueOnly?: boolean) {
  let sql = 'SELECT * FROM customers WHERE 1=1';
  if (region) sql += ` AND region = '${region}'`;
  if (overdueOnly) sql += ' AND balance_cents > 0 AND due_date < NOW()';
  return db.query(sql);
}
```

**✅ Positive (typescript)**

```typescript
class CustomerQuery {
  private clauses: string[] = [];
  private values: unknown[] = [];

  inRegion(region: string): this {
    this.values.push(region);
    this.clauses.push('region = $' + this.values.length);
    return this;
  }

  overdue(): this {
    this.clauses.push('balance_cents > 0 AND due_date < NOW()');
    return this;
  }

  toSql(): SqlQuery {
    const where = this.clauses.length ? ' WHERE ' + this.clauses.join(' AND ') : '';
    return { text: 'SELECT * FROM customers' + where + ' ORDER BY name LIMIT 100', values: this.values };
  }
}
```

*The positive version composes query criteria safely and consistently, avoiding string interpolation and repeated overdue logic.*

## Relationships

**Synergies**

- [Repository](../data-persistence/repository.md) — Repositories can accept Query Objects to express criteria without exposing SQL or ORM APIs.
- [Specification](../ddd-tactical/specification.md) — Specifications capture domain predicates that Query Objects can translate for persistence.
- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper translates query objects into SQL and maps matching rows back into domain objects.
- [Pagination](../api-design/pagination.md) — Query Objects can make paging and ordering mandatory parts of list queries.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Repository](../data-persistence/repository.md), [Specification](../ddd-tactical/specification.md), [Table Data Gateway](../enterprise-application/table-data-gateway.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** hibernate, entity-framework, sqlalchemy, prisma, typeorm
- **Project types:** backend-service, web-api, data-pipeline, modular-monolith
- **Tags:** query-composition, data-access, filtering

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

