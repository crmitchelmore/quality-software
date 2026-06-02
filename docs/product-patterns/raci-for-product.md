# RACI for Product Decisions

> Clarify who recommends, approves, contributes, and must be informed for product decisions, so collaboration is explicit without turning every choice into consensus theatre.

**Discipline:** Product Management · **Category:** stakeholder-alignment · **Maturity:** time-tested

**Also known as:** Product Decision RACI, Decision Rights Matrix

## Description

RACI for Product Decisions adapts the responsibility-assignment matrix to product work by making decision rights visible before a decision is needed. For a roadmap change, launch readiness decision, pricing move, or deprecation, the team names who is responsible for preparing the recommendation, who is accountable for the final decision, who must be consulted because they hold relevant expertise or constraints, and who only needs to be informed. The pattern reduces both decision paralysis and surprise escalations by separating input from authority. Its product-management value is not the acronym itself but the conversation it forces about ownership, escalation, and the difference between being heard and holding a veto.

**Problem.** Product decisions stall or reopen because participants assume different decision rights. Some stakeholders believe they have approval authority; others are consulted too late and escalate; teams either seek unanimous consensus or let hidden power override documented priorities.

**Context.** Most useful where product choices cut across engineering, design, sales, marketing, support, legal, finance, or operations and where unclear authority has already caused rework or delay.

## Forces

- Inclusiveness competes with speed; too many approvers slow decisions, but ignoring affected groups creates resistance.
- Formal authority may differ from practical influence, so the map must reflect real escalation paths rather than an idealised org chart.
- Product teams need autonomy, yet some decisions legitimately belong to legal, finance, security, or executive owners.
- A matrix can clarify collaboration or become performative paperwork if it is not used at decision time.

## Solution

Define decision types rather than individual tasks: roadmap priority, launch readiness, pricing, customer commitments, incident-facing product changes, and sunsetting. For each type, assign exactly one accountable decision owner, one or more responsible recommenders, consulted roles with specific reasons for input, and informed audiences. Review the matrix with the named stakeholders, publish it near the operating model, and use it when decisions are made. When a decision is escalated, update the matrix if the documented rights did not match reality.

## When to use

- Decisions repeatedly reopen after apparent agreement.
- Cross-functional partners are surprised by product choices or believe they were bypassed.
- A growing product organisation needs to preserve team autonomy while making escalation paths explicit.

## Metrics

Signals that tell you whether this pattern is working:

- Decision cycle time for recurring product decision types.
- Number of decisions reopened because an omitted stakeholder objected after the fact.
- Percentage of major decisions with one named accountable owner.
- Stakeholder satisfaction with clarity of input and decision rights in product retrospectives.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Small teams usually need direct conversation more than a formal matrix; a lightweight decision owner note is often enough. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Valuable as functions and product squads multiply, especially when speed is suffering from unclear approvals. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential in large or regulated organisations where decision authority, consultation, and auditability must be explicit. |

## Examples

### One accountable owner

**❌ Poorer approach**

A pricing packaging decision lists Product, Sales, Finance, Legal, and Customer Success as joint approvers. Meetings continue for weeks because each group waits for the others to compromise first.

**✅ Better approach**

The matrix names the GM as accountable, Product and Finance as responsible for the recommendation, Legal and Sales as consulted on constraints, and Customer Success as informed before announcement.

*The better version distinguishes decision authority from necessary input. It still includes the affected functions, but it prevents shared approval from becoming no approval.*

### Consultation before commitment

**❌ Poorer approach**

Product finalises a roadmap shift and then sends support an FYI. Support escalates because the change breaks promised enterprise onboarding dates.

**✅ Better approach**

The RACI for roadmap changes marks Support and Sales as consulted when customer commitments are affected, so the recommendation includes contract risks before the accountable owner decides.

*Consultation is valuable only while the decision can still change. The better process reduces surprise without giving every function a veto.*

## Anti-patterns

- Giving every senior stakeholder an accountable or approval role, turning RACI into a veto grid.
- Treating consulted stakeholders as silent recipients of a document rather than engaging them before the recommendation hardens.
- Publishing a matrix that contradicts how executives actually make decisions.
- Using RACI to avoid judgement when a product leader should make a timely call.

## Relationships

**Related product / UX patterns**

- [Product Operating Model](../product-patterns/product-operating-model.md) — Decision rights are a core part of a product operating model, translating abstract team autonomy into repeatable governance.
- [Stakeholder Mapping](../product-patterns/stakeholder-mapping.md) — Stakeholder mapping helps identify who should be consulted or informed for each class of decision.
- [Definition of Ready & Done](../product-patterns/definition-of-ready-done.md) — Ready and done criteria often include approvals or consultations that should map cleanly to decision rights.

**Related software patterns**

- [Bounded Context](../patterns/ddd-strategic/bounded-context.md) — Both patterns draw explicit boundaries around authority and language so adjacent groups can collaborate without constant ambiguity.

**Related philosophies**

- [Empowered Product Teams](../philosophies/empowered-product-teams.md) — Clear decision rights protect empowered teams from hidden approval layers while recognising legitimate organisational constraints.
- [Conway's Law & Team Topologies](../philosophies/conways-law-team-topologies.md) — The decision map should match the real communication structure that shapes product and system outcomes.

## Tags

- **Tags:** decision-rights, governance, cross-functional, accountability
- **Product stages:** growth, enterprise

## References

- Project Management Institute, Responsible Accountable Consulted Informed (RACI) Matrix
- Matthew Skelton, Manuel Pais, Team Topologies, (2019)

