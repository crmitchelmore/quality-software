# Hypothesis Statement

> Express a product belief as a falsifiable statement linking a customer, change, expected behaviour and measurable outcome so discovery and experiments can prove or disprove it.

**Discipline:** Product Management · **Category:** problem-framing · **Maturity:** established

## Description

A Hypothesis Statement turns assumptions into testable product bets. Instead of saying "build this feature", the team states what it believes will happen, for whom, why, and how success will be measured. Good hypotheses are specific, falsifiable and connected to a decision: if the evidence contradicts the statement, the team should change course. They bridge problem framing, experimentation and roadmap learning.

**Problem.** Teams ship ideas without naming what must be true for them to work. After release, ambiguous metrics make it easy to rationalise any outcome as success.

**Context.** Use before experiments, MVPs, discovery tests, feature launches and strategy bets where uncertainty is material.

## Forces

- A hypothesis must be narrow enough to test but meaningful enough to affect a product decision.
- Teams may choose easy-to-move proxy metrics rather than metrics that reflect real customer or business value.
- Falsifiability is emotionally difficult when stakeholders are invested in the idea.

## Solution

Write the belief in a structure such as: "We believe [customer/segment] will [behaviour] when [change] because [reason]. We will know this is true when [metric/threshold] without harming [guardrail]." Define the decision rule before testing and connect the hypothesis back to the assumption or opportunity it addresses.

## When to use

- A product bet needs evidence before full investment.
- Assumption mapping has identified a risky belief to test.
- Experiments are producing data but not clear decisions.

## Metrics

Signals that tell you whether this pattern is working:

- Percentage of experiments with pre-declared hypothesis, primary metric and decision rule.
- Number of hypotheses invalidated early enough to change investment decisions.
- Learning velocity from hypothesis creation to decision.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Excellent for reducing waste when most product beliefs remain uncertain. |
| Growth (scaling team & users) | ●●●●● 5/5 | Essential for disciplined experimentation and roadmap learning across multiple teams. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable for governance and investment decisions, though bureaucracy can make hypotheses performative. |

## Examples

### Falsifiable metric

**❌ Poorer approach**

"We believe users will prefer the new onboarding."

**✅ Better approach**

"We believe first-time team admins will invite at least two colleagues during onboarding if permissions are explained in plain language; success is a 15% lift in team invites with no increase in support contacts."

*The better statement names customer, change, behaviour, threshold and guardrail. It can be proven wrong.*

### Decision rule

**❌ Poorer approach**

After launch, the team searches dashboards until one metric improved and calls the feature successful.

**✅ Better approach**

Before launch, the team declares the primary metric and agrees to roll back, iterate or scale based on specified thresholds.

*Hypotheses prevent post-hoc storytelling by defining success before evidence arrives.*

## Anti-patterns

- Writing unfalsifiable statements such as "users will like the new experience".
- Changing the metric after seeing results.
- Running tests with no pre-defined decision threshold or guardrail.

## Relationships

**Related product / UX patterns**

- [Assumption Mapping](../product-patterns/assumption-mapping.md) — Assumption mapping identifies which beliefs should become hypotheses first.
- [Feature-Flag Experimentation](../product-patterns/feature-flag-experimentation.md) — Feature-flag experiments are a common way to test product hypotheses with behavioural data.

**Related software patterns**

- [Given-When-Then (BDD)](../patterns/testing/given-when-then.md) — Both hypothesis statements and Given-When-Then scenarios express expected outcomes in a structured, testable form.
- [Structured Output (Schema-Constrained Generation)](../patterns/ai-ml/structured-output.md) — Structured hypotheses make experiment intent machine- and team-readable, reducing ambiguity in tracking and analysis.

**Related philosophies**

- [Hypothesis-Driven Development](../philosophies/hypothesis-driven-development.md) — The hypothesis statement is the core artefact of hypothesis-driven development.
- [The Lean Startup](../philosophies/lean-startup.md) — It expresses the learning loop as a falsifiable bet rather than an output commitment.

## Tags

- **Tags:** hypothesis, experimentation, assumptions, metrics
- **Product stages:** early, growth, enterprise

## References

- Alistair Croll and Benjamin Yoskovitz, Lean Analytics, (2013)

