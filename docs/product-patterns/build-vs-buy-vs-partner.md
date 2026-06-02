# Build vs Buy vs Partner

> Decide whether a capability should be built internally, purchased from a vendor, or delivered through a partner by comparing differentiation, speed, cost, control and risk.

**Discipline:** Product Management · **Category:** product-strategy · **Maturity:** established

**Also known as:** Make Buy Partner Decision

## Description

Build vs Buy vs Partner is a strategic sourcing pattern for product capabilities. It prevents teams from defaulting to engineering everything, buying everything that looks commoditised, or outsourcing decisions that define product differentiation. The decision balances whether the capability is core to advantage, how fast it is needed, what lifecycle control is required, and what integration, vendor and partner risks the organisation can tolerate.

**Problem.** Teams make capability decisions piecemeal: engineers build commodities, executives mandate vendors for core differentiators, or partnerships create dependencies that later constrain the product.

**Context.** Use when a roadmap requires a major capability, when entering a new market, or when a platform dependency could materially affect speed, margin, data ownership or strategic control.

## Forces

- Building maximises control and learning but consumes scarce engineering capacity.
- Buying accelerates delivery but can limit differentiation, data access and roadmap influence.
- Partnering can unlock channels or expertise but creates shared incentives and dependency risk.

## Solution

Classify the capability by strategic importance and market maturity. Build when it is core to differentiation or requires deep product learning. Buy when it is commodity, mature and faster to integrate than maintain. Partner when value depends on another party's reach, expertise or complementary asset. Document assumptions, exit options, integration costs, data rights and success metrics before committing.

## When to use

- A required capability is expensive enough to affect roadmap or platform strategy.
- Vendors or partners can provide speed, compliance, data or distribution advantages.
- The team needs to protect differentiation while avoiding unnecessary custom build.

## Metrics

Signals that tell you whether this pattern is working:

- Time-to-market difference between options and actual time saved.
- Total cost of ownership over the expected capability lifecycle.
- Strategic dependency risk score, including data access, switching cost and roadmap control.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Critical for speed and focus, though early teams may over-buy before understanding their core learning loop. |
| Growth (scaling team & users) | ●●●●● 5/5 | Very valuable as capacity constraints and differentiation choices become explicit. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential because vendor risk, procurement, security and integration costs become major strategic factors. |

## Examples

### Commodity capability

**❌ Poorer approach**

The team spends six months building billing infrastructure because subscriptions are important to revenue.

**✅ Better approach**

They buy a mature billing platform because billing is necessary but not differentiating, reserving engineering effort for usage insights that customers value.

*Importance is not the same as differentiation. The better choice preserves scarce capacity for product advantage.*

### Core learning loop

**❌ Poorer approach**

A recommendation product outsources its ranking engine entirely and receives only black-box results.

**✅ Better approach**

The team builds the ranking model internally while buying commodity data pipelines, because ranking quality and learning are the product's moat.

*Capabilities that create strategic learning and differentiation usually require control, even if buying is faster.*

## Anti-patterns

- Building because the team enjoys the technical problem even though the capability is commodity.
- Buying a vendor solution for a capability that defines the product's unique value.
- Ignoring switching costs, data ownership and roadmap dependency until renewal time.

## Relationships

**Related product / UX patterns**

- [Platform Strategy](../product-patterns/platform-strategy.md) — Platform strategy often depends on which shared capabilities should be built as internal platforms versus bought.
- [Moat & Differentiation Analysis](../product-patterns/moat-and-differentiation.md) — Differentiation analysis identifies which capabilities are too strategic to outsource casually.

**Related software patterns**

- [Adapter](../patterns/gof-structural/adapter.md) — Purchased or partner capabilities usually need adapters to isolate vendor APIs and preserve switching options.
- [Anti-Corruption Layer](../patterns/cloud-distributed/anti-corruption-layer.md) — Strategic systems use an anti-corruption layer to prevent vendor models leaking into the core domain.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — Buying or partnering can accelerate validated learning when the capability is not the core hypothesis.
- [Domain-Driven Design](../philosophies/domain-driven-design.md) — DDD helps distinguish core domain capabilities worth building from supporting or generic subdomains.

## Tags

- **Tags:** sourcing, strategy, differentiation, partnerships
- **Product stages:** early, growth, enterprise

## References

- Clayton Christensen and Michael Raynor, The Innovator's Solution, (2003)

