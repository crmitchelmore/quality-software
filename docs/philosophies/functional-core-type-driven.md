# Functional Core & Type-Driven Design

> Put pure, total, immutable logic at the centre of the system, keep effects at the edges, and use types and constructors so invalid states cannot be represented.

**Discipline:** software · **Origin:** ML and Haskell traditions, Gary Bernhardt, Yaron Minsky · *ML/Haskell type-driven programming, Functional Core Imperative Shell, and Effective ML* · (2012)

**Also known as:** Functional core, imperative shell, Make illegal states unrepresentable, Parse, don't validate

## Description

Functional Core & Type-Driven Design combines the functional-programming tradition of ML and Haskell with Gary Bernhardt's "functional core, imperative shell" formulation and Yaron Minsky's Effective ML advice to make illegal states unrepresentable. The system is split between a core of pure, deterministic functions over immutable values and a thin shell that performs IO, persistence, network calls and other effects. Inputs are parsed once at the boundary into rich domain types; after that, the rest of the program should not repeatedly validate primitive data or defend against impossible cases. The philosophy prizes total functions, explicit absence and failure, algebraic data types, smart constructors and narrow effect boundaries as tools for moving correctness from runtime convention into compile-time structure.

**In practice.** Define small domain types before writing workflows; use smart constructors for values with invariants; return Option/Maybe or Either/Result for expected absence and failure; keep command handlers, controllers and adapters as shells that translate to and from the functional core. Tests should concentrate on core behaviour with plain values, with fewer mocks because effects are already pushed outward.

## Core tenets

- Keep domain decisions in a pure functional core whose outputs depend only on its inputs, so it is easy to reason about and test.
- Push IO, clocks, randomness, persistence, logging and external services into a thin imperative shell around that core.
- Use domain-specific types, sum types and smart constructors to make illegal states unrepresentable rather than merely documented.
- Parse, don't validate — convert untrusted input into precise types at the boundary, then pass only valid values inward.
- Prefer total functions and explicit result types for absence and failure instead of nulls, exceptions and partial assumptions.
- Treat immutability as the default so transformations are local, repeatable and free of hidden temporal coupling.

## Key ideas

- **Functional core, imperative shell** — Pure business logic is isolated from the messy world; the shell gathers inputs, invokes the core and performs effects with the core's results.
- **Illegal states unrepresentable** — Types encode invariants such as non-empty lists, validated identifiers or allowed state transitions, so many errors cannot be expressed by well-typed code.
- **Parse, don't validate** — Validation should produce a richer value that carries proof of validity; repeatedly checking raw strings and maps leaves the same uncertainty everywhere.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Pure Function](../patterns/functional/pure-function.md) — The basic unit of the functional core: deterministic logic with no hidden effects.
- [Immutability](../patterns/functional/immutability.md) — Immutable values make core transformations easier to reason about and safe to share.
- [Option / Maybe](../patterns/functional/option-maybe.md) — Represents expected absence explicitly instead of smuggling it through null.
- [Either / Result](../patterns/functional/either-result.md) — Makes recoverable failure part of a function's type and return value.
- [Newtype / Wrapper Type](../patterns/implementation/newtype-wrapper.md) — Turns primitive strings and numbers into domain-specific types that cannot be accidentally mixed.
- [Type State](../patterns/implementation/type-state.md) — Encodes valid state transitions in types so operations are only available in legal states.
- [Smart Constructor](../patterns/implementation/smart-constructor.md) — Centralises invariant checks at creation time and returns only values that satisfy them.

## Software patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Active Record](../patterns/enterprise-application/active-record.md) — Mixing persistence, mutation and domain behaviour in one object tends to pull effects into the core instead of keeping them at the shell.
- [Service Locator](../patterns/implementation/service-locator.md) — Hidden global dependencies obscure effects that this philosophy wants explicit and isolated.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Gary Bernhardt's Destroy All Software examples | Bernhardt popularised separating deterministic application logic from side-effecting shells as a practical way to make tests fast and design clearer. | primary source | Functional Core, Imperative Shell |
| Jane Street OCaml systems | Jane Street has publicly described using OCaml's type system and functional style to model financial-domain invariants and reduce classes of runtime errors. | secondary source | Yaron Minsky, Effective ML and OCaml for the Masses talks/articles |
| Haskell and ML compiler/type-system practice | Algebraic data types, pattern matching and explicit effects are longstanding practice in the language families from which the philosophy draws. | inferred | ML and Haskell language traditions |

**Best for:** library, backend-service, web-api, safety-critical

## Relationships with other philosophies

**Complements:** [Simple Made Easy](simple-made-easy.md), [Design by Contract](design-by-contract.md), [Information Hiding & Modular Decomposition](information-hiding.md)

**In tension with**

- [Data-Oriented Design](data-oriented-design.md) — Type-driven functional designs often favour abstraction, persistent data structures and immutability; data-oriented design may reject those costs in hot loops where layout, mutation and cache behaviour dominate.
- [The Unix Philosophy](unix-philosophy.md) — Unix text-stream composition is intentionally weakly typed at process boundaries, whereas type-driven design wants boundary parsing to produce precise internal types quickly.

## Criticisms / limits

- Strong type modelling can become ceremony if applied to throwaway or very simple code.
- Persistent immutable structures and abstraction may be inappropriate for performance-critical inner loops without careful measurement.
- Teams unfamiliar with algebraic types can encode invariants awkwardly or hide complexity in type machinery.

## References

- Gary Bernhardt, Functional Core, Imperative Shell, (2012)
- Yaron Minsky, Effective ML / Make illegal states unrepresentable, (2011)
- Alexis King, Parse, don't validate, (2019)

