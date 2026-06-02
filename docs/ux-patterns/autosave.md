# Autosave

> Preserve user work automatically and visibly so interruption, navigation, or failure does not turn effort into lost data.

**Discipline:** UX Design · **Category:** forms-input · **Maturity:** established

## Description

Autosave periodically or event-triggeredly persists a user's in-progress work without requiring an explicit save action. It is common in document editors, long forms, settings, drafts, and creation flows where lost work would be painful. The UX challenge is not only saving, but making the saving model understandable: users need to know whether changes are saved, saving, failed, or recoverable, and whether an explicit submit or publish step still exists. Good autosave protects effort while keeping final commitment clear.

**Problem.** Users lose work when sessions expire, networks fail, tabs close, or they navigate away before pressing save. But invisible autosave can also create uncertainty about what has been committed.

**Context.** Best for long-lived inputs, drafts, editors, complex forms, and settings where users create value over time and interruptions are likely.

## Forces

- Automatic persistence prevents loss, but can blur the boundary between a draft and a committed change.
- Frequent saves improve recovery, but create conflict, performance, and server-load concerns.
- Offline or multi-device editing improves resilience, but requires clear conflict resolution and status.

## Solution

Save meaningful changes automatically after debounce, step completion, or idle moments; show a concise status such as "Saving", "Saved", or "Couldn't save" near the work; and provide retry or recovery when a save fails. Distinguish draft persistence from final submission or publication, and keep enough version or timestamp information to reconcile conflicts without silently overwriting another change.

## When to use

- The user invests substantial effort before a final submission or publish action.
- Interruption, mobile use, or flaky connectivity is common.
- The system can safely store drafts without committing them prematurely.

## Heuristics

Rules of thumb for applying this pattern well:

- Save drafts automatically, but make final commitment explicit when consequences matter.
- Show save state in calm, persistent language rather than disruptive alerts.
- Design the failure path before shipping autosave; lost work is the pattern's core risk.
- Treat conflicts as a user-facing state, not an invisible backend exception.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Worth adding when the core task involves long input, but can be too much infrastructure for simple early signup or checkout forms. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit once real users rely on the product for substantial work across varied connections. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Often expected in serious productivity and workflow tools, with audit, conflict, and retention rules layered on top. |

## Examples

### Long application form

**❌ Poorer approach**

A scholarship application requires forty minutes of writing and only saves when the user reaches the final submit button; a session timeout erases the draft.

**✅ Better approach**

Each section autosaves as a draft, shows "Saved 10 seconds ago", and lets the applicant resume from another device before final submission.

*The better version protects the user's effort while preserving a clear final submit action.*

### Settings changes

**❌ Poorer approach**

Billing settings autosave every toggle immediately with no confirmation, so users cannot tell which changes are live or undo an accidental change.

**✅ Better approach**

Low-risk preferences autosave with visible status, while billing-critical changes require review and an explicit confirmation.

*Autosave should match the stakes of the change; automatic persistence is not the same as automatic commitment.*

## Anti-patterns

- Autosaving destructive or publicly visible changes without making commitment explicit.
- Showing no status, leaving users unsure whether it is safe to close the page.
- Silently overwriting newer edits from another device or collaborator.

## Relationships

**Related product / UX patterns**

- [System Status Visibility](../ux-patterns/system-status-visibility.md) — Autosave succeeds only when users can see whether their work is saved, saving, failed, or recoverable.
- [Confirmation & Undo](../ux-patterns/confirmation-and-undo.md) — Reversible saves and undo affordances reduce the risk of automatic persistence capturing an unintended edit.

**Related software patterns**

- [Write-Behind Cache](../patterns/data-persistence/write-behind-cache.md) — Autosave often buffers user edits locally and writes them asynchronously to persistent storage.
- [Optimistic Concurrency Control](../patterns/data-persistence/optimistic-concurrency-control.md) — Drafts edited across devices need conflict detection so autosave does not overwrite newer work.
- [Optimistic UI](../patterns/frontend/optimistic-ui.md) — The interface may show a change immediately while persistence completes in the background.

**Related philosophies**

- [Calm Technology](../philosophies/calm-technology.md) — Autosave status should reassure in the periphery rather than interrupting the user's writing flow.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Visible save state gives feedback about the effect of the user's ongoing actions.

## Tags

- **Tags:** forms, drafts, resilience, status
- **Product stages:** growth, enterprise

## References

- [Nielsen Norman Group, Designing Autosave](https://www.nngroup.com/articles/auto-save/)
- Alan Cooper, Robert Reimann, David Cronin, and Christopher Noessel, About Face: The Essentials of Interaction Design, (2014)

