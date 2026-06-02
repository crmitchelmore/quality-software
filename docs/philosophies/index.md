# Software Design Philosophies

Total philosophies: **16**

Each philosophy associates patterns from the [pattern catalogue](../index.md) and records where it has reportedly been applied.

| Philosophy | Originators | Origin | Patterns |
| --- | --- | --- | :-: |
| [A Philosophy of Software Design](a-philosophy-of-software-design.md) | John Ousterhout | *A Philosophy of Software Design* (2018) | 5 |
| [Clean Architecture & SOLID](clean-architecture-solid.md) | Robert C. Martin | *Clean Architecture: A Craftsman's Guide to Software Structure and Design* (2017) | 7 |
| [Conceptual Integrity](conceptual-integrity.md) | Fred Brooks | *The Mythical Man-Month* (1975) | 6 |
| [Continuous Delivery & Lean Software](continuous-delivery-lean.md) | Jez Humble, David Farley, Nicole Forsgren, Gene Kim, Mary Poppendieck, Tom Poppendieck | *Continuous Delivery and Lean Software Development* (2010) | 6 |
| [Conway's Law & Team Topologies](conways-law-team-topologies.md) | Melvin Conway, Matthew Skelton, Manuel Pais | *How Do Committees Invent? and Team Topologies* (1968) | 6 |
| [Data-Oriented Design](data-oriented-design.md) | Mike Acton, Richard Fabian | *Data-Oriented Design and C++* (2014) | 6 |
| [Design by Contract](design-by-contract.md) | Bertrand Meyer | *Object-Oriented Software Construction* (1988) | 7 |
| [Design for Production / Stability](design-for-production.md) | Michael Nygard | *Release It!* (2007) | 7 |
| [Domain-Driven Design](domain-driven-design.md) | Eric Evans | *Domain-Driven Design: Tackling Complexity in the Heart of Software* (2003) | 7 |
| [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) | Kent Beck | *Extreme Programming Explained and Test-Driven Development by Example* (1999) | 7 |
| [Functional Core & Type-Driven Design](functional-core-type-driven.md) | ML and Haskell traditions, Gary Bernhardt, Yaron Minsky | *ML/Haskell type-driven programming, Functional Core Imperative Shell, and Effective ML* (2012) | 7 |
| [Information Hiding & Modular Decomposition](information-hiding.md) | David Parnas | *On the Criteria To Be Used in Decomposing Systems into Modules* (1972) | 6 |
| [Simple Made Easy](simple-made-easy.md) | Rich Hickey | *Simple Made Easy* (2011) | 7 |
| [The Unix Philosophy](unix-philosophy.md) | Doug McIlroy, Ken Thompson, Dennis Ritchie, Rob Pike | *The Bell System Technical Journal (Unix issue) and The Art of Unix Programming* (1978) | 5 |
| [The Zen of Python](zen-of-python.md) | Tim Peters | *PEP 20 -- The Zen of Python* (2004) | 7 |
| [Worse Is Better](worse-is-better.md) | Richard P. Gabriel | *The Rise of Worse Is Better* (1991) | 6 |

## Patterns and the philosophies that motivate them

| Pattern | Motivated by |
| --- | --- |
| [Adapter](../patterns/gof-structural/adapter.md) | [Information Hiding & Modular Decomposition](information-hiding.md) |
| [Aggregate](../patterns/ddd-tactical/aggregate.md) | [Domain-Driven Design](domain-driven-design.md) |
| [Anti-Corruption Layer](../patterns/cloud-distributed/anti-corruption-layer.md) | [Conway's Law & Team Topologies](conways-law-team-topologies.md), [Domain-Driven Design](domain-driven-design.md), [Information Hiding & Modular Decomposition](information-hiding.md) |
| [Arrange-Act-Assert](../patterns/testing/arrange-act-assert.md) | [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) |
| [Backend for Frontend (BFF)](../patterns/architecture/backend-for-frontend.md) | [Conway's Law & Team Topologies](conways-law-team-topologies.md) |
| [Backpressure](../patterns/resilience/backpressure.md) | [Design for Production / Stability](design-for-production.md) |
| [Bounded Context](../patterns/ddd-strategic/bounded-context.md) | [Conceptual Integrity](conceptual-integrity.md), [Conway's Law & Team Topologies](conways-law-team-topologies.md), [Domain-Driven Design](domain-driven-design.md) |
| [Bridge](../patterns/gof-structural/bridge.md) | [Information Hiding & Modular Decomposition](information-hiding.md) |
| [Bulkhead](../patterns/resilience/bulkhead.md) | [Design for Production / Stability](design-for-production.md) |
| [Cache-Aside](../patterns/cloud-distributed/cache-aside.md) | [Data-Oriented Design](data-oriented-design.md) |
| [Circuit Breaker](../patterns/resilience/circuit-breaker.md) | [Continuous Delivery & Lean Software](continuous-delivery-lean.md), [Design for Production / Stability](design-for-production.md) |
| [Clean Architecture](../patterns/architecture/clean-architecture.md) | [Clean Architecture & SOLID](clean-architecture-solid.md) |
| [Contract-First API (OpenAPI)](../patterns/api-design/contract-first-api.md) | [Conceptual Integrity](conceptual-integrity.md) |
| [Consumer-Driven Contract Testing](../patterns/testing/contract-testing.md) | [Design by Contract](design-by-contract.md) |
| [Copy-on-Write](../patterns/concurrency/copy-on-write.md) | [Data-Oriented Design](data-oriented-design.md) |
| [CQRS (Command Query Responsibility Segregation)](../patterns/architecture/cqrs.md) | [Simple Made Easy](simple-made-easy.md) |
| [Database per Service](../patterns/data-persistence/database-per-service.md) | [Continuous Delivery & Lean Software](continuous-delivery-lean.md) |
| [Dependency Injection](../patterns/implementation/dependency-injection.md) | [Clean Architecture & SOLID](clean-architecture-solid.md), [The Zen of Python](zen-of-python.md) |
| [Deployment Stamp (Cells)](../patterns/cloud-distributed/deployment-stamp.md) | [Continuous Delivery & Lean Software](continuous-delivery-lean.md) |
| [Domain Event](../patterns/ddd-tactical/domain-event.md) | [Domain-Driven Design](domain-driven-design.md) |
| [Domain Model](../patterns/enterprise-application/domain-model.md) | [Conceptual Integrity](conceptual-integrity.md) |
| [Either / Result](../patterns/functional/either-result.md) | [Functional Core & Type-Driven Design](functional-core-type-driven.md) |
| [Facade](../patterns/gof-structural/facade.md) | [A Philosophy of Software Design](a-philosophy-of-software-design.md), [Conceptual Integrity](conceptual-integrity.md), [Information Hiding & Modular Decomposition](information-hiding.md) |
| [Fail Fast](../patterns/implementation/fail-fast.md) | [Design by Contract](design-by-contract.md), [The Zen of Python](zen-of-python.md) |
| [Fallback](../patterns/resilience/fallback.md) | [Design for Production / Stability](design-for-production.md), [Worse Is Better](worse-is-better.md) |
| [Feature Toggle](../patterns/implementation/feature-toggle.md) | [Continuous Delivery & Lean Software](continuous-delivery-lean.md), [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md), [Worse Is Better](worse-is-better.md) |
| [Flyweight](../patterns/gof-structural/flyweight.md) | [Data-Oriented Design](data-oriented-design.md) |
| [Function Composition](../patterns/functional/function-composition.md) | [Simple Made Easy](simple-made-easy.md) |
| [Given-When-Then (BDD)](../patterns/testing/given-when-then.md) | [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) |
| [Guard Clause (Early Return)](../patterns/implementation/guard-clause.md) | [A Philosophy of Software Design](a-philosophy-of-software-design.md), [Design by Contract](design-by-contract.md), [The Zen of Python](zen-of-python.md) |
| [Health Endpoint Monitoring](../patterns/cloud-distributed/health-endpoint-monitoring.md) | [Design for Production / Stability](design-for-production.md) |
| [Hexagonal Architecture (Ports & Adapters)](../patterns/architecture/hexagonal-architecture.md) | [A Philosophy of Software Design](a-philosophy-of-software-design.md), [Clean Architecture & SOLID](clean-architecture-solid.md) |
| [Immutability](../patterns/functional/immutability.md) | [Functional Core & Type-Driven Design](functional-core-type-driven.md), [Simple Made Easy](simple-made-easy.md) |
| [Input Validation (Allow-List)](../patterns/security/input-validation.md) | [Design by Contract](design-by-contract.md), [The Zen of Python](zen-of-python.md) |
| [Inversion of Control](../patterns/implementation/inversion-of-control.md) | [Clean Architecture & SOLID](clean-architecture-solid.md) |
| [Layered (N-Tier) Architecture](../patterns/architecture/layered-architecture.md) | [A Philosophy of Software Design](a-philosophy-of-software-design.md) |
| [Map-Filter-Reduce](../patterns/functional/map-filter-reduce.md) | [Data-Oriented Design](data-oriented-design.md), [Simple Made Easy](simple-made-easy.md), [The Unix Philosophy](unix-philosophy.md) |
| [Memoization](../patterns/functional/memoization.md) | [Data-Oriented Design](data-oriented-design.md) |
| [Microkernel (Plugin) Architecture](../patterns/architecture/microkernel.md) | [Conceptual Integrity](conceptual-integrity.md), [Worse Is Better](worse-is-better.md) |
| [Microservices](../patterns/architecture/microservices.md) | [Conway's Law & Team Topologies](conways-law-team-topologies.md), [The Unix Philosophy](unix-philosophy.md) |
| [Middleware Pipeline](../patterns/implementation/middleware-pipeline.md) | [The Unix Philosophy](unix-philosophy.md) |
| [Mock Object](../patterns/testing/mock-object.md) | [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) |
| [Modular Monolith](../patterns/architecture/modular-monolith.md) | [Conceptual Integrity](conceptual-integrity.md), [Conway's Law & Team Topologies](conways-law-team-topologies.md) |
| [Newtype / Wrapper Type](../patterns/implementation/newtype-wrapper.md) | [Functional Core & Type-Driven Design](functional-core-type-driven.md) |
| [Null Object](../patterns/implementation/null-object.md) | [Design by Contract](design-by-contract.md) |
| [Object Pool](../patterns/implementation/object-pool.md) | [Data-Oriented Design](data-oriented-design.md) |
| [Onion Architecture](../patterns/architecture/onion-architecture.md) | [Clean Architecture & SOLID](clean-architecture-solid.md) |
| [Option / Maybe](../patterns/functional/option-maybe.md) | [Functional Core & Type-Driven Design](functional-core-type-driven.md) |
| [Options Object](../patterns/implementation/options-object.md) | [The Zen of Python](zen-of-python.md) |
| [Transactional Outbox](../patterns/cloud-distributed/outbox.md) | [Continuous Delivery & Lean Software](continuous-delivery-lean.md) |
| [Persistent Data Structure](../patterns/functional/persistent-data-structure.md) | [Simple Made Easy](simple-made-easy.md) |
| [Pipes and Filters](../patterns/architecture/pipes-and-filters.md) | [The Unix Philosophy](unix-philosophy.md), [Worse Is Better](worse-is-better.md) |
| [Problem Details (RFC 7807 Errors)](../patterns/api-design/problem-details.md) | [The Zen of Python](zen-of-python.md) |
| [Property-Based Testing](../patterns/testing/property-based-testing.md) | [Design by Contract](design-by-contract.md), [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) |
| [Prototype](../patterns/gof-creational/prototype.md) | [Worse Is Better](worse-is-better.md) |
| [Published Language](../patterns/ddd-strategic/published-language.md) | [Conway's Law & Team Topologies](conways-law-team-topologies.md) |
| [Pure Function](../patterns/functional/pure-function.md) | [Functional Core & Type-Driven Design](functional-core-type-driven.md), [Simple Made Easy](simple-made-easy.md) |
| [Repository](../patterns/data-persistence/repository.md) | [A Philosophy of Software Design](a-philosophy-of-software-design.md), [Clean Architecture & SOLID](clean-architecture-solid.md), [Domain-Driven Design](domain-driven-design.md), [Information Hiding & Modular Decomposition](information-hiding.md) |
| [Retry with Backoff](../patterns/resilience/retry.md) | [Design for Production / Stability](design-for-production.md) |
| [Separated Interface](../patterns/enterprise-application/separated-interface.md) | [Information Hiding & Modular Decomposition](information-hiding.md) |
| [Service Layer](../patterns/enterprise-application/service-layer.md) | [Clean Architecture & SOLID](clean-architecture-solid.md) |
| [Smart Constructor](../patterns/implementation/smart-constructor.md) | [Functional Core & Type-Driven Design](functional-core-type-driven.md) |
| [Specification](../patterns/ddd-tactical/specification.md) | [Design by Contract](design-by-contract.md) |
| [Strangler Fig](../patterns/architecture/strangler-fig.md) | [Continuous Delivery & Lean Software](continuous-delivery-lean.md), [Worse Is Better](worse-is-better.md) |
| [Strategy](../patterns/gof-behavioural/strategy.md) | [The Unix Philosophy](unix-philosophy.md) |
| [Template Method](../patterns/gof-behavioural/template-method.md) | [The Zen of Python](zen-of-python.md) |
| [Test Double](../patterns/testing/test-double.md) | [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) |
| [Test Pyramid](../patterns/testing/test-pyramid.md) | [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md) |
| [Timeout](../patterns/resilience/timeout.md) | [Design for Production / Stability](design-for-production.md) |
| [Type State](../patterns/implementation/type-state.md) | [Functional Core & Type-Driven Design](functional-core-type-driven.md) |
| [Ubiquitous Language](../patterns/ddd-strategic/ubiquitous-language.md) | [Domain-Driven Design](domain-driven-design.md) |
| [Value Object](../patterns/ddd-tactical/value-object.md) | [Domain-Driven Design](domain-driven-design.md), [Simple Made Easy](simple-made-easy.md) |

