# Release Train

> Ship on a predictable cadence with fixed departure dates and variable scope, reducing coordination cost while keeping product increments flowing.

**Discipline:** Product Management · **Category:** roadmapping · **Maturity:** established

## Description

A release train is a recurring release cadence where teams aim to have work ready for scheduled departures rather than negotiating a bespoke launch date for every item. Scope is flexible: work that is not ready misses the train and boards a later one. The pattern creates predictability for sales, support, operations, compliance and customers while discouraging large-batch release planning.

**Problem.** Releases are negotiated one by one, creating coordination overhead, surprise launches, late scope pressure and unreliable communication to customers and internal teams.

**Context.** Fits multi-team products, regulated contexts, enterprise customer communication and platforms where change windows, enablement and support readiness matter.

## Forces

- Predictable cadence improves coordination but can slow learning if releases wait for the next train unnecessarily.
- Fixed dates require variable scope, which some stakeholders resist when their item misses the train.
- Large trains can recreate big-bang release risk unless work is integrated and verified continuously.

## Solution

Establish a regular release cadence with clear entry criteria, cut-off dates, communication rituals and rollback paths. Keep scope variable and make readiness evidence-based. Use feature flags to decouple code deployment from customer release where possible, and inspect each train for missed work, defects and coordination friction.

## When to use

- Several teams or functions must coordinate around customer-visible releases.
- Enterprise customers, compliance or operations need predictable change windows.
- The organisation is not yet able to release every change independently and safely.

## Metrics

Signals that tell you whether this pattern is working:

- Release predictability and adherence to published cadence.
- Number of defects, rollbacks or support escalations per train.
- Percentage of items missing the train due to readiness or dependency issues.
- Lead time from code complete to customer availability.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Usually too heavy for small teams that can release on demand, except where external release windows impose cadence. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Useful as coordination complexity grows, especially with multiple squads and go-to-market dependencies. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Strong fit for large, regulated or customer-managed environments that need predictable change windows. |

## Examples

### Framing the work

**❌ Poorer approach**

The team lists a feature or date without explaining the customer behaviour or strategic reason it is meant to change.

**✅ Better approach**

The team states the intended outcome, the evidence behind the priority and the conditions that would change the plan.

*The better approach keeps the roadmap useful as a decision and learning artefact rather than a static promise.*

### Updating with evidence

**❌ Poorer approach**

The roadmap remains unchanged after discovery invalidates a major assumption because changing it would be awkward.

**✅ Better approach**

The team reviews the evidence, updates the item or horizon, and explains the decision to stakeholders with the metric or customer signal that changed.

*Roadmaps create trust when they adapt transparently to evidence, not when they preserve outdated certainty.*

## Anti-patterns

- Treating the train as a fixed-scope deadline and pressuring teams to board unfinished work.
- Holding safe, independently releasable improvements until the train for no customer or operational reason.
- Allowing release trains to become large-batch ceremonies without continuous integration and rollback.

## Relationships

**Related product / UX patterns**

- [MoSCoW Prioritization](../product-patterns/moscow-prioritization.md) — MoSCoW helps decide which scope is required for a train and which items can wait for a later departure.
- [Weighted Shortest Job First](../product-patterns/weighted-shortest-job-first.md) — WSJF can rank candidate items competing for limited capacity on the upcoming train.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Feature toggles let code ship with the train while customer exposure waits until product readiness.
- [Strangler Fig](../patterns/architecture/strangler-fig.md) — Incremental migrations can board successive trains rather than waiting for one risky cutover.

**Related philosophies**

- [Continuous Delivery & Lean Software](../philosophies/continuous-delivery-lean.md) — Release trains should preserve lean flow and safe release discipline, not become a substitute for it.

## Tags

- **Tags:** roadmap, release-management, cadence, coordination
- **Product stages:** growth, enterprise

## References

- Jez Humble and David Farley, Continuous Delivery, (2010)
- Donald G. Reinertsen, The Principles of Product Development Flow, (2009)

