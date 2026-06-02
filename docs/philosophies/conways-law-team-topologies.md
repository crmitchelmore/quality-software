# Conway's Law & Team Topologies

> Treat organisation design as system design: software mirrors communication paths, so shape team boundaries, cognitive load and interaction modes deliberately.

**Discipline:** software · **Origin:** Melvin Conway, Matthew Skelton, Manuel Pais · *How Do Committees Invent? and Team Topologies* · (1968)

**Also known as:** Conway's Law, Team Topologies, Inverse Conway manoeuvre

## Description

Conway's Law observes that organisations design systems that copy their communication structures. What begins as a sociological observation becomes a design tool: if architecture and team structure are coupled, then team boundaries should be chosen deliberately rather than inherited accidentally. Team Topologies turns this into an operating model with four team types — stream-aligned, platform, enabling and complicated-subsystem — and three interaction modes: collaboration, X-as-a-Service and facilitating. The goal is a fast flow of change through teams with bounded cognitive load. The inverse Conway manoeuvre makes the implication explicit: reshape teams and communication paths to encourage the architecture you want.

**In practice.** Map current software boundaries against team communication paths; identify where many teams must coordinate for one user-visible change; split or realign ownership around value streams and bounded contexts; build platform capabilities as products; and make collaboration temporary and purposeful rather than the default for every change. Review team APIs, not only code APIs.

## Core tenets

- Systems mirror the communication structures of the organisations that build them; architecture and organisation cannot be designed independently.
- Use team boundaries as architectural boundaries, aligning ownership with streams of value and bounded contexts where possible.
- Manage cognitive load explicitly; a team should own a coherent slice that fits within what it can understand and operate well.
- Prefer stable, long-lived teams over temporary project groups so learning, ownership and flow accumulate.
- Use the four team types deliberately: stream-aligned, platform, enabling and complicated-subsystem.
- Choose interaction modes intentionally — collaboration for discovery, X-as-a-Service for reduced coupling and facilitating for capability building.

## Key ideas

- **Conway's Law** — The structure of the delivered system tends to reflect the structure of communication among the people and teams who created it.
- **Inverse Conway manoeuvre** — Deliberately change team boundaries and collaboration paths to bias the software architecture toward the desired modular shape.
- **Cognitive load** — Team ownership should be sized so that teams can understand, change and operate their systems without constant cross-team coordination.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Bounded Context](../patterns/ddd-strategic/bounded-context.md) — Provides a socio-technical boundary where model, code ownership and team responsibility can align.
- [Microservices](../patterns/architecture/microservices.md) — Independent services can reinforce autonomous stream-aligned teams when boundaries match business change streams.
- [Modular Monolith](../patterns/architecture/modular-monolith.md) — Lets teams preserve clear module ownership and cognitive boundaries without paying the full distributed-systems cost of microservices.
- [Backend for Frontend (BFF)](../patterns/architecture/backend-for-frontend.md) — Aligns an API boundary with a consuming experience or channel team, reducing cross-team negotiation for UI-specific needs.
- [Anti-Corruption Layer](../patterns/cloud-distributed/anti-corruption-layer.md) — Protects a team's model from another team's or legacy system's semantics, reducing accidental coupling across boundaries.
- [Published Language](../patterns/ddd-strategic/published-language.md) — Gives teams an explicit shared contract for integration without requiring constant direct collaboration.

## Software patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Monolith](../patterns/architecture/monolith.md) — A single deployable owned through a central bottleneck can force unrelated streams of work to coordinate, though a modular monolith can avoid this.
- [Service Locator](../patterns/implementation/service-locator.md) — Hidden dependencies obscure the real communication and ownership paths that Team Topologies tries to make explicit.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Organisations discussed in Team Topologies case studies | Skelton and Pais report case-study experience from organisations using team types, interaction modes and platform teams to improve flow while managing cognitive load. | primary source | Team Topologies |
| Inverse Conway manoeuvre adoption reports | Industry reports describe organisations realigning teams around desired service and product boundaries to reduce coordination and improve delivery flow; results are context-dependent. | secondary source | Team Topologies case studies and adoption reports |
| Domain-driven microservice organisations | Microservices guidance commonly combines Conway's Law with DDD bounded contexts to explain why service boundaries should follow team and domain boundaries. | secondary source | Building Microservices |

**Best for:** microservices, modular-monolith, distributed-system, backend-service, web-api, monolith

## Relationships with other philosophies

**Complements:** [Domain-Driven Design](domain-driven-design.md), [Continuous Delivery & Lean Software](continuous-delivery-lean.md), [Information Hiding & Modular Decomposition](information-hiding.md)

**In tension with**

- [Conceptual Integrity](conceptual-integrity.md) — Strong team autonomy can fragment a product's conceptual integrity unless shared design principles and architecture stewardship keep the user model coherent.
- [The Unix Philosophy](unix-philosophy.md) — Unix-style technical decomposition can create many tiny components; Team Topologies asks whether the resulting ownership and communication load is sustainable for real teams.

## Criticisms / limits

- Organisation charts are slower and more political to change than code, so the inverse Conway manoeuvre can be hard to execute in practice.
- Over-applying team autonomy can duplicate capabilities or create inconsistent user experiences unless platform and design responsibilities are clear.
- The model can be misused as a taxonomy exercise; the value comes from improving flow and cognitive load, not from labelling teams.

## References

- Melvin E. Conway, How Do Committees Invent?, (1968)
- Matthew Skelton, Manuel Pais, Team Topologies, (2019)
- Sam Newman, Building Microservices, (2015)

