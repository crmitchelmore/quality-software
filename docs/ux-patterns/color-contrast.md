# Colour Contrast

> Choose text, icon, state, and background colours with sufficient contrast so information remains legible across vision, device, and lighting differences.

**Discipline:** UX Design · **Category:** accessibility-inclusive-design · **Maturity:** established

**Also known as:** Accessible Contrast, Contrast Ratio

## Description

Colour contrast ensures that foreground information can be distinguished from its background by people with low vision, colour-vision differences, ageing eyesight, glare, low-quality displays, or high zoom. It applies to text, icons, focus indicators, controls, chart marks, status messages, and meaningful boundaries. Contrast is not only a compliance number; it is a perception and hierarchy tool. Good contrast systems use semantic tokens and tested palettes so states remain distinct in light mode, dark mode, high-contrast settings, and brand themes without relying on colour alone.

**Problem.** Low-contrast text, subtle icons, colour-only status, and pale focus indicators make interfaces hard or impossible to use for many people, especially in real lighting conditions and on varied devices.

**Context.** Applies to every visual interface, especially dense dashboards, forms, charts, disabled and error states, dark mode, brand theming, and products used outdoors or for long sessions.

## Forces

- Brand palettes often include low-contrast colours that need accessible semantic mappings.
- Higher contrast improves legibility but can reduce perceived subtlety or increase glare if applied indiscriminately.
- Disabled and secondary states need lower emphasis without becoming unreadable or ambiguous.
- Colour alone is attractive for status, but meaning must survive monochrome, colour-vision differences, and assistive modes.

## Solution

Define contrast requirements for body text, large text, icons, focus indicators, borders, and chart marks, usually aligned to WCAG 2.2 AA or better. Build palettes as semantic tokens, test every token pair in each supported theme, and provide non-colour cues such as labels, icons, patterns, or position for meaningful distinctions. Review real screens, not only token tables, because adjacent colours, font weight, size, and state combinations affect perceived legibility.

## When to use

- Text, icons, controls, charts, or statuses must remain legible to a broad audience.
- A brand refresh, dark mode, or theme system changes colour values.
- Accessibility checks identify contrast failures or colour-only meaning.

## Heuristics

Rules of thumb for applying this pattern well:

- Contrast is a functional requirement; test component states, not just brand swatches.
- Never make colour the only carrier of meaning; pair it with text, shape, icon, or position.
- Secondary can be quieter without being faint; reduce emphasis through hierarchy, not illegibility.
- Check contrast in every supported theme, including dark mode and high-contrast contexts.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Easy to bake into initial palettes and components, with immediate usability benefits and little process overhead. |
| Growth (scaling team & users) | ●●●●● 5/5 | Vital as brand systems, charts, and variants expand; token-level checks prevent repeated regressions. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Non-negotiable for compliance and procurement, especially across multiple brands, themes, and legacy surfaces. |

## Examples

### Status badges in a table

**❌ Poorer approach**

Status badges use pale red, amber, and green text on tinted backgrounds with no icons or labels beyond colour, making warning and success nearly indistinguishable for some users.

**✅ Better approach**

Badges use tested foreground/background pairs, include clear text labels and optional icons, and retain distinct borders in both light and dark themes.

*The better version preserves meaning when colour perception, theme, or display conditions vary. It is more legible and less dependent on brand colour alone.*

## Anti-patterns

- Approving a palette in isolation without testing actual components, states, and backgrounds.
- Using pale placeholder text as the only visible label for a form field.
- Communicating success, warning, and error only through red, amber, and green colour.
- Making focus indicators subtle to preserve aesthetics, leaving keyboard users disoriented.

## Relationships

**Related product / UX patterns**

- [WCAG Conformance](../ux-patterns/wcag-conformance.md) — Colour contrast is one of the most common WCAG conformance checks and affects text and non-text content.
- [Dark Mode & Theming](../ux-patterns/dark-mode-theming.md) — Each theme needs separate contrast validation because readable light-mode colours may fail in dark mode.
- [Data Visualization Design](../ux-patterns/data-visualization-design.md) — Chart colours must remain distinguishable and meaningful without relying on hue alone.

**Related software patterns**

- [Component-Based UI](../patterns/frontend/component-based-ui.md) — Contrast-safe component variants prevent low-contrast states from recurring across screens.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Contrast design accounts for varied vision, devices, environments, and temporary impairments.
- [Universal Design](../philosophies/universal-design.md) — Legible contrast benefits almost every user while removing barriers for those with low vision.

## Tags

- **Tags:** accessibility, colour, contrast, theming
- **Product stages:** early, growth, enterprise

## References

- [W3C Web Accessibility Initiative, Web Content Accessibility Guidelines (WCAG) 2.2, (2023)](https://www.w3.org/TR/WCAG22/)
- Geri Coady, Color Accessibility Workflows, (2015)

