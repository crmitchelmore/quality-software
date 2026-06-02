# Cognitive Walkthrough

> Step through a task from a new user's perspective, asking whether each action is discoverable, understandable, and clearly confirmed.

**Discipline:** UX Design · **Category:** usability-evaluation · **Maturity:** time-tested

**Also known as:** Learnability Walkthrough, Task Walkthrough

## Description

A cognitive walkthrough evaluates learnability by simulating how a first-time or infrequent user would attempt a task. Reviewers define the user's goal, knowledge, and context, then examine each step through questions such as whether the user will know what to do, see the right control, connect it to their goal, and understand the feedback after acting. The method is especially useful for onboarding, setup, forms, and complex workflows where users cannot rely on prior familiarity. It finds gaps in signposting, labels, conceptual models, and feedback before those gaps become support tickets or failed launches.

**Problem.** Teams familiar with a product assume users will recognise internal terminology, hidden affordances, and multi-step logic. New users then fail because the next action is not visible or the result of an action is unclear.

**Context.** Best for evaluating specific tasks, first-use flows, setup, permissions, unfamiliar enterprise workflows, or redesigned interactions where learnability matters more than expert efficiency.

## Forces

- Walking every path can be time-consuming, so task selection must focus on critical or risky flows.
- Reviewers need empathy for novice knowledge; internal experts easily smuggle in what they already know.
- The method predicts learnability issues but cannot fully replace observing real first-time users.
- Simplifying first use can conflict with exposing power-user capability and efficiency.

## Solution

Define a persona or user segment, their goal, and what they plausibly know before starting. Break the task into intended actions. At each step ask whether the user will form the correct intention, notice the right control, understand that it matches their intention, and interpret the feedback. Record breakdowns with the step, evidence, likely consequence, and design change. Prioritise issues that block progress or teach the wrong model.

## When to use

- A flow must be learnable by first-time, occasional, or lower-confidence users.
- A product uses domain-specific language, permissions, setup steps, or unfamiliar interaction patterns.
- A team needs a structured pre-test review focused on task discovery rather than broad heuristic coverage.

## Heuristics

Rules of thumb for applying this pattern well:

- At each step, ask what the user is trying to do, what they can see, and why they would choose the intended action.
- Assume only the knowledge the target user plausibly has before this moment.
- Feedback after an action must confirm progress in the user's language, not the system's internal state.
- Prioritise breakdowns that prevent the user from forming the next correct intention.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Excellent for young products because first-use comprehension is critical and walkthroughs can be run before recruitment. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Valuable for new flows and onboarding, though teams should pair it with behavioural data and user testing. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful for complex workflows and training reduction, but needs domain context to avoid naive reviewer assumptions. |

## Examples

### Connecting a calendar integration

**❌ Poorer approach**

Reviewers familiar with OAuth click through setup and declare it simple because every screen has a button, ignoring that new users do not know why scopes are requested or what happens after granting access.

**✅ Better approach**

The walkthrough models a first-time admin, step by step, and finds that scope language, account switching, and post-connection confirmation fail to explain progress in the admin's terms.

*The better version evaluates learnability rather than expert completion. It reveals where the interface needs signifiers, plain language, and feedback.*

## Anti-patterns

- Asking whether the reviewer can complete the task, rather than whether the target user would know how.
- Skipping feedback questions and focusing only on whether the next button exists.
- Reviewing screens out of task order, missing failures that occur between steps.
- Treating documentation or training as the default fix for unclear interface cues.

## Relationships

**Related product / UX patterns**

- [Heuristic Evaluation](../ux-patterns/heuristic-evaluation.md) — Heuristic evaluation provides broader usability criteria, while cognitive walkthrough examines step-by-step learnability.
- [Progressive Onboarding](../ux-patterns/progressive-onboarding.md) — Walkthrough findings often become onboarding changes that teach concepts at the moment of need.
- [Microcopy](../ux-patterns/microcopy.md) — Clear labels, explanations, and confirmations are frequent fixes for cognitive walkthrough breakdowns.

**Related software patterns**

- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Explicit UI states help reviewers reason about what feedback and next actions users receive at each step.

**Related philosophies**

- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — The walkthrough often uses heuristics such as match with the real world and visibility of system status to interpret step failures.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — The method directly examines Norman's gulfs of execution and evaluation at each task step.

## Tags

- **Tags:** usability, learnability, walkthrough, task-analysis
- **Product stages:** early, growth, enterprise

## References

- Cathleen Wharton, John Rieman, Clayton Lewis, Peter Polson, The Cognitive Walkthrough Method: A Practitioner's Guide, (1994)
- Clayton Lewis and John Rieman, Task-Centered User Interface Design, (1993)
- Don Norman, The Design of Everyday Things, revised and expanded edition, (2013)

