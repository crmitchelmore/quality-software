# Atomic Design

> Build interface systems from small reusable parts, composing atoms into molecules, organisms, templates and pages.

**Discipline:** ux · **Origin:** Brad Frost · *Atomic Design* · (2016)

## Description

Atomic Design is Brad Frost's mental model for creating design systems. Borrowing a chemistry metaphor, it decomposes interfaces into atoms such as labels and buttons, molecules such as form fields, organisms such as headers, templates and finally pages. The philosophy shifts interface work from bespoke page production to systematic composition: teams design and implement durable components, document their variants and states, and assemble them into consistent experiences across products.

**In practice.** Inventory repeated UI, define tokens and primitives, create component variants and states, publish a pattern library, and require product teams to compose pages from documented components unless a deliberate new pattern is needed.

## Core tenets

- Treat interfaces as systems of reusable components rather than isolated pages.
- Start with small elements and compose them into larger patterns with clear responsibilities.
- Document states, variants and usage guidance so components remain consistent in real products.
- Keep design and implementation close enough that the system can be tested in production contexts.
- Evolve the system continuously as product needs reveal missing or over-specific components.

## Key ideas

- **Atoms, molecules and organisms** — Small UI elements combine into progressively richer interface components, making composition and reuse explicit.
- **Pattern Lab** — Frost's tooling popularised building and reviewing components outside individual pages while still composing realistic templates.
- **System over page** — The unit of design work becomes a component system that can support many pages consistently.

## Associated practice patterns

Product / UX patterns that embody or operationalise this philosophy:

- [Atomic Design Components](../ux-patterns/atomic-design-components.md) — The practice pattern directly operationalises Frost's atom-to-page component hierarchy.
- [Design Tokens](../ux-patterns/design-tokens.md) — Tokens provide the reusable visual decisions that make atomic components coherent across themes and platforms.
- [Pattern Library Governance](../ux-patterns/pattern-library-governance.md) — Governance prevents a component system from fragmenting as teams add variants and exceptions.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Pattern Lab and web design systems | Frost's Atomic Design and Pattern Lab became widely adopted references for component-driven web design systems. | primary source | Atomic Design |
| Enterprise design systems | The atom-to-page vocabulary is commonly used by large organisations to structure component libraries and documentation. | secondary source | Design Systems Handbook |

**Best for:** design systems, multi-product UI consistency, component-driven frontend teams

## Relationships with other philosophies

**Complements:** [A Philosophy of Software Design](a-philosophy-of-software-design.md), [The Design of Everyday Things](design-of-everyday-things.md)

## Criticisms / limits

- The chemistry metaphor can become rigid when real components do not fit neatly into levels.
- Component consistency can crowd out local optimisation if governance is too restrictive.
- Atomic inventories alone do not guarantee good user journeys or information architecture.

## References

- Brad Frost, Atomic Design, (2016)
- Brad Frost and Dave Olsen, Pattern Lab, (2013)
- Marco Suarez, Jina Anne, Katie Sylor-Miller, Diana Mounter and Roy Stanfield, Design Systems Handbook, (2017)

