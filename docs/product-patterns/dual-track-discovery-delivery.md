# Dual-Track Discovery & Delivery

> Run discovery and delivery as connected parallel tracks so teams continuously learn what should be built while reliably shipping validated, ready work.

**Discipline:** Product Management · **Category:** product-operations · **Maturity:** established

**Also known as:** Dual-Track Agile, Continuous Discovery and Delivery

## Description

Dual-Track Discovery and Delivery separates the uncertainty-reduction work of product discovery from the production-building work of delivery while keeping them tightly coupled in one team. Discovery explores opportunities, customer needs, assumptions, prototypes, and experiments. Delivery turns validated slices into reliable product changes. The tracks run in parallel, not as a waterfall hand-off: discovery feeds delivery with ready, evidence-backed work, and delivery outcomes feed discovery with behavioural data and constraints. The pattern helps teams avoid both extremes of building a backlog of unvalidated ideas and endlessly researching without shipping.

**Problem.** Teams either rush ideas into delivery without validating the problem, or they isolate discovery in a separate phase that produces hand-off documents and stale recommendations. Delivery starves for ready work while discovery loses contact with implementation and real outcomes.

**Context.** Best for empowered product teams that own outcomes, have regular customer access, and can prototype, test, instrument, and ship in small increments.

## Forces

- Discovery needs openness and divergent learning; delivery needs commitment, sequencing, and reliability.
- Keeping both tracks in one team preserves context but creates capacity tension, especially for product, design, and engineering.
- If discovery gets too far ahead, learning goes stale; if it is too close, delivery waits.
- Stakeholders may misread the tracks as permission to promise everything in discovery will be built.

## Solution

Maintain two linked flows. In discovery, identify opportunities, assumptions, prototypes, and experiment results around a target outcome. In delivery, pull only work that meets readiness criteria and has a clear customer value, acceptance examples, and measurement plan. Keep engineers involved in discovery to test feasibility and keep product and design involved in delivery to protect intent. Review both tracks together: discovery health, delivery flow, decisions made, and outcomes observed. Explicitly discard discovery ideas that fail to earn delivery investment.

## When to use

- A team owns a measurable outcome and must learn continuously while still shipping reliably.
- Backlogs are full of stakeholder requests with weak customer evidence.
- Discovery, design, and engineering are separated enough that hand-offs lose context.

## Metrics

Signals that tell you whether this pattern is working:

- Ratio of delivered work traceable to validated opportunities or tested assumptions.
- Discovery decision velocity, such as assumptions tested and ideas killed or advanced per cycle.
- Delivery flow stability for ready work, including cycle time and blocked time.
- Outcome movement and learning readouts from shipped discovery-backed changes.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Strong for early teams if kept lightweight, because it prevents wasting scarce capacity on unvalidated features while still shipping. |
| Growth (scaling team & users) | ●●●●● 5/5 | Ideal when teams have enough customers, traffic, and delivery pressure to need disciplined parallel learning and shipping. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable but harder to sustain because governance, dependencies, and specialist silos can pull discovery and delivery apart. |

## Examples

### Parallel tracks, shared team

**❌ Poorer approach**

Product and design spend a quarter researching a new onboarding concept, then hand a large specification to engineering. Engineers identify major feasibility issues and analytics gaps after stakeholders have already seen the design.

**✅ Better approach**

Product, design, and engineering test onboarding assumptions weekly with prototypes and technical spikes. Only the validated slice with known analytics and feasible implementation enters delivery.

*The better approach keeps feasibility, desirability, viability, and measurability in the same learning loop instead of discovering conflicts at hand-off.*

### Discovery is allowed to kill ideas

**❌ Poorer approach**

Every idea tested in discovery becomes a backlog item because stakeholders interpret prototypes as commitments.

**✅ Better approach**

The team labels discovery artefacts as options, records decision outcomes, and celebrates invalidated assumptions that prevented delivery waste.

*Dual-track only works when discovery has permission to reduce the backlog as well as feed it. Otherwise it becomes a slower route to the same output factory.*

## Anti-patterns

- Treating discovery as a mini-waterfall phase that must finish before any delivery starts.
- Letting discovery become an innovation theatre backlog where every prototype is assumed to become a feature.
- Excluding engineers from discovery, causing feasibility surprises and weak solution options.
- Measuring delivery velocity while ignoring discovery quality and outcome learning.

## Relationships

**Related product / UX patterns**

- [Opportunity Solution Tree](../product-patterns/opportunity-solution-tree.md) — Opportunity Solution Trees provide a practical structure for the discovery track and its links to solutions and experiments.
- [Definition of Ready & Done](../product-patterns/definition-of-ready-done.md) — Ready criteria define when discovery output is mature enough to enter delivery without pretending all uncertainty is gone.
- [Feature-Flag Experimentation](../product-patterns/feature-flag-experimentation.md) — Delivery can ship discovery-backed bets behind flags so real behavioural evidence feeds the next discovery cycle.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Feature toggles help delivery expose validated slices safely and learn from real users without big-bang releases.
- [Prototype](../patterns/gof-creational/prototype.md) — Prototypes are common discovery artefacts for testing desirability and usability before delivery commitment.

**Related philosophies**

- [Dual-Track Agile](../philosophies/dual-track-agile.md) — This pattern is the day-to-day operating practice derived from the Dual-Track Agile philosophy.
- [Continuous Discovery](../philosophies/continuous-discovery.md) — Continuous discovery supplies the customer learning cadence that keeps the discovery track alive.
- [Empowered Product Teams](../philosophies/empowered-product-teams.md) — Dual-track work assumes a cross-functional team empowered to decide what to test, build, and discard.

## Tags

- **Tags:** discovery, delivery, product-ops, continuous-learning
- **Product stages:** growth, enterprise

## References

- [Jeff Patton, Dual-Track Development is not Duel-Track](https://www.jpattonassociates.com/dual-track-development/)
- Teresa Torres, Continuous Discovery Habits, (2021)

