# Domain Event

> Capture a business-significant occurrence as an immutable fact so other parts of the domain can react without coupling to the initiating object.

**Scale:** design · **Category:** ddd-tactical · **Maturity:** time-tested

## Description

A Domain Event names something that has already happened in the business, usually in past tense: OrderConfirmed, PaymentCaptured, ClaimRejected. It is raised by domain behaviour when a meaningful state transition occurs and carries the minimal facts needed by interested handlers. Inside a process it decouples side effects from the aggregate method; across boundaries it often feeds an outbox, message bus, or integration event after translation. Domain events are not generic CRUD notifications; they should reflect language the business uses.

**Problem.** Without events, initiating services directly call every downstream side effect: send email, update loyalty, start fulfilment, notify analytics. This creates temporal coupling and makes the original operation brittle as new reactions are added.

**Context.** Use domain events when a domain action has consequences in other aggregates, bounded contexts, or policies, but the initiating model should not know who reacts.

## Consequences / Trade-offs

- Decouples the decision that something happened from the policies that react to it.
- Creates an auditable vocabulary of important business facts.
- Enables eventual consistency between aggregates and contexts.
- Requires clear transaction and delivery semantics; in-process events are not automatically reliable integration messages.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often unnecessary in tiny CRUD apps; direct calls are simpler when there are no independent reactions. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit when multiple policies react to one business event inside a modular monolith or service. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large domain systems, especially where bounded contexts integrate asynchronously and require auditable business facts. |

## Examples

### Raising an order-confirmed event

**❌ Negative (csharp)**

```csharp
public async Task Confirm(Guid orderId)
{
    var order = await orders.Get(orderId);
    order.Status = "Confirmed";
    await orders.Save(order);
    await email.SendConfirmation(order.CustomerEmail);
    await fulfilment.Start(order.Id);
    await loyalty.AwardPoints(order.CustomerId, order.Total);
}
```

**✅ Positive (csharp)**

```csharp
public sealed record OrderConfirmed(OrderId OrderId, CustomerId CustomerId, Money Total, Instant OccurredAt);

public sealed class Order
{
    private readonly List<object> events = new();
    public IReadOnlyCollection<object> DomainEvents => events.AsReadOnly();

    public void Confirm(IClock clock)
    {
        if (Status != OrderStatus.Ready) throw new DomainException("Order is not ready");
        Status = OrderStatus.Confirmed;
        events.Add(new OrderConfirmed(Id, CustomerId, Total, clock.Now()));
    }
}

// Application service saves the order; handlers react to OrderConfirmed afterwards.
```

*The positive version keeps the aggregate responsible for the business fact and lets independent handlers add email, fulfilment, or loyalty reactions without modifying Confirm.*

## Relationships

**Synergies**

- [Aggregate](../ddd-tactical/aggregate.md) — Aggregates raise domain events after enforcing invariants, keeping event facts trustworthy.
- [Transactional Outbox](../cloud-distributed/outbox.md) — Outbox persists events with state changes before publishing them reliably to other processes.
- [Choreography](../cloud-distributed/choreography.md) — Domain events can drive cross-service workflows without a central orchestrator.
- [Published Language](../ddd-strategic/published-language.md) — Events exposed outside the bounded context should be translated into a stable published language.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Observer](../gof-behavioural/observer.md), [Process Manager](../enterprise-integration/process-manager.md), [Message Bus](../enterprise-integration/message-bus.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, dotnet, spring-boot, kafka, rabbitmq
- **Project types:** backend-service, microservices, modular-monolith, distributed-system
- **Tags:** ddd, events, eventual-consistency, decoupling

## References

- Eric Evans, Domain-Driven Design, (2003)
- Vaughn Vernon, Implementing Domain-Driven Design, (2013)

