# Heuristic Evaluation

> Have evaluators inspect an interface against established usability heuristics to find likely problems quickly before or between user studies.

**Discipline:** UX Design · **Category:** usability-evaluation · **Maturity:** time-tested

**Also known as:** Expert Usability Review, Heuristic Review

## Description

Heuristic evaluation is a structured expert review in which one or more evaluators inspect an interface against recognised usability principles, most commonly Nielsen's ten heuristics. It is fast, inexpensive, and useful early because it does not require recruiting participants. Evaluators move through key flows, note where the design violates a heuristic, describe likely user impact, and rate severity. The method is not a substitute for observing real users, but it efficiently catches preventable issues such as missing feedback, inconsistent terminology, weak error recovery, hidden system status, and excessive memory burden.

**Problem.** Teams often wait for a full usability test or launch before discovering obvious design defects. Conversely, informal expert opinions can become subjective lists of preferences unless grounded in shared criteria.

**Context.** Useful for prototypes, production screens, design-system components, competitive reviews, and pre-test quality passes where time or recruitment constraints make immediate user research difficult.

## Forces

- Expert review is fast, but it can miss domain-specific problems that only real users reveal.
- Multiple evaluators find more issues, yet coordinating and de-duplicating findings takes effort.
- Heuristics bring rigour, but severity ratings still require judgement about task frequency and impact.
- Teams may over-fix expert findings before validating the most consequential ones with users.

## Solution

Select an appropriate heuristic set, define representative tasks, and have evaluators inspect the interface independently before consolidating findings. For each issue, record the violated heuristic, evidence from the interface, affected users or task, and severity based on frequency, impact, and persistence. Prioritise fixes that block task completion, create errors, or recur across components, and feed uncertain findings into usability testing or cognitive walkthroughs.

## When to use

- A team needs rapid usability feedback before investing in a full user study.
- A prototype or flow is mature enough to inspect but still cheap to change.
- A product has known friction and needs a structured review rather than a preference debate.

## Heuristics

Rules of thumb for applying this pattern well:

- Use a named heuristic set and cite which heuristic each finding violates.
- Evaluate realistic tasks, not isolated screens, because many usability failures appear between steps.
- Have evaluators inspect independently before merging findings to reduce groupthink.
- Rate severity by user impact, frequency, and persistence, not by reviewer irritation.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Highly valuable when recruiting users is hard and design changes are still cheap, provided findings are not overclaimed. |
| Growth (scaling team & users) | ●●●●● 5/5 | Useful as a recurring quality gate before experiments, launches, and larger usability studies. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable across portfolios, though complex regulated workflows still need domain experts and user validation. |

## Examples

### Reviewing a checkout flow

**❌ Poorer approach**

A designer reviews checkout alone and reports that the payment page feels cluttered, the buttons are ugly, and the address form should be shorter, with no connection to user goals or severity.

**✅ Better approach**

Three evaluators independently walk a first-purchase task, then merge findings such as missing system status after payment submission and unclear error recovery, each mapped to Nielsen heuristics and severity.

*The better version turns expert judgement into inspectable evidence. It helps the team prioritise likely usability defects rather than debating taste.*

## Anti-patterns

- Having one reviewer create an unprioritised list of dislikes and calling it research.
- Applying generic heuristics without walking realistic tasks or considering user goals.
- Treating heuristic findings as proof of user behaviour rather than likely problems to prioritise and validate.
- Reporting only violations without severity, rationale, or recommended next step.

## Relationships

**Related product / UX patterns**

- [Cognitive Walkthrough](../ux-patterns/cognitive-walkthrough.md) — Cognitive walkthrough complements heuristic evaluation by focusing more narrowly on learnability and first-time task success.
- [Accessibility Audit](../ux-patterns/accessibility-audit.md) — Accessibility audits are another expert inspection method, but they use accessibility criteria and assistive-technology checks.
- [Usability Testing Session](../ux-patterns/usability-testing-session.md) — User testing validates whether heuristic findings actually affect real users and uncovers issues experts miss.

**Related software patterns**

- [LLM Evaluation Harness](../patterns/ai-ml/evaluation-harness.md) — Both define repeatable evaluation criteria and evidence capture rather than relying on ad hoc judgement.

**Related philosophies**

- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — The method is most closely associated with Nielsen's usability heuristics and severity-rating practice.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Many heuristics operationalise Norman's principles of feedback, constraints, mapping, and error recovery.

## Tags

- **Tags:** usability, expert-review, heuristics, evaluation
- **Product stages:** early, growth, enterprise

## References

- Jakob Nielsen, Usability Engineering, (1993)
- [Jakob Nielsen, How to Conduct a Heuristic Evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/)
- Jakob Nielsen and Rolf Molich, Heuristic Evaluation of User Interfaces, (1990)

