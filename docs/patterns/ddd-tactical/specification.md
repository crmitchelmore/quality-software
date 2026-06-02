# Specification

> Encapsulate a business rule as a composable predicate that can validate objects, select candidates, or explain eligibility decisions.

**Scale:** design · **Category:** ddd-tactical · **Maturity:** time-tested

## Description

A Specification packages a domain predicate behind a name such as EligibleForUpgrade, CanShipInternationally, or OverCreditLimit. Specifications can be combined with and/or/not, reused by entities, domain services, and repositories, and tested independently. In DDD they are valuable when a rule is important enough to name, reused in multiple workflows, or must be translated into a query while retaining domain meaning.

**Problem.** Eligibility and selection rules are often duplicated as inline if statements, SQL fragments, and UI filters. Over time the same business concept diverges across commands, reports, and validations.

**Context.** Use specifications for reusable or composable predicates, particularly when the same rule needs to validate an aggregate and query a repository.

## Consequences / Trade-offs

- Gives business rules names and makes them reusable across workflows.
- Supports composition and unit testing of complex eligibility logic.
- Can bridge domain predicates to persistence queries when carefully designed.
- Overuse creates many tiny classes for one-off conditions; query translation can leak persistence concerns.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Too much structure for one-off conditions; use when the rule is named or reused. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for eligibility, policy, and search criteria shared by application workflows. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable in large domains, but enforce conventions to avoid a proliferation of trivial predicate classes. |

## Examples

### Upgrade eligibility rule

**❌ Negative (csharp)**

```csharp
if (customer.Status == "Active" && customer.TotalSpend > 1000 && !customer.HasOpenDispute)
{
    customer.UpgradeToGold();
}

var candidates = db.Customers.Where(c => c.Status == "Active" && c.TotalSpend > 1000 && !c.HasOpenDispute);
```

**✅ Positive (csharp)**

```csharp
public interface ISpecification<T>
{
    bool IsSatisfiedBy(T candidate);
}

public sealed class EligibleForGoldUpgrade : ISpecification<Customer>
{
    public bool IsSatisfiedBy(Customer customer) =>
        customer.IsActive && customer.TotalSpend().IsGreaterThan(Money.gbp(1000_00)) && !customer.HasOpenDispute;
}

if (new EligibleForGoldUpgrade().IsSatisfiedBy(customer))
{
    customer.UpgradeToGold();
}
```

*The positive version names the business rule once and makes it testable. A repository adapter can translate the same specification concept to an efficient query without duplicating the language.*

## Relationships

**Synergies**

- [Repository](../data-persistence/repository.md) — Repositories can accept specifications to express domain criteria without exposing SQL or ORM details.
- [Value Object](../ddd-tactical/value-object.md) — Specifications are clearer when predicates use rich value-object behaviour instead of primitive comparisons.
- [Domain Service](../ddd-tactical/domain-service.md) — Domain services can delegate reusable eligibility rules to specifications.
- [Composite](../gof-structural/composite.md) — Composite structure naturally models and/or/not combinations of specifications.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Query Object](../enterprise-application/query-object.md), [Strategy](../gof-behavioural/strategy.md), [Guard Clause (Early Return)](../implementation/guard-clause.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, dotnet, spring-boot, entity-framework, hibernate
- **Project types:** backend-service, modular-monolith, microservices, web-api
- **Tags:** ddd, rules, predicates, query

## References

- Martin Fowler and Eric Evans, Specifications, (2004)
- Eric Evans, Domain-Driven Design, (2003)

