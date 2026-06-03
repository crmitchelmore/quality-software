# Canonical Data Model

> Define a stable enterprise message shape so integrations translate once at the boundary instead of every system learning every other system's private schema.

**Scale:** integration · **Altitude:** high · **Category:** enterprise-integration · **Maturity:** time-tested

**Also known as:** Canonical Message Model, Enterprise Canonical Model

## Description

A Canonical Data Model establishes a shared representation for messages that cross application or bounded-context boundaries. Producers translate their native records into the canonical form, consumers translate from that form into their local model, and the integration layer owns versioning and compatibility rules. It is most valuable when many systems exchange the same business concepts and pairwise mappings would otherwise grow quadratically. It is not a global domain model: local systems still keep their own vocabulary and invariants, while the canonical model is a deliberately narrow interchange contract.

**Problem.** Without a common interchange shape, every new integration adds bespoke mappings, field semantics drift, and teams accidentally couple to each other's internal database or API structures.

**Context.** Multiple applications exchange recurring business messages such as orders, customers, shipments or payments, especially during enterprise integration, mergers, legacy modernisation or message-bus adoption.

## Consequences / Trade-offs

- Reduces pairwise translators and makes integration contracts easier to test and govern.
- Centralises semantic decisions such as identifiers, currencies, timestamps, nullability and versioning.
- Can become a lowest-common-denominator enterprise schema if treated as the domain model for every system.
- Requires explicit ownership, change control and compatibility policy; otherwise it slows delivery.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary overhead when only one or two systems integrate; direct translation is cheaper. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Useful once repeated business concepts are exchanged across several services or vendors. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent fit for large enterprises, provided ownership and versioning prevent the model becoming a bottleneck. |

## Examples

### Publishing an order with a canonical envelope

**❌ Negative (typescript)**

```typescript
// Billing must understand Checkout's private database/API shape.
await kafka.send({
  topic: "billing.orders",
  messages: [{
    value: JSON.stringify({
      order_tbl_id: row.id,
      cust_ref: row.customer_id,
      total_cents: row.gross_total,
      curr: row.currency_code,
      ts: row.created_at,
      internal_status: row.state
    })
  }]
});
```

**✅ Positive (typescript)**

```typescript
type CanonicalOrderAccepted = {
  messageType: "OrderAccepted";
  messageVersion: 2;
  orderId: string;
  customerId: string;
  acceptedAt: string;
  amount: { currency: string; minorUnits: number };
};

function toCanonical(row: CheckoutOrder): CanonicalOrderAccepted {
  return {
    messageType: "OrderAccepted",
    messageVersion: 2,
    orderId: row.id,
    customerId: row.customerId,
    acceptedAt: row.createdAt.toISOString(),
    amount: { currency: row.currency, minorUnits: row.totalMinorUnits }
  };
}

await kafka.send({
  topic: "enterprise.order.accepted.v2",
  messages: [{ key: row.id, value: JSON.stringify(toCanonical(row)) }]
});
```

*The positive version publishes a stable integration contract with explicit versioning and domain names. Consumers depend on the canonical message, not Checkout's storage names or accidental status fields.*

## Relationships

**Synergies**

- [Message Translator](../enterprise-integration/message-translator.md) — Translators adapt each endpoint's native model to and from the canonical interchange shape.
- [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md) — An ACL protects a domain from canonical or legacy compromises leaking into its internal model.
- [Published Language](../ddd-strategic/published-language.md) — A published language gives the canonical model documented vocabulary and versioned semantics.
- [Message Bus](../enterprise-integration/message-bus.md) — A bus benefits from canonical messages because participants do not need pairwise schema knowledge.

**Alternatives:** [Message Translator](../enterprise-integration/message-translator.md), [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md), [Published Language](../ddd-strategic/published-language.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** kafka, rabbitmq, nats, spring-boot
- **Project types:** microservices, distributed-system, backend-service, data-pipeline
- **Tags:** integration, schema, messaging

## References

- Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)

