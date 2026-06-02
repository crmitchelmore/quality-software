# Conceptual Integrity

> Make a system feel as though it was designed by one mind: one coherent set of ideas, constraints and metaphors, protected from feature accretion and committee compromise.

**Discipline:** software · **Origin:** Fred Brooks · *The Mythical Man-Month* · (1975)

**Also known as:** Brooks's conceptual integrity, Unified design vision

## Description

Fred Brooks argued that conceptual integrity is the most important consideration in system design: a system should present one coherent design idea rather than a patchwork of individually reasonable but inconsistent features. In The Mythical Man-Month he connects this to architecture, organisation and management. Adding people to a late project makes it later because communication cost rises; the second-system effect tempts designers to overload the next system with everything they omitted from the first; there is no silver bullet that removes essential complexity. To preserve integrity, Brooks favours a small architecture function and a surgical-team structure in which a few people hold the vision while a larger team supports its realisation. The point is not autocracy for its own sake, but a unified user and developer experience: the system's parts should fit together because they express the same taste, vocabulary and constraints.

**In practice.** Name the system's few central concepts and enforce them across API, UI, documentation, tests and operations. Prefer one clear pattern over several locally optimal variants. Give architecture ownership enough authority to say no to inconsistent features. Review changes for vocabulary, interaction model and boundary consistency, not only correctness. Use design systems, reference implementations and architecture decision records to make the unified idea teachable.

## Core tenets

- Conceptual integrity is the most important attribute of a system; consistency of ideas beats a collection of disconnected good features.
- Preserve a small, coherent architectural vision; too many independent designers produce compromise and inconsistency.
- Resist the second-system effect — success with a first system creates pressure to overbuild the next one with every deferred idea.
- There is no silver bullet for essential complexity; disciplined design judgement and iteration remain necessary even as tools improve.
- Organise teams to protect the design idea, using clear architecture ownership and support roles rather than letting every contributor redefine the concept.

## Key ideas

- **Designed by one mind** — Users should experience the system as if its interface, abstractions and constraints came from a single coherent intelligence, even when many people implemented it.
- **Second-system effect** — A team's second major system is prone to over-elaboration because designers try to include every attractive feature and lesson from the first.
- **Surgical team** — Brooks's organisational pattern assigns a chief programmer/architectial vision holder and a small supporting team, reducing communication paths while preserving a unified design.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Facade](../patterns/gof-structural/facade.md) — Provides one coherent interface over diverse internals, helping users experience a unified concept rather than subsystem seams.
- [Modular Monolith](../patterns/architecture/modular-monolith.md) — Keeps a system deployable and governable as one product while preserving internal module boundaries, often supporting a single architectural vision.
- [Bounded Context](../patterns/ddd-strategic/bounded-context.md) — Makes conceptual boundaries explicit so integrity is preserved within each model rather than diluted across an enterprise.
- [Contract-First API (OpenAPI)](../patterns/api-design/contract-first-api.md) — Forces agreement on a coherent external contract before implementation details fragment the design.
- [Domain Model](../patterns/enterprise-application/domain-model.md) — Encodes the system's central concepts directly, making the unified design idea visible in code.
- [Microkernel (Plugin) Architecture](../patterns/architecture/microkernel.md) — Maintains a small stable core concept while allowing controlled extension through plugins.

## Software patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Microservices](../patterns/architecture/microservices.md) — Independently owned services can drift in vocabulary, API style and user model unless strong architecture governance preserves integrity across them.
- [Service-Oriented Architecture (SOA)](../patterns/architecture/service-oriented-architecture.md) — Large service portfolios often reflect organisational boundaries more than one coherent product idea, creating the inconsistency Brooks warned against.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| IBM System/360 architecture | Brooks presents System/360 as a major example where a unified architecture across a family of machines mattered commercially and technically, despite the project's severe management difficulties. | primary source | The Mythical Man-Month |
| IBM OS/360 lessons | Brooks's account of OS/360 uses schedule pressure, communication overhead and second-system effect as cautionary evidence for protecting conceptual integrity and architectural control. | primary source | The Mythical Man-Month |
| Surgical-team programming model | Brooks describes Harlan Mills's chief-programmer team idea as an organisational approach for scaling implementation while preserving the conceptual control of a small design group. | primary source | The Mythical Man-Month |

**Best for:** sdk, web-api, desktop-app, mobile-app, modular-monolith, distributed-system

## Relationships with other philosophies

**Complements:** [Simple Made Easy](simple-made-easy.md), [Domain-Driven Design](domain-driven-design.md), [Information Hiding & Modular Decomposition](information-hiding.md)

**In tension with**

- [The Unix Philosophy](unix-philosophy.md) — Unix gains power from independently evolved tools that compose through conventions; conceptual integrity may reject such heterogeneity when it weakens the system's unified model.
- [Worse Is Better](worse-is-better.md) — Worse-is-better tolerates rough edges and partial completeness to spread quickly, while conceptual integrity values coherence even when it requires saying no.

## Criticisms / limits

- A single vision can become a bottleneck or suppress useful local knowledge if architecture ownership is not balanced with feedback from implementation and users.
- Pursuing coherence too rigidly can delay pragmatic fixes or prevent evolution when the original concept is wrong.
- Brooks's surgical-team metaphor is culturally dated and must be adapted carefully for modern, collaborative teams.

## References

- Frederick P. Brooks Jr., The Mythical Man-Month: Essays on Software Engineering, (1975)
- Frederick P. Brooks Jr., No Silver Bullet: Essence and Accidents of Software Engineering, (1986)
- Frederick P. Brooks Jr., The Design of Design: Essays from a Computer Scientist, (2010)

