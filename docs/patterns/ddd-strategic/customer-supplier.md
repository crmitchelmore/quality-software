# Customer-Supplier

> Define an upstream/downstream relationship where the upstream supplier plans changes in collaboration with downstream customer needs.

**Scale:** organisational · **Category:** ddd-strategic · **Maturity:** time-tested

## Description

Customer-Supplier is a context-map relationship for two bounded contexts where the upstream team provides a model, API, or data feed and the downstream team depends on it. Unlike conformist, the downstream customer has a recognised voice in upstream planning: priorities, compatibility needs, release schedules, and contract changes are negotiated. It is an organisational agreement as much as a technical integration pattern.

**Problem.** Downstream teams often discover upstream changes after they break. If the upstream team ignores dependent needs, downstream workarounds multiply; if every request blocks upstream progress, delivery stalls.

**Context.** Use customer-supplier when one team owns a capability consumed by another and both can collaborate on planning, contracts, and compatibility.

## Consequences / Trade-offs

- Makes dependency power and planning responsibilities explicit.
- Reduces surprise breakage through roadmap and contract negotiation.
- Gives downstream needs a formal channel without transferring ownership.
- Fails when teams lack trust, cadence, or authority to honour the relationship.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●○○○○ 1/5 | Usually unnecessary with one team or one deployable; direct conversation is enough. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful as teams split ownership and need explicit upstream/downstream commitments. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large organisations because it turns dependency management into an explicit planning relationship. |

## Examples

### Downstream contract captured explicitly

**❌ Negative (typescript)**

```typescript
// Shipping silently depends on fields from Ordering's internal response.
const response = await fetch("/internal/orders/" + orderId);
const order = await response.json();
if (order.state === "paid" && order.lines.length > 0) scheduleShipment(order.lines);
```

**✅ Positive (typescript)**

```typescript
// Customer-supplier agreement: Shipping publishes this consumer contract.
interface PaidOrderForShipping {
  orderId: string;
  paidAt: string;
  shippableLines: Array<{ sku: string; quantity: number }>;
}

async function handlePaidOrder(event: PaidOrderForShipping): Promise<void> {
  if (event.shippableLines.length === 0) return;
  await scheduleShipment(event.orderId, event.shippableLines);
}
```

*The positive version turns the downstream need into an explicit contract that Ordering can plan against, rather than relying on an accidental internal shape.*

## Relationships

**Synergies**

- [Context Map](../ddd-strategic/context-map.md) — Customer-supplier should be shown on the map with upstream and downstream direction.
- [Bounded Context](../ddd-strategic/bounded-context.md) — The relationship connects separate bounded contexts without merging their models.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Consumer-driven contract tests make downstream expectations executable.
- [Published Language](../ddd-strategic/published-language.md) — A stable published language gives the supplier a concrete contract to negotiate and version.

**Conflicts with:** [Shared Kernel](../ddd-strategic/shared-kernel.md)

**Alternatives:** [Conformist](../ddd-strategic/conformist.md), [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md), [Open Host Service](../ddd-strategic/open-host-service.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, spring-boot, dotnet, grpc, graphql
- **Project types:** microservices, modular-monolith, distributed-system, backend-service
- **Tags:** ddd, strategic-design, team-collaboration, upstream-downstream

## References

- Eric Evans, Domain-Driven Design, (2003)

