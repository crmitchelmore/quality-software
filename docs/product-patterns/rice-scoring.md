# RICE Scoring

> Prioritise candidate work by estimating reach, impact, confidence and effort, turning a messy backlog into a comparable set of bets while making uncertainty explicit.

**Discipline:** Product Management · **Category:** prioritization · **Maturity:** established

**Also known as:** Reach Impact Confidence Effort

## Description

RICE scoring is a lightweight quantitative prioritisation method for comparing product initiatives. Each item is scored on the number of people it will reach, the expected impact on each person or target metric, confidence in the estimates, and the effort required to deliver it. The resulting score is not a substitute for judgement; it is a way to expose assumptions and make trade-offs visible. Used well, RICE helps teams compare different kinds of work — growth experiments, customer pain fixes, technical enablers and usability improvements — without pretending the numbers are precise forecasts.

**Problem.** Backlogs often get ordered by the loudest stakeholder, the newest idea, or the feature with the clearest narrative. Teams lack a shared way to compare scale, value, uncertainty and effort across competing bets.

**Context.** Useful for teams with many candidate initiatives, enough customer or analytics signal to estimate reach, and a need to explain why some visible requests are not first.

## Forces

- Quantification improves comparability but can create false precision when estimates are weak.
- High reach can swamp strategically important niche work unless impact and confidence are discussed.
- Effort estimates are often optimistic; treating them as ranges is safer than single-point certainty.

## Solution

Define consistent scoring scales for reach, impact, confidence and effort. Score each candidate with the people closest to the evidence, write down the reasoning behind every number, and rank by reach × impact × confidence ÷ effort. Review the top items qualitatively before committing, especially where strategic commitments, dependencies or risk make a pure score misleading.

## When to use

- A product team must rank a mixed backlog and needs a transparent decision aid.
- You have at least rough reach data and can express impact against a known outcome.
- Stakeholders need to see the assumptions behind prioritisation rather than a black-box ranking.

## Metrics

Signals that tell you whether this pattern is working:

- Share of roadmap items with explicit reach, impact, confidence and effort rationale.
- Forecast accuracy of reach and effort estimates after delivery.
- Reduction in prioritisation escalations or re-litigated backlog decisions.
- Outcome movement from top-ranked items compared with lower-ranked items.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Helpful once ideas proliferate, but early teams often lack stable reach data and should not let a score outrank direct customer learning. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit for scaling teams with many bets, analytics data and stakeholders who need transparent prioritisation. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful at portfolio scale, though enterprise dependencies and regulatory work often need additional governance beyond the formula. |

## Examples

### Scoring with evidence

**❌ Poorer approach**

A PM gives a pet feature reach 100,000, impact 3 and confidence 100% because a senior customer asked for it, so it floats to the top of the ranking.

**✅ Better approach**

The team estimates reach from usage logs, impact from the affected funnel step, confidence at 50% because evidence comes from one segment, and effort from engineering ranges.

*The better approach uses RICE to expose uncertainty. Confidence becomes a brake on weak evidence rather than a knob for making preferred work appear rational.*

### Comparing unlike work

**❌ Poorer approach**

Security hardening, onboarding improvements and reporting features sit in separate priority lists, so each stakeholder claims their list is most urgent.

**✅ Better approach**

The team scores each item against the same quarterly outcome and then reviews any high-risk mandatory work separately before committing the final sequence.

*RICE creates a shared comparison surface, while the final qualitative pass prevents mandatory or strategic work being hidden by the formula.*

## Anti-patterns

- Treating RICE as an objective truth machine and shipping the highest score without judgement.
- Inflating confidence to make a favoured idea win instead of using confidence to surface uncertainty.
- Comparing scores built on different scales or time horizons.

## Relationships

**Related product / UX patterns**

- [Opportunity Scoring](../product-patterns/opportunity-scoring.md) — Opportunity scoring can supply the impact and confidence evidence that makes RICE less speculative.
- [Outcome-Based Roadmap](../product-patterns/outcome-based-roadmap.md) — RICE is most useful when candidate items are scored against outcomes already expressed in the roadmap.

**Related philosophies**

- [Outcome Over Output](../philosophies/outcome-over-output.md) — The method works best when impact is defined as behaviour or outcome change, not feature volume.
- [Continuous Discovery](../philosophies/continuous-discovery.md) — Continuous discovery improves confidence estimates by keeping opportunity evidence fresh.

## Tags

- **Tags:** prioritization, scoring, portfolio, decision-making
- **Product stages:** growth, enterprise

## References

- [Intercom, RICE: Simple prioritization for product managers](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)
- Alistair Croll and Benjamin Yoskovitz, Lean Analytics, (2013)

