# Class Table Inheritance

> Store each class in an inheritance hierarchy in its own table, joining subclass rows to superclass rows by the same primary key.

**Scale:** data · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Class Table Inheritance maps common superclass data to a base table and subtype-specific fields to subtype tables. It preserves relational structure and subtype constraints better than a single sparse table, but polymorphic reads require joins or unions. It fits hierarchies with meaningful subtype data, strong database constraints, and less frequent cross-hierarchy listing.

**Problem.** A single inheritance table becomes sparse and weakly constrained when subtypes have many distinct fields, yet the object model still needs shared superclass identity and behaviour.

**Context.** Use when subtype data is substantial and relational integrity matters. Avoid for hot polymorphic reads where join cost and query complexity dominate.

## Consequences / Trade-offs

- Keeps subtype columns non-null and constrained in subtype-specific tables.
- Reflects the object hierarchy clearly in the database schema.
- Polymorphic loads require joins or multiple queries, increasing latency and mapper complexity.
- Refactoring the hierarchy can be expensive because it touches several tables and migrations.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too much schema and mapper complexity for small systems. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational when subtype constraints matter more than read simplicity. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong for stable, regulated data models with rich subtype-specific fields and integrity requirements. |

## Examples

### Insurance policy hierarchy

**❌ Negative (sql)**

```sql
CREATE TABLE policies (
  id BIGINT PRIMARY KEY,
  kind VARCHAR(20) NOT NULL,
  premium_cents INTEGER NOT NULL,
  vehicle_vin VARCHAR(17),
  property_address TEXT,
  flood_zone VARCHAR(10),
  driver_count INTEGER
);
-- Many columns are meaningless for each policy kind and hard to constrain.
```

**✅ Positive (sql)**

```sql
CREATE TABLE policies (
  id BIGINT PRIMARY KEY,
  kind VARCHAR(20) NOT NULL,
  premium_cents INTEGER NOT NULL
);

CREATE TABLE vehicle_policies (
  id BIGINT PRIMARY KEY REFERENCES policies(id),
  vehicle_vin VARCHAR(17) NOT NULL,
  driver_count INTEGER NOT NULL
);

CREATE TABLE property_policies (
  id BIGINT PRIMARY KEY REFERENCES policies(id),
  property_address TEXT NOT NULL,
  flood_zone VARCHAR(10) NOT NULL
);
```

*The positive version keeps subtype fields in constrained tables, trading simpler integrity for join-heavy polymorphic reads.*

## Relationships

**Synergies**

- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper coordinates the multi-table load and assembles the right domain subtype.
- [Unit of Work](../enterprise-application/unit-of-work.md) — Unit of Work can write superclass and subclass rows atomically.
- [Metadata Mapping](../enterprise-application/metadata-mapping.md) — Metadata centralises table joins, primary-key sharing, and subtype mappings.
- [Identity Map](../enterprise-application/identity-map.md) — Identity Map prevents duplicate objects when superclass and subclass rows are loaded through different paths.

**Conflicts with:** [Single Table Inheritance](../enterprise-application/single-table-inheritance.md)

**Alternatives:** [Single Table Inheritance](../enterprise-application/single-table-inheritance.md), [Active Record](../enterprise-application/active-record.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, sql
- **Frameworks:** hibernate, entity-framework, sqlalchemy, django
- **Project types:** backend-service, web-api, monolith, modular-monolith
- **Tags:** inheritance-mapping, relational-integrity, persistence

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

