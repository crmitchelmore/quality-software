# Good-Better-Best Tiering

> Package an offer into progressively richer tiers that map to customer segments and value differences, making trade-offs clear without overwhelming buyers.

**Discipline:** Product Management · **Category:** pricing-packaging · **Maturity:** established

**Also known as:** GBB Packaging, Three-Tier Packaging

## Description

Good-Better-Best tiering presents a product in a small number of ascending packages. The good tier solves an entry-level job, the better tier serves the mainstream target with the strongest value balance, and the best tier captures advanced, high-value, scale, governance or premium needs. The pattern reduces choice complexity while allowing price discrimination by value. Good tiering is not arbitrary feature slicing; each tier should correspond to a recognisable segment, willingness-to-pay band, or sophistication level. The gaps between tiers should create clear upgrade reasons without crippling the lower tier's ability to deliver promised value.

**Problem.** Buyers face either one flat offer that under-monetises high-value customers or a confusing menu of add-ons and custom packages. Teams move features between packages opportunistically, causing churn, sales friction and unclear upgrade paths.

**Context.** Useful for SaaS, subscriptions, developer tools, consumer apps and service bundles where customers differ in needs, scale, sophistication or willingness to pay.

## Forces

- Simplicity for buyers competes with the nuance of many segments and edge cases.
- Entry tiers must be useful enough to build trust but constrained enough to leave upgrade reasons.
- Feature placement affects perceived fairness, not only revenue optimisation.
- Sales and self-serve motions may need tier language that works in both contexts.

## Solution

Segment customers by jobs, scale, sophistication and value, then define a small tier ladder with a clear target user and promise for each tier. Put core value in every paid tier, reserve advanced scale, governance, collaboration, automation or support for higher tiers, and communicate differences in buyer language. Monitor tier mix, upgrade paths, downgrades, discounting and support signals, and revise tiers when customer needs or economics change.

## When to use

- Customers cluster into recognisable value or sophistication levels.
- A single price leaves money on the table or blocks lower-value customers.
- The team needs clearer self-serve comparison and sales packaging.

## Metrics

Signals that tell you whether this pattern is working:

- Tier selection mix by segment and acquisition channel.
- Upgrade, downgrade and expansion rates between tiers.
- Conversion and churn by tier.
- Support, confusion and sales-cycle signals related to packaging clarity.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful once willingness to pay is emerging, but premature tier complexity can slow learning before clear segments exist. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit as customer segments and expansion paths become clearer and self-serve packaging matters. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable for clarity, though enterprise deals often require overlays such as custom contracts, add-ons or account-level entitlements. |

## Examples

### Segment-aligned tiers

**❌ Poorer approach**

A SaaS product puts reporting in the highest tier only because it is popular, leaving small teams unable to understand their own usage and increasing churn.

**✅ Better approach**

Basic reporting exists in all paid tiers, while advanced audit exports, governance and multi-team analytics are placed in the best tier for larger organisations.

*The better packaging preserves core value while reserving scale and governance value for customers who need it.*

### Avoiding choice overload

**❌ Poorer approach**

Buyers must compare seven packages, fourteen add-ons and custom exceptions before understanding what the product costs.

**✅ Better approach**

The team simplifies to good, better and best tiers, with add-ons only for genuinely independent value drivers that do not belong in the main ladder.

*GBB works because it makes trade-offs legible. Too many options recreate the confusion tiering should solve.*

## Anti-patterns

- Creating tiers by randomly withholding essential features from lower packages.
- Offering so many packages and add-ons that buyers cannot compare options.
- Naming tiers aspirationally while the included capabilities do not match segment needs.
- Moving features between tiers without migration, communication or fairness considerations.

## Relationships

**Related product / UX patterns**

- [Value-Based Pricing](../product-patterns/value-based-pricing.md) — Tier boundaries should reflect differences in customer value and willingness to pay, not only internal feature categories.
- [Freemium Design](../product-patterns/freemium-design.md) — Freemium often sits below a good-better-best paid ladder and must create a coherent path into paid tiers.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Tier entitlements are commonly enforced through feature flags or entitlement toggles across packages.
- [Strategy](../patterns/gof-behavioural/strategy.md) — Pricing and entitlement logic often uses strategy-like variation by package while preserving one product flow.

**Related philosophies**

- [Jobs to Be Done](../philosophies/jobs-to-be-done.md) — Tier promises are strongest when they map to different customer jobs and progress levels.

## Tags

- **Tags:** packaging, tiers, pricing, monetisation
- **Product stages:** growth, enterprise

## References

- Rafi Mohammed, Good-Better-Best: Using Three-Tiered Choice to Boost Sales and Customer Satisfaction, (2018)
- Madhavan Ramanujam and Georg Tacke, Monetizing Innovation, (2016)

