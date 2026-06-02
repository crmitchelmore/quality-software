# Pagination

> Return large collections in bounded pages using stable ordering and continuation information instead of unbounded lists.

**Scale:** integration · **Category:** api-design · **Maturity:** time-tested

## Description

Pagination constrains collection responses so APIs, databases, and clients handle predictable amounts of data. Offset pagination is simple for small, mostly static lists; keyset or cursor pagination is safer for large or frequently changing datasets because it follows a stable sort key. Good pagination includes explicit limits, deterministic ordering, next/previous links or cursors, and clear consistency expectations.

**Problem.** Unbounded collection endpoints cause slow queries, huge responses, timeouts, memory pressure, and inconsistent client behaviour as data grows.

**Context.** Use for every API endpoint that can return more than a small fixed number of items. Choose cursor/keyset pagination when inserts or deletes happen during traversal.

## Consequences / Trade-offs

- Protects databases and clients from accidental full scans and huge payloads.
- Cursor design can leak implementation details if tokens are not opaque or versioned.
- Offset pagination is easy but becomes slow and inconsistent at high offsets.
- Stable sorting and conditional requests are needed for predictable user experiences.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good default even for small APIs because growth is predictable. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Essential for medium APIs and mobile clients. |
| Large (>100k LOC) | ●●●●● 5/5 | Mandatory at large scale; pair with keyset indexes, ETags, and clear cursor contracts. |

## Examples

### Prefer stable cursors for changing data

**❌ Negative (typescript)**

```typescript
app.get("/orders", async (req, res) => {
  const rows = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
  res.json(rows.rows);
});
```

**✅ Positive (typescript)**

```typescript
app.get("/orders", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 50), 100);
  const cursor = decodeCursor(req.query.cursor as string | undefined);
  const rows = await ordersPageAfter(cursor, limit + 1);
  res.json({
    items: rows.slice(0, limit),
    next_cursor: rows.length > limit ? encodeCursor(rows[limit - 1]) : null
  });
});
```

*The positive version caps result size and uses a continuation cursor so clients can traverse a changing collection without unbounded scans.*

## Relationships

**Synergies**

- [ETag / Conditional Request](../api-design/etag-conditional-request.md) — ETags let clients revalidate pages and avoid refetching unchanged collection slices.
- [REST](../api-design/rest.md) — REST collection resources should expose page boundaries and navigation links.
- [Read Replica](../data-persistence/read-replica.md) — Paginated reads keep replica queries bounded and less likely to starve other traffic.
- [HATEOAS](../api-design/hateoas.md) — Page responses can include next and previous links rather than forcing clients to construct URLs.

**Conflicts with:** [Lazy Load](../enterprise-application/lazy-load.md)

**Alternatives:** [Iterator](../gof-behavioural/iterator.md), [Materialized View](../cloud-distributed/materialized-view.md), [Gateway Aggregation](../cloud-distributed/gateway-aggregation.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, python, java, sql
- **Frameworks:** express, fastapi, spring-boot, django, none
- **Project types:** web-api, backend-service, data-pipeline, mobile-app
- **Tags:** bounded-results, cursor, keyset

