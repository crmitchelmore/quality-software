# Confirmation & Undo

> Protect users from unintended consequences by either asking for confirmation before high-risk actions or making low-risk actions easy to undo afterwards.

**Discipline:** UX Design · **Category:** feedback-status · **Maturity:** time-tested

## Description

Confirmation and undo are complementary safeguards. Confirmation interrupts before an action to ensure the user understands a consequence; undo lets the user act quickly and recover if the action was mistaken. The art is choosing the right protection for the stakes. Low-risk, reversible actions are often better served by immediate action plus undo, avoiding habituating users to meaningless prompts. High-risk, irreversible, costly, or security-sensitive actions need explicit confirmation with clear consequence language. The pattern protects trust by making errors recoverable without slowing every interaction.

**Problem.** Users misclick, misunderstand, or change their mind. If every action is instant and irreversible, mistakes become costly; if every action asks for confirmation, users stop reading and the product feels sluggish.

**Context.** Applies to delete, archive, send, publish, billing, permission, bulk, and settings changes where the cost and reversibility of mistakes vary.

## Forces

- Undo preserves flow, but requires the system to retain enough state to reverse the action safely.
- Confirmation can prevent severe errors, but repeated prompts create habituation and false safety.
- Some actions are technically reversible but socially or legally consequential once seen by others.

## Solution

Classify actions by consequence and reversibility. For low-risk reversible changes, perform the action, show clear feedback, and offer undo for an appropriate window. For high-risk or irreversible changes, require a focused confirmation that names the object, consequence, and any recovery limits. Avoid generic "Are you sure?" prompts; make the decision specific.

## When to use

- Users can take actions whose consequences are easy to trigger accidentally.
- Some actions are reversible enough to support undo, while others require prior confirmation.
- The product needs to balance speed with trust and safety.

## Heuristics

Rules of thumb for applying this pattern well:

- Prefer undo for frequent, low-stakes, reversible actions; reserve confirmation for high-stakes actions.
- Confirmation copy should name the exact object and consequence.
- Keep undo visible long enough for human correction, but not so long that state becomes ambiguous.
- For bulk or destructive actions, show scope before commitment.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Essential for obvious destructive actions; richer undo can wait until the product has stable state handling. |
| Growth (scaling team & users) | ●●●●● 5/5 | As action volume increases, undo prevents friction while confirmations protect trust. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Critical for bulk, regulated, and administrative workflows, with audit and permission implications. |

## Examples

### Archiving a task

**❌ Poorer approach**

Every archive click opens a modal asking "Are you sure?", slowing a user cleaning up dozens of tasks.

**✅ Better approach**

The task archives immediately, a toast says "Task archived" with Undo, and the list updates without losing the user's place.

*The action is low-risk and reversible, so undo protects mistakes while preserving flow.*

### Deleting a workspace

**❌ Poorer approach**

Deleting an entire workspace is a single red button with no details about what will be removed.

**✅ Better approach**

The confirmation names the workspace, summarises the data that will be deleted, requires the user to type the workspace name, and explains recovery limits.

*High-consequence actions need deliberate confirmation and specific consequence framing.*

## Anti-patterns

- Confirming every minor action until users reflexively dismiss prompts.
- Offering undo for actions that have already exposed private data or triggered external effects.
- Using vague confirmation copy that does not identify the object or consequence.

## Relationships

**Related product / UX patterns**

- [Optimistic UI Feedback](../ux-patterns/optimistic-ui-feedback.md) — Immediate action plus rollback or undo uses the same responsiveness trade-off as optimistic feedback.
- [Destructive Action Confirmation](../ux-patterns/destructive-action-confirmation.md) — Destructive confirmation is the high-stakes branch of this broader protection pattern.
- [Toast Notification](../ux-patterns/toast-notification.md) — Toasts are a common lightweight surface for short undo windows after reversible actions.

**Related software patterns**

- [Memento](../patterns/gof-behavioural/memento.md) — Undo often requires capturing previous state so it can be restored safely.
- [Compensating Transaction](../patterns/cloud-distributed/compensating-transaction.md) — Reversing a committed operation may require a compensating action rather than a simple state restore.
- [Optimistic UI](../patterns/frontend/optimistic-ui.md) — Low-risk actions can update immediately while retaining a path to reverse or reconcile.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Norman emphasises designing for error and recovery rather than blaming users for slips.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — User control and freedom is the heuristic behind escape hatches such as undo.

## Tags

- **Tags:** undo, confirmation, safety, error-recovery
- **Product stages:** early, growth, enterprise

## References

- Jenifer Tidwell, Charles Brewer, and Aynne Valencia, Designing Interfaces, (2020)
- Don Norman, The Design of Everyday Things, (2013)

