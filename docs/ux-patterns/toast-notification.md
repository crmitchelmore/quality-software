# Toast Notification

> Show a brief, non-modal message for low-stakes feedback so users can stay in flow while still noticing what just happened.

**Discipline:** UX Design · **Category:** feedback-status · **Maturity:** established

## Description

A toast notification is a transient message that appears near the edge of the interface to confirm a result, warn about a minor issue, or offer a short-lived action such as undo. It is useful when feedback matters but should not interrupt the user's task. Good toasts are concise, accessible, and appropriately prioritised: they do not carry critical information that disappears, they do not stack into a noisy feed, and they give users enough time and assistive-technology support to perceive them. A toast is a whisper, not a dialogue.

**Problem.** Interfaces need to acknowledge background or secondary events without blocking the user, but modal alerts over-interrupt and silent feedback leaves users uncertain.

**Context.** Best for low-stakes confirmations, transient warnings, background results, and reversible actions where the user can continue working.

## Forces

- Temporary messages reduce interruption, but can be missed by users who look away or use screen readers.
- Stacking toasts handles bursts of events, but too many become notification spam.
- Undo actions fit well in toasts, but critical decisions need persistent controls.

## Solution

Use toasts for brief, non-critical feedback. Place them consistently, use plain language, set sensible durations, and expose them to assistive technology without stealing focus unless action is required. Escalate persistent errors, destructive confirmations, and decisions requiring attention to inline or modal patterns instead.

## When to use

- The message confirms a completed low-risk action such as saved, copied, added, or sent.
- The user should be able to continue their current task without interruption.
- A short undo or view-details action is helpful but not mandatory.

## Heuristics

Rules of thumb for applying this pattern well:

- Toasts are for awareness, not decisions; if the user must act, use a persistent pattern.
- Keep copy short and start with the outcome in the user's language.
- Provide enough time and accessible announcement for users to perceive the message.
- Limit stacking and group repeated events into one meaningful message.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | A simple toast system quickly improves perceived responsiveness, but teams must avoid using it for every message. |
| Growth (scaling team & users) | ●●●●● 5/5 | Valuable as asynchronous actions and background events multiply across the product. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful, though enterprises need stricter rules for persistence, auditability, and accessibility of operational alerts. |

## Examples

### Copy confirmation

**❌ Poorer approach**

Clicking "Copy invite link" opens a modal confirmation that must be dismissed before the user can continue inviting teammates.

**✅ Better approach**

A toast says "Invite link copied" for a few seconds while focus remains where the user was working.

*The feedback is useful but low-stakes, so it should not interrupt the primary task.*

### Failed payment

**❌ Poorer approach**

A failed payment appears as a toast for five seconds and then vanishes, leaving the checkout page looking unchanged.

**✅ Better approach**

The failure appears inline at the payment section with a persistent explanation and retry path.

*Critical errors require durable, actionable feedback; a toast alone is too easy to miss.*

## Anti-patterns

- Putting legal, payment, or security-critical information in a message that disappears.
- Showing a toast for every minor event until the interface becomes noisy.
- Using colour alone to distinguish success, warning, and error messages.

## Relationships

**Related product / UX patterns**

- [Confirmation & Undo](../ux-patterns/confirmation-and-undo.md) — Toasts often carry a short undo action after a low-risk change.
- [Microcopy](../ux-patterns/microcopy.md) — Toast effectiveness depends on concise outcome-focused copy.
- [System Status Visibility](../ux-patterns/system-status-visibility.md) — Toasts provide lightweight visibility for recent background or secondary events.

**Related software patterns**

- [Observer](../patterns/gof-behavioural/observer.md) — UI notification systems often observe application events and render toast messages from them.
- [Publish-Subscribe Channel](../patterns/enterprise-integration/publish-subscribe.md) — Toast infrastructure commonly subscribes to event streams from different parts of the application.

**Related philosophies**

- [Calm Technology](../philosophies/calm-technology.md) — Toasts should move information to the periphery without demanding attention unless stakes require it.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — The pattern supports visibility of system status, but must be balanced with user control and accessibility.

## Tags

- **Tags:** notifications, feedback, undo, accessibility
- **Product stages:** early, growth, enterprise

## References

- Jenifer Tidwell, Charles Brewer, and Aynne Valencia, Designing Interfaces, (2020)
- [W3C Web Accessibility Initiative, Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)

