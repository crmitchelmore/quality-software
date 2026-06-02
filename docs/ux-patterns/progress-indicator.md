# Progress Indicator

> Show how far a task has advanced and what remains, reducing uncertainty during multi-step flows or operations that take noticeable time.

**Discipline:** UX Design · **Category:** feedback-status · **Maturity:** time-tested

## Description

A progress indicator communicates status over time: steps completed in a wizard, percent of a file upload, phases of account setup, or the queue position of a background job. Its purpose is to turn opaque waiting into understandable waiting. The best indicators are honest about what can be known. Determinate progress uses a real denominator such as bytes uploaded or steps completed; indeterminate progress admits that work is happening but cannot yet be measured. Misstated precision, fake progress, and indicators that reach ninety-nine percent then stall quickly destroy trust.

**Problem.** Users abandon or repeat actions when they cannot tell whether a process is progressing, stuck, or close to completion.

**Context.** Applies to multi-step forms, uploads, imports, checkout, onboarding, background processing, installation, and any task where waiting or sequencing is part of the user experience.

## Forces

- Specific progress reassures users, but only if the system can measure it accurately.
- Indicators reduce anxiety, but extra chrome can slow down very short interactions.
- Long-running work may need cancellation, backgrounding, or notification rather than a captive wait.

## Solution

Choose the indicator that matches the work: stepper for known stages, percentage or bar for measurable continuous work, spinner or activity indicator for short unknown waits, and status text for long phases. Label the current state, expose the next step when helpful, and provide recovery or cancellation for operations that may fail or take longer than expected.

## When to use

- A task takes long enough that users may wonder whether anything is happening.
- The flow has known steps or measurable work units.
- Users need to decide whether to wait, cancel, or continue elsewhere.

## Heuristics

Rules of thumb for applying this pattern well:

- Use determinate progress only when the denominator is real.
- Name the current step in human language, not internal job names.
- Offer cancellation or backgrounding when waiting is long enough to interrupt work.
- Escalate from activity to explanation when the operation exceeds user expectations.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Simple and valuable wherever onboarding or uploads take time, though early products should not invent elaborate progress models without need. |
| Growth (scaling team & users) | ●●●●● 5/5 | Critical as flows, imports, and background operations become common across a larger user base. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for long-running regulated workflows, batch jobs, and administrative operations with audit and cancellation expectations. |

## Examples

### File upload

**❌ Poorer approach**

Uploading a large video shows a spinner and the text "Please wait" for five minutes.

**✅ Better approach**

The interface shows upload percentage, remaining time when reliable, the current file name, and a cancel option.

*Measurable work should show measurable progress, giving users control and confidence during the wait.*

### Account setup wizard

**❌ Poorer approach**

A setup flow has four pages but no indication of where the user is or how much is left.

**✅ Better approach**

A labelled stepper shows Profile, Team, Preferences, Review, with the current step and completed steps marked clearly.

*Step progress reduces uncertainty and supports orientation in a sequence.*

## Anti-patterns

- Displaying a precise percentage that is not tied to real progress.
- Hiding errors behind an endlessly spinning control.
- Using a progress indicator for a sub-second action where immediate completion feedback would suffice.

## Relationships

**Related product / UX patterns**

- [Multi-Step Form](../ux-patterns/multi-step-form.md) — Multi-step forms rely on progress indicators to make sequence and remaining effort visible.
- [System Status Visibility](../ux-patterns/system-status-visibility.md) — Progress indication is one of the clearest expressions of making system status visible.

**Related software patterns**

- [Process Manager](../patterns/enterprise-integration/process-manager.md) — Long-running workflows often need a process manager whose states can be translated into user-facing progress.
- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Step and progress displays should reflect explicit UI states and legal transitions.

**Related philosophies**

- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Visibility of system status is the primary heuristic embodied by progress indicators.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Progress feedback closes the gulf of evaluation by showing the effect and continuation of an action.

## Tags

- **Tags:** progress, feedback, loading, flow
- **Product stages:** early, growth, enterprise

## References

- [Jakob Nielsen, Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
- Jenifer Tidwell, Charles Brewer, and Aynne Valencia, Designing Interfaces, (2020)

