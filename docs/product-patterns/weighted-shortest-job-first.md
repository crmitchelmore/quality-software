# Weighted Shortest Job First

> Sequence work by dividing cost of delay by job size, so teams do the most economically urgent small jobs first and reduce the cost of queues.

**Discipline:** Product Management · **Category:** prioritization · **Maturity:** established

## Description

Weighted Shortest Job First is an economic prioritisation method popularised in lean product development and SAFe. It compares work by estimating the cost of delaying an item and dividing that by the job duration or size. High cost-of-delay, small-size items rise to the top because they deliver urgent value quickly; large items must justify the queue time they impose. WSJF is especially useful when work is queued through constrained delivery capacity and waiting has a measurable economic impact.

**Problem.** Teams prioritise large strategic initiatives ahead of smaller urgent work, or execute by stakeholder rank, causing high-value short jobs to wait in queues while cost of delay accumulates unseen.

**Context.** Suits portfolio, programme and platform planning where many jobs compete for constrained teams and delay cost can be estimated at least relatively.

## Forces

- Economic sequencing requires honest job size estimates, which can be politically uncomfortable.
- Cost of delay is hard to quantify precisely but ignoring it makes queues appear free.
- Breaking work down can improve WSJF, but over-slicing can lose coherence and increase coordination cost.

## Solution

Estimate each job cost of delay using user/business value, time criticality and risk reduction or opportunity enablement, then divide by job size. Prioritise the highest WSJF items while checking for dependencies, capacity constraints and strategic coherence. Use relative scoring when absolute economics are unavailable, and revisit scores as time windows, risks and estimates change.

## When to use

- Multiple sizeable initiatives are queued behind constrained delivery capacity.
- Delay has real economic, regulatory, learning or risk-reduction consequences.
- Teams can estimate relative job size and cost of delay collaboratively.

## Metrics

Signals that tell you whether this pattern is working:

- Queue time reduction for high cost-of-delay items.
- Economic value delivered per unit of delivery capacity.
- Age of delayed high-WSJF items in the portfolio queue.
- Accuracy of job-size estimates after completion.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Often too heavy before queues and cost-of-delay economics are visible, though the intuition is useful. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Valuable as delivery capacity becomes constrained and teams need transparent economic sequencing. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Strong fit for portfolio and programme planning, provided governance does not turn relative scoring into false precision. |

## Examples

### Seeing queue cost

**❌ Poorer approach**

A six-month platform rewrite consumes the whole team while a two-week compliance change with a fixed deadline waits until it becomes an emergency.

**✅ Better approach**

The team scores the compliance change as high cost of delay and small job size, pulls it forward, and then resumes the rewrite with the deadline risk removed.

*WSJF makes waiting economically visible. Small urgent work should not sit behind large bets simply because the large bet sounds strategic.*

### Relative scoring

**❌ Poorer approach**

Planning stalls for weeks because nobody can calculate exact pounds-per-week delay for each feature.

**✅ Better approach**

The group uses relative scoring for delay and size, then revisits the few items where the rank is sensitive to assumptions.

*WSJF is a decision aid. Relative economics usually beats paralysis, as long as uncertain scores are discussed rather than hidden.*

## Anti-patterns

- Treating WSJF scores as precise finance when they are rough economic heuristics.
- Inflating cost of delay for executive-sponsored items to force a preferred order.
- Ignoring dependencies and sequencing prerequisites because the formula says otherwise.

## Relationships

**Related product / UX patterns**

- [Cost of Delay](../product-patterns/cost-of-delay.md) — Cost of Delay is the numerator in WSJF and supplies the economic urgency behind the sequence.
- [Release Train](../product-patterns/release-train.md) — Release trains often use WSJF to decide which work boards a constrained upcoming increment.

**Related software patterns**

- [Strangler Fig](../patterns/architecture/strangler-fig.md) — Strangler migrations create smaller jobs that can score better than a single large replacement effort.

**Related philosophies**

- [Continuous Delivery & Lean Software](../philosophies/continuous-delivery-lean.md) — WSJF reflects lean flow thinking by reducing queues and delivering economically valuable increments sooner.

## Tags

- **Tags:** prioritization, economics, lean, portfolio
- **Product stages:** growth, enterprise

## References

- Donald G. Reinertsen, The Principles of Product Development Flow, (2009)
- [Scaled Agile, SAFe Lean-Agile Principles: Weighted Shortest Job First](https://scaledagileframework.com/wsjf/)

