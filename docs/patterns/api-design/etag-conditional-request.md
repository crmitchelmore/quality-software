# ETag / Conditional Request

> Use entity tags with If-None-Match or If-Match headers to validate cached representations and prevent lost updates over HTTP.

**Scale:** integration · **Category:** api-design · **Maturity:** time-tested

## Description

An ETag is an opaque validator for a specific resource representation. Clients use If-None-Match to ask whether a cached response is still valid, receiving 304 when unchanged, or If-Match to update only if the server representation still has the expected tag. This brings HTTP-native cache revalidation and optimistic concurrency to APIs, but tags must be stable, representation-specific, and generated without exposing sensitive implementation details.

**Problem.** Clients either refetch unchanged resources wastefully or overwrite concurrent changes because the server cannot tell which representation they edited.

**Context.** Use for cacheable resources, expensive representations, and update flows where clients read before writing. Avoid weak or incorrectly scoped tags for writes that require strong concurrency guarantees.

## Consequences / Trade-offs

- Reduces bandwidth and compute through standard HTTP revalidation.
- Prevents lost updates when combined with If-Match and 412 Precondition Failed.
- Incorrect ETag generation can leak data, miss changes, or invalidate caches too often.
- Collection ETags and paginated resources need careful scope and ordering rules.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for small APIs with editable resources or expensive responses. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for medium REST APIs where caching and concurrency matter. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large HTTP ecosystems with shared caches, mobile clients, and concurrent editing. |

## Examples

### Use If-Match for updates

**❌ Negative (typescript)**

```typescript
app.put("/documents/:id", async (req, res) => {
  const saved = await documents.replace(req.params.id, req.body);
  res.json(saved);
});
// Last writer wins even if the client edited stale content.
```

**✅ Positive (typescript)**

```typescript
app.put("/documents/:id", async (req, res) => {
  const expected = req.header("If-Match");
  if (!expected) return res.sendStatus(428);

  const saved = await documents.replaceIfVersion(req.params.id, req.body, parseEtag(expected));
  if (!saved) return res.status(412).type("application/problem+json").json(preconditionFailed());
  res.set("ETag", makeEtag(saved.version)).json(saved);
});
```

*The positive version requires the client to prove which representation it edited and rejects stale writes instead of losing updates.*

## Relationships

**Synergies**

- [Optimistic Concurrency Control](../data-persistence/optimistic-concurrency-control.md) — If-Match exposes optimistic concurrency as an HTTP precondition.
- [Pagination](../api-design/pagination.md) — Each page can have its own validator so clients revalidate bounded collection slices.
- [REST](../api-design/rest.md) — ETags use standard HTTP semantics that REST APIs can expose naturally.
- [Cache-Aside](../cloud-distributed/cache-aside.md) — ETag-aware responses and caches reduce unnecessary reloads from backing stores.

**Conflicts with:** [Write-Behind Cache](../data-persistence/write-behind-cache.md)

**Alternatives:** [Idempotency Key](../api-design/idempotency-key.md), [Read Replica](../data-persistence/read-replica.md), [Optimistic Offline Lock](../enterprise-application/optimistic-offline-lock.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python, go
- **Frameworks:** express, spring-boot, fastapi, aspnet, rails
- **Project types:** web-api, web-frontend, mobile-app, backend-service
- **Tags:** http-cache, conditional-update, etag

