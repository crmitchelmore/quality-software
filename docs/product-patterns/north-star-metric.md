# North Star Metric

> Choose one durable measure of customer value that predicts business success, then align teams, strategy and growth work around improving its inputs rather than chasing disconnected KPIs.

**Discipline:** Product Management · **Category:** metrics-analytics · **Maturity:** established

**Also known as:** NSM, North Star, One Metric That Matters

## Description

A North Star Metric is the primary product metric that captures the recurring customer behaviour most strongly connected to long-term business value. It is not a slogan, vanity number, or revenue target by another name; it is a behavioural measure that says customers are getting the core value the product exists to deliver. Good North Stars are decomposed into input metrics that teams can influence, such as activation, frequency, depth of usage, retention, or expansion. The pattern gives a product organisation a shared outcome language: teams can disagree about solutions while staying aligned on the value they are trying to increase and the guardrails they must not harm.

**Problem.** Product teams optimise local metrics that look good in isolation — visits, sign-ups, shipped features, sales-qualified leads — while the organisation lacks a shared measure of whether customers are repeatedly receiving value. Roadmaps drift into output bargaining and metric trade-offs are settled by politics rather than by a clear value model.

**Context.** Most useful once a product has enough usage signal to identify the behaviour that correlates with retention or expansion. Early teams may use a provisional North Star while discovery continues.

## Forces

- The metric must be simple enough to align the company but rich enough to represent real value.
- A single metric focuses attention, yet can create blind spots unless guardrails are explicit.
- Revenue matters, but using revenue alone hides whether value creation or pricing pressure is moving it.
- Different product lines may need local input metrics while sharing a portfolio-level North Star.

## Solution

Define the product's core value exchange in behavioural terms, then select a metric that counts the repeated delivery of that value to the right customer segment. Validate that movement in the metric is associated with retention, expansion, or strategic value. Decompose it into input metrics owned by teams, pair it with guardrails, and review strategy and roadmap decisions through its causal tree rather than using it as a decorative dashboard number.

## When to use

- Teams need a common outcome to align roadmap, growth and investment decisions.
- The product has enough behavioural data to connect usage to retention or revenue.
- Metric sprawl is causing teams to optimise contradictory local KPIs.

## Metrics

Signals that tell you whether this pattern is working:

- North Star movement segmented by target customer and cohort.
- Input metric movement with clear ownership and plausible causal links to the North Star.
- Retention, expansion or revenue correlation with North Star attainment.
- Guardrail metrics staying within agreed thresholds while the North Star improves.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Helpful as a provisional learning focus, but early teams may not yet know which behaviour predicts durable value and should avoid over-freezing the metric. |
| Growth (scaling team & users) | ●●●●● 5/5 | Highly valuable when multiple teams and growth channels need a shared outcome model and enough data exists to validate causal inputs. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful for portfolio alignment, though large organisations often need a hierarchy of North Stars and careful governance to avoid oversimplifying diverse products. |

## Examples

### From activity to value

**❌ Poorer approach**

A collaboration product chooses monthly active users as its North Star, so teams ship email nudges that bring people back briefly without helping teams complete work together.

**✅ Better approach**

The product chooses "teams with three or more members completing a shared project milestone each week" and decomposes it into invite success, first milestone creation and repeat collaboration.

*The better metric describes the value moment the product promises, not mere attendance. It gives growth, onboarding and core-workflow teams concrete levers without rewarding empty activity.*

### Pairing focus with guardrails

**❌ Poorer approach**

A marketplace pushes completed bookings at all costs and celebrates growth even as refund disputes and host churn climb.

**✅ Better approach**

Completed qualified bookings are the North Star, but the review requires dispute rate, cancellation rate and host repeat listing to stay within thresholds.

*A North Star creates focus; guardrails keep that focus from becoming tunnel vision that damages the ecosystem the metric is meant to represent.*

## Anti-patterns

- Choosing a vanity total such as registered users or page views because it is easy to increase.
- Naming revenue as the North Star without understanding the customer behaviour that creates it.
- Treating the North Star as the only metric and ignoring quality, trust, margin or safety guardrails.
- Changing the metric every quarter to match the current initiative.

## Relationships

**Related product / UX patterns**

- [Guardrail Metrics](../product-patterns/guardrail-metrics.md) — Guardrail metrics protect the North Star from being improved through tactics that damage quality, trust or long-term value.
- [Leading vs Lagging Indicators](../product-patterns/leading-vs-lagging-indicators.md) — A North Star usually sits between controllable leading inputs and lagging financial outcomes, so the distinction helps teams build a useful metric tree.

**Related philosophies**

- [The North Star Framework](../philosophies/north-star-framework.md) — The pattern is the operational artefact at the centre of the North Star Framework's alignment model.
- [Outcome Over Output](../philosophies/outcome-over-output.md) — A North Star shifts planning conversations from features shipped to measurable customer outcomes.

## Tags

- **Tags:** metrics, alignment, strategy, outcomes
- **Product stages:** growth, enterprise

## References

- [Amplitude, North Star Metric](https://amplitude.com/blog/north-star-metric)
- Alistair Croll and Benjamin Yoskovitz, Lean Analytics, (2013)

