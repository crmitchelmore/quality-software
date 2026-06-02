# Kano Model

> Classify needs as basic, performance, delighter, indifferent or dissatisfier so prioritisation accounts for non-linear customer satisfaction rather than feature count.

**Discipline:** Product Management · **Category:** prioritization · **Maturity:** time-tested

## Description

The Kano Model explains how different kinds of product attributes affect customer satisfaction. Basic needs are expected and only noticed when absent; performance needs increase satisfaction roughly in proportion to how well they are met; delighters pleasantly surprise customers but become expected over time; indifferent attributes do not move satisfaction; dissatisfiers actively hurt. Product teams use Kano analysis to avoid over-investing in visible delighters while neglecting basics, and to find targeted opportunities for differentiation once table stakes are reliable.

**Problem.** Teams assume every feature adds equal value, so they chase flashy additions while unresolved basics create dissatisfaction, or they over-polish table stakes that no longer differentiate the product.

**Context.** Useful when customer satisfaction, retention or differentiation is more important than pure feature throughput, especially in markets where expectations evolve quickly.

## Forces

- Basic needs rarely generate praise, making them easy to underfund despite being essential.
- Delighters decay into expected features as competitors copy them and customers acclimatise.
- Segment expectations differ; one user's delighter may be another user's basic need.

## Solution

Research customer reactions to the presence and absence of candidate attributes, classify each need by satisfaction effect, and prioritise accordingly. Ensure basics are dependable before investing heavily in delighters, use performance attributes where measurable improvement matters, and revisit classifications as the market matures. Treat Kano as a lens on satisfaction, not as a complete business-case model.

## When to use

- Customer satisfaction or retention is weak and feature requests are pulling in many directions.
- You need to distinguish table stakes from differentiating investments.
- A product is entering a mature market with established user expectations.

## Metrics

Signals that tell you whether this pattern is working:

- Customer satisfaction movement by attribute category.
- Reduction in complaints tied to basic needs.
- Adoption and retention lift from delighter or performance investments.
- Reclassification cadence for ageing delighters becoming basics.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Helpful for understanding expectations, but early products may not yet have enough usage or segments for stable classification. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit as markets and segments become clearer and teams must balance basics with differentiation. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful for large portfolios, though segment complexity makes research design and interpretation harder. |

## Examples

### Basics before delighters

**❌ Poorer approach**

A banking app adds animated spending insights while login failures and confusing transfer statuses remain frequent sources of support tickets.

**✅ Better approach**

The team first stabilises login and transfer confirmation as basic needs, then tests whether spending insights delight a target segment once trust is restored.

*Delighters cannot compensate for missing basics. Kano helps the team sequence reliability and trust before novelty.*

### Segment-aware classification

**❌ Poorer approach**

A project-management product labels advanced permissions as indifferent because most small-team users do not ask for them.

**✅ Better approach**

The team classifies permissions as a basic need for enterprise buyers and indifferent for small teams, then gates the investment to the enterprise segment.

*Kano categories are segment-relative; averaging them hides buyer-specific expectations that may decide adoption.*

## Anti-patterns

- Shipping delighters while reliability, trust or core workflow basics remain broken.
- Assuming a Kano category is permanent instead of checking whether expectations have shifted.
- Averaging all segments together and missing a critical segment's basic needs.

## Relationships

**Related product / UX patterns**

- [Opportunity Scoring](../product-patterns/opportunity-scoring.md) — Opportunity scoring can quantify how important and underserved each Kano-classified need is.
- [Value vs Effort Matrix](../product-patterns/value-vs-effort-matrix.md) — Once needs are classified, the matrix helps compare the effort of satisfying basics or delighters.

**Related philosophies**

- [Jobs to Be Done](../philosophies/jobs-to-be-done.md) — Jobs-to-be-Done research helps reveal the expectations and outcomes behind each Kano category.
- [Outcome Over Output](../philosophies/outcome-over-output.md) — Kano steers teams towards satisfaction outcomes rather than a larger list of shipped features.

## Tags

- **Tags:** prioritization, customer-satisfaction, differentiation, research
- **Product stages:** growth, enterprise

## References

- Noriaki Kano, Nobuhiku Seraku, Fumio Takahashi and Shinichi Tsuji, Attractive Quality and Must-Be Quality, (1984)
- Dan Olsen, The Lean Product Playbook, (2015)

