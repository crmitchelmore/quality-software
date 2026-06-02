# MoSCoW Prioritization

> Sort scope into Must, Should, Could and Won't-have bands so delivery discussions distinguish minimum success from desirable additions and explicit non-goals.

**Discipline:** Product Management · **Category:** prioritization · **Maturity:** time-tested

## Description

MoSCoW prioritisation classifies requirements or roadmap items into four bands: Must have, Should have, Could have and Won't have for this timeframe. It is especially useful when a fixed date, budget or release boundary forces scope negotiation. The pattern's value is the shared definition of minimum viable scope. Must items are required for the release to be worthwhile or compliant; Should items are important but not fatal if deferred; Could items are optional improvements; Won't items are consciously excluded.

**Problem.** Delivery plans blur mandatory work, important improvements and optional nice-to-haves, so teams discover too late that the date cannot hold unless scope is cut in a politically painful scramble.

**Context.** Best for release planning, procurement-style requirement sets, migration cutovers and deadline-driven initiatives where scope bands need to be negotiated explicitly.

## Forces

- Stakeholders overuse Must because the category feels like the only safe way to protect their needs.
- Fixed dates need flexible scope, but organisations often pretend both are fixed.
- The method communicates priority bands well but does not itself measure value or effort.

## Solution

Agree precise definitions for each MoSCoW band before classifying work. Cap Must-have scope to the minimum release that still achieves the intended outcome or obligation, and require a concrete consequence for anything labelled Must. Revisit the bands as evidence and estimates change, and make Won't-have items visible so exclusion is deliberate rather than silent neglect.

## When to use

- A release or project has a fixed timebox and negotiable scope.
- Stakeholders need a common vocabulary for scope trade-offs.
- Requirements must distinguish launch blockers from desirable follow-ups.

## Metrics

Signals that tell you whether this pattern is working:

- Percentage of Must-have items with explicit launch-blocker rationale.
- Ratio of Must-have scope to total release capacity.
- Number of late scope escalations caused by misclassified items.
- Release predictability after Could and Should items are deferred.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for launch scoping, but early teams often need sharper discovery than requirement banding. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Helps growing teams manage deadline pressure and stakeholder trade-offs without heavy process. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Strong fit where many stakeholders, release windows and compliance needs require explicit scope bands. |

## Examples

### Defining Must-have

**❌ Poorer approach**

In planning, each department marks its favourite feature as Must-have because nobody wants their work deferred, leaving 90% of the backlog in the top band.

**✅ Better approach**

The team defines Must-have as legally required, technically required for launch, or essential to the target outcome; everything else must justify why the release fails without it.

*The better approach preserves the meaning of Must-have and creates real trade-off space when delivery pressure arrives.*

### Making Won't explicit

**❌ Poorer approach**

Optional reporting enhancements fall out of the sprint silently, and stakeholders later assume the team forgot them.

**✅ Better approach**

The roadmap lists those enhancements as Won't-have for the launch with a note that they will be reconsidered after adoption data is reviewed.

*Explicit Won't-have decisions reduce ambiguity and make deferral a managed product choice, not a hidden delivery failure.*

## Anti-patterns

- Allowing more than half the scope to become Must-have, eliminating useful trade-off space.
- Treating Won't-have as rejection forever rather than exclusion for the current decision horizon.
- Using MoSCoW instead of value discovery, leaving all bands based on opinion.

## Relationships

**Related product / UX patterns**

- [Release Train](../product-patterns/release-train.md) — Release trains often use MoSCoW bands to decide what boards the current train and what waits for the next.
- [Now-Next-Later Roadmap](../product-patterns/now-next-later-roadmap.md) — MoSCoW can clarify what belongs in Now versus what should be deferred to Next or Later.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Feature toggles can separate required release readiness from optional functionality that can stay hidden.

**Related philosophies**

- [Empowered Product Teams](../philosophies/empowered-product-teams.md) — The technique works best when teams can negotiate scope around outcomes rather than simply accept stakeholder lists.

## Tags

- **Tags:** prioritization, scope, release-planning, stakeholder-alignment
- **Product stages:** growth, enterprise

## References

- Agile Business Consortium, DSDM Agile Project Framework Handbook
- Ken Schwaber, Agile Project Management with Scrum, (2004)

