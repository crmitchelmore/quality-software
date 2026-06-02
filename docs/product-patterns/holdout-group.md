# Holdout Group

> Reserve a stable control cohort from exposure to a change so teams can measure incremental long-term impact rather than relying on before-and-after trends.

**Discipline:** Product Management · **Category:** experimentation · **Maturity:** established

## Description

A Holdout Group is a deliberately unexposed cohort used as a control while a feature, campaign, model or programme rolls out to others. Unlike a short A/B test, a holdout may persist for weeks or months to measure durable incremental impact, cannibalisation, retention, revenue or model drift. The pattern is powerful when global rollouts make it hard to know what changed because of the product versus seasonality, marketing or market conditions.

**Problem.** Teams roll out changes to everyone and later cannot tell whether metric movement came from the change, an external trend, a marketing campaign or normal variation.

**Context.** Useful for lifecycle programmes, pricing changes, recommendation systems, growth campaigns, AI models and features expected to have long-term or network-level effects.

## Forces

- Measurement quality improves when a control is held out, but withholding a beneficial change can feel unfair.
- Long-running holdouts require stable assignment and protection from accidental exposure.
- Holdout size trades statistical power against the opportunity cost of non-exposure.

## Solution

Define the population, randomisation unit, holdout size, duration, primary incremental metric, guardrails and ethical boundaries before launch. Keep assignment stable, prevent leakage across accounts or devices, and monitor guardrails for both exposed and held-out cohorts. End the holdout when it has answered the decision question or when continuing would be unfair or unsafe.

## When to use

- You need to measure incremental impact over time rather than immediate variant performance.
- Before-and-after trends are likely to be confounded by seasonality, campaigns or market changes.
- The change can ethically and contractually be withheld from a small cohort.

## Metrics

Signals that tell you whether this pattern is working:

- Incremental lift versus holdout for the primary outcome.
- Guardrail differences between exposed and holdout cohorts.
- Assignment leakage or contamination rate.
- Opportunity cost of holdout non-exposure and time to decision.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Usually too traffic-constrained and ethically costly for young products unless the effect is large. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Valuable for lifecycle and growth programmes with enough users to support stable controls. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Strong fit for mature experimentation platforms, provided governance handles fairness, compliance and leakage. |

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

- Keeping holdouts forever after the decision is clear, creating unnecessary customer inequity.
- Allowing sales, support or account teams to manually override assignment and contaminate the control.
- Using a holdout where withholding the change creates safety, legal or accessibility harm.

## Relationships

**Related product / UX patterns**

- [A/B Test Design](../product-patterns/ab-test-design.md) — Holdout groups are a control design that extends A/B testing principles to longer-running impact measurement.
- [Feature-Flag Experimentation](../product-patterns/feature-flag-experimentation.md) — Feature flags are commonly used to keep holdout assignment stable and prevent accidental exposure.
- [Cohort Analysis](../product-patterns/cohort-analysis.md) — Cohort analysis is often used to read holdout effects over retention, revenue or lifecycle windows.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Stable toggles or targeting rules keep the holdout separated from exposed cohorts.
- [Audit Logging](../patterns/security/audit-logging.md) — Assignment and exposure audit logs help diagnose leakage and preserve experiment integrity.

**Related philosophies**

- [Hypothesis-Driven Development](../philosophies/hypothesis-driven-development.md) — The holdout expresses a falsifiable hypothesis about incremental impact over time.
- [The Lean Startup](../philosophies/lean-startup.md) — It supports validated learning when changes need a durable control to distinguish signal from trend.

## Tags

- **Tags:** experimentation, control-group, causal-inference, metrics
- **Product stages:** growth, enterprise

## References

- Eric Ries, The Lean Startup, (2011)
- David J. Bland and Alexander Osterwalder, Testing Business Ideas, (2019)

