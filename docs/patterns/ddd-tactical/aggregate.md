# Aggregate

> Group entities and value objects behind a root that enforces consistency boundaries and transactional invariants.

**Scale:** design · **Category:** ddd-tactical · **Maturity:** time-tested

## Description

An Aggregate is a cluster of domain objects treated as one consistency boundary. External code references only the aggregate root; child entities and value objects are modified through root methods. The root enforces invariants that must be true at transaction commit, while relationships to other aggregates are by identity rather than direct object references. Good aggregates are deliberately small and aligned to business consistency, not database table graphs.

**Problem.** Object graphs with unrestricted references allow any service to mutate any child object, making invariants unenforceable and transactions too broad. In distributed systems this produces lock contention, stale writes, and accidental coupling between business capabilities.

**Context.** Use aggregates when multiple domain objects participate in rules that must remain consistent together, especially when repositories, transactions, and domain events need a clear boundary.

## Consequences / Trade-offs

- Clarifies what must be saved atomically and what may become eventually consistent.
- Protects child entities by forcing modifications through intention-revealing root methods.
- Avoids large object graphs and cross-aggregate transactions when designed well.
- Poorly chosen boundaries cause either invariant leaks or oversized transactional bottlenecks.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often overkill for simple CRUD; use when there is a real invariant spanning multiple objects. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for domain services with meaningful transactions and repositories. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large systems because aggregate boundaries define safe transaction scope and team-shared consistency rules. |

## Examples

### Basket aggregate boundary

**❌ Negative (java)**

```java
class BasketService {
    void changeQuantity(Basket basket, UUID lineId, int quantity) {
        BasketLine line = basket.lines().stream()
            .filter(l -> l.id().equals(lineId))
            .findFirst()
            .orElseThrow();
        line.setQuantity(quantity);
        basket.setTotal(basket.lines().stream().mapToInt(BasketLine::lineTotal).sum());
    }
}
```

**✅ Positive (java)**

```java
public final class Basket {
    private final BasketId id;
    private final List<BasketLine> lines = new ArrayList<>();

    public void changeQuantity(BasketLineId lineId, Quantity quantity) {
        BasketLine line = lines.stream()
            .filter(candidate -> candidate.hasId(lineId))
            .findFirst()
            .orElseThrow(() -> new DomainException("Unknown basket line"));
        line.changeQuantity(quantity);
        if (total().isGreaterThan(Money.gbp(500_00))) {
            throw new DomainException("Basket exceeds approval limit");
        }
    }

    public Money total() {
        return lines.stream().map(BasketLine::lineTotal).reduce(Money.gbp(0), Money::add);
    }
}
```

*The positive version prevents callers from mutating a line independently of the basket invariant. The aggregate root owns both the child change and the approval-limit rule.*

## Relationships

**Synergies**

- [Entity](../ddd-tactical/entity.md) — The aggregate root is an entity whose identity is the only external handle to the cluster.
- [Value Object](../ddd-tactical/value-object.md) — Value objects keep aggregate internals compact and immutable where identity is unnecessary.
- [Repository](../data-persistence/repository.md) — Repositories are normally defined per aggregate root, not per table or child entity.
- [Domain Event](../ddd-tactical/domain-event.md) — Domain events communicate cross-aggregate consequences without broadening the transaction.

**Conflicts with:** [Table Data Gateway](../enterprise-application/table-data-gateway.md)

**Alternatives:** [Transaction Script](../enterprise-application/transaction-script.md), [Active Record](../enterprise-application/active-record.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, dotnet, spring-boot, hibernate, entity-framework
- **Project types:** backend-service, modular-monolith, microservices, distributed-system
- **Tags:** ddd, consistency-boundary, transactions, invariants

## References

- Eric Evans, Domain-Driven Design, (2003)
- Vaughn Vernon, Effective Aggregate Design, (2011)

