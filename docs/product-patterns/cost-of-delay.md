# Cost of Delay

> Estimate the value lost by waiting to deliver or learn, making time an explicit economic factor in product prioritisation and sequencing.

**Discipline:** Product Management · **Category:** prioritization · **Maturity:** established

## Description

Cost of Delay expresses the economic impact of postponing a product decision, feature, fix or experiment. It combines lost revenue, deferred risk reduction, missed market windows, continued support burden, compliance exposure and delayed learning into a time-sensitive view of value. The core insight is that two equally valuable items are not equally urgent if one loses value quickly while the other can wait. Cost of Delay gives teams a language for urgency grounded in economics rather than volume or stakeholder pressure.

**Problem.** Roadmaps treat time as neutral, so teams defer urgent opportunities, risk reductions or learning loops without seeing the value being lost each week or month.

**Context.** Useful when deadlines, market windows, operational pain, compliance dates or learning velocity affect the value of work, especially in constrained portfolios.

## Forces

- Exact financial estimates are difficult, but no estimate at all hides the real economics of waiting.
- Time-critical work can crowd out important long-term investments if urgency is not separated from value.
- Some delay cost is reputational or strategic and must be reasoned qualitatively.

## Solution

For each candidate item, ask what is lost if it ships or is learned one week or month later. Capture the components of delay cost, estimate them as ranges or relative scores, and identify time windows where the cost changes sharply. Use the result to sequence work, feed WSJF, or justify capacity for urgent risk-reduction and learning work.

## When to use

- A decision involves market windows, deadlines, support cost, compliance exposure or learning speed.
- Stakeholders disagree about urgency and need to separate importance from time sensitivity.
- Portfolio queues are long enough that waiting materially changes value.

## Metrics

Signals that tell you whether this pattern is working:

- Number of prioritisation decisions with explicit delay-cost rationale.
- Estimated value preserved by accelerating time-critical items.
- Reduction in missed market, compliance or customer-commitment windows.
- Age of high-delay-cost items in backlog or portfolio queues.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Helpful for time-sensitive learning and launches, but exact economics are usually unavailable pre-PMF. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Strong fit as queues grow and delayed opportunities, retention fixes and learning loops become costly. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for portfolio governance where delay spans revenue, risk, compliance and operational cost. |

## Examples

### Deadline economics

**❌ Poorer approach**

A tax-reporting update is ranked below a dashboard redesign because both are labelled medium value and the dashboard has louder sponsors.

**✅ Better approach**

The team estimates the tax update delay cost rises sharply after the filing deadline, so it moves ahead of the redesign even though the redesign has higher eventual upside.

*Cost of Delay separates total value from urgency. Time-sensitive work can deserve priority because waiting destroys value.*

### Learning delay

**❌ Poorer approach**

The team postpones a one-week pricing experiment until after a quarter of feature delivery, losing the chance to shape what gets built.

**✅ Better approach**

They quantify the delay as three months of building without willingness-to-pay evidence and run the experiment before committing the roadmap.

*Delay cost includes delayed learning, not only delayed revenue. Early evidence can prevent much larger waste downstream.*

## Anti-patterns

- Calling every item urgent without explaining what value decays over time.
- Ignoring qualitative delay costs such as trust erosion because they are harder to price.
- Using cost of delay once and never updating it as windows close or evidence changes.

## Relationships

**Related product / UX patterns**

- [Weighted Shortest Job First](../product-patterns/weighted-shortest-job-first.md) — WSJF operationalises Cost of Delay by dividing it by job size to create a sequence.
- [A/B Test Design](../product-patterns/ab-test-design.md) — Experiments have delay cost because each postponed test delays validated learning and subsequent decisions.

**Related philosophies**

- [Continuous Delivery & Lean Software](../philosophies/continuous-delivery-lean.md) — Lean product flow treats delay as waste, making Cost of Delay a direct economic expression of that philosophy.
- [The Lean Startup](../philosophies/lean-startup.md) — Lean Startup values fast learning; Cost of Delay quantifies the price of postponing that learning.

## Tags

- **Tags:** prioritization, economics, urgency, lean
- **Product stages:** growth, enterprise

## References

- Donald G. Reinertsen, The Principles of Product Development Flow, (2009)
- [Joshua Arnold, Cost of Delay: How to quantify the cost of postponing a project](https://blackswanfarming.com/cost-of-delay/)

