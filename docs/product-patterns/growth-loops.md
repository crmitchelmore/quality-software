# Growth Loops

> Design self-reinforcing product systems where user or customer actions produce outputs that bring back more users, usage or value, making growth repeatable rather than campaign-dependent.

**Discipline:** Product Management · **Category:** growth · **Maturity:** established

## Description

A growth loop is a causal system in which an input user action creates an output that feeds the next cycle of growth. A user creates content that attracts search traffic; a team invites collaborators who create more teams; a seller lists inventory that attracts buyers who attract more sellers. Unlike a linear funnel, a loop is measured by whether each cycle produces enough qualified input for the next one. The practice pushes teams to identify the product mechanism that naturally compounds, remove friction in the loop, and manage quality so the loop does not grow through spam, low-fit acquisition or degraded trust.

**Problem.** Growth depends on repeated campaigns, paid acquisition or sales pushes that stop producing results when spend stops. Teams optimise funnel steps but do not understand whether the product itself creates a repeatable acquisition, activation or retention engine.

**Context.** Useful for products with collaborative, content, marketplace, network, usage-expansion or referral dynamics where one user's value-producing action can generate more demand or supply.

## Forces

- Loops compound only if the output quality is high enough to create valuable new inputs.
- Short-term amplification can become spam or channel fatigue without trust guardrails.
- Some products have multiple loops that interact, making attribution harder than a simple funnel.
- Loops need an initial source of inputs before they can sustain themselves.

## Solution

Map the loop as inputs, product action, output, distribution surface and reinvestment into the next cycle. Instrument each conversion in the loop and measure loop efficiency, cycle time and output quality. Remove the tightest friction point, strengthen the value users receive for taking the action, and add guardrails against low-quality or abusive amplification. Treat campaigns as ways to seed or accelerate a durable loop, not as the loop itself.

## When to use

- Growth relies on repeatable behaviours rather than one-off campaign spikes.
- Users, content, inventory, invitations or usage can create value that attracts more participants.
- A team needs a systems view beyond acquisition funnels.

## Metrics

Signals that tell you whether this pattern is working:

- Loop conversion at each step from input action to reinvested output.
- Loop cycle time and number of completed cycles per cohort.
- Qualified new users, accounts, content or supply generated per active participant.
- Quality guardrails such as spam reports, referral activation, retention or marketplace fulfilment.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for thinking, but early teams often need to prove the value exchange before a loop can sustain itself. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit when acquisition costs rise and the product needs repeatable, compounding growth mechanisms. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable in platforms, marketplaces and collaboration suites, though governance and abuse controls become heavier. |

## Examples

### From campaign to loop

**❌ Poorer approach**

A knowledge-base product buys ads every quarter and calls the resulting sign-ups a growth loop.

**✅ Better approach**

The team designs publishing so helpful public articles rank in search, bring new readers, convert teams, and encourage those teams to publish more useful articles.

*The better system reinvests product output into future acquisition. The poor version is a linear paid channel, not a compounding loop.*

### Protecting loop quality

**❌ Poorer approach**

A collaboration tool rewards users for inviting anyone, creating noisy invites that recipients ignore and email providers start throttling.

**✅ Better approach**

The loop rewards invitations tied to shared workspaces and measures recipient activation, spam complaints and collaborator retention.

*Growth loops must compound value, not noise. Quality guardrails keep the loop healthy enough to repeat.*

## Anti-patterns

- Renaming a marketing campaign as a loop even though it stops when spend stops.
- Optimising invites or sharing without ensuring recipients receive real value.
- Allowing loop growth to degrade content, marketplace quality, deliverability or trust.
- Copying another company's loop without matching the product's natural value exchange.

## Relationships

**Related product / UX patterns**

- [Viral Loop](../product-patterns/viral-loop.md) — Viral loops are a specific growth-loop shape where sharing or invitation by current users creates new users.
- [Guardrail Metrics](../product-patterns/guardrail-metrics.md) — Guardrails prevent loop optimisation from producing spam, low-quality supply or trust erosion.

**Related software patterns**

- [Event-Driven Architecture](../patterns/architecture/event-driven-architecture.md) — Product loops are often implemented and observed through events that trigger notifications, sharing, recommendations or lifecycle actions.
- [Rate Limiting](../patterns/resilience/rate-limiting.md) — Rate limiting is a technical guardrail that prevents growth mechanics from becoming abuse or channel spam.

**Related philosophies**

- [Product-Led Growth](../philosophies/product-led-growth.md) — Product-led growth commonly relies on loops where product usage itself drives acquisition, activation or expansion.
- [The Lean Startup](../philosophies/lean-startup.md) — Loop hypotheses should be tested cycle by cycle rather than assumed from a diagram.

## Tags

- **Tags:** growth, systems-thinking, acquisition, compounding
- **Product stages:** growth

## References

- [Reforge, Growth Loops Are the New Funnels](https://www.reforge.com/blog/growth-loops)
- Sean Ellis and Morgan Brown, Hacking Growth, (2017)

