# Optimistic Concurrency Control

> Detect conflicting updates with versions, timestamps, or compare-and-swap conditions instead of locking records for long workflows.

**Scale:** data · **Category:** data-persistence · **Maturity:** time-tested

## Description

Optimistic Concurrency Control assumes conflicts are uncommon but must be detected reliably. A reader receives a version token with the data; the writer includes that token in the update condition. If another transaction changed the row first, the update affects zero rows or raises a concurrency exception, allowing the caller to retry, merge, or report a conflict. The pattern is essential for long think-time edits, APIs, and distributed workflows where pessimistic locks would be fragile or too expensive.

**Problem.** Two callers can read the same value and overwrite each other, losing one update without any error.

**Context.** Use when records are read, modified outside a short transaction, then written back; conflicts are possible but not constant. Choose pessimistic locking for high-contention invariants that cannot be merged.

## Consequences / Trade-offs

- Prevents silent lost updates while avoiding long-held locks.
- Callers must handle conflict outcomes explicitly instead of assuming every save succeeds.
- Version fields need to be included in API contracts, forms, or ETags.
- High-contention data can devolve into repeated retries and poor user experience.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful where users edit shared records, but overkill for append-only or single-user data. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for APIs and admin tools that update durable records. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large distributed systems; combine with clear conflict semantics and ETags. |

## Examples

### Version the write condition

**❌ Negative (sql)**

```sql
UPDATE accounts
SET display_name = 'Chris'
WHERE id = 'acc_123';
-- Any concurrent edit is silently overwritten.
```

**✅ Positive (sql)**

```sql
UPDATE accounts
SET display_name = 'Chris', version = version + 1
WHERE id = 'acc_123' AND version = 7;

-- If row_count is 0, return a concurrency conflict and reload before retrying.
```

*The positive update succeeds only if the caller edited the version it originally read, so concurrent changes are detected rather than lost.*

## Relationships

**Synergies**

- [ETag / Conditional Request](../api-design/etag-conditional-request.md) — HTTP ETags expose the same compare-and-swap idea through If-Match headers.
- [Repository](../data-persistence/repository.md) — Repositories can hide version checks behind aggregate save semantics.
- [Optimistic Offline Lock](../enterprise-application/optimistic-offline-lock.md) — Optimistic Offline Lock is the enterprise application version of the same pattern.
- [Retry with Backoff](../resilience/retry.md) — Retries should be selective; retrying a semantic conflict blindly can overwrite user intent.

**Conflicts with:** [Pessimistic Offline Lock](../enterprise-application/pessimistic-offline-lock.md)

**Alternatives:** [Pessimistic Offline Lock](../enterprise-application/pessimistic-offline-lock.md), [Read-Write Lock](../concurrency/read-write-lock.md), [ETag / Conditional Request](../api-design/etag-conditional-request.md)

## Applicability tags

- **Languages:** language-agnostic, sql, java, typescript, csharp
- **Frameworks:** entity-framework, hibernate, spring-boot, dotnet, none
- **Project types:** web-api, backend-service, modular-monolith, distributed-system
- **Tags:** lost-update, versioning, concurrency

