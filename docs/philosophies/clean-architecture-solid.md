# Clean Architecture & SOLID

> Keep business policy independent of delivery mechanisms by making dependencies point inward, applying SOLID principles and treating frameworks, databases and UI as plugins.

**Discipline:** software · **Origin:** Robert C. Martin · *Clean Architecture: A Craftsman's Guide to Software Structure and Design* · (2017)

**Also known as:** Clean Architecture, SOLID, Uncle Bob's architecture

## Description

Clean Architecture extends Robert C. Martin's SOLID object-design principles into a whole-system architecture. Its dependency rule says source-code dependencies should point inward, toward the more stable, higher-level policy of the application, and never outward toward details such as UI, databases, web frameworks or devices. Entities and use cases express business rules; interface adapters translate between that core and the outside world; frameworks and drivers sit at the edge as replaceable details. SOLID provides the class and package-level discipline behind this shape: single reasons to change, extension without modification, substitutable abstractions, small client-specific interfaces, and dependence on abstractions rather than concretions. The aim is not ceremony for its own sake, but keeping decisions that should change at different rates from being tangled together.

**In practice.** Put enterprise rules and use cases in framework-free packages; define ports or interfaces where the core needs persistence, time, messaging or presentation; implement those interfaces in outer adapters. Test use cases with in-memory fakes before wiring real frameworks. Keep DTOs and persistence models at boundaries unless the domain model is deliberately shared. Be alert to over-segmentation: the architecture should protect policy, not manufacture layers with no hidden decision behind them.

## Core tenets

- The dependency rule — source-code dependencies point inward toward policy; inner circles know nothing about outer frameworks, databases, UI or devices.
- Separate policy from detail — business rules and use cases should be testable without a web server, database, message broker or framework bootstrapped.
- Apply SOLID at module boundaries — small reasons to change, substitutable abstractions, interface segregation and dependency inversion keep policies insulated.
- Treat frameworks and databases as plugins chosen at the edge, not as the architecture's centre or the vocabulary of the domain.
- Cross boundaries with simple data structures and interfaces, translating where necessary so outer concerns do not leak inward.

## Key ideas

- **Dependency rule** — Dependencies may cross architectural circles only inward. Runtime control can flow outward, but source dependencies are inverted through interfaces owned by the inner policy.
- **Use cases as application policy** — Use cases orchestrate application-specific business rules independently of controllers, presenters, repositories and frameworks.
- **Details are plugins** — Databases, web frameworks, UI and external services are replaceable mechanisms attached at the perimeter, not foundations that dictate the core design.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Clean Architecture](../patterns/architecture/clean-architecture.md) — The direct architectural pattern: concentric boundaries with business policy inside and details outside.
- [Hexagonal Architecture (Ports & Adapters)](../patterns/architecture/hexagonal-architecture.md) — Ports and adapters express the same plugin idea, with the application core independent of delivery and infrastructure mechanisms.
- [Onion Architecture](../patterns/architecture/onion-architecture.md) — Reinforces inward dependencies and domain-centred layering closely aligned with Clean Architecture's circles.
- [Dependency Injection](../patterns/implementation/dependency-injection.md) — Supplies outer implementations to inner abstractions without making the core depend on concrete details.
- [Inversion of Control](../patterns/implementation/inversion-of-control.md) — Enables control flow to reach outward at runtime while preserving inward source-code dependencies.
- [Repository](../patterns/data-persistence/repository.md) — Gives use cases and domain code a persistence abstraction rather than coupling them to a database API or ORM.
- [Service Layer](../patterns/enterprise-application/service-layer.md) — A common place to express application use cases and coordinate domain operations apart from controllers and infrastructure.

## Software patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Active Record](../patterns/enterprise-application/active-record.md) — Couples domain behaviour to persistence mechanisms, making the database an inner design concern rather than an outer plugin.
- [Service Locator](../patterns/implementation/service-locator.md) — Hides dependencies behind global lookup, weakening explicit dependency inversion and making use cases harder to test and reason about.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Robert C. Martin's published architecture practice and examples | Martin presents Clean Architecture as a synthesis of architectures he reports using and teaching across enterprise systems, with dependency inversion keeping policy independent of delivery mechanisms. | primary source | Clean Architecture: A Craftsman's Guide to Software Structure and Design |
| .NET eShopOnWeb reference application | Microsoft's reference application is explicitly organised around Clean Architecture, using a domain/application core with infrastructure and web projects at the edge. | secondary source | [eShopOnWeb ASP.NET Core Reference Application](https://github.com/dotnet-architecture/eShopOnWeb) |
| Enterprise application templates and training codebases | Widely used Clean Architecture templates for .NET, Java and TypeScript report the same separation of use cases, domain model, adapters and infrastructure for maintainable business systems. | secondary source | [Clean Architecture Solution Template](https://github.com/jasontaylordev/CleanArchitecture) |

**Best for:** web-api, backend-service, modular-monolith, microservices, distributed-system

## Relationships with other philosophies

**Complements:** [Information Hiding & Modular Decomposition](information-hiding.md), [Domain-Driven Design](domain-driven-design.md), [A Philosophy of Software Design](a-philosophy-of-software-design.md)

**In tension with**

- [A Philosophy of Software Design](a-philosophy-of-software-design.md) — Clean Architecture and SOLID can be applied as many small interfaces and classes; APoSD warns that this easily becomes shallow-module classitis when interfaces hide little.
- [The Unix Philosophy](unix-philosophy.md) — Clean Architecture favours inward, domain-specific policy boundaries, while Unix favours small context-free tools connected by simple external protocols.

## Criticisms / limits

- Rigid layering can add boilerplate and indirection to simple CRUD systems where the protected policy is thin.
- Misapplied SOLID can produce many tiny interfaces and classes that obscure the design instead of hiding meaningful decisions.
- Framework independence is relative — performance, transactions and deployment constraints still shape real architectures.

## References

- Robert C. Martin, Clean Architecture: A Craftsman's Guide to Software Structure and Design, (2017)
- Robert C. Martin, Agile Software Development, Principles, Patterns, and Practices, (2002)
- [Robert C. Martin, The Clean Architecture, (2012)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

