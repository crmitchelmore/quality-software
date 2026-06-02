# Lazy Load

> Defer loading related data until a caller actually needs it, while preserving the object interface.

**Scale:** data · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Lazy loading, Virtual proxy, Ghost object

## Description

Lazy Load replaces immediate graph hydration with a placeholder, proxy, or deferred collection that knows how to fetch its data on first use. It can make common paths cheaper and keep aggregate loading focused, but it moves database access into object navigation and must therefore be bounded, observable, and understood by callers.

**Problem.** Loading every relationship eagerly wastes memory and database time for use cases that need only part of the graph. Loading nothing up front can push callers into ad hoc query code or repeated manual fetches.

**Context.** Use when object graphs have optional or expensive relationships, read paths vary substantially, and the persistence layer can prevent accidental N+1 queries through fetch plans, batching, or explicit repository methods.

## Consequences / Trade-offs

- Improves performance for paths that rarely touch expensive relationships.
- Keeps object APIs convenient by hiding deferred retrieval behind fields or collections.
- Can create N+1 queries and surprising database access during rendering or serialisation.
- Requires a live session or explicit loader; detached objects with lazy fields often fail at awkward boundaries.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often more complexity than value; explicit queries are easier to reason about. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational: useful with mature ORM support, but needs N+1 tests and query logging. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful, but large systems often prefer explicit fetch plans, read models, and DTO projections to avoid surprise database access. |

## Examples

### Deferred order lines with an explicit loader

**❌ Negative (typescript)**

```typescript
async function showOrderSummary(id: string) {
  const order = await db.order.findUnique({
    where: { id },
    include: { lines: true, payments: true, shipments: true }
  });
  return `${order!.number}: ${order!.lines.length} lines`;
}
```

**✅ Positive (typescript)**

```typescript
class Order {
  constructor(
    readonly id: string,
    readonly number: string,
    private readonly loadLines: () => Promise<OrderLine[]>
  ) {}

  private linesCache?: Promise<OrderLine[]>;
  lines(): Promise<OrderLine[]> {
    return this.linesCache ??= this.loadLines();
  }
}

async function showOrderSummary(id: string) {
  const order = await orders.get(id);
  return `${order.number}: ${(await order.lines()).length} lines`;
}
```

*The positive version loads the common order fields first and fetches lines only when needed. The loader is explicit and cache-backed, so repeated access in the same object does not repeatedly hit the database.*

## Relationships

**Synergies**

- [Identity Map](../enterprise-application/identity-map.md) — Lazy loaders should resolve through Identity Map so the same related row is not materialised twice.
- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper can install proxies or loaders while keeping domain classes free of SQL.
- [Query Object](../enterprise-application/query-object.md) — Query Objects or fetch specifications make eager-versus-lazy choices explicit for read-heavy use cases.
- [Repository](../data-persistence/repository.md) — Repositories can expose intention-revealing methods that pre-load relationships when the use case really needs them.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Query Object](../enterprise-application/query-object.md), [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md), [Materialized View](../cloud-distributed/materialized-view.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby
- **Frameworks:** hibernate, entity-framework, typeorm, sqlalchemy, rails
- **Project types:** backend-service, web-api, modular-monolith, monolith, web-frontend
- **Tags:** deferred-loading, orm, performance, n-plus-one

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

