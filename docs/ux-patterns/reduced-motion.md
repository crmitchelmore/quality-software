# Reduced Motion

> Respect motion sensitivity by reducing or replacing non-essential animation while preserving orientation, feedback, and meaning.

**Discipline:** UX Design · **Category:** accessibility-inclusive-design · **Maturity:** established

**Also known as:** Motion Sensitivity Support, Prefers Reduced Motion

## Description

Reduced motion adapts animation and movement for users who experience vestibular discomfort, distraction, nausea, migraines, cognitive load, or preference-based fatigue from motion. It does not mean removing all feedback or making the interface lifeless. Instead, essential state changes remain clear through opacity, instant transitions, position-preserving changes, text, icons, or subtle fades. The pattern respects system settings such as prefers-reduced-motion and gives teams criteria for when motion informs, delights, or harms.

**Problem.** Parallax, zooming, auto-playing animation, large sliding transitions, and motion-heavy loading states can make products uncomfortable or unusable. Teams often add animation for polish without alternatives for users who have explicitly requested less motion.

**Context.** Applies to web and mobile interfaces with page transitions, carousels, parallax, skeletons, loading indicators, charts, onboarding tours, animated illustrations, or microinteractions.

## Forces

- Motion can guide attention and explain spatial relationships, but the same movement can trigger discomfort.
- Brand delight and perceived polish compete with user control and sustained concentration.
- Removing motion entirely can hide state change unless alternative feedback is designed.
- System preferences vary by platform and must be respected consistently across design and code.

## Solution

Classify motion as essential, supportive, or decorative. Respect system reduced-motion preferences by disabling decorative motion and replacing large spatial movement with instant changes, short fades, or non-motion cues. Keep essential feedback, but reduce distance, duration, looping, and acceleration. Avoid auto-playing or parallax effects by default, and provide controls for animation that lasts, repeats, or distracts from the task.

## When to use

- A product uses animation, parallax, animated illustrations, carousels, page transitions, or moving charts.
- Users may work for long sessions or in contexts where motion is distracting or harmful.
- Accessibility standards or platform guidelines require respecting reduced-motion preferences.

## Heuristics

Rules of thumb for applying this pattern well:

- Respect the user's reduced-motion setting globally, not one component at a time.
- Replace motion with another cue for state change, such as text, icon, opacity, or position-stable feedback.
- Avoid large zoom, parallax, and sweeping movement for task-critical interfaces.
- Let users pause, stop, or hide motion that starts automatically or repeats.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | If animation is minimal, the pattern is light; if motion is central to the brand, early support prevents later redesign. |
| Growth (scaling team & users) | ●●●●○ 4/5 | As polish and microinteractions increase, reduced-motion rules keep experience quality from excluding sensitive users. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Important for compliance, employee tools, and long-session applications where distraction and discomfort accumulate. |

## Examples

### A route transition

**❌ Poorer approach**

Navigating between sections triggers a full-screen slide and zoom effect lasting half a second, even for users whose operating system asks for reduced motion.

**✅ Better approach**

Default users see a brief spatial transition, while reduced-motion users get an immediate content swap with a short fade and a focused heading confirming the new section.

*The better version keeps orientation and feedback but removes the movement most likely to cause discomfort. It respects user preference without making the interface ambiguous.*

## Anti-patterns

- Treating prefers-reduced-motion as a way to turn off only one animation while leaving large transitions elsewhere.
- Removing animation without replacing the feedback that told users something changed.
- Using auto-playing, looping decorative motion near primary tasks or reading content.
- Making essential information available only through animation timing or movement.

## Relationships

**Related product / UX patterns**

- [WCAG Conformance](../ux-patterns/wcag-conformance.md) — WCAG includes requirements for pausing moving content and avoiding harmful flashing or motion-triggered interactions.
- [Focus Management](../ux-patterns/focus-management.md) — Reduced-motion transitions still need focus movement to orient users when visual motion cues are removed.
- [Optimistic UI Feedback](../ux-patterns/optimistic-ui-feedback.md) — Immediate feedback can be conveyed without excessive animation when optimistic changes need to feel responsive.

**Related software patterns**

- [Debounce / Throttle (UI)](../patterns/frontend/debounce-throttle-ui.md) — Throttling rapid UI updates can reduce distracting motion and visual churn during frequent interaction.
- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Explicit UI states help provide non-motion feedback for transitions that would otherwise rely on animation.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Reduced motion accounts for permanent, temporary, and situational sensitivity to movement and distraction.
- [Calm Technology](../philosophies/calm-technology.md) — Motion restraint helps interfaces stay in the periphery and avoid unnecessary attention capture.

## Tags

- **Tags:** accessibility, motion, animation, preferences
- **Product stages:** early, growth, enterprise

## References

- W3C Web Accessibility Initiative, Web Content Accessibility Guidelines (WCAG) 2.2, (2023)
- [MDN Web Docs, Using the prefers-reduced-motion media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

