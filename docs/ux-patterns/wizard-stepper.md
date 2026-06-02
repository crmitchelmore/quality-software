# Wizard / Stepper

> Break a complex task into ordered steps with progress, validation, and review so users can complete it without facing the whole form at once.

**Discipline:** UX Design · **Category:** interaction-design · **Maturity:** time-tested

**Also known as:** Step-by-Step Flow, Guided Wizard

## Description

A wizard or stepper structures a multi-part task as a sequence of screens or sections. It reduces initial complexity by focusing the user on one decision set at a time, while showing progress and preserving the broader sense of where they are. The pattern is useful when order matters, prerequisites exist, or the task would overwhelm users as one long page. Its danger is unnecessary linearity: if users need to compare information across sections or jump freely, a wizard can slow them down and hide dependencies. Good steppers support saving progress, moving backwards safely, clear validation, and a final review before irreversible submission.

**Problem.** Long, complex tasks overwhelm users when all fields and decisions appear at once, but splitting them poorly can make the flow feel rigid, opaque, and hard to correct.

**Context.** Common in onboarding, checkout, account setup, configuration, applications, imports, and enterprise workflows with prerequisites or staged decisions.

## Forces

- Sequencing reduces cognitive load but can hide context users need for later decisions.
- Linear progress helps novices but frustrates experts who want to jump ahead or correct earlier steps.
- Step validation prevents late failure but can trap users if rules are unclear.

## Solution

Divide the task into meaningful steps based on user goals, not internal data models. Show where the user is, what remains, and whether earlier steps are complete. Validate at the point where information becomes knowably invalid, allow backtracking without data loss, save progress for longer flows, and provide a review step for consequential submissions. Use a single-page form instead when the task is short or users need to scan all fields together.

## When to use

- The task has a natural order, prerequisites, or a high number of decisions.
- Users benefit from focusing on one topic at a time rather than scanning an entire form.
- The flow can preserve state and allow safe backtracking.

## Heuristics

Rules of thumb for applying this pattern well:

- Steps should map to user goals, not database tables or team ownership.
- Show progress, current location, and completion state throughout the flow.
- Validate when the user can still fix the problem in context.
- Use review and confirmation for consequential submission, not for every step.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for onboarding or setup, but early products should avoid over-structuring flows that are still changing. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Strong fit as forms and setup paths grow, especially when analytics reveal abandonment at complex points. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Often necessary for regulated or multi-party workflows, with save/resume, audit, and review requirements. |

## Examples

### Account setup

**❌ Poorer approach**

A setup wizard has eight steps named after internal systems, blocks progress with unexplained errors, and loses previous entries when the user goes back.

**✅ Better approach**

The flow groups steps as "Profile", "Team", "Security", and "Review", shows completion status, saves entries automatically, and links each review item back to the step where it can be changed.

*The better version structures the flow around the user's mental model and supports correction without punishment.*

### Short preference form

**❌ Poorer approach**

Three notification preferences are split across three separate steps, forcing Next and Back clicks for a decision users could make at a glance.

**✅ Better approach**

The preferences appear as one compact form with progressive disclosure only for advanced scheduling options.

*Steppers are for complexity management, not ceremony. Short tasks are often clearer on one page.*

## Anti-patterns

- Turning a short form into a multi-step wizard just to look guided.
- Hiding errors until the final step after the user has mentally moved on.
- Preventing users from revisiting earlier steps or losing entered data when they go back.

## Relationships

**Related product / UX patterns**

- [Progressive Disclosure](../ux-patterns/progressive-disclosure.md) — A wizard is a sequential form of disclosure that reveals the next part of a task only when relevant.
- [Multi-Step Form](../ux-patterns/multi-step-form.md) — Multi-step form guidance provides the form-specific details for validation, persistence, and review.
- [Progress Indicator](../ux-patterns/progress-indicator.md) — Users need persistent feedback about current step, completed steps, and remaining effort.

**Related software patterns**

- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Wizard steps, validation gates, backtracking, and completion states are naturally modelled as a UI state machine.
- [Process Manager](../patterns/enterprise-integration/process-manager.md) — Long-running multi-step flows often coordinate several operations and checkpoints like a lightweight process manager.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — A well-designed wizard reduces decision clutter and makes the next action obvious.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Stepper design depends on visibility of system status, error prevention, and user control.

## Tags

- **Tags:** forms, onboarding, sequencing, complexity-management
- **Product stages:** early, growth, enterprise

## References

- [Jakob Nielsen, Progressive Disclosure (Nielsen Norman Group)](https://www.nngroup.com/articles/progressive-disclosure/)
- Steve Krug, Don't Make Me Think, Revisited, (2014)

