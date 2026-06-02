# Focus Management

> Move, contain, restore, and display focus deliberately so keyboard and assistive-technology users always know where interaction will happen next.

**Discipline:** UX Design · **Category:** accessibility-inclusive-design · **Maturity:** established

**Also known as:** Focus Order Management, Programmatic Focus

## Description

Focus management controls the active point of interaction in dynamic interfaces. When modals open, routes change, validation fails, content updates, menus expand, or steps advance, focus must move to a meaningful place, remain within appropriate boundaries, and return when the temporary context closes. Visible focus is the user's cursor through an application; programmatic focus is how the interface explains changes to assistive technologies. Good focus management turns dynamic UI from a maze into a coherent conversation.

**Problem.** Dynamic interfaces often leave focus behind, hide it under overlays, trap it accidentally, or move it unexpectedly. Keyboard and screen-reader users then lose context, activate the wrong control, or cannot escape.

**Context.** Applies to single-page applications, modals, drawers, popovers, menus, validation summaries, route changes, wizards, infinite updates, and any component that changes visible context without a full page load.

## Forces

- Moving focus can orient users, but unexpected jumps can also be disorienting.
- Focus traps are necessary for modal contexts, yet accidental traps block task completion.
- Visual polish may reduce focus visibility, but hidden focus breaks keyboard operation.
- Framework routing often updates content without the browser's default focus reset, so teams must recreate the cue.

## Solution

Define focus rules for each dynamic pattern. On modal open, move focus to the dialog or first meaningful control, trap focus while modal, and restore it to the trigger on close. On route or step changes, move focus to the new page heading or status summary. On validation failure, move to an error summary or first invalid field with clear relationships. Keep focus indicators visible and test with keyboard and screen reader combinations across the full flow.

## When to use

- The interface opens overlays, changes routes, reveals panels, validates forms, or updates content dynamically.
- Users report losing their place when interacting by keyboard or screen reader.
- A component library needs shared modal, menu, popover, and wizard behaviours.

## Heuristics

Rules of thumb for applying this pattern well:

- When context changes, put focus where the user can understand and continue the new context.
- Trap focus only for truly modal experiences, and always provide a predictable escape and restoration path.
- After temporary UI closes, return focus to the control or logical place that opened it.
- Visible focus is not optional; it must survive every theme and component state.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Simple products still need visible focus and sane modal behaviour; native patterns can cover much of the need early. |
| Growth (scaling team & users) | ●●●●● 5/5 | As single-page flows and custom overlays expand, focus rules become essential to prevent recurring defects. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Critical for complex applications, compliance, and productivity in keyboard-heavy workflows. |

## Examples

### A delete confirmation dialog

**❌ Poorer approach**

The dialog appears, but focus stays on the delete button behind the overlay. Pressing Tab moves through hidden page controls, and closing the dialog drops focus at the top of the document.

**✅ Better approach**

Focus moves to the dialog heading or safest action, cycles within the dialog, Escape and Cancel close it, and focus returns to the original delete button or the next logical row.

*The better version preserves context and safety. Keyboard users can operate the modal as the visual design implies, without falling through to obscured content.*

## Anti-patterns

- Opening a modal visually while focus remains on the obscured page behind it.
- Trapping focus in a component that is not actually modal or offering no keyboard escape.
- Moving focus to the top of the page after every small update, interrupting the user's work.
- Showing custom focus styles only for mouse hover and not for keyboard focus.

## Relationships

**Related product / UX patterns**

- [Keyboard Navigation](../ux-patterns/keyboard-navigation.md) — Keyboard navigation is only reliable when focus order, visibility, trapping, and restoration are intentionally managed.
- [Screen Reader Semantics](../ux-patterns/screen-reader-semantics.md) — Focus changes determine what screen readers announce, so targets need meaningful semantic names and roles.
- [WCAG Conformance](../ux-patterns/wcag-conformance.md) — Focus order, focus visible, and no keyboard trap are core WCAG accessibility requirements.

**Related software patterns**

- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Focus behaviour in complex widgets is easier to make correct when open, closed, active, and disabled states are explicit.
- [Memento](../patterns/gof-behavioural/memento.md) — Restoring focus after temporary UI closes resembles saving and restoring interaction state.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Focus management provides feedback and a clear conceptual model for where actions will apply.
- [Inclusive Design](../philosophies/inclusive-design.md) — Deliberate focus behaviour supports people navigating by keyboard, screen reader, switch, or voice.

## Tags

- **Tags:** accessibility, focus, modals, dynamic-ui
- **Product stages:** growth, enterprise

## References

- [W3C Web Accessibility Initiative, WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- W3C Web Accessibility Initiative, Web Content Accessibility Guidelines (WCAG) 2.2, (2023)

