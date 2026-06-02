# Wayfinding Cues

> Provide visible cues such as location, hierarchy, progress, landmarks, labels, and state so users know where they are, what is nearby, and how to move next.

**Discipline:** UX Design · **Category:** navigation-wayfinding · **Maturity:** time-tested

**Also known as:** Orientation Cues, You-Are-Here Signals

## Description

Wayfinding cues are the interface signals that help users orient themselves inside a product or service. They include active navigation states, breadcrumbs, page titles, progress indicators, section landmarks, URLs, headings, search refinements, disabled and completed states, and consistent visual hierarchy. The pattern borrows from physical wayfinding: users need to know their current position, recognise landmarks, infer routes, and recover when lost. In digital products, wayfinding is especially important because screens often lack the spatial continuity of physical environments.

**Problem.** Users can reach screens but cannot confidently tell where they are, what has changed, how this page relates to the whole, or how to return to a meaningful place.

**Context.** Use in any multi-screen or multi-step experience, especially deep information architectures, dashboards, account areas, complex workflows, and search or browsing tasks.

## Forces

- More cues improve orientation, but too many competing signals clutter the interface.
- Users need consistent landmarks, yet responsive layouts and role-based permissions change what is visible.
- Organisational terminology may be precise internally but poor as a navigation landmark.
- Current-state cues must work visually, semantically, and for assistive technologies.

## Solution

Identify the orientation questions users ask at each level: where am I, how did I get here, what can I do here, what is nearby, what has changed, and how do I leave or continue. Add the smallest set of cues that answer those questions, using consistent page titles, active states, breadcrumbs, progress indicators, landmarks, and content hierarchy. Ensure cues are accessible through semantics, not just colour or position.

## When to use

- Users move through nested pages, workflows, or long browsing sessions.
- Support or research shows people feel lost or cannot return to a previous context.
- Navigation, page titles, and content headings disagree.
- Responsive or personalised layouts risk removing familiar landmarks.

## Heuristics

Rules of thumb for applying this pattern well:

- Answer three questions on every screen: where am I, what can I do, and where can I go next.
- Use redundant cues for state; combine label, position, shape, and semantics rather than colour alone.
- Keep titles, navigation labels, breadcrumbs, and URLs aligned enough to reinforce the same mental model.
- Provide stronger cues at transitions, deep links, and recovery points where users lack prior context.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Even small products benefit from clear titles, active states, and progress cues; the pattern can be applied lightly. |
| Growth (scaling team & users) | ●●●●● 5/5 | Critical as IA deepens and users arrive through search, notifications, and shared links rather than the home page. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential in complex, permissioned products where role, scope, and workflow state must be clear to avoid costly errors. |

## Examples

### Deep settings page

**❌ Poorer approach**

A user lands from search on a page titled Settings with no active navigation, no account name, and no clue whether the setting applies to their profile or the whole organisation.

**✅ Better approach**

The page title reads Organisation billing settings, the side navigation highlights Billing, breadcrumbs show Admin > Billing, and a scope badge names the organisation.

*The better version layers cues so the user can understand context even when arriving by deep link.*

### Progress through a task

**❌ Poorer approach**

A multi-step setup hides navigation but gives no step count, completed state, or save indication, making users anxious about how much remains.

**✅ Better approach**

The setup shows a progress stepper, completed sections, save status, and a clear exit path back to the dashboard.

*Wayfinding applies inside workflows as much as sites. Progress and exit cues reduce uncertainty.*

## Anti-patterns

- Relying only on colour to show current location or selected state.
- Using vague titles such as Details or Overview without the parent context.
- Removing all navigation and landmarks during a task with no escape or progress cue.
- Showing breadcrumbs that reflect database structure rather than user-understandable hierarchy.

## Relationships

**Related product / UX patterns**

- [Breadcrumb Trail](../ux-patterns/breadcrumb-trail.md) — Breadcrumbs are a specific wayfinding cue for communicating hierarchy and enabling upward movement.
- [Global Navigation](../ux-patterns/global-navigation.md) — Global navigation contributes stable landmarks and current-location cues across the product.
- [Progress Indicator](../ux-patterns/progress-indicator.md) — Progress indicators are wayfinding cues for time-based or step-based tasks.

**Related software patterns**

- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Many wayfinding cues represent UI state, progress, and allowed transitions that benefit from explicit state modelling.
- [Routing Slip](../patterns/enterprise-integration/routing-slip.md) — Complex workflows with changing routes need visible cues that match the actual route sequence and next steps.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Wayfinding cues are signifiers and feedback that help users bridge the gulf between intention and system state.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Visibility of system status, recognition rather than recall, and consistency are core heuristic foundations for wayfinding.

## Tags

- **Tags:** wayfinding, orientation, navigation, accessibility
- **Product stages:** early, growth, enterprise

## References

- Steve Krug, Don't Make Me Think, Revisited, (2014)
- Louis Rosenfeld, Peter Morville, Jorge Arango, Information Architecture: For the Web and Beyond, (2015)

