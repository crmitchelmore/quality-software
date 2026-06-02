# Service Layer

> Define application operations as a boundary that coordinates domain logic, transactions, security, and integration.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Application service layer, Use-case layer

## Description

Service Layer exposes the use cases of an application through services such as PlaceOrder or TransferFunds. It coordinates repositories, units of work, domain objects, gateways, authorisation, and messaging, but should avoid becoming the place where all business rules live when a Domain Model exists. The layer gives controllers, jobs, and APIs one stable entry point for application behaviour.

**Problem.** Without a service layer, controllers, message handlers, and scheduled jobs duplicate transaction demarcation, authorisation, orchestration, and persistence calls. The same use case behaves differently depending on which adapter invoked it.

**Context.** Use when an application has multiple entry points, non-trivial transaction boundaries, or domain operations that need consistent orchestration across web, API, batch, and messaging adapters.

## Consequences / Trade-offs

- Creates a clear application API independent of transport details.
- Centralises transaction, authorisation, idempotency, and integration orchestration.
- Can turn into an anaemic god layer if domain rules are not pushed into Domain Model or well-named scripts.
- Adds indirection for very small applications with only one controller path.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when multiple adapters exist, but can be needless layering for a tiny single-controller app. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for backend services with transactions, authorisation, and integration boundaries. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large systems to keep transports thin and use-case behaviour consistent across many entry points. |

## Examples

### Keeping controllers thin

**❌ Negative (typescript)**

```typescript
app.post("/orders", async (req, res) => {
  const customer = await db.customers.find(req.body.customerId);
  const order = Order.create(customer, req.body.lines);
  await db.orders.insert(order);
  await bus.publish("OrderPlaced", { orderId: order.id });
  res.status(201).json({ id: order.id });
});
```

**✅ Positive (typescript)**

```typescript
class PlaceOrderService {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly orders: OrderRepository,
    private readonly unitOfWork: UnitOfWork
  ) {}

  async place(command: PlaceOrder): Promise<OrderId> {
    const customer = await this.customers.get(command.customerId);
    const order = Order.place(customer, command.lines);
    this.orders.add(order);
    await this.unitOfWork.commit();
    return order.id;
  }
}

app.post("/orders", async (req, res) =>
  res.status(201).json({ id: await placeOrder.place(req.body) })
);
```

*The controller only translates HTTP. The service provides a reusable application operation with one transaction boundary, so another adapter can place an order without duplicating orchestration.*

## Relationships

**Synergies**

- [Domain Model](../enterprise-application/domain-model.md) — The service layer coordinates use cases and delegates business decisions to domain objects.
- [Unit of Work](../enterprise-application/unit-of-work.md) — Application services are a natural place to start and commit a Unit of Work.
- [Repository](../data-persistence/repository.md) — Services use repositories to load and persist aggregates without depending on SQL or controllers.
- [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md) — DTOs form stable input and output contracts at the service boundary.
- [Front Controller](../enterprise-application/front-controller.md) — A Front Controller can route all requests into service-layer operations consistently.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Transaction Script](../enterprise-application/transaction-script.md), [Application Controller](../enterprise-application/application-controller.md), [Facade](../gof-structural/facade.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby
- **Frameworks:** spring-boot, dotnet, nestjs, django, rails, jakarta-ee
- **Project types:** backend-service, web-api, modular-monolith, monolith, microservices
- **Tags:** application-layer, use-case, transactions, orchestration

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

