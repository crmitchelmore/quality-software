# Cohort Analysis

> Compare groups of users who share a starting event or attribute over time, so retention, activation and monetisation changes are visible instead of hidden in blended averages.

**Discipline:** Product Management · **Category:** metrics-analytics · **Maturity:** established

## Description

Cohort analysis groups users, accounts, or transactions by a shared characteristic — often signup week, first purchase month, acquisition channel, plan, region, or feature exposure — and tracks their behaviour over subsequent periods. It turns time-series averages into longitudinal evidence. Instead of asking whether total active users are up, the team asks whether the users acquired in March retained better than those acquired in February, or whether accounts activated through a new onboarding flow expand faster after 90 days. The pattern is essential whenever improvements affect future behaviour but aggregate dashboards are confounded by growth, seasonality, or mix shifts.

**Problem.** Blended metrics can look healthy while new users are retaining worse, a channel is degrading, or a product change helped one segment and hurt another. Teams make decisions from averages that mix old and new behaviour and cannot isolate whether changes are improving customer outcomes.

**Context.** Useful for products with repeat usage, subscriptions, marketplaces, ecommerce, onboarding flows and any situation where behaviour unfolds over time.

## Forces

- Cohorts reveal longitudinal truth, but small cohorts produce noisy conclusions.
- Too many cohort dimensions create analysis paralysis and false stories from sparse data.
- Calendar time, user age and product-version effects overlap and must be separated carefully.
- Choosing the cohort anchor determines what question the analysis can answer.

## Solution

Define the decision question first, then choose the cohort anchor and segmentation that answer it. Track each cohort's relevant behaviour over consistent intervals, such as day 1, week 4, month 3, or renewal. Compare cohorts against prior cohorts, control cohorts, or expected curves, and pair quantitative changes with qualitative investigation when a cohort diverges. Preserve cohort definitions so later teams can compare like with like.

## When to use

- Retention, monetisation, activation or churn needs to be understood over user age.
- Aggregate metrics are changing but the team cannot tell whether new or old users drove the movement.
- A launch, channel or onboarding change should affect future cohorts more than historical users.

## Metrics

Signals that tell you whether this pattern is working:

- Retention curves by acquisition or activation cohort.
- Activation, conversion or expansion rates at fixed user-age intervals.
- Cohort lifetime value, payback or churn by segment and channel.
- Variance between cohorts after major launches or lifecycle interventions.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Conceptually useful, but cohorts may be too small for precision; qualitative follow-up is usually needed to interpret the signal. |
| Growth (scaling team & users) | ●●●●● 5/5 | Essential once acquisition, onboarding and retention changes are frequent enough that blended metrics mislead. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Critical for mature products with many segments, channels and plans, provided definitions are governed consistently. |

## Examples

### Aggregate growth hiding retention decay

**❌ Poorer approach**

A consumer app celebrates rising monthly active users while each new signup cohort retains worse than the previous one because paid acquisition keeps filling the top of the bucket.

**✅ Better approach**

The team reviews weekly signup cohorts and sees week-four retention falling for paid channels, then pauses spend and fixes the activation path before scaling again.

*Cohorts separate growth from quality. The poor view confuses more new users with a healthier product.*

### Measuring an onboarding change

**❌ Poorer approach**

After changing onboarding, the team compares this month's total activation rate with last month's and ignores that the acquisition mix also changed.

**✅ Better approach**

Users exposed to the new onboarding are tracked as a cohort and compared with similar prior cohorts by channel, segment and user age.

*The better approach isolates the change more cleanly and avoids attributing channel mix effects to product design.*

## Anti-patterns

- Looking only at totals while the composition of users changes underneath the metric.
- Creating dozens of thin cohorts until every comparison is underpowered.
- Changing the cohort definition mid-analysis and comparing unlike groups.
- Interpreting correlation by cohort as causation without checking channel, seasonality or segment mix.

## Relationships

**Related product / UX patterns**

- [Retention Curve Analysis](../product-patterns/retention-curve-analysis.md) — Retention curves are a specialised cohort analysis focused on whether usage stabilises or decays over time.
- [Funnel Analysis](../product-patterns/funnel-analysis.md) — Funnel improvements should often be evaluated by cohorts to see whether better conversion produces durable users rather than low-quality volume.

**Related software patterns**

- [Materialized View](../patterns/cloud-distributed/materialized-view.md) — Cohort dashboards often rely on precomputed materialized views so longitudinal slices remain fast and consistent.
- [Event Sourcing](../patterns/architecture/event-sourcing.md) — Event histories make it possible to reconstruct cohorts and analyse behaviour from the original user events.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — Cohort analysis is a core actionable-metrics practice for validated learning in Lean Startup.

## Tags

- **Tags:** analytics, retention, segmentation, lifecycle
- **Product stages:** growth, enterprise

## References

- Alistair Croll and Benjamin Yoskovitz, Lean Analytics, (2013)
- [Reforge, Cohort Analysis](https://www.reforge.com/blog/cohort-analysis)

