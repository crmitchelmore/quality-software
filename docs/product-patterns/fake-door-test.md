# Fake Door Test

> Present a realistic entry point to a not-yet-built feature and measure intent before investing in full delivery, while being transparent once users engage.

**Discipline:** Product Management · **Category:** experimentation · **Maturity:** established

## Description

A Fake Door Test adds a visible but non-functional or not-yet-available entry point, such as a button, menu item or plan card, to measure whether users try to access a proposed capability. When a user engages, the product explains that the feature is not available yet, may invite feedback or a waitlist, and avoids pretending the action completed. The pattern cheaply tests demand in a real context, but it must be used sparingly and ethically because it can disappoint users if the door feels deceptive.

**Problem.** Teams build expensive features based on stated interest or stakeholder confidence, only to discover that few users try to use them when they appear in the product.

**Context.** Best for demand validation where the main uncertainty is whether users will notice and choose a proposed capability in the real product context.

## Forces

- Real in-product intent is more reliable than survey interest, but the test can frustrate users.
- The entry point must be realistic enough to measure demand but not so misleading that it damages trust.
- Click intent does not prove willingness to pay, repeat use or technical feasibility.

## Solution

Add the smallest realistic entry point to the target workflow, instrument impressions and engagement, and route users who click to an honest explanation, feedback prompt or waitlist. Predefine the demand threshold and guardrails for complaints or support contacts. If demand is strong, follow with concierge, prototype or implementation experiments that test value delivery.

## When to use

- The main risk is demand or discoverability, not whether the team can build the feature.
- You can expose the door without interrupting critical tasks or harming trust.
- A click, waitlist signup or follow-up interview is a meaningful signal for the decision.

## Metrics

Signals that tell you whether this pattern is working:

- Door impression-to-click rate for the target segment.
- Waitlist, interview opt-in or follow-up conversion after the disclosure.
- Complaint, support contact or trust-impact rate from exposed users.
- Percentage of fake-door tests that lead to clear build, iterate or stop decisions.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Very strong for cheaply testing demand before committing scarce engineering capacity, if trust is protected. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Useful for segment and placement validation, though guardrails matter more as the customer base grows. |
| Enterprise (mature org / regulated) | ●●○○○ 2/5 | Riskier where trust, contracts and regulated workflows make unavailable features politically sensitive. |

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

- Letting users complete a long flow before revealing the feature does not exist.
- Counting curiosity clicks as validated demand without a threshold or follow-up.
- Running fake doors in high-stakes, regulated or trust-sensitive workflows.

## Relationships

**Related product / UX patterns**

- [Painted Door Test](../product-patterns/painted-door-test.md) — Painted Door Test is a close variant; both measure demand through a realistic not-yet-built entry point.
- [Concierge MVP](../product-patterns/concierge-mvp.md) — Strong fake-door demand often graduates into concierge delivery to test whether the value can be fulfilled.
- [Feature-Flag Experimentation](../product-patterns/feature-flag-experimentation.md) — Flags can limit fake-door exposure to a safe cohort and remove the door quickly if guardrails move.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — A feature toggle is the natural mechanism for exposing and withdrawing the test entry point safely.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — The test is a minimum viable experiment for validated learning about demand.

## Tags

- **Tags:** experimentation, demand-validation, mvp, discovery
- **Product stages:** early, growth

## References

- Eric Ries, The Lean Startup, (2011)
- David J. Bland and Alexander Osterwalder, Testing Business Ideas, (2019)

