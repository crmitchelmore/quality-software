# A/B Test Design

> Design controlled product experiments with a clear hypothesis, random assignment, primary metric, guardrails and stopping rule before exposing users.

**Discipline:** Product Management · **Category:** experimentation · **Maturity:** established

## Description

A/B Test Design is the product discipline of planning an online controlled experiment so the result can support a decision. It defines the hypothesis, population, randomisation unit, variants, primary success metric, guardrail metrics, sample size, duration, segmentation plan and decision rule before launch. Good design prevents common experiment failure modes such as peeking, underpowered tests, novelty effects and instrumentation gaps.

**Problem.** Teams ship variants to cohorts and read dashboards opportunistically, but the results are ambiguous because the test lacked a pre-declared metric, sufficient sample, stable assignment or guardrails.

**Context.** Best for digital products with enough traffic to detect meaningful effects and instrumentation reliable enough to measure the intended behaviour.

## Forces

- Statistical rigour slows impulsive decisions but prevents false positives and costly rollouts.
- Primary metrics focus the decision, while guardrails protect against local optimisation.
- Low-traffic products may be unable to resolve small effects and need qualitative experiments instead.

## Solution

Write an experiment plan before launch: hypothesis, target population, variants, randomisation unit, primary metric, guardrails, minimum detectable effect, sample size or duration, analysis segments and the decision rule. Instrument and QA assignment before exposure. Read the result at the planned stopping point, document the decision, and retire or roll forward the variant cleanly.

## When to use

- A change effect on user behaviour is uncertain and enough traffic exists to measure it.
- The decision is reversible and can be exposed safely to randomised cohorts.
- Stakeholders need evidence stronger than opinion or before-and-after comparison.

## Metrics

Signals that tell you whether this pattern is working:

- Percentage of experiments with pre-registered hypothesis, primary metric and stopping rule.
- Experiment decisions reached without instrumentation defects or sample-ratio mismatch.
- Primary metric effect with confidence interval or credible interval.
- Guardrail metric health during and after rollout.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Often underpowered before traffic grows; use qualitative or demand experiments unless the effect is very large. |
| Growth (scaling team & users) | ●●●●● 5/5 | Ideal once traffic and instrumentation support reliable decisions on contested product changes. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential at scale, though governance is needed for overlapping tests, privacy and metric consistency. |

## Examples

### Choosing the experiment

**❌ Poorer approach**

The team treats a weak signal as proof and commits to building the whole feature without a decision threshold or follow-up learning step.

**✅ Better approach**

The team names the riskiest assumption, sets a threshold and guardrail, runs the smallest ethical test, and chooses the next experiment based on the result.

*The better approach keeps experimentation tied to a decision and avoids confusing curiosity, delivery or activity with validated learning.*

### Protecting trust

**❌ Poorer approach**

Users are surprised by an unavailable or manually operated experience in a critical workflow and have no clear explanation or recovery path.

**✅ Better approach**

The test is limited to a safe cohort, explains the state honestly when users engage, and provides a fallback or contact path when the feature is not available.

*Experiment speed must not come at the cost of user trust. Ethical boundaries and guardrails make the learning usable.*

## Anti-patterns

- Stopping early when the dashboard looks favourable and ignoring the planned sample size.
- Running multiple overlapping tests on the same users without understanding interactions.
- Optimising a conversion metric while guardrails such as refunds, latency or retention deteriorate.

## Relationships

**Related product / UX patterns**

- [Feature-Flag Experimentation](../product-patterns/feature-flag-experimentation.md) — Feature flags commonly provide the controlled exposure mechanism for A/B tests.
- [Holdout Group](../product-patterns/holdout-group.md) — Holdouts are a specific control design used when measuring long-running or programme-level effects.
- [Guardrail Metrics](../product-patterns/guardrail-metrics.md) — Guardrail metrics protect the experiment from optimising the primary metric while harming system health or users.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Toggles implement stable cohort assignment and variant exposure in many experimentation systems.
- [LLM Evaluation Harness](../patterns/ai-ml/evaluation-harness.md) — Reliable experiment analysis depends on instrumentation, assignment checks and metric computation.

**Related philosophies**

- [Hypothesis-Driven Development](../philosophies/hypothesis-driven-development.md) — A/B test design operationalises hypothesis-driven product work with explicit decision rules.
- [The Lean Startup](../philosophies/lean-startup.md) — Controlled experiments are a rigorous build-measure-learn mechanism when sufficient traffic exists.

## Tags

- **Tags:** experimentation, ab-testing, metrics, statistics
- **Product stages:** growth, enterprise

## References

- Eric Ries, The Lean Startup, (2011)
- David J. Bland and Alexander Osterwalder, Testing Business Ideas, (2019)

