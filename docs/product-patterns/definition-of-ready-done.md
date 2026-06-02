# Definition of Ready & Done

> Make entry and exit criteria explicit for product work, so teams start items with enough shared understanding and finish only when customer, operational, and measurement obligations are met.

**Discipline:** Product Management · **Category:** product-operations · **Maturity:** established

**Also known as:** DoR and DoD, Ready Done Criteria

## Description

Definition of Ready and Definition of Done are working agreements that make quality and hand-off expectations explicit. Ready describes the minimum conditions for a product item to enter delivery: clear problem, user or customer value, acceptance criteria, constraints, dependencies, analytics needs, and enough design or discovery confidence. Done describes what must be true before the work is considered complete: shipped or deliberately not shipped, tested, documented, instrumented, communicated, support-ready, accessible, observable, and measured against its intended outcome. In product operations, these definitions prevent vague ideas from entering delivery and prevent "done" from meaning merely "code merged".

**Problem.** Teams pull poorly understood work into delivery, then discover missing decisions, dependencies, instrumentation, or stakeholder commitments mid-sprint. Conversely, work is declared done when engineering finishes, even though customers, support, analytics, and launch obligations remain incomplete.

**Context.** Useful for cross-functional product teams that need a shared contract between discovery, design, delivery, release, and measurement without turning every item into a heavyweight specification.

## Forces

- Readiness criteria improve flow but can become a gate that blocks learning if they demand certainty too early.
- Done criteria protect quality and outcomes, but too many universal requirements make small changes inefficient.
- Product, design, engineering, data, and go-to-market each see different completion risks.
- The criteria must fit different work types; an experiment, bug fix, migration, and launch should not share every requirement.

## Solution

Define lightweight, visible criteria for ready and done by work type. For readiness, include problem clarity, intended outcome, user or segment, evidence level, acceptance examples, dependencies, risks, analytics plan, and decision owner. For done, include production readiness, accessibility, support and documentation, instrumentation, rollout or rollback plan, stakeholder communication, and post-release learning review. Review criteria in retrospectives, remove checks that do not prevent real failure, and add checks when escaped issues reveal a missing condition.

## When to use

- Work repeatedly churns during delivery because critical decisions or dependencies were missing at start.
- Teams celebrate completion before launch, support, analytics, or learning obligations are actually complete.
- Product operations needs a shared quality contract across multiple squads without central approval for every item.

## Metrics

Signals that tell you whether this pattern is working:

- Percentage of delivery items that meet ready criteria before commitment.
- Rework rate caused by missing requirements, dependencies, or acceptance criteria discovered during delivery.
- Percentage of shipped items with instrumentation and post-release outcome review completed.
- Cycle-time predictability and escaped launch issues before and after criteria adoption.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Lightweight criteria help avoid chaos, but overly formal gates can slow the fast learning early teams need. |
| Growth (scaling team & users) | ●●●●● 5/5 | Very strong fit because more teams and more dependencies make implicit readiness and completion assumptions expensive. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for consistency, compliance, and operational readiness across many teams, as long as criteria are tailored by work type. |

## Examples

### Ready without pretending certainty

**❌ Poorer approach**

A team requires every backlog item to have pixel-perfect designs, final copy, full acceptance criteria, and executive sign-off before discovery has tested whether the idea matters.

**✅ Better approach**

The team uses separate ready criteria for discovery and delivery. Discovery items need a hypothesis and learning question; delivery items need validated problem framing, acceptance examples, dependencies, and analytics plan.

*The better approach recognises different kinds of readiness. It protects delivery from churn without demanding false certainty during discovery.*

### Done includes learning

**❌ Poorer approach**

A retention prompt is marked done when the pull request merges. Nobody checks whether it reached the target cohort or affected activation and churn.

**✅ Better approach**

Done requires rollout confirmation, event instrumentation, support notes, dashboard link, and a scheduled readout against the retention hypothesis two weeks after launch.

*Product work is not complete when output ships; completion includes the operational and learning loop needed to know whether the work mattered.*

## Anti-patterns

- Treating Definition of Ready as a promise that discovery is finished and no uncertainty remains.
- Making one massive checklist apply equally to tiny copy changes and major launches.
- Letting Done mean code merged, with analytics, documentation, support enablement, and success review deferred indefinitely.
- Using criteria as a blame tool between product and engineering rather than a shared flow improvement mechanism.

## Relationships

**Related product / UX patterns**

- [Product Operating Model](../product-patterns/product-operating-model.md) — Ready and done criteria are one of the concrete operating agreements that make a product operating model executable.
- [Dual-Track Discovery & Delivery](../product-patterns/dual-track-discovery-delivery.md) — Dual-track teams need different readiness criteria for discovery bets and delivery commitments.
- [Guardrail Metrics](../product-patterns/guardrail-metrics.md) — Done criteria should include guardrail instrumentation when changes may affect reliability, trust, revenue, or retention.

**Related software patterns**

- [Given-When-Then (BDD)](../patterns/testing/given-when-then.md) — Behavioural acceptance examples often use a Given-When-Then structure to make readiness concrete.
- [Health Endpoint Monitoring](../patterns/cloud-distributed/health-endpoint-monitoring.md) — Operational done criteria for production-facing work often include health monitoring and observability checks.

**Related philosophies**

- [Empowered Product Teams](../philosophies/empowered-product-teams.md) — Shared definitions let empowered teams own quality and outcomes without relying on external gatekeepers for every hand-off.
- [Continuous Delivery & Lean Software](../philosophies/continuous-delivery-lean.md) — Done criteria support continuous delivery by making release, rollback, and observability expectations explicit.

## Tags

- **Tags:** product-ops, quality, delivery-readiness, acceptance-criteria
- **Product stages:** early, growth, enterprise

## References

- Ken Schwaber, Jeff Sutherland, Scrum Guide, (2020)
- Nicole Forsgren, Jez Humble, Gene Kim, Accelerate, (2018)

