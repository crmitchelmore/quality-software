# Tab Bar Navigation

> Use a small, persistent set of peer-level tabs to make the most important sections of a mobile or compact interface directly reachable with clear current-state feedback.

**Discipline:** UX Design · **Category:** navigation-wayfinding · **Maturity:** time-tested

**Also known as:** Bottom Navigation, Tab Navigation

## Description

Tab bar navigation presents a small number of top-level, mutually exclusive destinations as persistent tabs, commonly at the bottom of mobile screens or near the top of desktop panes. It works best when the destinations are peers that users switch between frequently. Because tab bars are always visible and spatially stable, they create strong wayfinding and fast access. Their constraint is also their strength: there is room for only a few items, so every tab must earn its place and be labelled clearly.

**Problem.** Users need frequent access to a handful of primary sections on a small screen, but menu drawers or deep navigation make switching slow and obscure the product's structure.

**Context.** Use for mobile apps, compact web apps, or product areas with three to five peer destinations that users revisit often and can understand from short labels and icons.

## Forces

- Persistent tabs improve reachability and orientation, but consume valuable screen space.
- Few tabs are memorable; too many tabs become cramped and ambiguous.
- Icons save space but often need text labels for clarity and accessibility.
- A tab implies peer-level destinations, not steps in a process or arbitrary actions.

## Solution

Choose three to five primary peer destinations based on user goals and frequency. Keep the tab bar persistent at the same level, show a clear selected state, and use concise labels with icons only where they genuinely help recognition. Preserve each tab's navigation stack when users switch, and avoid hiding important destinations behind a vague more tab unless the information architecture truly requires it.

## When to use

- Users regularly switch between a small set of top-level areas.
- Mobile reachability and persistent orientation are more important than maximising vertical space.
- Destinations are peers rather than a linear sequence.
- The product can commit to stable, short labels for primary areas.

## Heuristics

Rules of thumb for applying this pattern well:

- Use tabs for three to five peer destinations that users visit often.
- Show text labels; icons alone are rarely self-explanatory enough.
- Keep selected state unmistakable and preserve each tab's local history.
- Do not use tab bars for sequential tasks or infrequent destinations.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Good for simple mobile products with a few core destinations, but should not lock in unproven IA too early. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit as mobile usage grows and frequent switching between primary areas becomes common. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Useful in enterprise mobile apps, though role-based complexity and many modules often exceed what a tab bar can hold. |

## Examples

### Peer destinations, not process steps

**❌ Poorer approach**

A loan application uses bottom tabs labelled Details, Documents, Review, and Submit, letting users jump around and miss required validation.

**✅ Better approach**

The application uses a stepper for the sequential flow, while the app's tab bar remains Home, Applications, Messages, and Profile.

*Tabs communicate peer-level switching. A process needs progress and completion rules, not global navigation semantics.*

### Label clarity

**❌ Poorer approach**

A finance app uses five unlabeled icons in the tab bar, and users mistake the insights icon for notifications.

**✅ Better approach**

The tab bar uses Home, Spend, Save, Insights, and Profile labels with supporting icons and a clear active state.

*Labels reduce recognition errors, especially for abstract destinations where icon meaning is not universal.*

## Anti-patterns

- Using tabs for wizard steps, where users need progress and validation rather than peer switching.
- Adding six or more tabs until labels truncate and icons become cryptic.
- Placing one-off actions such as create or scan as peer destinations without clarifying their role.
- Resetting a tab's internal state every time the user switches away and back.

## Relationships

**Related product / UX patterns**

- [Global Navigation](../ux-patterns/global-navigation.md) — A mobile tab bar is often the compact expression of a product's global navigation for the most important destinations.
- [Wayfinding Cues](../ux-patterns/wayfinding-cues.md) — Selected states, labels, and stable placement make tab bars strong wayfinding cues.
- [Wizard / Stepper](../ux-patterns/wizard-stepper.md) — Wizard steppers are the better pattern when the apparent tabs are really ordered steps in a task.

**Related software patterns**

- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Tab selection, preserved stacks, and disabled or badge states often map to explicit UI state transitions.
- [Model-View-ViewModel (MVVM)](../patterns/frontend/model-view-viewmodel.md) — Mobile tab screens commonly bind persistent navigation state and per-tab view models in MVVM-style architectures.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — Clear, persistent tabs reduce the effort of choosing where to go in compact interfaces.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Tab bars rely on visible signifiers, stable mappings, and immediate feedback for the selected destination.

## Tags

- **Tags:** mobile-navigation, tabs, wayfinding, primary-navigation
- **Product stages:** early, growth, enterprise

## References

- [Apple, Human Interface Guidelines: Tab Bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Google, Material Design: Navigation Bar](https://m3.material.io/components/navigation-bar/overview)

