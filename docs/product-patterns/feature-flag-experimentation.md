# Feature-Flag Experimentation

> Ship features behind runtime flags and expose them to randomised user cohorts so that product decisions are settled by measured behaviour rather than opinion.

**Discipline:** Product Management · **Category:** experimentation · **Maturity:** established

**Also known as:** A/B Testing with Flags, Controlled Rollout Experiments

## Description

Feature-flag experimentation couples a technical capability — toggling code paths at runtime without redeploying — to a product discipline: every non-trivial change is framed as a hypothesis and released first to a controlled slice of traffic. Outcomes are compared against a holdout or control cohort on pre-declared metrics before the change is rolled out, held, or removed. The flag is both the delivery mechanism and the experiment boundary: it decouples deploy from release, lets teams ship continuously while exposing change gradually, and gives an instant kill-switch if a variant harms key metrics. Done well it turns the roadmap into a stream of falsifiable bets and builds an evidence trail for why the product looks the way it does.

**Problem.** Teams argue about whether a change will help, ship it to everyone at once, and then cannot tell whether a later metric move was caused by the change, by seasonality, or by something else. Big-bang releases also make regressions hard to attribute and slow to undo.

**Context.** Applies wherever you have enough traffic to detect an effect and the instrumentation to measure the metric that matters. Most valuable for changes whose impact is contested or whose downside risk is real.

## Forces

- Statistical power needs sufficient sample size; low-traffic surfaces cannot resolve small effects.
- Every flag is a branch in the code and the analysis; flags left in place become permanent complexity.
- Speed of learning competes with rigour — peeking at results early inflates false positives.
- Experimenting on some users while others see the control raises fairness and consistency questions.

## Solution

Frame the change as a hypothesis with a primary metric and a guardrail metric agreed in advance. Put the change behind a flag, randomise assignment at a stable unit (user or account), and ramp exposure (e.g. 1% → 10% → 50%) while watching guardrails. Decide at a pre-set sample size or duration, not when the numbers first look good. Then fully roll out, roll back, or iterate — and schedule removal of the flag so it does not become permanent debt.

## When to use

- The expected impact of a change is genuinely contested or the downside is material.
- You have enough traffic and clean instrumentation to detect a meaningful effect.
- You want deploy decoupled from release so engineering can ship continuously.

## Metrics

Signals that tell you whether this pattern is working:

- Primary success metric movement vs control, with confidence interval.
- Guardrail metrics (latency, error rate, retention, revenue) staying within tolerance.
- Experiment velocity — number of decisions shipped and concluded per quarter.
- Flag debt — count and age of flags still live after their experiment concluded.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Pre-PMF traffic is usually too low for statistically meaningful tests; qualitative discovery learns faster than A/B at this stage. The flag-as-kill-switch benefit still applies. |
| Growth (scaling team & users) | ●●●●● 5/5 | The sweet spot — enough traffic to detect effects and enough contested decisions to make disciplined experimentation the fastest path to truth. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for safe change at scale; mature orgs run experimentation platforms with guardrails, though governance and flag hygiene become first-class concerns. |

## Examples

### Declaring the decision rule

**❌ Poorer approach**

The team ships a new checkout layout to 50% of users and a PM checks the dashboard each morning. On day three conversion looks up, so they call it a win and roll it out to everyone.

**✅ Better approach**

Before launch the team writes: "Hypothesis — the one-page checkout lifts completed purchases. Primary metric: checkout completion rate. Guardrail: refund rate must not rise. Run to 50,000 users per arm, then decide." They only read the result at that sample size.

*Pre-committing to a metric and a stopping rule removes the "peeking" bias that turns random noise into false wins. The poor version will ship changes that look good by luck.*

### Retiring the flag

**❌ Poorer approach**

Eighteen months of experiments have left 40 live flags. Nobody remembers which are still experiments, so every code path has to handle every combination.

**✅ Better approach**

Each experiment ticket includes a "clean-up" subtask; once a decision is made the losing branch and the flag are deleted in the next sprint, leaving only the chosen behaviour.

*The flag is scaffolding, not architecture. Treating removal as part of "done" keeps the experimentation system from collapsing under its own complexity.*

## Anti-patterns

- Stopping an experiment the moment it crosses significance ("peeking"), which inflates false positives.
- Measuring a convenient proxy metric instead of the outcome you actually care about.
- Letting flags accumulate forever so the codebase carries dozens of dead branches.
- Running so many overlapping experiments that interaction effects make results uninterpretable.

## Relationships

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — The experimentation discipline is built directly on the feature-toggle pattern — the toggle is the runtime mechanism that gates each variant and provides the kill-switch.
- [Strangler Fig](../patterns/architecture/strangler-fig.md) — Flag-gated cohort ramps are the safe-rollout mechanism a strangler migration uses to shift traffic incrementally from old to new implementations.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — Experimentation operationalises Lean Startup's build-measure-learn loop and validated-learning stance at the level of a single feature.
- [Continuous Delivery & Lean Software](../philosophies/continuous-delivery-lean.md) — Decoupling deploy from release via flags is a core continuous-delivery practice that makes safe, frequent experimentation possible.

## Tags

- **Tags:** hypothesis-driven, ab-testing, rollout, kill-switch
- **Product stages:** growth, enterprise

## References

- Ron Kohavi, Diane Tang, Ya Xu, Trustworthy Online Controlled Experiments, (2020)
- Eric Ries, The Lean Startup, (2011)

