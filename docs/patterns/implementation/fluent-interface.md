# Fluent Interface

> Design method chains that read like a small domain language while progressively configuring or composing an object.

**Scale:** implementation · **Altitude:** low · **Category:** implementation · **Maturity:** established

**Also known as:** Method Chaining, Fluent API

## Description

A Fluent Interface returns the receiver or a next-stage object from methods so calls can be chained into a readable expression. It is most effective when the chain models a natural sequence: query construction, validation rules, builders, or test fixtures. The danger is making clever sentence-like APIs that obscure control flow, errors, or required ordering.

**Problem.** Repetitive configuration code can be noisy and lose the shape of the domain action among temporary variables and setters.

**Context.** Use for focused APIs where chaining improves readability and the valid sequence of calls is simple or type-enforced.

## Consequences / Trade-offs

- Produces concise, discoverable configuration or composition code.
- Can encode staged workflows when methods return narrower types.
- Debugging long chains can be harder than stepping through named variables.
- Over-fluent APIs can hide side effects and mandatory ordering.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Nice for small libraries but unnecessary for one-off configuration. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for stable internal DSLs, builders, and test data setup. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful selectively; long chains and hidden side effects become review risks. |

## Examples

### Query construction

**❌ Negative (csharp)**

```csharp
var query = new InvoiceQuery();
query.CustomerId = customerId;
query.IncludePaid = false;
query.SortField = "dueDate";
query.SortDescending = false;
var invoices = repository.Find(query);
```

**✅ Positive (csharp)**

```csharp
var invoices = repository
    .Invoices()
    .ForCustomer(customerId)
    .UnpaidOnly()
    .OrderByDueDate()
    .Find();
```

*The positive version makes the query read as one domain expression, reducing incidental setter noise while keeping each operation explicit.*

## Relationships

**Synergies**

- [Builder](../gof-creational/builder.md) — Builders commonly expose fluent methods for incremental construction.
- [Type State](../implementation/type-state.md) — Type State can make fluent chains safe by exposing only the next valid calls.
- [Options Object](../implementation/options-object.md) — Options Object is often simpler when configuration has no meaningful sequence.

**Conflicts with:** [Parameter Object](../implementation/parameter-object.md)

**Alternatives:** [Builder](../gof-creational/builder.md), [Options Object](../implementation/options-object.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, ruby
- **Frameworks:** none, sqlalchemy, entity-framework, graphql
- **Project types:** library, sdk, web-api
- **Tags:** api-design, readability, chaining

## References

- Martin Fowler, FluentInterface, (2005)

