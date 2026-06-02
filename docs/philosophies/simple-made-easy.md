# Simple Made Easy

> Separate simple from easy: prefer unbraided concepts and explicit data transformations over familiar conveniences that entangle state, identity and behaviour.

**Origin:** Rich Hickey · *Simple Made Easy* · (2011)

**Also known as:** Decomplecting, Simplicity over ease

## Description

Rich Hickey's Simple Made Easy argues that software quality depends on separating the objective property of simplicity from the subjective property of ease. Simple means unbraided: one concept, one role, one axis of change. Easy means nearby, familiar or already in the toolchain. Easy things may be complex when they complect concerns, while unfamiliar things may be simple once learned. The talk applies this distinction to design choices in Clojure: values over mutable state, data over opaque objects, functions over methods, and explicit composition over incidental coupling. The aim is not minimalism for its own sake, but decomplecting systems so each part can be reasoned about independently.

**In practice.** Model information as plain immutable data; express behaviour as functions that transform values; keep identity and state transitions explicit and isolated; use namespaces and small libraries rather than deep object hierarchies; choose unfamiliar tools when they reduce entanglement rather than merely feeling easy.

## Core tenets

- Simple is objective and structural: it means not intertwined, regardless of whether the idea is familiar to the programmer.
- Easy is subjective and contextual: it means close at hand, habitual or already installed, and can hide significant complexity.
- Decomplect concerns so identity, state, time, behaviour and data representation do not become braided together accidentally.
- Prefer values, persistent data and pure functions because they separate information from time and make reasoning local.
- Use data as an open, inspectable medium rather than forcing all meaning through opaque object method calls.
- Avoid incidental complexity even when it feels convenient in the short term.

## Key ideas

- **Simple vs easy** — Simplicity is about a thing's internal lack of entanglement; ease is about a user's proximity to it. The two are often confused in technology choices.
- **Complecting** — To complect is to braid concepts together so they must change or be understood as one. Good design separates those strands again.
- **Values, not places** — Immutable values describe facts. Mutable places introduce time and identity, making every read depend on when it happens and who else can write.

## Associated patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Pure Function](../patterns/functional/pure-function.md) — A pure function separates calculation from time, identity and hidden state, directly serving Hickey's decomplecting goal.
- [Immutability](../patterns/functional/immutability.md) — Immutable data keeps facts stable and prevents state changes from being braided through every consumer of a value.
- [Persistent Data Structure](../patterns/functional/persistent-data-structure.md) — Persistent structures make immutable values practical by sharing structure while preserving prior versions.
- [Value Object](../patterns/ddd-tactical/value-object.md) — Value objects model concepts by their attributes rather than mutable identity, aligning with the preference for values over places.
- [CQRS (Command Query Responsibility Segregation)](../patterns/architecture/cqrs.md) — Separates reads from writes, reducing the complection of querying, mutation and consistency concerns in one interface.
- [Function Composition](../patterns/functional/function-composition.md) — Builds behaviour by composing small independent transformations rather than hiding sequencing behind mutable collaborators.
- [Map-Filter-Reduce](../patterns/functional/map-filter-reduce.md) — Expresses collection processing as transparent value transformations instead of stateful iteration mixed with business logic.

## Patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Active Record](../patterns/enterprise-application/active-record.md) — Braids persistence, identity, data and behaviour into one object, exactly the kind of complection Hickey warns about.
- [Service Locator](../patterns/implementation/service-locator.md) — Hides dependencies behind global lookup, making the real strands of collaboration harder to see and reason about.
- [Singleton](../patterns/gof-creational/singleton.md) — A globally reachable mutable identity is easy to access but often complects state, lifetime and dependency management.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Clojure | Hickey presents Clojure's emphasis on immutable persistent data structures, functions and explicit state management as the practical expression of simple-not-easy design. | primary source | [Simple Made Easy](https://www.infoq.com/presentations/Simple-Made-Easy/) |
| Datomic | Datomic's database-as-values model, immutable facts and time-aware queries reflect the same separation of value, identity and time described in Hickey's talks and Datomic rationale. | primary source | Datomic rationale and architecture talks |
| Clojure standard library practice | The library's pervasive use of plain data maps, sequences and small functions gives users composable building blocks rather than large stateful class frameworks. | inferred | [Clojure Rationale](https://clojure.org/about/rationale) |

**Best for:** library, backend-service, data-pipeline, etl, high-throughput

## Relationships with other philosophies

**Complements:** [Functional Core & Type-Driven Design](functional-core-type-driven.md), [The Unix Philosophy](unix-philosophy.md), [A Philosophy of Software Design](a-philosophy-of-software-design.md), [Data-Oriented Design](data-oriented-design.md)

**In tension with**

- [Clean Architecture & SOLID](clean-architecture-solid.md) — SOLID can be practised simply, but object-oriented interpretations often distribute behaviour across many method-bearing objects, which Hickey criticises as complecting state and action.
- [Domain-Driven Design](domain-driven-design.md) — DDD tactical models can use rich mutable entities and object behaviour; Simple Made Easy prefers data, values and functions unless identity and mutation are essential.
- [Worse Is Better](worse-is-better.md) — Worse-is-better may choose the familiar easy implementation to ship; Simple Made Easy warns that ease can import hidden complexity that slows the system later.

## Criticisms / limits

- It can understate the adoption cost of unfamiliar ideas; what is structurally simple may still slow teams without the background to use it well.
- The talk is strongest as design judgement rather than a mechanical method; teams can disagree about what is actually complected.
- Object-oriented domains with rich behaviour may find a pure data-and-functions style less natural or more ceremonious.

## References

- [Rich Hickey, Simple Made Easy, (2011)](https://www.infoq.com/presentations/Simple-Made-Easy/)
- [Rich Hickey, Clojure Rationale](https://clojure.org/about/rationale)
- Rich Hickey, The Value of Values, (2012)

