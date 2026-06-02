# Information Hiding & Modular Decomposition

> Decompose systems around design decisions likely to change, hiding each decision behind a stable module interface rather than mirroring processing steps or implementation order.

**Discipline:** software · **Origin:** David Parnas · *On the Criteria To Be Used in Decomposing Systems into Modules* · (1972)

**Also known as:** Parnas decomposition, Secrets-based modularity

## Description

Information hiding is Parnas's criterion for modular decomposition: a module should be responsible for a design decision, implementation detail or source of volatility that other modules need not know. The interface reveals only what clients require; the secret behind it can change without forcing coordinated changes elsewhere. Parnas contrasted this with flow-chart or processing-step decomposition, where modules follow execution order and therefore share assumptions about data formats, algorithms and devices. The deeper claim is that good modularity is a change-management strategy. A system is easier to understand and evolve when each likely-to-change decision has one home, a narrow interface, and clients that depend on the stable abstraction rather than on the hidden choice.

**In practice.** Start a design review by asking what decisions are likely to change: storage format, transport, parsing rules, scheduling policy, external service, hardware device or business rule. Put each behind a small, intention-revealing interface and ensure only the owning module knows the representation. Watch for information leakage in repeated conditionals, duplicated parsing, reach-through accessors and tests that assert internals rather than behaviour.

## Core tenets

- Decompose by secrets — each module hides a design decision that is likely to change, rather than exposing a processing step in the program's execution sequence.
- Interfaces should reveal as little as possible while still being useful; clients should not need to know data representations, algorithms, devices or policies owned by another module.
- Localise change by giving every volatile decision one authoritative home; duplicated knowledge across modules is information leakage.
- Treat module boundaries as design decisions made for future maintainers, not merely as file or class boundaries imposed by the language.
- Prefer stable abstractions over direct dependency on details, so a hidden representation or implementation can be replaced without cascading edits.

## Key ideas

- **Design decision as module secret** — The module is organised around knowledge it withholds: a data representation, algorithm, hardware interface, protocol detail or policy choice that callers should not rely on.
- **Changeability criterion** — The right decomposition is the one that minimises expected future change cost, not the one that most closely resembles the order in which work happens at runtime.
- **Interface as ignorance boundary** — A good interface lets clients remain ignorant of the hidden decision; a bad interface forces them to encode the same assumption and makes the secret public in practice.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Facade](../patterns/gof-structural/facade.md) — Presents a small stable surface over a complex subsystem, hiding many implementation decisions behind one module boundary.
- [Separated Interface](../patterns/enterprise-application/separated-interface.md) — Separates the contract clients depend on from the implementation that owns the hidden design decision.
- [Bridge](../patterns/gof-structural/bridge.md) — Decouples abstraction from implementation so representation or platform choices can vary independently behind the interface.
- [Adapter](../patterns/gof-structural/adapter.md) — Contains the knowledge of an external interface in one place instead of letting foreign assumptions leak through the system.
- [Repository](../patterns/data-persistence/repository.md) — Hides persistence and query details behind a collection-like abstraction owned by the data access module.
- [Anti-Corruption Layer](../patterns/cloud-distributed/anti-corruption-layer.md) — Protects a model by localising translation knowledge and preventing another system's design decisions from becoming everyone else's dependency.

## Software patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Active Record](../patterns/enterprise-application/active-record.md) — Often exposes persistence representation through domain objects, making database structure a shared assumption rather than a hidden decision.
- [Transaction Script](../patterns/enterprise-application/transaction-script.md) — Organising code around processing steps can scatter representation and policy knowledge across scripts, the decomposition Parnas warned against.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Naval Research Laboratory A-7E avionics Software Cost Reduction project | Parnas and colleagues reported an information-hiding module guide for the A-7E operational flight program, using hidden design decisions and precise interfaces to make avionics software easier to change and review. | primary source | The Modular Structure of Complex Systems |
| Modular programming practice | The 1972 paper is widely cited as the foundation for modular decomposition by hidden decisions, influencing later object-oriented, abstract data type and architecture practice. | secondary source | Software Pioneers: Contributions to Software Engineering |
| A Philosophy of Software Design | Ousterhout explicitly reuses information hiding as the basis for deep modules, treating leaked design decisions as a central cause of software complexity. | secondary source | A Philosophy of Software Design |

**Best for:** library, sdk, backend-service, modular-monolith, embedded, safety-critical

## Relationships with other philosophies

**Complements:** [A Philosophy of Software Design](a-philosophy-of-software-design.md), [Clean Architecture & SOLID](clean-architecture-solid.md), [Domain-Driven Design](domain-driven-design.md)

**In tension with**

- [The Unix Philosophy](unix-philosophy.md) — Unix composition exposes a uniform text interface deliberately, while information hiding may prefer richer, narrower interfaces that conceal representation and avoid repeated parsing.
- [Worse Is Better](worse-is-better.md) — Hiding volatile decisions can require upfront interface design; worse-is-better may accept exposed details if the simpler implementation ships and spreads faster.

## Criticisms / limits

- Predicting what will change is difficult; hiding the wrong decisions can add indirection without useful flexibility.
- Excessive encapsulation can make systems hard to inspect or debug if observability and diagnostic interfaces are not designed deliberately.

## References

- David L. Parnas, On the Criteria To Be Used in Decomposing Systems into Modules, (1972)
- David L. Parnas, Paul C. Clements, David M. Weiss, The Modular Structure of Complex Systems, (1985)
- David L. Parnas, Paul C. Clements, A Rational Design Process: How and Why to Fake It, (1986)

