# A Philosophy of Software Design

> Treat complexity as the enemy and design deep modules with simple interfaces, so that the cost of understanding and changing a system stays low as it grows.

**Origin:** John Ousterhout · *A Philosophy of Software Design* · (2018)

**Also known as:** APoSD, Ousterhout's philosophy

## Description

John Ousterhout's philosophy frames software design as a continuous fight against complexity — the accumulation of dependencies and obscurity that makes systems hard to understand and risky to change. Its central prescription is the "deep module": a component whose interface is much simpler than its implementation, so each module hides a large amount of complexity behind a small surface. It argues for designing interfaces first, designing things twice, pulling complexity downward into modules rather than exposing it to callers, defining errors out of existence, and writing comments that capture design intent the code cannot. Crucially, it reframes encapsulation around information hiding: a module's job is to know things its callers should not have to.

**In practice.** Prefer a few deep classes over many shallow ones; resist "classitis". When an interface forces callers to handle many special cases or to understand internals, redesign it. Add design-intent comments to interfaces before implementing. Review for information leakage and temporal decomposition (structure code by knowledge, not by execution order).

## Core tenets

- Complexity is incremental; it accumulates from dependencies and obscurity, so it must be resisted continuously rather than fixed in one big cleanup.
- Modules should be deep — a simple interface hiding a substantial implementation — not shallow pass-throughs that add interface cost without hiding complexity.
- Design it twice — generating multiple interface designs before committing yields markedly better results than taking the first idea.
- Pull complexity downward — it is better for the implementer to suffer complexity than to leak it to every caller through the interface.
- Define errors out of existence — design APIs so that exceptional cases simply do not arise, reducing the number of special cases callers must handle.
- Comments should capture intent and rationale that the code cannot express; writing them early is itself a design tool that exposes shallow abstractions.

## Key ideas

- **Deep vs shallow modules** — Module value is depth = benefit (functionality hidden) minus cost (interface complexity). Maximise depth; a class with many tiny methods can be net-negative.
- **Information leakage** — A design smell where the same knowledge (e.g. a file format) is spread across modules, coupling them invisibly. Hide each design decision in one place.
- **Tactical vs strategic programming** — Tactical programming optimises for getting the next feature working; strategic programming invests continuously in a clean design, which pays back as the system grows.

## Associated patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Facade](../patterns/gof-structural/facade.md) — The archetypal deep module — a small interface that hides a large, complex subsystem, exactly the depth APoSD optimises for.
- [Hexagonal Architecture (Ports & Adapters)](../patterns/architecture/hexagonal-architecture.md) — Ports are narrow interfaces that hide whole categories of infrastructure complexity from the domain, embodying pull-complexity-downward.
- [Repository](../patterns/data-persistence/repository.md) — A deep abstraction: a simple collection-like interface conceals query, mapping and storage complexity, and localises the persistence design decision.
- [Guard Clause (Early Return)](../patterns/implementation/guard-clause.md) — Supports defining errors out of existence and reducing special cases the body must handle.
- [Layered (N-Tier) Architecture](../patterns/architecture/layered-architecture.md) — Each layer should present a simpler interface upward than the complexity it manages, a layered expression of module depth.

## Patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Service Locator](../patterns/implementation/service-locator.md) — Hides real dependencies behind a global lookup, increasing obscurity — a form of complexity APoSD warns against.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Stanford CS190 | The book grew out of and is taught in Ousterhout's software design course, where students iteratively redesign code to deepen modules and remove complexity. | primary source | A Philosophy of Software Design (book), and Stanford CS190 course materials |
| Tcl/Tk | Ousterhout's earlier scripting language and toolkit are frequently cited as examples of deep, widely-reused modules with small interfaces. | secondary source | A Philosophy of Software Design — author's worked examples and retrospectives |
| RAMCloud | The Stanford low-latency storage system led by Ousterhout is used in the book as a source of design examples and lessons on interface depth. | secondary source | A Philosophy of Software Design, case-study chapters |

**Best for:** library, backend-service, modular-monolith, microservices

## Relationships with other philosophies

**Complements:** [Information Hiding & Modular Decomposition](information-hiding.md), [Simple Made Easy](simple-made-easy.md), [Domain-Driven Design](domain-driven-design.md)

**In tension with**

- [Clean Architecture & SOLID](clean-architecture-solid.md) — APoSD warns that aggressive SOLID/"small classes and methods" advice can create classitis — many shallow modules whose aggregate interface complexity exceeds what they hide.
- [Worse Is Better](worse-is-better.md) — APoSD favours strategic investment in clean interfaces, whereas worse-is-better tolerates a simpler, less complete implementation that ships sooner.

## Criticisms / limits

- Several principles (deep modules, comments-as-design) are qualitative and rely on judgement; they are hard to enforce mechanically.
- Some advice (e.g. on comments and small-method scepticism) is contested by adherents of Clean Code, who value many small, named methods.

## References

- John Ousterhout, A Philosophy of Software Design, (2018)
- John Ousterhout, A Philosophy of Software Design (2nd edition), (2021)

