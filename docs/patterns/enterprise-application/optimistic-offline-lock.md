# Optimistic Offline Lock

> Detect conflicting business transactions by checking a version or timestamp at commit time instead of holding locks while users think or work offline.

**Scale:** data · **Altitude:** medium · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Optimistic Offline Lock protects long-running business transactions that span multiple requests, screens, or disconnected edits. Each record carries a version. A user reads version N, edits locally, and the update succeeds only if the stored version is still N; the write then advances the version. Conflicts are surfaced for merge, retry, or rejection. The pattern assumes conflicts are possible but uncommon enough that detection is cheaper than prevention.

**Problem.** Holding database locks across user think time is impractical, yet lost updates occur when two users load the same data and save changes in sequence.

**Context.** Use for collaborative enterprise data where edits are long-lived and conflict frequency is low to moderate. Choose pessimistic locking for scarce resources or high-conflict workflows that cannot tolerate retries.

## Consequences / Trade-offs

- Avoids holding database locks across requests, tabs, mobile sessions, or offline edits.
- Detects lost updates reliably when every write checks the version.
- Pushes conflict handling into the application and user experience.
- Performs poorly when conflicts are frequent because users repeatedly retry or merge.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Worth adding when users edit the same records; otherwise simple transactions may suffice. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for web applications with long-running edits and moderate conflict rates. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large enterprise systems, but requires consistent conflict UX and API semantics. |

## Examples

### Version-checked update

**❌ Negative (sql)**

```sql
-- Last writer wins; Alice can overwrite Bob's change silently.
UPDATE orders
   SET status = 'APPROVED', approved_by = 'alice'
 WHERE id = 'ord_123';
```

**✅ Positive (sql)**

```sql
-- Alice loaded version 7. The update succeeds only if nobody saved version 8 first.
UPDATE orders
   SET status = 'APPROVED', approved_by = 'alice', version = version + 1
 WHERE id = 'ord_123'
   AND version = 7;

-- If row_count is 0, reload and report a concurrency conflict instead of overwriting.
```

*The positive version makes the lost-update check part of the write, so stale edits are detected without holding a database lock across user think time.*

## Relationships

**Synergies**

- [Unit of Work](../enterprise-application/unit-of-work.md) — Unit of Work can include original versions in the commit and verify all changed objects together.
- [Layer Supertype](../enterprise-application/layer-supertype.md) — A layer supertype can provide a consistent version field across persistent entities.
- [Repository](../data-persistence/repository.md) — Repositories can enforce version-aware saves instead of letting callers forget the check.
- [ETag / Conditional Request](../api-design/etag-conditional-request.md) — HTTP ETags expose the same optimistic version check at API boundaries.

**Conflicts with:** [Pessimistic Offline Lock](../enterprise-application/pessimistic-offline-lock.md)

**Alternatives:** [Pessimistic Offline Lock](../enterprise-application/pessimistic-offline-lock.md), [Optimistic Concurrency Control](../data-persistence/optimistic-concurrency-control.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, sql
- **Frameworks:** spring-boot, dotnet, entity-framework, hibernate, sqlalchemy
- **Project types:** web-api, backend-service, modular-monolith, monolith
- **Tags:** concurrency, versioning, lost-update

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

