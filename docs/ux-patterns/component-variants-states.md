# Component Variants & States

> Define each component's intentional variants and interaction states so teams can reuse it consistently without inventing behaviour for every screen.

**Discipline:** UX Design · **Category:** design-systems · **Maturity:** established

**Also known as:** Component State Matrix, Variant Modelling

## Description

Component variants and states turn a component from a static picture into a governed interaction contract. Variants describe legitimate forms of a component, such as primary, secondary, destructive, compact, or with icon. States describe how it behaves through interaction and system conditions, such as default, hover, focus, active, disabled, loading, selected, error, empty, and success. Modelling them explicitly helps designers, engineers, QA, and accessibility reviewers reason about coverage. It also prevents component APIs from becoming a dumping ground for one-off flags.

**Problem.** Teams reuse components visually but improvise variants, loading behaviour, errors, focus, and disabled states in each product surface, creating inconsistent and inaccessible experiences.

**Context.** Use for any shared component that appears across screens or products, especially inputs, buttons, navigation, cards, tables, dialogs, and status components.

## Forces

- Coverage reduces ambiguity, but enumerating every possible combination can create an unmanageable state explosion.
- Product teams need flexibility, while the design system must protect meaning and consistency.
- Some states are interaction-driven, others data-driven, and some are accessibility obligations.
- Variant names become API and design language, so poor naming is costly to undo.

## Solution

For each component, define the supported variants, states, and meaningful combinations in a state matrix. Document anatomy, usage rules, accessibility behaviour, content guidance, and token usage for each. Make unsupported combinations explicit rather than silently letting teams improvise. Use component APIs and design-tool variants that reflect the same model, and review new variant requests against demonstrated product needs.

## When to use

- A component is shared by more than one team or appears in multiple contexts.
- Designers hand off static default states and engineers guess the rest.
- Accessibility reviews find inconsistent focus, disabled, or error behaviour.
- Variant props are multiplying without a clear conceptual model.

## Heuristics

Rules of thumb for applying this pattern well:

- Design default, focus, disabled, loading, error, and empty states before calling a component reusable.
- Constrain combinations deliberately; not every variant should support every state.
- Name variants by role, hierarchy, or intent rather than by visual treatment.
- Keep design-tool variants and code props aligned so the contract is the same in both places.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Important for core controls, but a young product should avoid over-modelling components that may not survive. |
| Growth (scaling team & users) | ●●●●● 5/5 | Excellent fit when multiple teams reuse components and need clear contracts for behaviour, accessibility, and theming. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for governed systems with compliance, accessibility, and many product surfaces; state coverage prevents costly inconsistency. |

## Examples

### Button variant sprawl

**❌ Poorer approach**

Product teams request blueButton, bigBlueButton, marketingBlueButton, and dangerBlueButton, each with slightly different hover and disabled behaviour.

**✅ Better approach**

The system defines primary, secondary, tertiary, and destructive variants, each with specified default, hover, focus, active, disabled, and loading states.

*The better model gives variation meaningful boundaries and keeps behaviour consistent across contexts.*

### Error state as first-class design

**❌ Poorer approach**

A shared input component has a default and focused design, but each team invents its own validation error copy, icon, colour, and screen-reader announcement.

**✅ Better approach**

The input component includes error, warning, success, disabled, readonly, and loading states with accessible descriptions and content guidance.

*States are part of the experience contract. Designing them centrally prevents the most stressful moments from becoming inconsistent.*

## Anti-patterns

- Designing only the default state and leaving hover, focus, error, empty, and loading to implementation guesses.
- Adding a new variant for every product request instead of identifying reusable intent.
- Allowing illegal combinations, such as disabled plus loading plus destructive, with no defined priority.
- Naming variants by colour or stakeholder preference instead of user-facing purpose.

## Relationships

**Related product / UX patterns**

- [Atomic Design Components](../ux-patterns/atomic-design-components.md) — Atomic components become reliable building blocks only when their supported variants and states are explicit.
- [Design Tokens](../ux-patterns/design-tokens.md) — State and variant styling should be driven by semantic tokens so meaning remains consistent across themes.
- [Pattern Library Governance](../ux-patterns/pattern-library-governance.md) — Governance decides when a new variant is generally useful enough to enter the shared system.

**Related software patterns**

- [State](../patterns/gof-behavioural/state.md) — Interactive components often implement explicit state-dependent behaviour that mirrors the design state matrix.
- [Type State](../patterns/implementation/type-state.md) — Type-state can encode legal component states and prevent invalid combinations in typed frontend APIs.
- [Component-Based UI](../patterns/frontend/component-based-ui.md) — Shared UI components need variant and state contracts to remain reusable in component-based applications.

**Related philosophies**

- [Atomic Design](../philosophies/atomic-design.md) — Variant and state modelling is what makes atomic components usable in real, dynamic product interfaces.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Visibility of system status, error prevention, and consistency are directly served by well-defined states.

## Tags

- **Tags:** component-states, variants, accessibility, design-systems
- **Product stages:** growth, enterprise

## References

- Brad Frost, Atomic Design, (2016)
- Marco Suarez, Jina Anne, Katie Sylor-Miller, Diana Mounter, Roy Stanfield, Design Systems Handbook, (2017)

