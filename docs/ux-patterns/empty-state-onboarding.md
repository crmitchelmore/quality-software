# Empty State Onboarding

> Turn empty screens into helpful starting points that explain value, set expectations, and guide users to a first meaningful action.

**Discipline:** UX Design · **Category:** onboarding-education · **Maturity:** established

## Description

Empty state onboarding treats the absence of content as an opportunity for guidance rather than a dead end. A new project with no tasks, an inbox with no messages, or a dashboard with no data can explain what will appear there, why it matters, and what the user can do next. Good empty states are specific to the user's context, avoid blame, and include a clear primary action. They should disappear gracefully once real content exists and reappear in different form when a filter, error, or permission issue causes apparent emptiness.

**Problem.** New users often encounter blank screens before they have created data, making the product feel broken, unvaluable, or unclear about what to do next.

**Context.** Useful wherever a feature depends on user-created content, imported data, collaboration, configuration, or permissions before its normal interface becomes meaningful.

## Forces

- Guidance can convert emptiness into action, but generic illustrations and vague copy waste the moment.
- Empty states should encourage creation without pressuring users into setup they are not ready for.
- True empty, filtered empty, error, and no-permission states can look similar but require different help.

## Solution

Identify why the state is empty and write copy for that cause. Explain what will appear here, why it is useful, and the smallest next action the user can take. Offer sample data or templates only when they help users understand the future populated state, and ensure the state changes once content exists.

## When to use

- A page or component has no user data yet and the next action is knowable.
- Users need to understand the value of creating, importing, inviting, or connecting something.
- Different causes of emptiness can be distinguished by the system.

## Heuristics

Rules of thumb for applying this pattern well:

- Say what belongs here, why it helps, and what to do next.
- Match the message to the cause of emptiness.
- Prefer one clear action over a menu of setup options.
- Use sample content carefully; mark it clearly and remove it when real content exists.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Very high leverage because early products often have sparse data and need to teach value quickly. |
| Growth (scaling team & users) | ●●●●● 5/5 | Important as more features and segments create many distinct empty and filtered states. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Still valuable, especially for role-based permissions and configuration-heavy products. |

## Examples

### New project task list

**❌ Poorer approach**

A newly created project shows an empty table with column headers and no explanation.

**✅ Better approach**

The page says "No tasks yet. Create your first task to track work in this project" with a primary "Create task" button and a small example of a useful task title.

*The better version turns the blank area into a clear starting point tied to the feature's value.*

### Filtered empty result

**❌ Poorer approach**

A filtered issues list says "You have no issues" even though removing the filter would show many.

**✅ Better approach**

The state says "No issues match these filters" and offers "Clear filters" before suggesting creation.

*Correctly naming the cause avoids misleading users and gives them the right recovery action.*

## Anti-patterns

- Displaying a blank table with no explanation or action.
- Using the same empty message for no data, no search results, failed loading, and missing permissions.
- Filling the state with marketing copy that does not help the user proceed.

## Relationships

**Related product / UX patterns**

- [Empty State Content](../ux-patterns/empty-state-content.md) — Empty state onboarding depends on strong content design tailored to the cause and next action.
- [Checklist Onboarding](../ux-patterns/checklist-onboarding.md) — Empty states can launch or reinforce checklist tasks such as create, invite, or import.

**Related software patterns**

- [Special Case](../patterns/enterprise-application/special-case.md) — Empty states are a deliberate special-case representation rather than treating absence as a broken normal view.
- [Null Object](../patterns/implementation/null-object.md) — A well-designed empty state provides safe behaviour when the expected content collection is empty.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — The pattern removes the need to infer what an empty screen means or how to proceed.
- [Inclusive Design](../philosophies/inclusive-design.md) — Clear empty states support users who lack domain knowledge, confidence, or organisational context.

## Tags

- **Tags:** onboarding, empty-states, content-design, activation
- **Product stages:** early, growth, enterprise

## References

- [Nielsen Norman Group, Designing Empty States](https://www.nngroup.com/articles/empty-state-interface/)
- Kinneret Yifrah, Microcopy: The Complete Guide, (2017)

