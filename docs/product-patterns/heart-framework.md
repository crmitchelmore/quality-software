# HEART Framework

> Measure user experience quality through happiness, engagement, adoption, retention and task success, turning broad UX goals into specific, trackable product signals.

**Discipline:** Product Management · **Category:** metrics-analytics · **Maturity:** established

**Also known as:** Happiness Engagement Adoption Retention Task Success

## Description

The HEART Framework, developed at Google, helps teams choose user-centred metrics for a product or feature. It separates five dimensions: Happiness captures attitudes such as satisfaction or perceived ease; Engagement captures depth or frequency of meaningful use; Adoption captures first use by new or existing users; Retention captures continued use; and Task Success captures whether users complete key tasks efficiently and accurately. HEART is most useful when paired with a goals-signals-metrics step: decide the experience goal, identify observable signals, then choose practical metrics. It prevents UX measurement from collapsing into either vague survey sentiment or raw usage volume alone.

**Problem.** Teams claim to care about user experience but rely on generic engagement dashboards or occasional anecdotal feedback. They cannot tell whether a redesign improved happiness, adoption, retention or task success, so UX trade-offs are judged by opinion.

**Context.** Applies to user-facing products and journeys where experience quality must be measured alongside business outcomes, especially redesigned flows, onboarding, search, support and productivity tools.

## Forces

- UX quality is multidimensional; no single HEART dimension captures the whole experience.
- Survey-based happiness is slower and noisier than behavioural metrics but captures sentiment usage cannot.
- Engagement can be good or bad depending on intent; more time spent may mean delight or friction.
- Task success metrics require clear task definitions and often usability research to interpret.

## Solution

For the product, journey, or feature, write explicit UX goals first. For each relevant HEART dimension, identify signals that would show the goal is being met, then select a small set of metrics that can be reliably collected. Combine behavioural analytics with usability tests or surveys where needed, and review HEART metrics with business metrics so a growth win does not hide a degraded experience.

## When to use

- A team needs product metrics that include experience quality, not only usage or revenue.
- A redesign or workflow change could affect satisfaction, adoption or task completion.
- UX researchers and product managers need a shared measurement language.

## Metrics

Signals that tell you whether this pattern is working:

- Happiness scores such as satisfaction, perceived ease or recommendation intent.
- Meaningful engagement frequency or depth for the target behaviour.
- Adoption rate for new or changed capabilities among eligible users.
- Retention or repeat-use rate for the relevant user cohort.
- Task completion, time-on-task, error rate or support-contact rate.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Helpful for focusing UX learning, but early teams may lack stable journeys and should avoid building a heavy measurement programme too soon. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit when redesigns, onboarding and core workflows need balanced UX and business measurement. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Very useful across mature suites, especially where product, UX research and analytics teams need a common framework for experience quality. |

## Examples

### Measuring a redesign

**❌ Poorer approach**

A dashboard redesign is declared successful because daily active use rose after launch, even though support tickets about finding reports also increased.

**✅ Better approach**

The team defines HEART goals: users should find weekly reports quickly, adopt saved views, return to the dashboard weekly and report confidence in the data. They track task success, adoption, retention and satisfaction together.

*The better version recognises that usage alone cannot prove better UX. HEART exposes whether people are succeeding, returning and feeling confident.*

### Choosing only relevant dimensions

**❌ Poorer approach**

A one-off account export flow gets a weekly engagement metric, encouraging the team to maximise repeated exports even though frequent exporting may signal lack of trust.

**✅ Better approach**

The team measures task success, perceived confidence and support contacts, omitting engagement because repeat usage is not the goal of this flow.

*HEART is a menu, not a checklist. The right dimensions depend on the user's job and the product goal.*

## Anti-patterns

- Filling every HEART box with metrics even when a dimension is irrelevant to the decision.
- Treating engagement as automatically positive without considering whether it reflects friction.
- Running satisfaction surveys with no behavioural signal to connect attitudes to product changes.
- Measuring task success without defining the user's actual task and context.

## Relationships

**Related product / UX patterns**

- [Funnel Analysis](../product-patterns/funnel-analysis.md) — Task-success and adoption metrics often require funnel analysis to locate where users fail in a flow.
- [Cohort Analysis](../product-patterns/cohort-analysis.md) — Adoption and retention dimensions become more meaningful when measured by cohort rather than as blended totals.
- [Heuristic Evaluation](../ux-patterns/heuristic-evaluation.md) — Heuristic evaluation can explain why HEART task-success or happiness metrics are weak before teams choose design changes.
- [System Usability Scale (SUS)](../ux-patterns/system-usability-scale.md) — SUS is a practical happiness and perceived-usability instrument that can feed the HEART happiness dimension.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — HEART turns Norman's principles of feedback, discoverability and task success into measurable product signals.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Nielsen-style usability criteria help interpret HEART signals and generate candidate improvements.

## Tags

- **Tags:** ux-metrics, usability, product-analytics, experience
- **Product stages:** growth, enterprise

## References

- [Kerry Rodden, Hilary Hutchinson and Xin Fu, Measuring the User Experience on a Large Scale, (2010)](https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/)
- William Albert and Thomas Tullis, Measuring the User Experience, (2013)

