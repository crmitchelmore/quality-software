# Opportunity Scoring

> Rank customer opportunities by how important they are and how underserved they remain, focusing product effort where unmet need is strongest.

**Discipline:** Product Management · **Category:** prioritization · **Maturity:** established

## Description

Opportunity scoring prioritises product opportunities by asking customers how important an outcome, job or need is and how satisfied they are with current solutions. Opportunities that are highly important and poorly satisfied are strong candidates for product investment; low-importance or already-satisfied areas are less attractive. Popularised in outcome-driven innovation and product discovery practice, the pattern shifts prioritisation away from feature requests and towards underserved needs.

**Problem.** Teams prioritise feature ideas without knowing whether the underlying customer need is important, underserved, or already solved well enough by existing behaviour.

**Context.** Useful after discovery has produced a set of customer needs or jobs and the team needs to choose which opportunity to address before designing solutions.

## Forces

- Survey scores help compare opportunities but can detach from rich qualitative context.
- Stated importance may diverge from observed behaviour, especially for aspirational needs.
- Different segments may produce different opportunity rankings and should not always be averaged.

## Solution

Express opportunities as customer outcomes or needs, then collect importance and satisfaction evidence from the target segment. Prioritise opportunities with high importance and low satisfaction, validate the result against behavioural data and interviews, and feed the chosen opportunities into solution discovery rather than jumping straight from score to feature.

## When to use

- Discovery has produced many needs and the team must decide where to focus.
- Customer requests conflict and you need to compare the underlying opportunity, not the requested feature.
- A market or segment is mature enough for customers to judge importance and satisfaction.

## Metrics

Signals that tell you whether this pattern is working:

- Share of roadmap items linked to high-importance, low-satisfaction opportunities.
- Improvement in satisfaction scores for targeted opportunities after release.
- Reduction in work started without a validated opportunity.
- Agreement between scored opportunities and observed behavioural pain.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Strong for focusing scarce effort, though sample sizes may be small and qualitative evidence should carry more weight. |
| Growth (scaling team & users) | ●●●●● 5/5 | Excellent once the team has enough customers to compare opportunities by segment and outcome. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful in mature portfolios, but requires careful segmentation and governance to avoid averaged scores. |

## Examples

### Need before feature

**❌ Poorer approach**

Customers ask for CSV export, so the team scores build CSV export as an opportunity and ships it.

**✅ Better approach**

Interviews reveal the opportunity is to share weekly status with finance without manual reformatting; the team scores that need, then compares CSV, scheduled email and accounting integration solutions.

*The better approach keeps opportunity and solution separate, preventing the first requested feature from masquerading as the customer need.*

### Segment-specific ranking

**❌ Poorer approach**

A broad survey shows mediocre importance for audit trails, so the team deprioritises them for everyone.

**✅ Better approach**

Segment analysis shows audit trails are highly important and underserved for regulated enterprise accounts, so the opportunity is prioritised for that segment.

*Opportunity scores are only meaningful for a target market. Segment averages can erase the opportunities that drive purchase decisions.*

## Anti-patterns

- Scoring feature ideas instead of customer opportunities, recreating a feature popularity contest.
- Averaging across unlike customer segments and hiding a valuable underserved niche.
- Treating survey numbers as complete truth without qualitative follow-up.

## Relationships

**Related product / UX patterns**

- [Opportunity Solution Tree](../product-patterns/opportunity-solution-tree.md) — Opportunity scoring helps choose which branch of an opportunity solution tree deserves solution work.
- [Kano Model](../product-patterns/kano-model.md) — Kano classification enriches opportunity scoring by showing whether an underserved need is a basic, performance attribute or delighter.

**Related philosophies**

- [Jobs to Be Done](../philosophies/jobs-to-be-done.md) — Jobs-to-be-Done provides a strong framing for the outcomes whose importance and satisfaction are scored.
- [Continuous Discovery](../philosophies/continuous-discovery.md) — Continuous discovery keeps scored opportunities grounded in current customer evidence.

## Tags

- **Tags:** prioritization, discovery, customer-needs, opportunity
- **Product stages:** early, growth

## References

- Anthony W. Ulwick, What Customers Want, (2005)
- Teresa Torres, Continuous Discovery Habits, (2021)

