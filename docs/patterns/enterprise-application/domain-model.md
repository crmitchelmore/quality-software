# Domain Model

> Represent business concepts as objects with behaviour, invariants, and relationships rather than as passive records.

**Scale:** design · **Altitude:** medium · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Rich domain model, Object model

## Description

Domain Model organises application behaviour around domain objects that encode rules and meaningful operations. Entities, value objects, aggregates, and domain services collaborate so business policy lives in the model rather than in procedural scripts or controllers. It is most valuable when the domain has non-trivial rules, vocabulary, and lifecycle transitions.

**Problem.** When business rules are spread across controllers, SQL, and services, the same invariant is implemented inconsistently and changes require hunting through procedural code. Passive data structures make invalid states easy to construct.

**Context.** Use when business complexity is high enough to justify modelling language, invariants, and object collaboration explicitly. Pair it with persistence ignorance and application services rather than letting UI or database concerns dominate the model.

## Consequences / Trade-offs

- Concentrates business rules in intention-revealing objects that can be tested without infrastructure.
- Makes complex invariants and lifecycle transitions explicit through methods and types.
- Requires more design effort than Transaction Script and can be overbuilt for simple CRUD.
- Needs supporting persistence patterns such as Data Mapper or Repository to avoid database coupling.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary for simple CRUD; start with transaction scripts until rules justify a model. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit once business rules and lifecycle transitions appear across several use cases. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large enterprise systems where consistent policy, testing, and ubiquitous language matter more than initial ceremony. |

## Examples

### Capturing order invariants

**❌ Negative (csharp)**

```csharp
public void ApplyDiscount(OrderDto order, decimal percent) {
    if (percent > 50 && !order.CustomerIsVip) throw new Exception("too much");
    order.DiscountPercent = percent;
    order.Total = order.Lines.Sum(l => l.Price) * (1 - percent / 100);
}
```

**✅ Positive (csharp)**

```csharp
public sealed class Order {
    private readonly List<OrderLine> lines = new();
    public Money Total { get; private set; }

    public void ApplyDiscount(Discount discount, Customer customer) {
        if (discount.Percent > 50 && !customer.IsVip)
            throw new DiscountNotAllowed();

        Total = Money.Sum(lines.Select(l => l.Price)).Apply(discount);
    }
}
```

*The positive version names the domain concepts and keeps the discount invariant with the Order behaviour. Callers cannot update totals independently of the rule.*

## Relationships

**Synergies**

- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper preserves persistence ignorance so domain objects do not grow save/find methods.
- [Repository](../data-persistence/repository.md) — Repositories provide aggregate-oriented access without leaking SQL or ORM queries into the model.
- [Service Layer](../enterprise-application/service-layer.md) — Service Layer coordinates use cases and transactions while delegating business decisions to the Domain Model.
- [Value Object](../ddd-tactical/value-object.md) — Value Objects make invalid primitive states harder to represent inside the model.
- [Aggregate](../ddd-tactical/aggregate.md) — Aggregates define consistency boundaries for related domain objects.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md), [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Transaction Script](../enterprise-application/transaction-script.md), [Table Module](../enterprise-application/table-module.md), [Active Record](../enterprise-application/active-record.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby
- **Frameworks:** none, spring-boot, dotnet, hibernate, entity-framework, rails
- **Project types:** backend-service, modular-monolith, monolith, web-api, microservices
- **Tags:** business-rules, ddd, invariants, persistence-ignorance

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

