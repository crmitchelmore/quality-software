# Polyglot Persistence

> Use different storage technologies for different data models and access patterns instead of forcing all data into one database engine.

**Scale:** data · **Altitude:** high · **Category:** data-persistence · **Maturity:** established

## Description

Polyglot Persistence recognises that relational transactions, document flexibility, graph traversal, search indexing, object storage, and time-series aggregation optimise for different things. A system deliberately assigns each durable responsibility to the store that best fits its invariants and query patterns, then hides those choices behind service boundaries or repositories. The pattern is not a licence to add databases casually; every new engine adds security, backup, migration, and operational competence requirements.

**Problem.** A single database engine can become a poor fit when the system needs incompatible access patterns such as ACID order booking, full-text search, graph recommendations, and large binary storage.

**Context.** Use when distinct subdomains or workloads have proven needs that are not well served by the current store. Prefer one primary source of truth and explicit projections rather than many writable copies of the same facts.

## Consequences / Trade-offs

- Improves fit between data shape and access pattern, often simplifying queries and scaling.
- Raises operational complexity: teams need expertise, backups, monitoring, and access controls for each engine.
- Consistency across stores becomes explicit and usually eventual.
- Without ownership boundaries it degenerates into technology sprawl and duplicated truths.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●○○○○ 1/5 | Avoid for small apps; one well-modelled database is almost always cheaper and safer. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational once a specific workload demonstrably outgrows the primary store. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent in large systems when paired with ownership, projection pipelines, and strong operations. |

## Examples

### Keep one authority per fact

**❌ Negative (typescript)**

```typescript
async function changeEmail(userId: string, email: string) {
  await postgres.query("UPDATE users SET email=$1 WHERE id=$2", [email, userId]);
  await mongo.collection("users").updateOne({ _id: userId }, { $set: { email } });
  await search.index("users").update({ id: userId, email });
}
```

**✅ Positive (typescript)**

```typescript
async function changeEmail(userId: string, email: string) {
  await usersRepository.changeEmail(userId, email); // PostgreSQL is authoritative.
  await outbox.publish("user.email-changed", { userId, email });
}

async function projectUserEmailChanged(event: EmailChanged) {
  await search.index("users").update({ id: event.userId, email: event.email });
}
```

*The positive version keeps PostgreSQL as the source of truth and updates specialised stores through replayable projections rather than fragile multi-store writes.*

## Relationships

**Synergies**

- [Database per Service](../data-persistence/database-per-service.md) — Service ownership is a natural boundary for choosing the right store per capability.
- [CQRS (Command Query Responsibility Segregation)](../architecture/cqrs.md) — CQRS separates transactional write models from search, analytics, or document-shaped read models.
- [Materialized View](../cloud-distributed/materialized-view.md) — Specialised stores often hold projections built from the canonical source.
- [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md) — Adapters protect the domain from store-specific query languages and data shapes.

**Conflicts with:** [Shared Kernel](../ddd-strategic/shared-kernel.md)

**Alternatives:** [Data Mapper](../enterprise-application/data-mapper.md), [Repository](../data-persistence/repository.md), [Modular Monolith](../architecture/modular-monolith.md)

## Applicability tags

- **Languages:** language-agnostic, sql, java, python, typescript
- **Frameworks:** none, spring-boot, kafka, redis, prisma
- **Project types:** distributed-system, microservices, data-pipeline, backend-service
- **Tags:** storage-selection, operational-complexity, data-modelling

