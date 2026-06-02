# Content-First Design

> Design around real user-facing content early, so structure, flow, and interface choices serve meaning rather than placeholder layouts.

**Discipline:** UX Design · **Category:** content-design · **Maturity:** established

**Also known as:** Content-First UX, Real-Content Prototyping

## Description

Content-first design treats words, information, and evidence as core design material from the start of a project. Instead of filling polished layouts with lorem ipsum late in the process, teams draft real headings, labels, examples, error states, policies, and data variations early enough to shape the interface. This exposes unclear concepts, missing decisions, localisation issues, edge cases, and hierarchy problems before visual design and engineering harden around the wrong structure. It is not a call to finish all copy before design; it is a practice of using representative content to make better structural decisions.

**Problem.** Interfaces designed around placeholders often break when real content arrives: labels do not fit, hierarchy is wrong, edge cases are missing, and the product's meaning is unclear.

**Context.** Useful for new features, redesigns, onboarding, marketing-to-product handoffs, complex forms, dashboards, empty states, policy-heavy flows, and multilingual products.

## Forces

- Early content reveals ambiguity, but teams may resist writing before layout feels settled.
- Real content improves design decisions, yet production copy may still change after research and legal review.
- Content models need structure, while interface exploration needs room to evolve.

## Solution

Bring content design into discovery and early prototyping. Replace placeholders with realistic draft content, representative data, error cases, and edge-case lengths. Use content inventories and models to clarify what the interface must express, then let those findings shape layout, interaction, and component choices. Keep copy iterative, but never let a design decision depend on fake content that hides the real problem.

## When to use

- Meaning, terminology, or information hierarchy is central to whether the flow works.
- The design must handle variable-length, regulated, localised, or user-generated content.
- Placeholder layouts are masking uncertainty about what the product actually needs to say.

## Heuristics

Rules of thumb for applying this pattern well:

- Prototype with content that is messy enough to be real.
- Let headings and labels reveal the information architecture before styling it.
- Include error, empty, long, short, translated, and permission-limited content examples early.
- Treat content decisions as product decisions when they change meaning or behaviour.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Helps teams avoid building the wrong structure, though drafts should stay lightweight while the product is still changing. |
| Growth (scaling team & users) | ●●●●● 5/5 | Very strong fit as multiple teams and surfaces need consistent content models before design debt compounds. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for localisation, governance, legal review, and complex content systems where late copy changes are expensive. |

## Examples

### Dashboard cards

**❌ Poorer approach**

A dashboard is approved with neat placeholder card titles and one-line descriptions; real customer names, statuses, and warnings later overflow and obscure the primary actions.

**✅ Better approach**

The prototype uses real-length account names, missing-data examples, warning copy, and translated labels before the card layout is finalised.

*Representative content reveals the actual constraints the component must support before visual polish locks it in.*

### Onboarding flow

**❌ Poorer approach**

Designers create a three-step onboarding flow with placeholder headings, then content later reveals that users need a privacy explanation before the first permission request.

**✅ Better approach**

The team drafts the permission rationale, data-use copy, and error states during flow design, which changes the order and adds a review step before prompting.

*Content-first design lets meaning and trust requirements shape the interaction rather than being squeezed in afterwards.*

## Anti-patterns

- Designing final layouts with lorem ipsum and treating copy as a late polish pass.
- Forcing real content into components that were sized around idealised examples.
- Separating content, design, legal, and engineering decisions until implementation exposes conflicts.

## Relationships

**Related product / UX patterns**

- [Plain Language](../ux-patterns/plain-language.md) — Content-first work benefits from plain language because early drafts must clarify meaning, not decorate layouts.
- [Microcopy](../ux-patterns/microcopy.md) — Drafting labels, hints, and messages early exposes interaction assumptions while they are still cheap to change.
- [Progressive Information Hierarchy](../ux-patterns/progressive-information-hierarchy.md) — Real content helps determine what information should be primary, secondary, or disclosed later.

**Related software patterns**

- [Contract-First API (OpenAPI)](../patterns/api-design/contract-first-api.md) — Both practices surface the contract early; content-first focuses on the human-facing content contract before implementation hardens.
- [Component-Based UI](../patterns/frontend/component-based-ui.md) — Components need real content variants and limits to be reusable without breaking in production.
- [Template View](../patterns/enterprise-application/template-view.md) — Template design is only reliable when it is tested against real content structure and variation.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — Designing from real content makes the user's path and interpretation clearer before visual complexity is added.
- [Human-Centred Design](../philosophies/human-centered-design.md) — Content-first design centres the information users actually need to understand and act.
- [Design Thinking](../philosophies/design-thinking.md) — Iterating with realistic content in prototypes supports design thinking's bias toward tangible, testable artefacts.

## Tags

- **Tags:** content-strategy, prototyping, information-architecture, ux-writing
- **Product stages:** early, growth, enterprise

## References

- Sarah Richards, Content Design, (2017)
- Kristina Halvorson, Melissa Rach, Content Strategy for the Web, (2012)

