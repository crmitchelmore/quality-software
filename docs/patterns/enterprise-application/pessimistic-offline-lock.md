# Pessimistic Offline Lock

> Prevent conflicting business transactions by acquiring an application-level lock before a user starts a long-running edit.

**Scale:** data · **Altitude:** medium · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Pessimistic Offline Lock reserves a business object or resource for a user, session, or process before work begins, preventing others from making conflicting changes until the lock is released or expires. Unlike database row locks, these locks survive across requests and user think time, so they need ownership, expiry, recovery, and administrative override. The pattern is justified when conflicts are common or the cost of resolving them after the fact is unacceptable.

**Problem.** Some business edits cannot be safely merged or retried. If two users concurrently modify the same scarce resource, one must be stopped before investing time in work that cannot commit.

**Context.** Use for high-conflict workflows, scarce resources, regulated approvals, or edits where conflict resolution is expensive. Avoid it for ordinary CRUD where lock management is more costly than occasional optimistic retries.

## Consequences / Trade-offs

- Prevents lost work and unmergeable conflicts by blocking conflicting edits early.
- Makes ownership and queueing visible to users before they start a task.
- Introduces stale locks, expiry races, abandoned sessions, and operational support needs.
- Reduces concurrency and can frustrate users if locks are coarse or long-lived.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely worth the operational complexity unless the domain has scarce resources. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for high-conflict workflows; expiry and recovery must be designed. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong for regulated or high-value edits, but can reduce throughput and needs operational tooling. |

## Examples

### Application-level edit lock

**❌ Negative (typescript)**

```typescript
async function openClaimForEdit(user: User, claimId: string) {
  return claims.load(claimId); // both Alice and Bob can edit for an hour
}

async function saveClaim(user: User, claim: Claim) {
  await claims.save(claim); // one user's work may be rejected or overwritten late
}
```

**✅ Positive (typescript)**

```typescript
async function openClaimForEdit(user: User, claimId: string) {
  const acquired = await lockStore.acquire({
    resource: 'claim:' + claimId,
    owner: user.id,
    expiresInMinutes: 30
  });
  if (!acquired) throw new ClaimAlreadyBeingEdited(claimId);
  return claims.load(claimId);
}

async function saveClaim(user: User, claim: Claim) {
  await lockStore.assertOwner('claim:' + claim.id, user.id);
  await claims.save(claim);
  await lockStore.release('claim:' + claim.id, user.id);
}
```

*The positive version prevents conflicting edits before users invest effort and verifies lock ownership again at save time.*

## Relationships

**Synergies**

- [Registry](../enterprise-application/registry.md) — A lock manager is often registered as an application service shared by controllers and jobs.
- [Service Layer](../enterprise-application/service-layer.md) — Service Layer operations can acquire and release locks around business transactions consistently.
- [Unit of Work](../enterprise-application/unit-of-work.md) — Unit of Work can verify the lock owner during commit and release locks after success or rollback.
- [Timeout](../resilience/timeout.md) — Lock acquisition and renewal need timeouts so abandoned sessions do not block work forever.

**Conflicts with:** [Optimistic Offline Lock](../enterprise-application/optimistic-offline-lock.md)

**Alternatives:** [Optimistic Offline Lock](../enterprise-application/optimistic-offline-lock.md), [Optimistic Concurrency Control](../data-persistence/optimistic-concurrency-control.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, sql
- **Frameworks:** spring-boot, dotnet, redis, hibernate
- **Project types:** backend-service, web-api, modular-monolith, distributed-system
- **Tags:** concurrency, locking, workflow

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

