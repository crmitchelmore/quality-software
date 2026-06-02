# Permission Priming

> Explain why a sensitive permission is needed before invoking the system prompt, so users can make an informed choice rather than reacting to a surprise request.

**Discipline:** UX Design · **Category:** trust-safety · **Maturity:** established

## Description

Permission priming introduces a device, browser, or account permission in product language before the platform-level permission dialogue appears. It is common for location, camera, microphone, contacts, notifications, calendar, and file access. The goal is not to manipulate users into granting access; it is to connect the permission to an immediate user benefit, set expectations about use, and make refusal a supported path. Good priming is contextual, truthful, and just-in-time. Asking on first launch for every possible permission teaches distrust and wastes the one chance many platforms give to ask well.

**Problem.** Sudden permission prompts feel risky and unexplained, causing users to deny access or grant it without understanding the consequences.

**Context.** Best when a permission is optional or sensitive and the user is about to use a feature that genuinely needs it.

## Forces

- Explaining value can improve consent quality, but persuasive copy can cross into coercion if refusal is punished unnecessarily.
- Waiting for context improves understanding, but some permissions are technically needed before a feature can demonstrate value.
- Platform prompts are constrained and final; the product-owned moment before them must carry the nuance.

## Solution

Ask only when the user takes or approaches an action that requires the permission. Before the platform prompt, show a concise explanation of what is requested, why it helps, how the data will be used, and what happens if they decline. Respect denial, offer manual alternatives where possible, and provide a clear path to enable the permission later.

## When to use

- The feature requires a sensitive permission and the user may not understand why.
- The product can defer the permission until a contextual moment.
- There is a meaningful alternative or degraded experience if access is denied.

## Heuristics

Rules of thumb for applying this pattern well:

- Ask at the moment of need, not at the moment of install.
- Explain the user benefit and data use in one or two plain-language sentences.
- Treat "not now" as a valid choice and remember it.
- Provide a route to recover from denial without nagging.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Important whenever permissions gate core value; easy to do reasonably with a few contextual prompts. |
| Growth (scaling team & users) | ●●●●● 5/5 | Critical as acquisition broadens and permission denial rates materially affect feature adoption. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for regulated and managed environments where users and administrators scrutinise access. |

## Examples

### Location for store search

**❌ Poorer approach**

On first launch, the app immediately asks for location access with no context.

**✅ Better approach**

When the user taps "Find stores near me", the app explains "Use your location to show nearby stores; you can also enter a postcode" before the platform prompt.

*The better version ties the permission to an immediate goal and preserves a manual alternative.*

### Notifications

**❌ Poorer approach**

A productivity app asks for notification permission during signup before the user has created any reminders.

**✅ Better approach**

After the user creates a reminder, the app explains that notifications are needed to alert them at the chosen time and lets them skip.

*Context makes the value concrete and avoids spending the permission request before it matters.*

## Anti-patterns

- Requesting all permissions during first launch before the user has seen any value.
- Using guilt, fear, or misleading benefits to push users into granting access.
- Dead-ending users who deny permission instead of explaining alternatives or settings.

## Relationships

**Related product / UX patterns**

- [Transparency Disclosure](../ux-patterns/transparency-disclosure.md) — Priming is a focused disclosure about why access is requested and how it will be used.
- [Privacy-by-Default UX](../ux-patterns/privacy-by-default-ux.md) — Permission prompts should default to minimal access and preserve functionality where possible.
- [Microcopy](../ux-patterns/microcopy.md) — The success of priming depends on concise, trustworthy permission copy.

**Related software patterns**

- [Principle of Least Privilege](../patterns/security/least-privilege.md) — The UX should request only the minimum permission needed for the user's chosen feature.
- [Valet Key](../patterns/cloud-distributed/valet-key.md) — Scoped, temporary access mirrors the UX principle of asking for narrow permission rather than blanket authority.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Inclusive permission design respects users with different safety needs, contexts, and willingness to share data.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — It supports user control and freedom by making denial and later recovery understandable.

## Tags

- **Tags:** permissions, privacy, trust, mobile
- **Product stages:** early, growth, enterprise

## References

- [Nielsen Norman Group, Mobile App Permissions: UX Guidelines](https://www.nngroup.com/articles/mobile-app-permissions/)
- [Apple, Human Interface Guidelines: Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)

