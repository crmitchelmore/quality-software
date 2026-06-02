# Design Tokens

> Store design decisions such as colour, typography, spacing, radius, motion, and elevation as named tokens that can be shared consistently across design and code.

**Discipline:** UX Design · **Category:** design-systems · **Maturity:** established

**Also known as:** Tokenised Design Decisions, Design Variables

## Description

Design tokens are named, platform-agnostic values that capture the smallest design decisions in a system. Instead of hard-coding a blue hex value or a spacing number into each mock-up and codebase, teams use semantic names such as colour.action.primary or space.inline.medium that can be transformed for web, mobile, documentation, and design tools. Tokens separate intent from implementation value: a brand colour, role colour, or component-specific alias can change centrally while product surfaces keep a stable meaning. Done well, tokens make consistency, theming, accessibility, and multi-platform delivery much easier.

**Problem.** Visual decisions are copied as raw values across design files and code, causing drift, inaccessible combinations, slow rebranding, and inconsistent theming across platforms.

**Context.** Use when a product has repeated visual decisions, multiple platforms, themes, brands, or teams that need the same design language expressed in design tools and production code.

## Forces

- Semantic names improve intent, but too many aliases can become hard to understand.
- Global consistency competes with local component needs and brand exceptions.
- Tokens must serve designers and engineers, so naming and distribution need shared ownership.
- A token change is small technically but can have large visual and accessibility impact.

## Solution

Define token layers for base values, semantic roles, and component aliases where needed. Name tokens by purpose rather than current appearance, document their intended use, and publish them through an automated source of truth that feeds design tools and code. Include accessibility constraints such as contrast pairs and state colours. Treat token changes as design-system releases with review, migration notes, and visual regression checks where available.

## When to use

- Teams repeatedly copy raw colours, sizes, typography, or motion values.
- A product supports theming, white-labelling, dark mode, or multiple platforms.
- Designers and engineers need one source of truth for design decisions.
- Accessibility or brand updates must be applied consistently at scale.

## Heuristics

Rules of thumb for applying this pattern well:

- Tokenise repeated decisions and semantic roles, not every accidental pixel value.
- Prefer names that describe intent; values change more often than purpose.
- Separate base, semantic, and component token layers so flexibility does not destroy clarity.
- Ship tokens through the same source of truth to design tools, code, and documentation.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | A small token set is helpful, but elaborate token architecture can slow exploration before the visual language stabilises. |
| Growth (scaling team & users) | ●●●●● 5/5 | High leverage as teams, themes, and platforms multiply; tokens prevent visual drift and speed systematic change. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for multi-brand, multi-platform, and accessibility-governed organisations, provided changes are released carefully. |

## Examples

### Semantic colour tokens

**❌ Poorer approach**

Designers specify #0066CC in Figma, web uses a similar blue constant, and mobile copies a slightly different value for primary actions.

**✅ Better approach**

The system defines colour.action.primary with platform outputs for design tools, CSS variables, and mobile resources, plus contrast guidance for text and backgrounds.

*The better version captures the design decision once and distributes it by meaning, reducing drift and making accessibility review possible.*

### Rebrand without rewriting screens

**❌ Poorer approach**

A brand refresh requires hundreds of component overrides because colours and radius values were hard-coded throughout products.

**✅ Better approach**

Brand tokens map to semantic tokens, so the refresh changes approved source values and affected components update through controlled releases.

*Tokens make system-wide visual change manageable when the naming model separates intent from raw value.*

## Anti-patterns

- Naming tokens after their current value, such as blue-500, when the product needs semantic meaning.
- Creating a token for every one-off value, turning the token set into noise.
- Changing token values without reviewing downstream components and accessibility.
- Keeping tokens in design files only, so production code continues to drift.

## Relationships

**Related product / UX patterns**

- [Atomic Design Components](../ux-patterns/atomic-design-components.md) — Tokens supply the primitive design decisions consumed by atomic components and composed interface patterns.
- [Component Variants & States](../ux-patterns/component-variants-states.md) — Variants and states need semantic tokens for hover, focus, disabled, destructive, success, and other interaction meanings.
- [Dark Mode & Theming](../ux-patterns/dark-mode-theming.md) — Dark mode is usually implemented by remapping semantic tokens rather than redesigning each component separately.

**Related software patterns**

- [Options Object](../patterns/implementation/options-object.md) — Token bundles often act like named configuration objects that pass design decisions into components without long primitive parameter lists.
- [Registry](../patterns/enterprise-application/registry.md) — A token source of truth behaves like a registry of approved design values that tools and components resolve by stable name.

**Related philosophies**

- [Atomic Design](../philosophies/atomic-design.md) — Tokens are the lowest-level design decisions that support Atomic Design's compositional component system.
- [Inclusive Design](../philosophies/inclusive-design.md) — Well-governed tokens encode accessibility constraints such as contrast and reduced-motion choices so inclusive defaults scale.

## Tags

- **Tags:** tokens, theming, design-systems, accessibility
- **Product stages:** growth, enterprise

## References

- [W3C Design Tokens Community Group, Design Tokens Community Group Format Module](https://design-tokens.github.io/community-group/format/)
- Marco Suarez, Jina Anne, Katie Sylor-Miller, Diana Mounter, Roy Stanfield, Design Systems Handbook, (2017)

