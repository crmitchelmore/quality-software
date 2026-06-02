# Contextual Tooltips

> Provide brief, local explanations exactly where users encounter unfamiliar controls, terms, or first-time opportunities.

**Discipline:** UX Design · **Category:** onboarding-education · **Maturity:** established

## Description

Contextual tooltips are small explanatory messages attached to a specific interface element or moment. They can clarify a term, explain a new feature, warn about a condition, or suggest a next action. Their strength is proximity: the help appears where the question arises. Their risk is clutter and fragility: too many tooltips become noise, hover-only triggers exclude touch and keyboard users, and explanations can mask controls that should be self-evident. A good tooltip is short, accessible, dismissible when it is a prompt, and unnecessary for understanding the core task.

**Problem.** Users encounter unfamiliar labels or features in context, but sending them to documentation interrupts flow and front-loaded training is forgotten.

**Context.** Useful for domain terms, first-time feature discovery, compact controls, advanced settings, and just-in-time coaching where a small explanation is enough.

## Forces

- Local help reduces context switching, but overuse makes the interface feel noisy and underdesigned.
- Hover works for mouse users, but touch, keyboard, and screen-reader users need equivalent access.
- Tooltips can aid discovery, but they should not hide essential information.

## Solution

Use tooltips for concise secondary explanations, not core labels or required instructions. Place them near the relevant element, make them reachable by focus and touch, and ensure they do not obscure the control being explained. For onboarding prompts, allow dismissal and remember it; for persistent definitions, make the trigger predictable and unobtrusive.

## When to use

- A user needs a short explanation of a specific control, field, or term.
- The information is useful in context but too secondary for the main layout.
- The product can support accessible triggers beyond hover.

## Heuristics

Rules of thumb for applying this pattern well:

- If the information is essential to complete the task, put it on the page rather than in a tooltip.
- Keep tooltip copy short enough to read at a glance.
- Support focus, touch, escape, and screen-reader semantics, not hover alone.
- Remember dismissed onboarding tooltips so help does not become harassment.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for a few domain terms, but early products should fix confusing labels before adding many tooltips. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Valuable as features deepen and teams need lightweight education across surfaces. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Strong fit for dense expert tools, provided accessibility and governance are enforced. |

## Examples

### Domain term in settings

**❌ Poorer approach**

A security setting says "Enable SCIM" with no explanation, so non-specialist administrators leave it untouched or search external documentation.

**✅ Better approach**

The label remains visible and a help icon opens a short tooltip: "SCIM automatically provisions users from your identity provider." with a documentation link.

*The tooltip clarifies a specific term without forcing every user through a longer explanation.*

### Icon-only action

**❌ Poorer approach**

A toolbar uses unlabeled icons and relies on hover tooltips for all meaning, making touch and keyboard use difficult.

**✅ Better approach**

Primary actions have labels; secondary icons include accessible names and optional tooltips for extra clarification.

*Tooltips should enhance comprehension, not carry the whole interface vocabulary.*

## Anti-patterns

- Replacing visible labels with icon-only controls that require tooltips to understand.
- Showing multiple onboarding bubbles at once and blocking the page.
- Making critical instructions available only on hover.

## Relationships

**Related product / UX patterns**

- [Progressive Onboarding](../ux-patterns/progressive-onboarding.md) — Contextual tooltips are a just-in-time delivery mechanism for progressive onboarding.
- [Microcopy](../ux-patterns/microcopy.md) — Tooltip value depends on concise, plain-language instructional copy.
- [Focus Management](../ux-patterns/focus-management.md) — Tooltip triggers and dismissal must work for keyboard users and assistive technologies.

**Related software patterns**

- [Decorator](../patterns/gof-structural/decorator.md) — Tooltips often decorate existing controls with explanatory behaviour without changing the control's primary purpose.
- [Component-Based UI](../patterns/frontend/component-based-ui.md) — Accessible tooltip behaviour should be standardised as a reusable component.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Inclusive tooltips must work across input modes, devices, and assistive technologies.
- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — Local explanations reduce the need to leave the task or infer hidden meaning.

## Tags

- **Tags:** onboarding, microcopy, accessibility, help
- **Product stages:** early, growth, enterprise

## References

- [Nielsen Norman Group, Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/)
- Kinneret Yifrah, Microcopy: The Complete Guide, (2017)

