# Design by Contract

> Define software elements by explicit contracts: preconditions for callers, postconditions for suppliers and invariants that every valid object state must preserve.

**Discipline:** software · **Origin:** Bertrand Meyer · *Object-Oriented Software Construction* · (1988)

**Also known as:** DbC, Contract programming

## Description

Design by Contract, introduced by Bertrand Meyer in Eiffel and Object-Oriented Software Construction, treats each routine and class as a formal agreement between client and supplier. A method's preconditions state what callers must satisfy before invocation; its postconditions state what the method guarantees on return; class invariants state what must remain true for every externally visible object state. These contracts are not merely defensive checks: they allocate responsibility, document intent in executable form and enable local reasoning about correctness. When a contract is violated, the right behaviour is to fail fast and expose the broken assumption rather than silently compensate for a caller or supplier that has not met its obligation.

**In practice.** Put explicit guards at module boundaries and constructors; document caller and supplier obligations in API contracts; assert invariants close to the state that owns them; distinguish expected domain rejection from contract violation. Use tests, property checks and contract tests to exercise the promises, but avoid scattering duplicate defensive checks that blur responsibility.

## Core tenets

- Every operation should make its obligations explicit: what the caller must provide and what the supplier guarantees in return.
- Preconditions belong to the caller; a callee should not quietly repair inputs that violate the contract.
- Postconditions belong to the supplier; after a successful call, callers may rely on the stated result and side effects.
- Class invariants must hold before and after public operations, making object validity a stable property rather than a hope.
- Contract violation is a bug, not a normal business outcome; fail fast so the responsible side can be fixed.
- Inheritance and substitution require behavioural compatibility: overridden methods must honour the ancestor contract.

## Key ideas

- **Preconditions** — Conditions a caller must satisfy before invoking an operation, such as non-null arguments, valid ranges or required state.
- **Postconditions** — Guarantees a routine makes if it returns normally, giving callers a reliable basis for the next step.
- **Class invariants** — Properties that define a valid instance and must be preserved by all public methods.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Guard Clause (Early Return)](../patterns/implementation/guard-clause.md) — A direct way to check preconditions early and keep the normal path free of invalid cases.
- [Fail Fast](../patterns/implementation/fail-fast.md) — Contract violations should surface immediately rather than contaminating later state.
- [Input Validation (Allow-List)](../patterns/security/input-validation.md) — Boundary validation can establish the preconditions needed before entering contracted code.
- [Consumer-Driven Contract Testing](../patterns/testing/contract-testing.md) — Verifies that providers and consumers agree on externally visible obligations.
- [Property-Based Testing](../patterns/testing/property-based-testing.md) — Exercises invariants and postconditions across broad generated input spaces.
- [Specification](../patterns/ddd-tactical/specification.md) — Encapsulates business rules that can serve as readable, reusable contract predicates.
- [Null Object](../patterns/implementation/null-object.md) — Replaces null with an object that satisfies the expected interface contract for benign absence.

## Software patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Service Locator](../patterns/implementation/service-locator.md) — Hidden dependencies make the real preconditions of an operation harder to see and reason about.
- [Active Record](../patterns/enterprise-application/active-record.md) — Persistence-coupled objects often blur whether invariants belong to the object, database or calling transaction.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Eiffel language and libraries | Eiffel built contract syntax for preconditions, postconditions and invariants into the language, making DbC an executable part of routine and class definitions. | primary source | Object-Oriented Software Construction |
| Eiffel Software method and tooling | Meyer's later editions and Eiffel tooling continued to present contracts as the core design and verification mechanism for object-oriented systems. | primary source | Object-Oriented Software Construction, second edition |
| Contract-testing practice in service APIs | Consumer/provider contract tests apply the same responsibility split to distributed service interfaces, though usually with examples rather than full formal contracts. | inferred | Consumer-driven contract testing practice |

**Best for:** library, sdk, safety-critical, backend-service

## Relationships with other philosophies

**Complements:** [Functional Core & Type-Driven Design](functional-core-type-driven.md), [A Philosophy of Software Design](a-philosophy-of-software-design.md), [Clean Architecture & SOLID](clean-architecture-solid.md)

**In tension with**

- [The Unix Philosophy](unix-philosophy.md) — Unix tools often rely on loose text conventions and tolerant parsing, while DbC prefers precise, explicit interface obligations.
- [Worse Is Better](worse-is-better.md) — DbC invests in correctness guarantees and explicit contracts; worse-is-better may accept a simpler incomplete interface that succeeds through adoption first.

## Criticisms / limits

- Runtime contract checks can add overhead or be disabled in production, weakening the guarantee if not handled deliberately.
- Over-specified contracts can make harmless implementation changes difficult.
- Many mainstream languages lack native contract support, so conventions and libraries may drift from the intended discipline.

## References

- Bertrand Meyer, Object-Oriented Software Construction, (1988)
- Bertrand Meyer, Object-Oriented Software Construction, second edition, (1997)
- Bertrand Meyer, Applying Design by Contract, (1992)

