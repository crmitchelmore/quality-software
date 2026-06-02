# Database per Service

> Each independently deployable service owns its durable store and exposes state through APIs or events, not shared tables.

**Scale:** data · **Category:** data-persistence · **Maturity:** established

## Description

Database per Service gives every service exclusive authority over its schema, migration cadence, transaction boundary, and operational controls. Other services integrate through contracts such as REST, events, CDC streams, or sagas rather than joining tables directly. The pattern makes service autonomy real while making eventual consistency an explicit design concern.

**Problem.** A shared database couples services through tables, locks, migrations, and unofficial query dependencies, so one team cannot change a schema or scale a workload without coordinating with every consumer.

**Context.** Use for microservices or bounded contexts that have separate ownership, release cadence, and availability needs. Avoid splitting data merely because code was split; the boundary must match a stable business capability.

## Consequences / Trade-offs

- Strong ownership and least-privilege access are easier because each service grants access only to its own store.
- Distributed transactions become rare or impossible; sagas, outbox events, and compensating actions are required.
- Cross-service reporting needs read models, data products, or CDC pipelines rather than ad hoc joins.
- Operational burden increases because backup, migration, pooling, and observability are repeated per service.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually premature for tiny systems; it creates distributed-data work before there is enough team or domain pressure to justify it. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit once services have independent owners and release cadence, provided integration patterns are explicit. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large organisations where autonomy, blast-radius control, and database-level least privilege matter more than simple joins. |

## Examples

### Avoid joining across service schemas

**❌ Negative (typescript)**

```typescript
async function createInvoice(orderId: string) {
  const row = await db.query(`
    SELECT o.id, o.total, c.credit_limit
    FROM orders.orders o
    JOIN customers.customers c ON c.id = o.customer_id
    WHERE o.id = $1`, [orderId]);

  await db.query("INSERT INTO billing.invoices(order_id,total) VALUES($1,$2)",
    [row.rows[0].id, row.rows[0].total]);
}
```

**✅ Positive (typescript)**

```typescript
async function createInvoice(command: CreateInvoice) {
  const order = await ordersClient.getOrder(command.orderId);
  const credit = await customersClient.reserveCredit({
    customerId: order.customerId,
    amount: order.total,
    idempotencyKey: command.requestId
  });

  if (!credit.accepted) throw new CreditDeclined(command.orderId);
  await invoices.save(Invoice.opened(order.id, order.total));
}
```

*The positive version respects data ownership: Billing reads Orders and reserves Customer credit through contracts, so schema changes, grants, and transactions stay inside the owning services.*

## Relationships

**Synergies**

- [Microservices](../architecture/microservices.md) — A service-owned database is what makes independent deployment and scaling credible rather than cosmetic.
- [Saga](../cloud-distributed/saga.md) — Sagas coordinate workflows that previously relied on a single ACID transaction across shared tables.
- [CQRS (Command Query Responsibility Segregation)](../architecture/cqrs.md) — CQRS read models provide query-side joins and projections without violating service data ownership.
- [Transactional Outbox](../cloud-distributed/outbox.md) — The outbox publishes durable state changes from each owned database without dual-write races.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Modular Monolith](../architecture/modular-monolith.md), [Service-Oriented Architecture (SOA)](../architecture/service-oriented-architecture.md), [Shared Kernel](../ddd-strategic/shared-kernel.md)

## Applicability tags

- **Languages:** language-agnostic, sql, java, typescript, go
- **Frameworks:** spring-boot, dotnet, kafka, kubernetes, none
- **Project types:** microservices, backend-service, distributed-system, web-api
- **Tags:** service-ownership, distributed-data, eventual-consistency

