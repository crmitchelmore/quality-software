# Factory (DDD)

> Encapsulate complex creation of aggregates or value objects so newly created domain objects are valid and intention-revealing from the start.

**Scale:** design · **Altitude:** low · **Category:** ddd-tactical · **Maturity:** time-tested

## Description

A DDD Factory centralises creation logic when constructing an object is more than calling a constructor. It may assign identities, choose subtypes, assemble child entities, validate cross-field rules, or translate a creation command into a valid aggregate. Unlike a generic GoF factory, a DDD factory is part of the domain model when creation itself contains domain rules. Use named creation methods such as registerNewCustomer or createTrialSubscription, and keep persistence and transport concerns outside.

**Problem.** Complex constructors and scattered object initialisation let callers forget required fields, create partially valid aggregates, or duplicate creation rules across application services.

**Context.** Use a factory when creating an aggregate or value object requires non-trivial rules, generated identifiers, default policies, or coordination of several domain objects.

## Consequences / Trade-offs

- Makes object creation explicit, valid, and expressed in domain language.
- Keeps constructors small while still protecting invariants.
- Reduces duplication of defaulting and assembly rules.
- Can become a dumping ground if it performs persistence, orchestration, or unrelated calculations.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary when constructors are simple; named constructors may be enough. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Useful when aggregates have complex creation rules or multiple creation scenarios. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong fit for complex domains, especially when creation policies must remain consistent across teams and applications. |

## Examples

### Creating a trial subscription

**❌ Negative (typescript)**

```typescript
const subscription = new Subscription();
subscription.id = randomUUID();
subscription.customerId = customerId;
subscription.plan = "trial";
subscription.endsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
subscription.status = "active";
subscription.seats = requestedSeats;
```

**✅ Positive (typescript)**

```typescript
class SubscriptionFactory {
  constructor(private readonly ids: IdGenerator, private readonly clock: Clock) {}

  createTrial(customerId: CustomerId, requestedSeats: number): Subscription {
    const seats = SeatCount.of(requestedSeats);
    const period = DateRange.startingOn(this.clock.today()).forDays(14);
    return Subscription.startTrial(
      SubscriptionId.of(this.ids.next()),
      customerId,
      seats,
      period,
    );
  }
}
```

*The positive version names the creation use case and prevents callers from forgetting identity, status, seat validation, or trial-period calculation.*

## Relationships

**Synergies**

- [Aggregate](../ddd-tactical/aggregate.md) — Factories can create aggregate roots with all required child entities and invariants established.
- [Value Object](../ddd-tactical/value-object.md) — Factories often compose validated value objects during aggregate creation.
- [Repository](../data-persistence/repository.md) — Factories create new aggregates; repositories later persist and rehydrate existing ones.
- [Builder](../gof-creational/builder.md) — Builders can help tests assemble many optional inputs, while factories enforce production creation rules.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Factory Method](../gof-creational/factory-method.md), [Abstract Factory](../gof-creational/abstract-factory.md), [Builder](../gof-creational/builder.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, dotnet, spring-boot, nestjs
- **Project types:** backend-service, modular-monolith, microservices, web-api
- **Tags:** ddd, creation, invariants, aggregates

## References

- Eric Evans, Domain-Driven Design, (2003)

