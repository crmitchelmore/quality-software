# Pirate Metrics (AARRR)

> Structure growth measurement around acquisition, activation, retention, referral and revenue so teams can locate where the customer journey leaks before choosing interventions.

**Discipline:** Product Management · **Category:** metrics-analytics · **Maturity:** established

**Also known as:** AARRR, Acquisition Activation Retention Referral Revenue

## Description

Pirate Metrics, popularised by Dave McClure, is a compact lifecycle model for product and growth analytics. It divides the customer journey into five questions: how people find the product, whether they reach first value, whether they come back, whether they bring others, and whether the business captures value. The model is deliberately simple. Its strength is not that every product has exactly five stages, but that it forces teams to diagnose the journey end-to-end instead of over-investing in top-of-funnel acquisition while activation or retention is broken. Good use adapts the definitions to the product's real value moments and segments metrics by channel and cohort.

**Problem.** Growth work is often reduced to getting more traffic or sign-ups. Teams spend money filling a funnel without knowing whether users activate, return, refer others, or generate sustainable revenue, so spend masks rather than solves product-market-fit problems.

**Context.** Useful for digital products with observable user journeys, especially when a team needs a first shared analytics map before building deeper lifecycle models.

## Forces

- The framework is memorable, but its simplicity can hide product-specific lifecycle complexity.
- Acquisition is easiest to buy, while activation and retention usually require harder product work.
- Stage conversion rates differ sharply by segment and channel; aggregate averages can mislead.
- Referral and revenue may arrive before or after retention depending on the business model.

## Solution

Define each AARRR stage in product-specific behavioural terms, instrument the transitions, and review stage metrics by cohort and acquisition channel. Identify the narrowest constraint before launching growth initiatives. Use qualitative research to explain the leaks the numbers reveal, then connect improvement work to activation, retention, referral, or revenue hypotheses rather than treating AARRR as a reporting taxonomy only.

## When to use

- A team needs an understandable lifecycle analytics model for a product or growth motion.
- Growth is stalling and the team needs to locate the journey stage causing the constraint.
- Acquisition spend is rising but downstream value creation is unclear.

## Metrics

Signals that tell you whether this pattern is working:

- Acquisition volume and quality by channel.
- Activation rate to a defined first-value behaviour.
- Retention curves by cohort and segment.
- Referral invitation, acceptance and successful referred activation rates.
- Revenue conversion, expansion and payback by cohort.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | A useful first analytics map, as long as definitions stay qualitative and learning-oriented before volumes are large enough for precise optimisation. |
| Growth (scaling team & users) | ●●●●● 5/5 | Excellent for scaling teams that need to decide whether acquisition, activation, retention, referral or revenue is the current constraint. |
| Enterprise (mature org / regulated) | ●●●○○ 3/5 | Still useful for product lines, but enterprise journeys often involve sales, procurement and success motions that require additional lifecycle stages. |

## Examples

### Finding the real leak

**❌ Poorer approach**

A SaaS team sees slow revenue growth and doubles paid acquisition because sign-ups are the most visible metric in the weekly dashboard.

**✅ Better approach**

The team maps AARRR and discovers that users from paid channels activate at half the rate of organic users, then fixes onboarding and channel targeting before increasing spend.

*The better approach treats growth as a system. More acquisition would only amplify the activation leak; diagnosing stages first prevents waste.*

### Defining activation honestly

**❌ Poorer approach**

A marketplace counts account creation as activation, so the dashboard looks healthy while buyers never contact sellers.

**✅ Better approach**

Activation is redefined as "first qualified seller contact" because that is the first moment where the buyer experiences marketplace value.

*AARRR only helps if each stage maps to meaningful behaviour. Administrative milestones inflate the funnel without showing whether value has been reached.*

## Anti-patterns

- Treating sign-up as activation even when the customer has not experienced the product's value.
- Reporting blended AARRR averages that hide a broken channel or customer segment.
- Jumping to referral mechanics before retention shows the product is worth referring.
- Optimising every stage at once instead of fixing the current limiting constraint.

## Relationships

**Related product / UX patterns**

- [Funnel Analysis](../product-patterns/funnel-analysis.md) — AARRR is often implemented as a lifecycle funnel, and funnel analysis provides the mechanics for measuring stage-to-stage leakage.
- [Aha-Moment Activation](../product-patterns/aha-moment-activation.md) — Activation in AARRR should be grounded in the product's aha moment rather than in a superficial sign-up event.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — AARRR supports Lean Startup's actionable metrics by replacing vanity totals with lifecycle learning.
- [Product-Led Growth](../philosophies/product-led-growth.md) — Product-led growth teams use AARRR-style lifecycle metrics to connect self-serve usage to revenue expansion.

## Tags

- **Tags:** growth, lifecycle, funnel, analytics
- **Product stages:** early, growth

## References

- Dave McClure, Startup Metrics for Pirates, (2007)
- Alistair Croll and Benjamin Yoskovitz, Lean Analytics, (2013)

