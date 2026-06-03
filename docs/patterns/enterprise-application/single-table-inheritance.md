# Single Table Inheritance

> Store an entire inheritance hierarchy in one database table, using a discriminator column to identify the concrete subtype for each row.

**Scale:** data · **Altitude:** medium · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Single Table Inheritance maps a class hierarchy to one table with columns for all subtype-specific fields plus a discriminator such as type. It is fast to query because no joins are needed, and it works well when subtypes share many fields or the hierarchy is shallow. Its cost is schema looseness: many nullable columns, weaker subtype constraints, and a table that can become wide as the hierarchy grows.

**Problem.** Object hierarchies need persistence, but separate tables can make polymorphic reads expensive and complicated when most queries need all subtypes together.

**Context.** Use when subtypes are queried together, have substantial common data, and subtype-specific fields are few. Prefer class table inheritance when subtype-specific data and constraints dominate.

## Consequences / Trade-offs

- Polymorphic reads are simple and fast because one table contains the whole hierarchy.
- Schema migrations are straightforward for common fields and cross-type indexes.
- Subtype-only columns are nullable for other types, weakening relational constraints.
- A growing hierarchy can produce a sparse, confusing table with many conditional rules.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Simple and pragmatic for small hierarchies; beware premature inheritance in the domain. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good when polymorphic reads dominate and subtype fields remain modest. |
| Large (>100k LOC) | ●●●○○ 3/5 | Can work at scale for stable shallow hierarchies, but sparse tables and constraints become costly. |

## Examples

### Payment method hierarchy

**❌ Negative (sql)**

```sql
-- Card and bank payments are queried together, but every listing needs unions.
SELECT id, amount, 'card' AS kind FROM card_payments WHERE customer_id = 42
UNION ALL
SELECT id, amount, 'bank' AS kind FROM bank_payments WHERE customer_id = 42;
```

**✅ Positive (sql)**

```sql
CREATE TABLE payments (
  id BIGINT PRIMARY KEY,
  customer_id BIGINT NOT NULL,
  kind VARCHAR(20) NOT NULL,
  amount_cents INTEGER NOT NULL,
  card_last4 VARCHAR(4),
  bank_account_hash VARCHAR(64),
  version INTEGER NOT NULL
);

SELECT id, kind, amount_cents, card_last4, bank_account_hash
  FROM payments
 WHERE customer_id = 42;
```

*The positive version makes polymorphic reads cheap and centralises the discriminator, accepting nullable subtype columns as the trade-off.*

## Relationships

**Synergies**

- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper can use the discriminator to instantiate the correct subtype while keeping domain classes persistence-ignorant.
- [Metadata Mapping](../enterprise-application/metadata-mapping.md) — Metadata can declare discriminator values and subtype column mappings in one place.
- [Query Object](../enterprise-application/query-object.md) — Query Objects can centralise type filters and avoid scattering discriminator strings.
- [Optimistic Offline Lock](../enterprise-application/optimistic-offline-lock.md) — A shared table makes a single version column easy to enforce across all subtypes.

**Conflicts with:** [Class Table Inheritance](../enterprise-application/class-table-inheritance.md)

**Alternatives:** [Class Table Inheritance](../enterprise-application/class-table-inheritance.md), [Active Record](../enterprise-application/active-record.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, sql
- **Frameworks:** hibernate, entity-framework, sqlalchemy, rails
- **Project types:** backend-service, web-api, monolith, modular-monolith
- **Tags:** inheritance-mapping, discriminator, persistence

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

