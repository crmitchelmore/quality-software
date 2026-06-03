# Metadata Mapping

> Describe object-relational mapping rules as metadata so generic mapper code can read columns, associations, inheritance, and conversions consistently.

**Scale:** data · **Altitude:** medium · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Metadata Mapping moves mapping knowledge out of hand-coded SQL fragments and into declarative metadata: annotations, XML, YAML, fluent configuration, or schema descriptors. Runtime or generated mapper code uses that metadata to load, save, validate, and construct objects. It is the foundation of many ORMs and persistence frameworks, but it should remain explicit enough that developers understand the SQL and lifecycle implications.

**Problem.** Hand-written mappers duplicate column names, joins, conversions, and discriminator rules, leading to inconsistent persistence behaviour and costly schema changes.

**Context.** Use when many domain types share persistence conventions or when mapping definitions need to be inspected, generated, or changed centrally. Avoid hiding complex queries behind opaque metadata.

## Consequences / Trade-offs

- Centralises table, column, association, and inheritance mapping definitions.
- Enables generic tooling for migrations, validation, schema generation, and mapper construction.
- Can make performance and query behaviour opaque if metadata is too magical.
- Metadata drift can break runtime behaviour unless mappings are validated by tests and tooling.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary unless a framework already provides it cheaply. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Valuable when many entities share conventions and schema changes are frequent. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large ORM-backed systems, provided metadata is validated and performance remains observable. |

## Examples

### Declarative entity mapping

**❌ Negative (java)**

```java
final class CustomerMapper {
    Customer load(ResultSet rs) throws SQLException {
        return new Customer(
            new CustomerId(rs.getLong("customer_id")),
            new Email(rs.getString("email_address")),
            rs.getLong("version_no"));
    }

    String updateSql() {
        return "UPDATE customers SET email_address=?, version_no=version_no+1 WHERE customer_id=?";
    }
}
```

**✅ Positive (java)**

```java
@Table(name = "customers")
final class Customer {
    @Id(name = "customer_id") CustomerId id;
    @Column(name = "email_address") Email email;
    @Version(name = "version_no") long version;
}

final class MetadataMapper {
    Customer load(Class<Customer> type, ResultSet row) {
        Mapping metadata = mappings.forType(type);
        return metadata.constructFrom(row);
    }
}
```

*The positive version records mapping facts once and lets generic mapper infrastructure apply them consistently across loads, saves, and version checks.*

## Relationships

**Synergies**

- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper often uses metadata to avoid bespoke load/save code for every entity.
- [Single Table Inheritance](../enterprise-application/single-table-inheritance.md) — Discriminators and subtype columns can be declared as metadata rather than repeated in query code.
- [Class Table Inheritance](../enterprise-application/class-table-inheritance.md) — Metadata can describe superclass/subclass joins and shared primary keys.
- [Registry](../enterprise-application/registry.md) — A mapping registry can load and expose metadata descriptors at application startup.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Active Record](../enterprise-application/active-record.md), [Table Data Gateway](../enterprise-application/table-data-gateway.md), [Row Data Gateway](../enterprise-application/row-data-gateway.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, python, typescript
- **Frameworks:** hibernate, entity-framework, sqlalchemy, typeorm, django
- **Project types:** backend-service, web-api, modular-monolith, monolith
- **Tags:** orm, mapping, metadata

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

