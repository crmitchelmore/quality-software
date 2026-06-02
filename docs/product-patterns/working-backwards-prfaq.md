# Working-Backwards PR/FAQ

> Start from the future customer-facing announcement and hard questions before committing to build, so alignment forms around the promised customer value rather than an internal feature plan.

**Discipline:** Product Management · **Category:** stakeholder-alignment · **Maturity:** established

**Also known as:** PRFAQ, Press Release and FAQ

## Description

A Working-Backwards PR/FAQ is a product alignment artefact that describes a proposed product or major feature as if it has already launched successfully. The press release explains the customer problem, the value delivered, the target customer, and why the launch matters in plain customer language. The FAQ then answers the difficult questions that would otherwise surface late: who it is for, what it will not do, how it works, what trade-offs it makes, how success is measured, and what risks remain. By forcing the team to write the customer story before the execution plan, it exposes weak value propositions, vague scope, and unresolved stakeholder assumptions while the idea is still cheap to change.

**Problem.** Teams often align around a roadmap item name or executive request without agreeing what customer outcome the work must create. Disagreements then emerge during delivery, when changing direction is expensive and stakeholders defend different implied versions of the product.

**Context.** Useful for substantial bets, new product lines, high-visibility launches, or ambiguous ideas that need cross-functional agreement before entering detailed planning.

## Forces

- Customer clarity competes with internal complexity; the document must translate technical and commercial detail into a story customers would recognise.
- Early alignment needs enough specificity to reveal disagreements, but not so much delivery detail that teams mistake the PR/FAQ for a fixed specification.
- Strong narratives can oversell weak evidence unless the FAQ explicitly names assumptions and metrics.
- Stakeholders want their concerns represented; the FAQ must include hard objections rather than becoming marketing copy.

## Solution

Draft a one-page future press release naming the customer, the problem, the differentiated promise, and the evidence that the product matters. Pair it with an FAQ covering customer questions, business questions, operational questions, launch constraints, non-goals, risks, and success metrics. Review it with the accountable stakeholders before committing delivery capacity. Iterate until the unresolved objections are explicit and the team can say what would make the launch successful, what is out of scope, and which assumptions must be tested first.

## When to use

- A proposed initiative is large enough that misunderstanding its value would waste meaningful time or budget.
- Stakeholders agree on the label of an idea but disagree on audience, scope, or success criteria.
- The team needs a customer-centred decision record before prioritising discovery or delivery work.

## Metrics

Signals that tell you whether this pattern is working:

- Share of approved initiatives with a named customer, problem, promise, non-goals, and success metric in the PR/FAQ.
- Number of material scope or audience disagreements discovered before delivery commitment rather than during build.
- Stakeholder review cycle time from first draft to decision.
- Post-launch comparison between promised outcomes in the PR/FAQ and measured customer or business results.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Very useful for preventing founders and early teams from building internally exciting but externally unclear ideas, though the format should stay lightweight when evidence is thin. |
| Growth (scaling team & users) | ●●●●● 5/5 | Excellent at growth stage because cross-functional stakeholders multiply and the cost of misaligned initiatives rises sharply. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Highly valuable for large, visible bets and regulated launches, provided the document remains a crisp decision artefact rather than a bureaucratic approval pack. |

## Examples

### Customer promise before scope

**❌ Poorer approach**

A team writes "launch admin dashboard v2" on the roadmap and opens epics for charts, filters, exports, and permissions. Sales expects executive reporting, support expects troubleshooting tools, and engineering builds a generic analytics page that satisfies none of them.

**✅ Better approach**

The PR/FAQ says, "Operations managers can spot blocked orders in under two minutes and assign an owner before customers call support." The FAQ names executive reporting as a non-goal, defines the launch metric as time-to-diagnosis, and records sales' reporting request as a separate opportunity.

*The better version aligns stakeholders on the customer job and success measure before discussing feature inventory. It prevents one vague dashboard idea from carrying several incompatible expectations.*

### Hard questions in the FAQ

**❌ Poorer approach**

The FAQ contains only friendly questions about benefits and launch timing. Migration, support burden, pricing impact, and data privacy are left for later because they make the proposal look risky.

**✅ Better approach**

The FAQ includes direct questions such as "What happens to existing saved reports?", "Which customers are excluded from beta?", and "What privacy review is required before launch?" Each answer names an owner or an assumption test.

*A PR/FAQ is valuable because it surfaces the uncomfortable issues early. Sanitising the FAQ preserves temporary consensus while storing up late delivery conflict.*

## Anti-patterns

- Writing the press release after the roadmap decision has already been made, reducing it to post-hoc justification.
- Filling the document with internal architecture, programme names, or executive jargon instead of customer language.
- Avoiding the uncomfortable FAQ questions about pricing, support, migration, privacy, or operational readiness.
- Treating the first draft as approval to build rather than as a way to expose assumptions for discovery.

## Relationships

**Related product / UX patterns**

- [Narrative Memo (Six-Pager)](../product-patterns/narrative-memo.md) — The PR/FAQ is a specific narrative memo format optimised for product launch alignment and customer-backwards decision-making.
- [Stakeholder Mapping](../product-patterns/stakeholder-mapping.md) — Stakeholder mapping identifies whose objections and decision rights must be represented in the FAQ review.
- [Opportunity Solution Tree](../product-patterns/opportunity-solution-tree.md) — Opportunities discovered in research can feed the customer problem section, while the PR/FAQ tests whether a proposed solution story is coherent.

**Related software patterns**

- [Contract-First API (OpenAPI)](../patterns/api-design/contract-first-api.md) — Both practices force agreement on externally visible behaviour before implementation details take over.

**Related philosophies**

- [Working Backwards](../philosophies/working-backwards.md) — The pattern is the operational artefact most associated with the Working Backwards philosophy.
- [Outcome Over Output](../philosophies/outcome-over-output.md) — A strong PR/FAQ frames the launch around customer and business outcomes rather than a list of outputs to ship.

## Tags

- **Tags:** alignment, launch-planning, customer-value, decision-record
- **Product stages:** early, growth, enterprise

## References

- Colin Bryar, Bill Carr, Working Backwards, (2021)
- Marty Cagan, Inspired, (2017)

