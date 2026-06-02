# Progressive Disclosure

> Show only what most users need most of the time, and reveal advanced or secondary options on demand, so interfaces stay learnable without sacrificing depth.

**Discipline:** UX Design · **Category:** interaction-design · **Maturity:** time-tested

**Also known as:** Staged Disclosure, Show More on Demand

## Description

Progressive disclosure sequences information and controls so that the common, essential subset is presented first and the rare, advanced, or detailed material is moved a step away — behind a "more options" link, a secondary screen, an expandable section, or an advanced mode. It manages complexity by matching what is visible to what the user is likely to need at that moment, reducing cognitive load and the chance of error without removing capability. The art lies in choosing the dividing line: put the wrong things in the advanced tier and you frustrate users who need them; expose everything and you overwhelm the majority. It is one of the oldest and most broadly applicable interaction patterns, spanning forms, settings, menus, onboarding, and data displays.

**Problem.** Presenting every option, field, and detail at once overwhelms users, hides the common path among rarely used controls, and makes interfaces feel intimidating and error-prone — yet removing the advanced capability would frustrate power users who depend on it.

**Context.** Applies anywhere an interface must serve both novice and expert needs, or where a task has a simple common case and a complex edge case: settings, creation flows, search, configuration, dashboards.

## Forces

- Simplicity for the majority competes with immediate access for the minority who need advanced options.
- Hiding options reduces clutter but adds an interaction cost and a discoverability risk.
- The "common case" differs across user segments, so any single split is a compromise.

## Solution

Identify the controls and information the large majority need for the primary task and present those by default. Move advanced, destructive, or infrequently used items one clearly signposted step away — an expander, an "advanced" toggle, or a secondary view — with an affordance that makes their existence discoverable. Keep the disclosure shallow (ideally one level) and ensure defaults are safe so most users never need to open the advanced tier.

## When to use

- A task has a simple common case and a more complex, less frequent case.
- The interface must serve both first-time and expert users without two separate products.
- A screen has grown crowded and the essential path is getting lost among options.

## Heuristics

Rules of thumb for applying this pattern well:

- Default to the 80% case; one click reveals the rest.
- Make the existence of hidden options discoverable even when their detail is not shown.
- Keep disclosure shallow — prefer one expandable step over nested layers.
- Pair disclosure with safe, sensible defaults so the advanced tier is genuinely optional.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Helps a young product feel approachable, though with a small feature set there is less to disclose and over-engineering the split can be premature. |
| Growth (scaling team & users) | ●●●●● 5/5 | As features multiply, disclosure is the main lever for keeping a growing product learnable without cutting capability. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for feature-rich enterprise tools serving mixed expertise; needs consistent disclosure conventions across the suite so users learn the pattern once. |

## Examples

### A settings screen

**❌ Poorer approach**

The account settings page lists all 40 preferences in one flat column, so the two settings 90% of users want are lost among networking, developer, and experimental toggles.

**✅ Better approach**

The page shows the handful of common settings, with "Advanced settings" expandable sections for the rest, clearly labelled so power users know where to look.

*The better version keeps the common path obvious while preserving full capability one signposted click away, lowering load without removing power.*

### A creation form

**❌ Poorer approach**

A "create event" form shows every possible field — recurrence rules, timezone overrides, custom reminders — at once, so a user adding a simple lunch faces a wall of inputs.

**✅ Better approach**

The form asks for title, time, and place, with "Add recurrence", "More reminder options" revealing the advanced fields only when needed.

*Sequencing the rare fields behind explicit affordances keeps the frequent task trivial while leaving depth available for the occasions that need it.*

## Anti-patterns

- Burying frequently needed controls in an "advanced" area, forcing most users to dig.
- Hiding options with no visible affordance, so users never discover the capability exists.
- Nesting disclosure several levels deep, turning a simple task into a treasure hunt.

## Relationships

**Related product / UX patterns**

- [Optimistic UI Feedback](../ux-patterns/optimistic-ui-feedback.md) — Both manage the perceived complexity of an interaction — disclosure controls how much is shown, optimistic feedback controls how quickly it responds — and they often combine in streamlined flows.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Progressive disclosure embodies Norman's call to manage complexity and avoid overwhelming the user, keeping the mapping between goals and visible controls tight.

## Tags

- **Tags:** complexity-management, cognitive-load, forms, onboarding

## References

- [Jakob Nielsen, Progressive Disclosure (Nielsen Norman Group)](https://www.nngroup.com/articles/progressive-disclosure/)
- Don Norman, The Design of Everyday Things, (2013)

