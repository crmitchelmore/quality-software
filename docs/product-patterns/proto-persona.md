# Proto-Persona

> Sketch an explicit, assumption-based persona early in discovery so the team can align on who they think they serve and then validate or replace that model with evidence.

**Discipline:** Product Management · **Category:** customer-discovery · **Maturity:** established

**Also known as:** Assumption Persona

## Description

A Proto-Persona is a lightweight persona created from team assumptions, existing knowledge and fragments of evidence before formal research is complete. Its purpose is not to pretend certainty; it makes implicit beliefs about users, goals, behaviours, pains and context visible so they can be tested. A good proto-persona is clearly labelled as provisional and includes evidence gaps and validation questions.

**Problem.** Teams carry unstated and conflicting pictures of the user. Decisions are made for an imagined average customer, but no one has documented the assumptions or tested whether that customer exists.

**Context.** Use at the start of discovery, during workshops, or when entering a new segment and needing a temporary alignment artefact before deeper research.

## Forces

- The artefact aligns teams quickly but can ossify into false certainty if not challenged.
- Demographics are easy to invent; behaviours, contexts and goals are more useful.
- Stakeholders may prefer polished persona stories over messy evidence gaps.

## Solution

Create a brief persona for a specific suspected segment: role, context, goals, behaviours, pains, triggers and assumptions. Mark confidence levels and evidence sources. Derive research questions from the weakest assumptions and replace or split the proto-persona as interviews, analytics and field research provide evidence.

## When to use

- A team needs initial alignment on a user segment before research is complete.
- Stakeholders hold conflicting assumptions about who the product serves.
- You need to plan recruitment and interview guides for discovery.

## Metrics

Signals that tell you whether this pattern is working:

- Percentage of persona claims marked with evidence source and confidence level.
- Number of high-risk persona assumptions validated, invalidated or split into new segments.
- Recruitment accuracy for discovery sessions using the proto-persona criteria.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Useful for fast alignment and recruitment, as long as it is clearly treated as provisional. |
| Growth (scaling team & users) | ●●●○○ 3/5 | Helpful for new segments, but growth products should increasingly rely on richer research and behavioural data. |
| Enterprise (mature org / regulated) | ●●○○○ 2/5 | Too lightweight for mature enterprise segmentation unless used only as an initial workshop input. |

## Examples

### Provisional by design

**❌ Poorer approach**

A workshop outputs "Marketing Mary, 35, likes coffee" and the team treats her as the validated customer.

**✅ Better approach**

The team documents "regional marketing manager coordinating campaigns across five offices" with assumed pains, confidence ratings and interview questions to test the segment.

*Proto-personas are useful when they expose assumptions about behaviour and context. Decorative demographics create false empathy.*

### Updating from evidence

**❌ Poorer approach**

Research shows two distinct user groups, but the team keeps one persona because it is already in the deck.

**✅ Better approach**

The persona is split into self-serve operators and approval-seeking managers, with different jobs and success metrics.

*A proto-persona should be cheap to change. Evidence has to win over workshop artefacts.*

## Anti-patterns

- Treating invented personas as research findings.
- Focusing on names, stock photos and demographics instead of behaviours and contexts.
- Keeping a proto-persona unchanged after contradictory evidence appears.

## Relationships

**Related product / UX patterns**

- [Assumption Mapping](../product-patterns/assumption-mapping.md) — Proto-persona claims are assumptions that can be mapped by importance and evidence before research.
- [Continuous Customer Interviewing](../product-patterns/continuous-interviewing.md) — Regular interviews validate, refine or retire provisional persona assumptions.

**Related software patterns**

- [State](../patterns/gof-behavioural/state.md) — Behavioural personas often reveal distinct user states or lifecycle stages that product flows and software state models must respect.

**Related philosophies**

- [Design Thinking](../philosophies/design-thinking.md) — Proto-personas are an empathy-starting artefact, but design thinking requires replacing assumptions with evidence.
- [Continuous Discovery](../philosophies/continuous-discovery.md) — Continuous discovery keeps provisional personas from becoming stale stereotypes.

## Tags

- **Tags:** personas, assumptions, segmentation, discovery
- **Product stages:** early, growth

## References

- Jeff Gothelf and Josh Seiden, Lean UX, (2013)

