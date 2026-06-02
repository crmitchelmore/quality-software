# Dark Mode & Theming

> Provide coherent light, dark, and branded themes through semantic tokens so comfort, contrast, hierarchy, and component states survive every mode.

**Discipline:** UX Design · **Category:** visual-interface-design · **Maturity:** established

**Also known as:** Themeable UI, Dark Theme

## Description

Dark mode and theming adapt an interface's colour, elevation, imagery, and emphasis to different visual environments or brand contexts. A good theme is not an inverted palette; it preserves hierarchy, contrast, state semantics, and emotional tone while reducing glare for users who prefer or need lower luminance. The durable approach is semantic design tokens — surface, text, border, focus, danger, success, elevation — mapped to theme values. This keeps component meaning stable when colours change and allows accessibility checks to happen at the token and component level.

**Problem.** Naive dark modes invert colours, break contrast, make disabled and active states indistinguishable, or leave logos and charts unreadable. One-off brand themes then multiply inconsistencies and regressions.

**Context.** Useful for products used in varied lighting, for accessibility and comfort preferences, for white-labelled products, and for design systems that must support multiple brands or high-contrast modes.

## Forces

- User comfort and brand expression must not undermine contrast, focus visibility, or state recognition.
- Dark surfaces reduce glare for some users but can increase halation or eye strain if contrast is too extreme.
- Semantic token discipline takes effort, but raw colour references make themes brittle and expensive.
- Charts, illustrations, shadows, and embedded content often need bespoke theme rules beyond simple colour swaps.

## Solution

Define semantic colour, elevation, and state tokens, then create light and dark mappings that meet contrast and hierarchy goals. Use dark palettes designed for luminance, not simple inversion; tune surfaces, borders, shadows, and overlays so depth remains legible. Ensure focus rings, disabled states, validation states, charts, and illustrations work in every supported theme. Respect system preferences where appropriate and let users override them when product context warrants.

## When to use

- Users work for long sessions, in low-light environments, or across devices with system theme preferences.
- A product needs brand, customer, or white-label theming without rebuilding every component.
- Existing colour usage is inconsistent and needs semantic tokenisation.

## Heuristics

Rules of thumb for applying this pattern well:

- Theme by semantic role, not by colour name; components should ask for danger text, not red 600.
- Check every interactive state in every theme: hover, focus, active, selected, disabled, error, and success.
- Dark mode should reduce glare without flattening hierarchy or making text bloom.
- Respect user preference by default, but keep a visible control where context switching is common.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Usually not essential before product-market fit unless the domain specifically demands low-light or long-session use. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Becomes valuable as users spend more time in the product and a design system can absorb token work. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Important for accessibility expectations, white-labelling, brand portfolios, and long-duration professional workflows. |

## Examples

### A developer console

**❌ Poorer approach**

The dark theme is produced by inverting the CSS, making blue links low contrast, green success and grey disabled states hard to distinguish, and charts still optimised for a white background.

**✅ Better approach**

The console uses semantic tokens with tested dark values; focus rings, status colours, charts, syntax highlighting, and empty states each have theme-specific accessible treatments.

*The better version treats theming as a system of meanings rather than a colour filter. Users get comfort without losing status, hierarchy, or trust.*

## Anti-patterns

- Inverting the light palette automatically and shipping without checking contrast, charts, or states.
- Encoding theme-specific hex values inside components instead of using semantic tokens.
- Treating dark mode as purely aesthetic while focus, error, and disabled states become less clear.
- Ignoring images, maps, data visualisations, and third-party embeds that clash with the theme.

## Relationships

**Related product / UX patterns**

- [Design Tokens](../ux-patterns/design-tokens.md) — Semantic tokens are the main mechanism for implementing themes consistently across components and platforms.
- [Colour Contrast](../ux-patterns/color-contrast.md) — Every theme must preserve contrast for text, icons, focus indicators, and meaningful non-text elements.
- [Data Visualization Design](../ux-patterns/data-visualization-design.md) — Charts and maps need explicit theme-aware palettes and labels rather than simple palette inversion.

**Related software patterns**

- [Component-Based UI](../patterns/frontend/component-based-ui.md) — Component libraries need token-driven theming so each component state remains coherent across modes.
- [Strategy](../patterns/gof-behavioural/strategy.md) — Theme selection often behaves like a strategy, swapping visual rules while component behaviour stays stable.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Supporting theme preferences recognises that visual comfort varies by user, environment, and ability.
- [Calm Technology](../philosophies/calm-technology.md) — A well-tuned theme reduces visual strain and lets the interface recede when users need sustained focus.

## Tags

- **Tags:** theming, dark-mode, design-tokens, colour
- **Product stages:** growth, enterprise

## References

- [Google, Material Design: Dark Theme](https://m3.material.io/styles/color/dark-theme/overview)
- [Apple, Human Interface Guidelines: Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)
- W3C Web Accessibility Initiative, Web Content Accessibility Guidelines (WCAG) 2.2, (2023)

