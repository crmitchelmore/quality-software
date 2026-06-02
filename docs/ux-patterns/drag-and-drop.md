# Drag and Drop

> Let users move, reorder, group, or upload items by directly dragging them, while providing accessible alternatives and clear drop feedback.

**Discipline:** UX Design · **Category:** interaction-design · **Maturity:** established

**Also known as:** Direct Manipulation Reordering, Drag Interaction

## Description

Drag and drop lets users act on objects by picking them up, moving them, and releasing them onto a target. It can make spatial tasks such as reordering, arranging, grouping, and uploading feel tangible because the action resembles the intended outcome. The pattern is powerful but fragile: targets must be discoverable, the item must visibly follow the pointer, valid and invalid destinations must be obvious, and the final result must be reversible. Because dragging is difficult or impossible for some users and devices, a production-quality design always includes keyboard, menu, or button alternatives with the same capability.

**Problem.** Some interactions are cumbersome when expressed only as forms or menus: users must specify source, destination, and order indirectly even though they can see exactly where the object should go.

**Context.** Common in kanban boards, file uploads, list reordering, layout builders, map tools, media editors, and any interface where objects have a meaningful spatial or ordered relationship.

## Forces

- Directness and delight compete with precision, especially on small screens or dense targets.
- Pointer-based interaction is not universally accessible, so equivalent non-drag controls are required.
- Immediate visual movement can hide data loss unless invalid drops and rollback are designed carefully.

## Solution

Use drag and drop only where movement or placement is central to the task. Provide clear drag handles or affordances, preview the dragged item and potential insertion point, distinguish valid from invalid drop targets, and confirm the resulting state. Support cancellation, undo, and keyboard or menu-based alternatives. For destructive or cross-context moves, explain the consequence before or immediately after drop and make reversal obvious.

## When to use

- Users need to reorder, group, arrange, or upload items in a visible workspace.
- Spatial placement or order is easier to express directly than through fields.
- Equivalent accessible alternatives can be provided without reducing capability.

## Heuristics

Rules of thumb for applying this pattern well:

- Use visible handles when dragging competes with clicking, selecting, or scrolling.
- Show the destination before the user releases, not only after the drop.
- Every drag operation needs an equivalent keyboard or command path.
- Make cancellation and undo obvious because slips are common in pointer movement.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Often expensive relative to simpler controls unless spatial manipulation is the core product value. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Good fit for productivity surfaces where speed and perceived control matter, provided accessibility is not deferred. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful in complex work management and design tools, but must meet stricter accessibility, audit, and error-recovery needs. |

## Examples

### Reordering a backlog

**❌ Poorer approach**

A backlog allows cards to be dragged but shows no insertion marker; when the user releases a card, it jumps to an unexpected position and the previous order cannot be restored.

**✅ Better approach**

The card lifts visually, a clear line marks the insertion point, invalid areas are dimmed, and an undo toast appears after the reorder is saved.

*The better version keeps the user's mental model aligned with the system state before and after the drop, and it treats ordering slips as recoverable.*

### Uploading files

**❌ Poorer approach**

A page says "drop files anywhere" but nothing changes as the user drags a file over it, and unsupported file types fail only after upload completes.

**✅ Better approach**

The drop zone highlights on drag-over, states accepted file types, rejects invalid files immediately, and also offers a standard "Choose files" button.

*Feedback and alternatives turn a gesture into a reliable interaction rather than a hidden shortcut.*

## Anti-patterns

- Making drag and drop the only way to complete a critical task.
- Providing no insertion preview, so users cannot tell where an item will land.
- Triggering destructive moves on drop with no confirmation, undo, or visible result.

## Relationships

**Related product / UX patterns**

- [Keyboard Navigation](../ux-patterns/keyboard-navigation.md) — Drag and drop needs keyboard equivalents so users who cannot perform pointer dragging can still move items.
- [Undo/Redo](../ux-patterns/undo-redo.md) — Movement errors are common, so reversible drag operations protect users from costly slips.
- [System Status Visibility](../ux-patterns/system-status-visibility.md) — Users need continuous feedback about what is being dragged, where it can go, and whether the result saved.

**Related software patterns**

- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Drag interactions have distinct idle, dragging, over-target, dropped, cancelled, and error states that benefit from explicit state modelling.
- [Optimistic UI](../patterns/frontend/optimistic-ui.md) — Reordering and moving items are often reflected immediately and later reconciled with the server.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — The pattern is a direct application of natural mapping and immediate feedback.
- [Inclusive Design](../philosophies/inclusive-design.md) — Inclusive design pushes drag and drop beyond pointer gestures to equivalent alternatives for diverse abilities.

## Tags

- **Tags:** direct-manipulation, reordering, accessibility, spatial-interaction
- **Product stages:** growth, enterprise

## References

- Jenifer Tidwell, Charles Brewer, Aynne Valencia, Designing Interfaces, (2020)
- [W3C, WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

