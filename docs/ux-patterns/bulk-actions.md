# Bulk Actions

> Let users select many items and apply one action once, with clear scope, preview, progress, and recovery for high-volume work.

**Discipline:** UX Design · **Category:** interaction-design · **Maturity:** established

**Also known as:** Batch Actions, Multi-Select Operations

## Description

Bulk actions turn repetitive item-by-item work into a single operation across a selected set. They are essential in administrative, data-management, commerce, support, and productivity tools where users need to archive, assign, tag, approve, delete, export, or update many records at once. The pattern's risk is scope ambiguity: users must know exactly which items are selected, whether selection spans pages or filters, what the action will change, and how partial failures are handled. A good bulk-action design makes selection visible, previews consequences when stakes are high, shows progress for long operations, and provides undo or a detailed result summary.

**Problem.** Users waste time and make mistakes repeating the same action across many items, yet applying actions to a large set can cause serious damage if the selected scope is unclear.

**Context.** Works in lists, tables, inboxes, asset libraries, issue trackers, moderation queues, and any interface where people manage sets of similar objects.

## Forces

- Efficiency increases with larger scope, but so does the cost of a mistaken selection.
- Selection across filters and pagination is powerful but easy to misunderstand.
- Long-running or partially successful operations need progress and reconciliation, not a single success toast.

## Solution

Provide deliberate multi-selection with persistent selected counts and clear affordances for selecting visible items, all filtered results, or specific subsets. Disable or explain actions that do not apply to every selected item. For high-stakes changes, summarise the consequence before commit. After execution, show progress, success, failure, and skipped counts, with undo or remediation where possible.

## When to use

- Users repeatedly apply the same operation to multiple similar items.
- The product presents list or table views with meaningful selection state.
- The system can report partial success and preserve enough state for recovery or audit.

## Heuristics

Rules of thumb for applying this pattern well:

- Selection scope must be visible at all times once any item is selected.
- For dangerous actions, preview the count, type, and representative examples before commit.
- Treat partial failure as a first-class result, not an edge case.
- Keep bulk controls close to the selected set and disabled until their scope is clear.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Usually unnecessary until users have enough volume for repetitive management work; can add risk before value. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Strong fit as customer datasets grow and operational efficiency becomes a differentiator. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Often essential for large-scale administration, with extra investment needed in permissions, audit, and partial-failure reporting. |

## Examples

### Selecting across pages

**❌ Poorer approach**

A table checkbox selects the first page of 50 users, but the toolbar says only "Delete selected"; the user assumes all 3,000 filtered users are selected.

**✅ Better approach**

The toolbar says "50 users selected on this page" and offers a separate link to "Select all 3,000 users matching this filter" before enabling destructive actions.

*The better version makes scope explicit and separates a page-level shortcut from an all-results operation.*

### Reporting batch results

**❌ Poorer approach**

A bulk archive action ends with "Success" even though 7 locked records could not be archived.

**✅ Better approach**

The result summary says "143 archived, 7 skipped because they are locked" with links to review the skipped records and undo the archived ones.

*Bulk work often has mixed outcomes. Reporting counts and reasons helps users reconcile the real state.*

## Anti-patterns

- Hiding whether "select all" means current page or all filtered results.
- Applying destructive actions to a selection with only a generic confirmation.
- Reporting "done" when some items failed or were skipped.

## Relationships

**Related product / UX patterns**

- [Destructive Action Confirmation](../ux-patterns/destructive-action-confirmation.md) — Large destructive changes need stronger confirmation and consequence preview than ordinary single-item actions.
- [Progress Indicator](../ux-patterns/progress-indicator.md) — Long-running bulk work needs progress feedback so users know the operation is still active.
- [Undo/Redo](../ux-patterns/undo-redo.md) — Bulk actions are safer when the system provides a practical recovery path for mistaken operations.

**Related software patterns**

- [Command](../patterns/gof-behavioural/command.md) — Bulk operations can be represented as commands with clear intent, authorisation, execution, and rollback boundaries.
- [Idempotency](../patterns/resilience/idempotency.md) — Retrying a bulk operation safely requires idempotent handling so items are not changed twice.
- [Problem Details (RFC 7807 Errors)](../patterns/api-design/problem-details.md) — Structured error details help explain item-level failures in a batch result.

**Related philosophies**

- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Bulk actions rely on visibility of status, error prevention, and user control over large state changes.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Clear mappings between selection, action, and result prevent users from applying power tools blindly.

## Tags

- **Tags:** productivity, batch-work, selection, administration
- **Product stages:** growth, enterprise

## References

- Jenifer Tidwell, Charles Brewer, Aynne Valencia, Designing Interfaces, (2020)
- [Jakob Nielsen, User Control and Freedom (Nielsen Norman Group)](https://www.nngroup.com/articles/ten-usability-heuristics/)

