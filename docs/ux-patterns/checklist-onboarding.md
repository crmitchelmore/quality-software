# Checklist Onboarding

> Give new users a visible sequence of meaningful setup tasks so they can reach first value, track progress, and resume where they left off.

**Discipline:** UX Design · **Category:** onboarding-education · **Maturity:** established

## Description

Checklist onboarding organises activation into a small set of concrete tasks: create a project, invite a teammate, import data, complete a profile, or publish the first item. It turns an ambiguous blank start into a progressable plan. Good checklists are outcome-oriented, not busywork; each item should produce user value or unlock a necessary capability. They should adapt to role and context, show completion honestly, and get out of the way once the user is activated.

**Problem.** New users may not know which setup actions matter or how much is left before the product becomes useful, leading to stalled activation.

**Context.** Best for products with several required setup actions, team configuration, data import, or a known path to an activation milestone.

## Forces

- Checklists create momentum, but meaningless tasks train users to complete the checklist rather than achieve their goal.
- Progress motivates, but inaccurate completion logic undermines trust.
- A common checklist is simple, but different roles may need different activation paths.

## Solution

Define the smallest sequence that leads to first meaningful value for each important segment. Write each item as a user outcome, deep-link it to the relevant place, mark completion from real behaviour, and allow non-essential items to be skipped or dismissed. Remove or transform the checklist once onboarding is done.

## When to use

- Activation requires multiple actions that users can complete over one or more sessions.
- The product can reliably detect completion of each task.
- Users benefit from seeing what remains before the product is fully useful.

## Heuristics

Rules of thumb for applying this pattern well:

- Checklist items should be valuable verbs, not marketing nouns.
- Keep the list short enough to feel achievable.
- Use real completion signals and show progress honestly.
- Adapt or hide tasks that are irrelevant to the user's role or plan.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Valuable once the team knows the activation path; before that, it can hard-code the wrong journey. |
| Growth (scaling team & users) | ●●●●● 5/5 | Excellent fit for scaling self-serve onboarding and improving activation across cohorts. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful for administrators and implementation teams, though role-based variation and services-led setup may complicate it. |

## Examples

### Team workspace setup

**❌ Poorer approach**

The checklist includes "Visit reports", "Open settings", and "Read what's new" because the team wants clicks across the product.

**✅ Better approach**

The checklist includes "Create your first project", "Invite one teammate", and "Add three tasks", each linking directly to the relevant action.

*The better list builds towards a useful workspace rather than vanity feature exposure.*

### Data import product

**❌ Poorer approach**

Import is shown as complete when the user starts an upload, even if validation later fails.

**✅ Better approach**

The item completes only after records import successfully, with failed import status and retry kept in the checklist.

*Honest completion preserves trust and keeps users oriented when setup spans background work.*

## Anti-patterns

- Adding checklist items because the business wants feature exposure rather than because users need them.
- Marking tasks complete when the user merely views a page.
- Keeping the onboarding checklist permanently visible after it has stopped being useful.

## Relationships

**Related product / UX patterns**

- [Empty State Onboarding](../ux-patterns/empty-state-onboarding.md) — Empty states often point users to the next checklist item when content has not yet been created.
- [Progress Indicator](../ux-patterns/progress-indicator.md) — A checklist is a progress indicator for onboarding tasks rather than a single operation.
- [Aha-Moment Activation](../product-patterns/aha-moment-activation.md) — Checklist tasks should lead users to the product's activation or aha moment.

**Related software patterns**

- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Checklist progress should be represented by explicit states so completion, skip, and retry are reliable.
- [Idempotency](../patterns/resilience/idempotency.md) — Setup tasks may be retried; idempotent operations prevent duplicate projects, invites, or imports.

**Related philosophies**

- [Product-Led Growth](../philosophies/product-led-growth.md) — Checklists are a common product-led growth mechanism for guiding self-serve users to activation.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — The pattern supports visibility of progress and user control during setup.

## Tags

- **Tags:** onboarding, activation, progress, setup
- **Product stages:** early, growth, enterprise

## References

- Samuel Hulick, User Onboarding, (2014)
- Ramli John, Product-Led Onboarding, (2021)

