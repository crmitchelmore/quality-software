# Row Data Gateway

> Represent one database row with an object that exposes finder-independent persistence operations for that row.

**Scale:** data · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Row gateway

## Description

Row Data Gateway wraps a single row and gives it methods to insert, update, or delete that row. It is thinner than Active Record because business logic usually lives elsewhere; the object is mainly a persistence-aware data holder. It can be useful when each row needs procedural access but a full mapper is unjustified.

**Problem.** Callers working with row-shaped data need a consistent way to persist individual rows without embedding SQL everywhere, but the application may not warrant rich domain objects or Active Record-style business methods.

**Context.** Use for legacy applications, generated data access layers, or simple table-driven modules where one object per row improves organisation but domain behaviour remains in services or table modules.

## Consequences / Trade-offs

- Makes per-row persistence operations explicit and colocated with row fields.
- Simpler than a mapper for straightforward record editing workflows.
- Can become an anaemic Active Record if business logic slowly migrates into row objects.
- Less efficient for bulk operations unless paired with table-level gateways or batching.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for simple row editing, though Active Record or a table gateway is often more convenient. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for legacy and generated access layers; set-oriented operations may need companion gateways. |
| Large (>100k LOC) | ●●○○○ 2/5 | Rarely ideal as a main pattern because it exposes row shape widely and handles complex invariants poorly. |

## Examples

### Editing one customer row

**❌ Negative (java)**

```java
void changeEmail(Connection c, long id, String email) throws SQLException {
    try (PreparedStatement s = c.prepareStatement(
        "update customers set email = ? where id = ?")) {
        s.setString(1, email);
        s.setLong(2, id);
        s.executeUpdate();
    }
}
```

**✅ Positive (java)**

```java
final class CustomerRow {
    private final Connection connection;
    long id;
    String email;

    void update() throws SQLException {
        try (PreparedStatement s = connection.prepareStatement(
            "update customers set email = ? where id = ?")) {
            s.setString(1, email);
            s.setLong(2, id);
            s.executeUpdate();
        }
    }
}

CustomerRow row = customers.find(id);
row.email = newEmail;
row.update();
```

*The SQL for updating a customer row is no longer scattered through callers. The object remains row-oriented; richer validation or cross-row rules should still live outside it.*

## Relationships

**Synergies**

- [Table Data Gateway](../enterprise-application/table-data-gateway.md) — A table gateway can create Row Data Gateway instances and handle set-oriented finder operations.
- [Transaction Script](../enterprise-application/transaction-script.md) — Transaction Scripts can orchestrate row gateways for simple business procedures.
- [Table Module](../enterprise-application/table-module.md) — Table Module keeps business logic table-oriented while row gateways handle persistence mechanics.

**Conflicts with:** [Domain Model](../enterprise-application/domain-model.md)

**Alternatives:** [Active Record](../enterprise-application/active-record.md), [Data Mapper](../enterprise-application/data-mapper.md), [Table Data Gateway](../enterprise-application/table-data-gateway.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, php
- **Frameworks:** none, spring-boot, dotnet, nodejs, django
- **Project types:** web-api, backend-service, monolith, modular-monolith
- **Tags:** row-object, data-access, legacy, crud

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

