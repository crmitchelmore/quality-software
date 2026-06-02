# Keyboard Shortcuts

> Provide memorable keyboard paths for frequent actions, while preserving visible controls and accessible alternatives for every capability.

**Discipline:** UX Design · **Category:** interaction-design · **Maturity:** time-tested

**Also known as:** Hotkeys, Accelerator Keys

## Description

Keyboard shortcuts let users invoke actions without moving through visible controls. They are a major productivity accelerator in text-heavy, expert, and high-frequency workflows, and they also support users who navigate primarily by keyboard. Good shortcuts build on platform conventions, avoid conflicts with assistive technology and browser defaults, and are taught progressively through menus, tooltips, command palettes, and cheat sheets. They should never be the only way to perform an action; shortcuts are an additional path that rewards practice, not a hidden requirement.

**Problem.** Frequent actions become slow and fatiguing when users must repeatedly reach for the mouse, open menus, or traverse several controls for operations they perform hundreds of times a day.

**Context.** Applies to editors, developer tools, design tools, dashboards, customer-support consoles, and any product where skilled users repeat a compact set of actions often.

## Forces

- Speed for experts competes with learnability for novices who do not know shortcuts yet.
- Global shortcuts can conflict with operating system, browser, and assistive technology commands.
- Too many shortcuts create memorisation burden; too few leave high-frequency work slow.

## Solution

Start with shortcuts for the most frequent, low-risk, and conventionally named actions. Follow platform norms, expose shortcuts beside menu items and in command-palette results, provide a searchable shortcut reference, and allow customisation where expert workflows differ. Test with keyboard and assistive technology users to avoid conflicts, and ensure every shortcuted action also has a visible accessible control.

## When to use

- Users perform the same actions repeatedly in a focused workflow.
- The product has an expert-user segment that values speed and flow.
- Actions can be named and grouped consistently enough to be learnable.

## Heuristics

Rules of thumb for applying this pattern well:

- Shortcut the frequent path first, not every possible command.
- Use platform conventions unless there is a compelling product-specific reason.
- Teach shortcuts at the moment of use through menus, tooltips, and palettes.
- Never make a shortcut the sole accessible path to an action.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | A few conventional shortcuts may help, but broad shortcut systems are usually premature before workflows stabilise. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Valuable once repeated expert workflows emerge and the product can teach shortcuts consistently. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Important for power users in complex tools, with added governance needed for localisation, remapping, and accessibility conflicts. |

## Examples

### Teaching an accelerator

**❌ Poorer approach**

A support console supports "assign to me" with a keyboard shortcut, but the only documentation is a release note from six months ago.

**✅ Better approach**

The action button says "Assign to me" and its tooltip and command-palette row show the shortcut, with a shortcut reference available from help.

*Shortcuts become useful when they are discoverable in context and reinforced by repeated exposure.*

### Handling conflicts

**❌ Poorer approach**

A web app binds a global shortcut that overrides a browser or screen-reader command, making the page faster for some users and unusable for others.

**✅ Better approach**

The app avoids reserved combinations, scopes shortcuts to the active workspace, and lets users disable or remap advanced shortcuts.

*Shortcut design must respect the broader input environment, not just the product's internal command list.*

## Anti-patterns

- Making critical actions available only through undocumented key combinations.
- Overriding browser or assistive technology shortcuts without strong reason and mitigation.
- Inventing shortcuts that conflict across product areas or change between screens.

## Relationships

**Related product / UX patterns**

- [Command Palette](../ux-patterns/command-palette.md) — Command palettes teach, search, and execute shortcuts while providing an alternate keyboard path.
- [Keyboard Navigation](../ux-patterns/keyboard-navigation.md) — Shortcuts complement but do not replace systematic keyboard navigation through focusable controls.
- [Contextual Tooltips](../ux-patterns/contextual-tooltips.md) — Tooltips can teach accelerators at the exact control where users already understand the action.

**Related software patterns**

- [Command](../patterns/gof-behavioural/command.md) — Shortcuts should invoke the same command objects or handlers as visible controls so behaviour stays consistent.
- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Shortcut availability often depends on the current UI state, selection, focus, and mode.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Visible signifiers and feedback help turn invisible keyboard commands into learnable controls.
- [Inclusive Design](../philosophies/inclusive-design.md) — Inclusive design requires shortcuts to coexist with assistive technologies and multiple input methods.

## Tags

- **Tags:** productivity, accessibility, keyboard, expert-use
- **Product stages:** growth, enterprise

## References

- [W3C, WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- Alan Cooper, Robert Reimann, David Cronin, Christopher Noessel, About Face: The Essentials of Interaction Design, (2014)

