# Table Module

> Place business logic in one class or module per database table, operating on sets of records rather than objects per row.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Table-oriented domain logic

## Description

Table Module organises logic around tables or record sets. Instead of each row having behaviour, a module such as CustomerTable or ContractTable contains operations over rows, often backed by datasets, gateways, or stored procedures. It suits environments where tables are the dominant abstraction and set-oriented processing matters.

**Problem.** A full Domain Model may be unnatural for table-shaped applications, reporting-heavy workflows, or platforms where data sets are already the primary unit. Pure transaction scripts can still duplicate rules across procedures.

**Context.** Use in table-centric enterprise applications, legacy database systems, reporting/admin tools, and .NET/DataSet-style designs where related rules apply consistently to rows from one table or view.

## Consequences / Trade-offs

- Centralises table-related rules without requiring one object per row.
- Works well with set-oriented database operations and legacy schemas.
- Keeps code close to table shape, which can leak storage decisions into business policy.
- Less expressive than Domain Model for behaviour involving rich object collaboration and invariants across aggregates.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually not needed; a script or Active Record is simpler. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for table-centric business systems and legacy database applications. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful in table-oriented subsystems, but large core domains often need richer Domain Models to avoid storage-shaped policy. |

## Examples

### Set-oriented discount rules

**❌ Negative (csharp)**

```csharp
foreach (DataRow row in orders.Rows) {
    if ((decimal)row["total"] > 1000m) {
        row["discount"] = 0.10m;
    }
}

foreach (DataRow row in renewalOrders.Rows) {
    if ((decimal)row["total"] > 1000m) {
        row["discount"] = 0.10m;
    }
}
```

**✅ Positive (csharp)**

```csharp
public sealed class OrderTableModule {
    private readonly DataTable orders;

    public OrderTableModule(DataTable orders) {
        this.orders = orders;
    }

    public void ApplyVolumeDiscounts() {
        foreach (DataRow row in orders.Rows) {
            if ((decimal)row["total"] > 1000m) {
                row["discount"] = 0.10m;
            }
        }
    }
}
```

*The discount rule is expressed once for the order table rather than copied through scripts. The design remains set-oriented and table-shaped, which is appropriate for this style of application.*

## Relationships

**Synergies**

- [Table Data Gateway](../enterprise-application/table-data-gateway.md) — The gateway provides the module with consistent table access while the module owns business operations.
- [Transaction Script](../enterprise-application/transaction-script.md) — Scripts can delegate repeated table-specific rules to a Table Module instead of duplicating them.
- [Query Object](../enterprise-application/query-object.md) — Query Objects help Table Modules expose complex set selection without long method lists.

**Conflicts with:** [Domain Model](../enterprise-application/domain-model.md)

**Alternatives:** [Domain Model](../enterprise-application/domain-model.md), [Transaction Script](../enterprise-application/transaction-script.md), [Active Record](../enterprise-application/active-record.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript, python
- **Frameworks:** dotnet, spring-boot, nodejs, django, none
- **Project types:** monolith, backend-service, data-pipeline, modular-monolith
- **Tags:** table-oriented, set-based, legacy, business-logic

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

