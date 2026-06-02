# Funnel Analysis

> Model a multi-step journey as ordered behavioural stages, then measure conversion and drop-off at each step so teams can focus improvement where users actually fail.

**Discipline:** Product Management · **Category:** metrics-analytics · **Maturity:** established

## Description

Funnel analysis turns a product journey — signup, checkout, onboarding, search, trial-to-paid, upgrade or support resolution — into a sequence of observable steps. By measuring how many eligible users reach each step and where they drop, the team can distinguish a leaky form from weak intent, a pricing mismatch from a payment error, or an onboarding education gap from a product-value problem. A good funnel is not a rigid assumption that every user follows the same path; it is a decision tool for journeys where sequence matters. It works best when segmented by intent, source, device, plan and cohort, and when analytics are paired with session review or research to explain the numbers.

**Problem.** Teams see a weak final outcome such as low activation or checkout conversion but do not know which part of the journey causes it. They redesign the whole flow, argue from anecdotes, or optimise the easiest screen rather than the highest-leverage failure point.

**Context.** Applies to journeys with a definable sequence and enough events to measure conversion, including onboarding, commerce, lead capture, activation, upgrade and task completion.

## Forces

- Real user paths branch and loop, while funnels simplify them into a sequence for analysis.
- Instrumentation errors can create false drop-offs that look like product problems.
- Improving one step may lower quality downstream if the funnel admits less-qualified users.
- Aggregate funnels hide segment-specific barriers such as mobile usability or channel mismatch.

## Solution

Define the journey's goal, eligibility population and ordered steps in behavioural terms. Instrument each step with consistent event semantics, then inspect conversion, time between steps and drop-off by segment. Prioritise the largest valuable constraint, form hypotheses about why users fail there, and validate with qualitative evidence before changing the flow. Pair the final conversion metric with downstream guardrails.

## When to use

- A goal depends on users completing an ordered journey with measurable steps.
- Conversion is weak and the team needs to locate the highest-leverage drop-off.
- A launch or redesign changes a flow and needs before/after evidence.

## Metrics

Signals that tell you whether this pattern is working:

- Step-to-step conversion and absolute drop-off by segment.
- Time-to-complete and time-between-steps for the target journey.
- Error, abandon and retry rates at high-friction steps.
- Final outcome quality such as retained activation, successful purchase or qualified lead rate.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Useful even with modest data because it sharpens where to observe users, though small samples require caution. |
| Growth (scaling team & users) | ●●●●● 5/5 | Essential for scaling activation, checkout and trial motions where small conversion gains compound. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable for complex journeys, but path diversity and data governance make funnel definitions harder to maintain. |

## Examples

### Checkout diagnosis

**❌ Poorer approach**

Checkout conversion is down, so the team redesigns the product details page because it receives the most traffic and stakeholders dislike its layout.

**✅ Better approach**

Funnel analysis shows most qualified buyers abandon after shipping cost appears. The team tests earlier cost disclosure and shipping options, then watches completion and refund guardrails.

*The better approach locates the actual constraint before designing a solution and keeps downstream quality in view.*

### Segmenting the funnel

**❌ Poorer approach**

A single onboarding funnel average looks acceptable, so the team moves on despite complaints from mobile users.

**✅ Better approach**

The funnel is split by device and shows mobile users fail at permission setup. The team fixes the mobile permission explanation and measures mobile activation separately.

*Aggregate funnels flatten important barriers. Segmenting turns a vague complaint into a specific fix.*

## Anti-patterns

- Treating the funnel as universal when different segments have legitimately different paths.
- Instrumenting page views instead of meaningful behaviours and decisions.
- Optimising the top of the funnel while downstream retention, quality or revenue worsens.
- Changing the flow before confirming that the apparent drop-off is not an analytics bug.

## Relationships

**Related product / UX patterns**

- [Pirate Metrics (AARRR)](../product-patterns/pirate-metrics-aarrr.md) — AARRR uses funnel thinking across the lifecycle; funnel analysis supplies the detailed diagnostic method.
- [Aha-Moment Activation](../product-patterns/aha-moment-activation.md) — Activation funnels should be designed around the steps that lead users to the aha moment.

**Related software patterns**

- [Wire Tap](../patterns/enterprise-integration/wire-tap.md) — Event capture for funnel analysis resembles a wire tap: observing product events without changing the user flow.
- [Correlation Identifier](../patterns/enterprise-integration/correlation-identifier.md) — Correlating events across steps and devices helps reconstruct a user's journey through the funnel accurately.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — Funnel analysis provides actionable metrics for build-measure-learn experiments on product journeys.

## Tags

- **Tags:** conversion, diagnostics, analytics, optimisation
- **Product stages:** early, growth, enterprise

## References

- Alistair Croll and Benjamin Yoskovitz, Lean Analytics, (2013)
- [Mixpanel, Funnel Analysis](https://docs.mixpanel.com/docs/reports/funnels)

