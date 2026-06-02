# Undo/Redo

> Let users reverse and reapply recent actions so exploration, correction, and recovery are safe parts of the interaction model.

**Discipline:** UX Design · **Category:** interaction-design · **Maturity:** time-tested

**Also known as:** Reversible Actions, Action History

## Description

Undo/redo gives users a reliable way to step backwards and forwards through the consequences of their actions. It turns many mistakes from serious failures into minor detours, encouraging exploration and reducing the need for defensive confirmations before every change. The pattern is most familiar in editors, creation tools, productivity apps, and administrative systems, but it also applies to account settings, destructive actions, and bulk operations when the system can preserve enough state to reverse the effect. Good undo is predictable about scope, visible enough to be found under stress, and honest about irreversible boundaries.

**Problem.** Users make slips, misunderstand controls, or change their minds; without a recovery path, each mistake requires manual reconstruction, support intervention, or excessive confirmation before acting.

**Context.** Applies to creative tools, document editing, configuration, workflow boards, bulk management, and any product where actions are frequent, exploratory, or costly to repeat by hand.

## Forces

- Recovery reduces fear, but full reversibility can be technically expensive when actions affect external systems.
- Confirmations prevent some errors but slow expert users; undo allows speed while preserving control.
- Users expect undo scope to match their mental model, not an implementation detail.

## Solution

Model user actions as reversible operations where possible. Provide a clear undo affordance close to the moment of change, maintain a comprehensible action history, and support redo when users reverse too far. Define explicit boundaries for actions that cannot be undone, and use confirmation only for those high- stakes cases. Preserve enough context to restore the prior state and explain what has been undone in the user's language.

## When to use

- Users perform frequent edits, moves, formatting changes, or configuration updates.
- The cost of an accidental action is high enough to need recovery but low enough to reverse safely.
- You want to reduce confirmation fatigue without sacrificing safety.

## Heuristics

Rules of thumb for applying this pattern well:

- Prefer undo over confirmation for frequent, reversible actions.
- Name the action being undone in the user's language.
- Keep undo scope consistent within a workspace; avoid hidden per-widget histories.
- Be explicit when an action is irreversible before the user commits it.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | A simple undo for the riskiest common action can dramatically improve confidence, though a full history may be premature. |
| Growth (scaling team & users) | ●●●●● 5/5 | As workflows deepen, undo becomes a core productivity and trust feature that reduces support burden. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for complex tools, but enterprise systems must reconcile undo with permissions, audit logs, and external side effects. |

## Examples

### Deleting an item

**❌ Poorer approach**

Every delete action opens a modal asking "Are you sure?"; users confirm reflexively and still have no recovery if they chose the wrong row.

**✅ Better approach**

Deleting a low-risk item removes it immediately and shows "Task deleted — Undo" for a short period, while permanent account deletion still requires an explicit confirmation.

*The better version uses undo for common reversible mistakes and reserves confirmation for genuinely irreversible consequences.*

### Editing a document

**❌ Poorer approach**

A document editor has separate undo stacks for the canvas, sidebar, and comments, so pressing undo reverses whichever area last had focus rather than the user's last meaningful action.

**✅ Better approach**

Undo follows the document-level action history and labels changes such as "Undo move section" or "Redo restore paragraph".

*Users think in meaningful actions, not widgets. A coherent history makes recovery predictable.*

## Anti-patterns

- Offering undo for only some actions without explaining the boundary.
- Showing a generic "Undone" message that does not identify what changed.
- Replacing undo with repeated confirmations for every low-stakes action.

## Relationships

**Related product / UX patterns**

- [Confirmation & Undo](../ux-patterns/confirmation-and-undo.md) — This feedback pattern decides when recovery should replace or complement explicit confirmation.
- [Destructive Action Confirmation](../ux-patterns/destructive-action-confirmation.md) — Irreversible actions mark the boundary where confirmation remains necessary despite a general undo model.
- [Inline Editing](../ux-patterns/inline-editing.md) — Inline edits feel safer and more trustworthy when accidental changes can be reversed.

**Related software patterns**

- [Command](../patterns/gof-behavioural/command.md) — Reversible commands are a common implementation model for storing, applying, undoing, and redoing actions.
- [Memento](../patterns/gof-behavioural/memento.md) — Mementos capture prior state so the interface can restore it without exposing internal representation.
- [Event Sourcing](../patterns/architecture/event-sourcing.md) — Event histories can support reconstruction and reversal where actions are represented as domain events.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Norman emphasises designing for error and recovery rather than blaming users for slips.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Undo directly operationalises Nielsen's user control and freedom heuristic.

## Tags

- **Tags:** recovery, safety, editing, user-control
- **Product stages:** early, growth, enterprise

## References

- Don Norman, The Design of Everyday Things, (2013)
- Alan Cooper, Robert Reimann, David Cronin, Christopher Noessel, About Face: The Essentials of Interaction Design, (2014)

