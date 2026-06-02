# Domain-Driven Design

> Put a rich, shared model of the business domain at the centre of software, aligning code, language and team boundaries so that complexity is tackled where it actually lives.

**Origin:** Eric Evans · *Domain-Driven Design: Tackling Complexity in the Heart of Software* · (2003)

**Also known as:** DDD

## Description

Domain-Driven Design holds that the primary complexity of most business software is in the domain itself, and that the best leverage comes from a deep, continuously refined model shared by engineers and domain experts. That model is expressed in a "ubiquitous language" used identically in conversation, code and tests. DDD provides strategic tools for the large picture — bounded contexts that delimit where a model and language apply, and context maps that describe how contexts relate — and tactical building blocks for expressing the model in code: entities, value objects, aggregates, domain events, repositories and services. Its deepest claim is that software design and organisational/communication design are inseparable: model boundaries and team boundaries should reinforce each other.

**In practice.** Model with domain experts and name code after the language they use; split a large system into bounded contexts with explicit relationships; keep invariants inside aggregate roots; publish domain events for cross-context communication; insulate from external models with anti-corruption layers. Often realised on hexagonal or clean architectures.

## Core tenets

- The model is the design — cultivate a single model that is reflected directly in the code, not a diagram that drifts from it.
- Use a ubiquitous language shared by developers and domain experts, consistently in speech, code and tests.
- Bound the applicability of any model explicitly with bounded contexts; do not seek one model for the whole enterprise.
- Distinguish entities (identity over time) from value objects (defined by their attributes) and keep invariants inside aggregates.
- Protect a context from foreign models at its edges with translation, rather than letting other models leak in.
- Focus the deepest design effort on the core domain — the part that differentiates the business — not on generic subdomains.

## Key ideas

- **Bounded context** — An explicit boundary within which a particular model and language are consistent; the same term may mean different things in different contexts.
- **Aggregate** — A cluster of objects treated as a single unit for changes, with one root enforcing invariants and controlling access.
- **Anti-corruption layer** — A translation layer that protects a clean model from the semantics of a legacy or external system it must integrate with.

## Associated patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Bounded Context](../patterns/ddd-strategic/bounded-context.md) — The central strategic pattern delimiting where a model and ubiquitous language hold.
- [Ubiquitous Language](../patterns/ddd-strategic/ubiquitous-language.md) — The practice that keeps model, conversation and code aligned — DDD's defining discipline.
- [Aggregate](../patterns/ddd-tactical/aggregate.md) — The tactical unit of consistency that keeps domain invariants enforced in one place.
- [Anti-Corruption Layer](../patterns/cloud-distributed/anti-corruption-layer.md) — Protects a context's model from external/legacy semantics, a core integration tactic.
- [Value Object](../patterns/ddd-tactical/value-object.md) — Models attribute-defined concepts immutably, sharpening the ubiquitous language.
- [Domain Event](../patterns/ddd-tactical/domain-event.md) — Expresses meaningful occurrences in the domain and decouples bounded contexts.
- [Repository](../patterns/data-persistence/repository.md) — Gives aggregates a collection-like persistence interface without leaking storage concerns into the model.

## Patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Active Record](../patterns/enterprise-application/active-record.md) — Coupling domain objects to table rows tends to push persistence concerns into the model, working against a persistence-ignorant domain.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Financial and insurance systems | Evans developed DDD on complex trading and logistics domains; the book's case studies draw on shipping/cargo and financial modelling. | primary source | Domain-Driven Design: Tackling Complexity in the Heart of Software |
| Microservices practice | Bounded contexts are widely used to find service boundaries; major microservices guidance adopts DDD context decomposition. | secondary source | Building Microservices, Sam Newman |
| .NET reference applications (eShopOnContainers / eShop) | Microsoft's reference microservices application is structured around DDD bounded contexts, aggregates and domain events. | secondary source | [.NET microservices: Architecture for Containerized .NET Applications](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/) |

**Best for:** microservices, modular-monolith, backend-service, distributed-system

## Relationships with other philosophies

**Complements:** [Conway's Law & Team Topologies](conways-law-team-topologies.md), [Clean Architecture & SOLID](clean-architecture-solid.md), [A Philosophy of Software Design](a-philosophy-of-software-design.md)

**In tension with**

- [The Unix Philosophy](unix-philosophy.md) — DDD invests in rich, domain-specific models and language; Unix prefers small, generic, context-free tools and uniform text interfaces.
- [Worse Is Better](worse-is-better.md) — DDD's deep modelling of the core domain is costly up front, which the worse-is-better preference for simpler, faster-to-ship designs resists.

## Criticisms / limits

- The full tactical/strategic apparatus is heavy for simple or CRUD-dominated domains where a thin model suffices.
- Success depends on sustained access to domain experts and disciplined language, which many teams cannot maintain.

## References

- Eric Evans, Domain-Driven Design: Tackling Complexity in the Heart of Software, (2003)
- Vaughn Vernon, Implementing Domain-Driven Design, (2013)
- Eric Evans, Domain-Driven Design Reference, (2015)

