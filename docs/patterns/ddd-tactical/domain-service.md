# Domain Service

> Place domain behaviour that does not naturally belong to one entity or value object into a stateless service expressed in ubiquitous language.

**Scale:** design · **Altitude:** medium · **Category:** ddd-tactical · **Maturity:** time-tested

## Description

A Domain Service implements business logic that coordinates multiple domain objects or performs a domain operation without a natural owning entity. It is part of the domain model, not an application service or infrastructure adapter, and should speak domain language: PricingPolicy, FraudAssessment, TransferFunds. Good domain services are usually stateless, take entities/value objects as inputs, return domain results, and avoid framework or persistence concerns.

**Problem.** Some rules are forced into arbitrary entities because teams try to avoid services, while other systems put all business logic in application services. Both choices obscure ownership and weaken the model.

**Context.** Use a domain service when an operation is conceptually domain behaviour, spans multiple aggregates or value objects, and cannot be assigned to one object without making that object know too much.

## Consequences / Trade-offs

- Keeps entities cohesive by not stuffing cross-object policies into one aggregate.
- Names domain operations explicitly and makes them reusable across application workflows.
- Can slide into an anemic domain model if every behaviour becomes a service.
- Must stay infrastructure-free; persistence and messaging belong in application services/adapters.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Use sparingly; tiny systems often do not have enough cross-object behaviour to justify it. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit when rules span entities but the domain model remains behaviour-rich. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable in large models, though overuse creates service-heavy procedural domains; guard entity behaviour carefully. |

## Examples

### Transfer policy across accounts

**❌ Negative (java)**

```java
class Account {
    void transferTo(Account destination, Money amount, ExchangeRateProvider rates) {
        Money converted = rates.convert(amount, destination.currency());
        if (!canDebit(amount)) throw new IllegalStateException("insufficient funds");
        debit(amount);
        destination.credit(converted);
    }
}
```

**✅ Positive (java)**

```java
public final class FundsTransfer {
    private final ExchangeRates exchangeRates;

    public FundsTransfer(ExchangeRates exchangeRates) {
        this.exchangeRates = exchangeRates;
    }

    public void transfer(Account source, Account destination, Money amount) {
        if (!source.canDebit(amount)) throw new DomainException("Insufficient funds");
        Money destinationAmount = exchangeRates.convert(amount, destination.currency());
        source.debit(amount);
        destination.credit(destinationAmount);
    }
}
```

*The positive version avoids making Account depend on exchange-rate policy or know how another account should be credited. The transfer remains domain logic, but the service owns the cross-account operation.*

## Relationships

**Synergies**

- [Entity](../ddd-tactical/entity.md) — Domain services coordinate entities without taking over behaviour that clearly belongs inside one entity.
- [Value Object](../ddd-tactical/value-object.md) — Services should accept and return rich value objects so rules stay type-safe and intention-revealing.
- [Specification](../ddd-tactical/specification.md) — Specifications can package reusable predicates consumed by a domain service.
- [Service Layer](../enterprise-application/service-layer.md) — Application services can call domain services while handling transactions, security, and integration.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Transaction Script](../enterprise-application/transaction-script.md), [Strategy](../gof-behavioural/strategy.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, dotnet, spring-boot, nestjs
- **Project types:** backend-service, modular-monolith, microservices, web-api
- **Tags:** ddd, domain-model, service, cohesion

## References

- Eric Evans, Domain-Driven Design, (2003)

