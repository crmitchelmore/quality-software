# Dual-Track Agile

> Run discovery and delivery as parallel, connected tracks so teams validate what should be built while reliably building and shipping what has been learned.

**Discipline:** product · **Origin:** Jeff Patton, Desiree Sy, Marty Cagan · *Dual-Track Discovery and Delivery* · 2000s-2010s

**Also known as:** Discovery and Delivery Tracks, Dual-Track Scrum

## Description

Dual-Track Agile separates two kinds of work that often become muddled in one backlog: discovery, which reduces uncertainty about value, usability and feasibility, and delivery, which turns validated ideas into reliable product increments. Desiree Sy described dual-track Scrum, Jeff Patton popularised discovery practices around story mapping, and Marty Cagan connected the model to modern product teams. The philosophy is not two isolated teams or a mini-waterfall; it is a continuous flow where discovery feeds delivery, delivery creates new evidence, and product, design and engineering collaborate across both tracks.

**In practice.** Maintain a discovery backlog of opportunities and assumptions and a delivery backlog of validated work; involve the product trio in both; prototype and test ahead of build commitment; keep discovery one or more learning cycles ahead without freezing scope; and use delivery telemetry and feedback to refresh discovery.

## Core tenets

- Discovery and delivery are different work types with different outputs, cadences and risk profiles.
- Discovery should stay close enough to delivery to inform it, not become an upstream requirements silo.
- Engineers participate in discovery so feasibility and technical options shape product decisions early.
- Delivery should focus on building validated solutions reliably, not debating untested ideas mid-sprint.
- Learning from delivered software should feed the next discovery cycle.

## Key ideas

- **Discovery track** — Work that explores problems, opportunities, assumptions, prototypes and experiments to decide what is worth building.
- **Delivery track** — Work that designs, implements, tests, releases and operates product increments with production quality.
- **Shared backlog boundary** — Items move towards delivery only when enough value, usability and feasibility risk has been reduced.

## Associated practice patterns

Product / UX patterns that embody or operationalise this philosophy:

- [Dual-Track Discovery & Delivery](../product-patterns/dual-track-discovery-delivery.md) — This practice directly implements the parallel discovery and delivery cadence.
- [Opportunity Solution Tree](../product-patterns/opportunity-solution-tree.md) — Discovery-track work often uses opportunity mapping to decide which ideas deserve delivery investment.
- [Definition of Ready & Done](../product-patterns/definition-of-ready-done.md) — Explicit readiness and done criteria help maintain the boundary between validated discovery work and delivery commitments.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Agile product teams and UX practice | Desiree Sy's dual-track Scrum writing and later product practice describe using parallel discovery and delivery to integrate UX research with agile delivery. | primary source | Adapting Usability Investigations for Agile User-centered Design |
| Modern product organisations | Cagan and product-coaching literature present discovery-plus-delivery as a common operating model for empowered technology product teams. | secondary source | Inspired |

**Best for:** agile-product-teams, product-discovery-and-delivery, reducing-build-risk

## Relationships with other philosophies

**Complements:** [Continuous Discovery](continuous-discovery.md), [Empowered Product Teams](empowered-product-teams.md), [Continuous Delivery & Lean Software](continuous-delivery-lean.md)

**In tension with**

- [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) — XP emphasises tight coding-feedback loops, while dual-track practice adds an explicit pre-delivery discovery stream that can become a handoff if mishandled.

## Criticisms / limits

- If discovery and delivery are staffed separately, the model can reintroduce waterfall handoffs.
- Discovery can become an excuse for analysis paralysis if no explicit decisions move work forward.
- Delivery teams under high output pressure may starve discovery of engineering participation.

## References

- Desiree Sy, Adapting Usability Investigations for Agile User-centered Design, (2007)
- Jeff Patton, User Story Mapping, (2014)
- Marty Cagan, Inspired, (2017)

