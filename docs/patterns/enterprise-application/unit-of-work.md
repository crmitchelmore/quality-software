# Unit of Work

> Track all object changes made during a business transaction and write them as one atomic commit.

**Scale:** data · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Transactional unit, Change set

## Description

Unit of Work keeps a deliberate boundary around a business transaction. It records new, dirty, and removed objects, coordinates their ordering, and commits them through one database transaction so callers do not scatter saves through domain logic. In object-relational systems it is often hidden inside an ORM session, but the pattern is still the boundary that decides when work becomes durable.

**Problem.** When each object or repository writes immediately, a use case can partially persist state, issue duplicate SQL, violate ordering constraints, or leave callers to remember which objects must be saved. Retried or automated callers make this worse because the same logical operation can be attempted more than once.

**Context.** Use it when a request or application service changes several related objects and the system needs one atomic outcome, especially with repositories, Data Mapper, Identity Map, optimistic locks, or domain models with invariants spanning multiple rows.

## Consequences / Trade-offs

- Centralises transaction demarcation and makes commit/rollback explicit at the application boundary.
- Allows batching, ordering, concurrency checks, and domain-event/outbox collection before durable commit.
- Can become a hidden global session if its lifetime is not scoped tightly to one request or use case.
- Long-running units of work are dangerous; do not hold them across user interaction, remote calls, or model inference.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when even a small application updates several records together, but explicit transaction scripts may be simpler. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent fit: repository, ORM session, and application service boundaries usually need coordinated commits. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large domain systems because batching, optimistic checks, outbox capture, and audit fields need one reliable commit boundary. |

## Examples

### Committing an order workflow

**❌ Negative (csharp)**

```csharp
public async Task Place(Guid cartId) {
    var cart = await carts.Find(cartId);
    var order = Order.From(cart);
    await orders.Insert(order);          // committed
    cart.MarkCheckedOut();
    await carts.Update(cart);            // may fail, leaving an order for an open cart
    await email.SendConfirmation(order); // external call inside persistence flow
}
```

**✅ Positive (csharp)**

```csharp
public async Task Place(Guid cartId) {
    var cart = await carts.Get(cartId);
    var order = Order.From(cart);

    orders.Add(order);
    cart.MarkCheckedOut();
    outbox.Add(OrderPlaced.From(order));

    await unitOfWork.CommitAsync();
}
```

*The positive version stages all durable changes and commits them once. External side effects are represented as an outbox record rather than performed while a transaction is open, reducing partial writes and retry hazards.*

## Relationships

**Synergies**

- [Repository](../data-persistence/repository.md) — Repositories provide collection-like access while Unit of Work coordinates when their loaded and changed aggregates are flushed.
- [Identity Map](../enterprise-application/identity-map.md) — Identity Map gives the Unit of Work one in-memory instance per row, making change tracking and relationship consistency reliable.
- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper implementations commonly delegate inserts, updates, and deletes to a Unit of Work at commit time.
- [Optimistic Offline Lock](../enterprise-application/optimistic-offline-lock.md) — The Unit of Work is a natural place to check version columns and fail the whole commit on stale data.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Active Record](../enterprise-application/active-record.md), [Transaction Script](../enterprise-application/transaction-script.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby
- **Frameworks:** hibernate, entity-framework, typeorm, sqlalchemy, rails
- **Project types:** backend-service, web-api, modular-monolith, monolith
- **Tags:** transaction-boundary, change-tracking, persistence, consistency

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

