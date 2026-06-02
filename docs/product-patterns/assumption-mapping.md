# Assumption Mapping

> Make product, customer, business and technical assumptions explicit, then prioritise the riskiest ones for discovery or experimentation.

**Discipline:** Product Management · **Category:** customer-discovery · **Maturity:** established

**Also known as:** Riskiest Assumption Mapping

## Description

Assumption Mapping turns hidden beliefs into a visible portfolio of risks. Teams list what must be true for a product idea, feature or strategy to succeed, then assess each assumption by importance and evidence. High importance with low evidence becomes the discovery priority. The pattern keeps teams from spending effort polishing solutions while foundational desirability, viability, feasibility or usability assumptions remain untested.

**Problem.** Teams argue about solutions without surfacing the beliefs underneath them. The riskiest assumptions stay implicit until a launch fails or a customer rejects the product.

**Context.** Use at the start of discovery, before experiments, during strategy reviews, or whenever a team is about to invest in a bet with uncertain evidence.

## Forces

- Important assumptions can be uncomfortable because they threaten favoured ideas.
- Teams may over-test easy assumptions while avoiding existential ones.
- Evidence must be judged honestly; internal confidence is not customer proof.

## Solution

List assumptions across customer need, value, behaviour, channel, business model, technical feasibility and organisational constraints. Score each by how critical it is and how much evidence exists. Select the riskiest assumptions and design the smallest research activity or experiment that could change the team's confidence. Re-map after learning.

## When to use

- A product idea has enthusiasm but unclear evidence.
- Discovery work needs prioritising around the biggest unknowns.
- Teams need to align on what they believe versus what they know.

## Metrics

Signals that tell you whether this pattern is working:

- Count of high-risk assumptions converted into evidence or invalidated per discovery cycle.
- Percentage of experiments linked to a named assumption.
- Reduction in late-stage pivots caused by previously hidden assumptions.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Extremely useful because early-stage products are mostly assumptions and scarce resources must target the riskiest ones. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong for prioritising discovery across many bets and preventing confident scaling of untested ideas. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable for major initiatives, though facilitation must overcome hierarchy and political certainty. |

## Examples

### Finding the riskiest belief

**❌ Poorer approach**

The team tests button copy while assuming customers will trust an automated financial recommendation.

**✅ Better approach**

The map identifies trust in automation as high-importance and low-evidence, so the first discovery test explores past decisions, trust triggers and required explanations.

*The riskiest assumption is the one that could end the product, not the one easiest to test.*

### Evidence honesty

**❌ Poorer approach**

"Sales thinks customers want it" is marked as strong evidence.

**✅ Better approach**

The team marks sales feedback as weak directional signal and schedules interviews with recent lost deals and active users to test the assumption.

*Assumption mapping only works when evidence quality is judged honestly.*

## Anti-patterns

- Mapping assumptions but then building the original solution unchanged.
- Choosing tests for assumptions that are easy to measure but not decision-critical.
- Treating stakeholder conviction as evidence.

## Relationships

**Related product / UX patterns**

- [Hypothesis Statement](../product-patterns/hypothesis-statement.md) — High-risk assumptions are often converted into hypothesis statements for experiments or discovery tests.
- [Opportunity Solution Tree](../product-patterns/opportunity-solution-tree.md) — Assumptions under solutions in an opportunity solution tree can be prioritised using assumption mapping.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Product assumptions can be tested safely through controlled, flag-gated releases when behavioural evidence is needed.
- [LLM Evaluation Harness](../patterns/ai-ml/evaluation-harness.md) — AI or algorithmic product assumptions often need an evaluation harness to turn vague confidence into measured evidence.

**Related philosophies**

- [Hypothesis-Driven Development](../philosophies/hypothesis-driven-development.md) — Assumption mapping supplies the raw material for hypothesis-driven development.
- [The Lean Startup](../philosophies/lean-startup.md) — It focuses validated learning on the riskiest beliefs before building too much.

## Tags

- **Tags:** assumptions, risk, discovery, experiments
- **Product stages:** early, growth, enterprise

## References

- David J. Bland and Alexander Osterwalder, Testing Business Ideas, (2019)

