# Narrative Memo (Six-Pager)

> Replace slide-led persuasion with a structured written argument that explains context, evidence, trade-offs, decision, and implications in one coherent product narrative.

**Discipline:** Product Management · **Category:** stakeholder-alignment · **Maturity:** established

**Also known as:** Six-Pager, Written Narrative

## Description

A Narrative Memo is a long-form written product decision artefact, often associated with Amazon's six-page memo practice, used to reason through strategy, roadmap choices, launch decisions, or complex trade-offs. Unlike a slide deck that can hide weak logic behind bullets and presenter performance, the memo must connect customer evidence, business context, constraints, options, recommendation, risks, and success measures in prose. Readers can interrogate the argument at their own pace, and the meeting can focus on the quality of thinking rather than on discovering the facts. For product work, the memo is most powerful when the decision is ambiguous, cross-functional, and evidence-heavy.

**Problem.** Important product decisions are made from slide decks or verbal updates that fragment the logic. Stakeholders leave with different interpretations of the recommendation, hidden assumptions go unchallenged, and later debates revisit facts that were never written down clearly.

**Context.** Best for strategy reviews, roadmap trade-offs, investment cases, launch readiness, executive alignment, and decisions where the reasoning matters as much as the answer.

## Forces

- Writing takes longer than making slides, but it exposes unclear thinking before the meeting.
- A memo must be complete enough to stand alone without becoming a data dump.
- Prose encourages depth, yet too much narrative can bury the actual decision and owner.
- Senior stakeholders may prefer presentation theatre; the meeting norm must protect reading and discussion time.

## Solution

Write a concise memo with a clear decision question, relevant context, customer and business evidence, options considered, trade-offs, recommendation, risks, open questions, and success metrics. Use appendices for detailed data rather than cluttering the argument. Circulate or read the memo before discussion, then use the meeting to challenge assumptions and decide. Keep the memo as a decision record so future teams can understand why a path was chosen and what evidence would have changed the decision.

## When to use

- The decision is complex enough that bullets cannot carry the reasoning safely.
- Stakeholders need a shared record of evidence, options, and trade-offs.
- A team wants to reduce meeting theatre and improve the quality of product thinking.

## Metrics

Signals that tell you whether this pattern is working:

- Percentage of major product decisions captured with a memo that states the decision, evidence, options, risks, and success metrics.
- Reduction in follow-up meetings needed to clarify what was decided and why.
- Number of material assumptions changed through memo review before commitment.
- Reader feedback on decision clarity and evidence sufficiency.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for high-stakes founder decisions, but too much memo ceremony can slow an early team that mainly needs fast discovery. |
| Growth (scaling team & users) | ●●●●● 5/5 | Excellent when the organisation has enough stakeholders and trade-offs that verbal alignment no longer scales. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Highly valuable for preserving decision quality and memory across large leadership, compliance, and portfolio structures. |

## Examples

### Argument instead of slide theatre

**❌ Poorer approach**

A roadmap review deck shows market size, customer quotes, screenshots, and a final slide saying "recommend enterprise analytics". The verbal story changes depending on who presents it.

**✅ Better approach**

The memo opens with the decision question, explains why enterprise analytics is the highest-leverage retention bet, compares two alternative investments, names the assumptions, and proposes success metrics for the next two quarters.

*The better artefact makes the reasoning inspectable. Stakeholders can challenge the causal chain rather than reacting to a polished sequence of slides.*

### Preserving decision memory

**❌ Poorer approach**

Six months after a platform investment, a new leader asks why the team deprioritised onboarding. Nobody can reconstruct the trade-off beyond "it was agreed in Q2 planning".

**✅ Better approach**

The narrative memo records that onboarding was deferred because activation was stable, enterprise churn risk was rising, and two named assumptions would be revisited after renewal season.

*Product decisions age better when their reasoning is written down. The memo lets future teams inspect whether the assumptions still hold.*

## Anti-patterns

- Writing a memo that is really a slide deck in paragraph form, with unsupported assertions and no argument structure.
- Hiding the recommendation until the end so readers cannot evaluate the evidence against the decision question.
- Overloading the memo with every chart available instead of selecting evidence that bears on the choice.
- Treating the memo as a one-way approval request rather than an artefact for critique.

## Relationships

**Related product / UX patterns**

- [Working-Backwards PR/FAQ](../product-patterns/working-backwards-prfaq.md) — A PR/FAQ is a launch-oriented narrative memo variant focused on the future customer announcement and hard launch questions.
- [Stakeholder Mapping](../product-patterns/stakeholder-mapping.md) — Stakeholder mapping helps the memo address the concerns, evidence needs, and decision rights of the actual audience.
- [Outcome-Based Roadmap](../product-patterns/outcome-based-roadmap.md) — Narrative memos are a strong format for explaining why roadmap themes ladder to outcomes rather than outputs.

**Related software patterns**

- [Ubiquitous Language](../patterns/ddd-strategic/ubiquitous-language.md) — A clear memo reinforces shared product language so stakeholders mean the same thing by customer, problem, outcome, and constraint.
- [Published Language](../patterns/ddd-strategic/published-language.md) — Like a published language between systems, a narrative memo creates a stable, shared interpretation of decisions across organisational boundaries.

**Related philosophies**

- [Working Backwards](../philosophies/working-backwards.md) — The written narrative supports the Working Backwards habit of clarifying customer value and decision logic before execution.
- [Conceptual Integrity](../philosophies/conceptual-integrity.md) — Prose forces the team to test whether the proposed product direction forms a coherent whole rather than a set of disconnected features.

## Tags

- **Tags:** writing, decision-record, executive-alignment, strategy
- **Product stages:** growth, enterprise

## References

- Colin Bryar, Bill Carr, Working Backwards, (2021)
- Barbara Minto, The Pyramid Principle, (1987)

