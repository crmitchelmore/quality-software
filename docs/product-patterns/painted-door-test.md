# Painted Door Test

> Add a lightweight visible affordance for a proposed capability and measure real user interest before building what sits behind it.

**Discipline:** Product Management · **Category:** experimentation · **Maturity:** established

## Description

A Painted Door Test places a visible signifier for a potential feature where the real capability would later live. The door is painted rather than built: clicking it reveals a truthful message, waitlist, contact option or research invitation. The method tests discoverability and intent in situ, often as a lower-cost precursor to prototypes or MVPs.

**Problem.** Teams rely on interview enthusiasm or stakeholder conviction and do not know whether users would notice or choose a capability when it appears in the actual product surface.

**Context.** Useful for testing entry-point demand, packaging interest, navigation placement or market appetite before committing design and engineering capacity.

## Forces

- The door must look real enough to test behaviour but reveal the truth quickly enough to protect trust.
- Placement affects results; a poor location may invalidate a good concept.
- Interest at the door does not prove successful fulfilment or retention.

## Solution

Choose the real surface where the future capability would be discovered, add the smallest credible door, and instrument impressions, clicks and follow-up intent. On click, explain that the feature is being explored, collect the user need or consent for follow-up, and route urgent needs to a safe alternative. Decide in advance what signal merits further investment.

## When to use

- You need evidence of in-product interest before designing or building the capability.
- The proposed feature can be represented by a small affordance without disrupting critical workflows.
- You can handle disappointed users transparently and safely.

## Metrics

Signals that tell you whether this pattern is working:

- Impression-to-click rate by segment and placement.
- Follow-up conversion such as waitlist signup, interview opt-in or manual workaround request.
- Negative feedback, complaint or support rate after disclosure.
- Decision rate from painted-door tests within the planned experiment window.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Excellent for checking real demand cheaply, so long as the team avoids deceptive or high-stakes doors. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Useful for segment and placement tests; requires governance to avoid clutter and user frustration. |
| Enterprise (mature org / regulated) | ●●○○○ 2/5 | Trust, procurement and support expectations make unavailable affordances risky outside controlled pilots. |

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

- Using painted doors for essential, high-stakes actions where an unavailable feature would harm users.
- Running multiple doors indefinitely and cluttering the product with unbuilt promises.
- Declaring victory on click-through alone without learning why users clicked.

## Relationships

**Related product / UX patterns**

- [Fake Door Test](../product-patterns/fake-door-test.md) — Fake Door Test is the closest related pattern, sharing the same demand-validation mechanism and trust risks.
- [A/B Test Design](../product-patterns/ab-test-design.md) — Painted doors can be designed as controlled tests of messaging, placement or segment demand.
- [Feature-Flag Experimentation](../product-patterns/feature-flag-experimentation.md) — Feature flags control which cohorts see the door and make removal fast.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — A toggle is a safe way to expose, target and withdraw the painted-door affordance.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — The pattern embodies minimum viable learning before building the full feature.

## Tags

- **Tags:** experimentation, demand-validation, ui-test, mvp
- **Product stages:** early, growth

## References

- Eric Ries, The Lean Startup, (2011)
- David J. Bland and Alexander Osterwalder, Testing Business Ideas, (2019)

