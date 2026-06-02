# Visual Hierarchy

> Arrange size, contrast, spacing, position, and grouping so users can see what matters first, what belongs together, and what action to take next.

**Discipline:** UX Design · **Category:** visual-interface-design · **Maturity:** time-tested

**Also known as:** Information Hierarchy, Visual Priority

## Description

Visual hierarchy is the deliberate ordering of attention across a screen or flow. It uses scale, weight, colour, contrast, whitespace, alignment, proximity, and motion sparingly to communicate priority before the user has read every word. A strong hierarchy lets people scan, orient, and act: primary content is prominent, secondary material supports it, and tertiary details recede without disappearing. The pattern is not decoration; it is information architecture expressed visually. Done well, hierarchy makes the intended path obvious while preserving enough structure for users who need to inspect details.

**Problem.** Interfaces with undifferentiated headings, controls, cards, and messages force users to read everything with equal effort. Important actions are missed, errors look like ordinary text, and dense screens feel chaotic even when the underlying content is useful.

**Context.** Applies to almost every user-facing surface, especially dashboards, landing pages, forms, settings, product lists, and complex enterprise screens where many competing elements appear together.

## Forces

- Business stakeholders often want everything to look important, but hierarchy only works when priorities are explicit.
- Strong contrast guides attention, yet excessive emphasis creates visual noise and fatigue.
- Reusable components need consistent hierarchy rules while each screen still has a specific task priority.
- Accessibility constraints mean priority cannot rely on colour, size, or spatial position alone.

## Solution

Start by naming the user's primary question or action for the screen. Give that element the strongest combination of position, size, contrast, and whitespace, then stage secondary and tertiary content in descending order. Use consistent type scales, spacing increments, and emphasis tokens so priority is predictable across the product. Confirm the hierarchy by squinting at the screen, scanning without reading, and checking that keyboard and screen-reader order match the visual order.

## When to use

- A screen contains multiple headings, actions, cards, messages, or data regions competing for attention.
- Users report that they cannot tell what to do next or what information matters most.
- A design system needs reusable rules for type, spacing, elevation, and emphasis.

## Heuristics

Rules of thumb for applying this pattern well:

- One screen, one primary priority; everything else should visibly support or recede from it.
- Use at least two cues for importance, such as size plus spacing or contrast plus position.
- If the screen is blurred or viewed for five seconds, the main action and main message should still be identifiable.
- Keep visual order, reading order, and keyboard focus order aligned unless there is a documented reason.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Even small products benefit immediately because visual priority is cheap to establish and strongly affects first impressions, though the component system may still be informal. |
| Growth (scaling team & users) | ●●●●● 5/5 | As feature count and team size grow, explicit hierarchy rules prevent crowded screens and inconsistent emphasis across product areas. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for dense workflows and design-system governance; the main challenge is preserving hierarchy through localisation, customisation, and compliance content. |

## Examples

### A billing settings page

**❌ Poorer approach**

The page shows plan name, invoices, tax details, upgrade offers, cancellation, and support links with the same heading size and button weight, so users cannot tell whether they should review, pay, or upgrade.

**✅ Better approach**

The current plan and next payment date sit at the top with the strongest heading; the primary billing action uses the only filled button; invoices and tax details are grouped below with quieter headings.

*The better version translates task priority into visual priority. Users can answer the common question first, then scan to secondary details without every element competing for attention.*

## Anti-patterns

- Making every stakeholder request visually prominent until nothing stands out.
- Using colour alone to signal priority or status, excluding colour-blind and assistive-technology users.
- Styling hierarchy screen by screen with one-off font sizes and spacing rather than reusable scales.
- Creating a visual order that conflicts with reading, focus, or DOM order.

## Relationships

**Related product / UX patterns**

- [Progressive Information Hierarchy](../ux-patterns/progressive-information-hierarchy.md) — Progressive information hierarchy structures content priority; visual hierarchy makes that priority perceivable through layout, type, and emphasis.
- [Wayfinding Cues](../ux-patterns/wayfinding-cues.md) — Wayfinding depends on clear visual priority so users can recognise where they are and which navigation options matter next.
- [Colour Contrast](../ux-patterns/color-contrast.md) — Contrast is a hierarchy tool, but accessible contrast rules constrain how emphasis can be expressed safely.

**Related software patterns**

- [Component-Based UI](../patterns/frontend/component-based-ui.md) — Component boundaries and variants need hierarchy rules so reusable UI pieces remain visually coherent when composed on many screens.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Clear hierarchy supports Norman's discoverability and feedback principles by making available actions and current state easier to perceive.
- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — A strong visual hierarchy reduces the amount of interpretation required before a user can proceed.

## Tags

- **Tags:** attention, typography, layout, scanning
- **Product stages:** early, growth, enterprise

## References

- Kevin Mullet and Darrell Sano, Designing Visual Interfaces, (1995)
- Steve Krug, Don't Make Me Think, Revisited, (2014)
- Don Norman, The Design of Everyday Things, revised and expanded edition, (2013)

