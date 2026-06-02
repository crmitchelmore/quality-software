# Smart Defaults

> Preselect safe, likely values so users can accept the common case quickly while still understanding and changing what will happen.

**Discipline:** UX Design · **Category:** forms-input · **Maturity:** established

## Description

Smart defaults reduce decision effort by using context, history, sensible policy, or common behaviour to populate a field before the user starts. A delivery address may default to the last used address, a date picker to the next available appointment, or privacy settings to the most protective option. The pattern is not about guessing aggressively; it is about making the safest common path easy while keeping the user's agency intact. Good defaults are visible, explainable when consequential, easy to change, and conservative when the cost of being wrong is high.

**Problem.** Blank forms force users to make decisions the system can often infer, increasing time, cognitive load, and errors. Bad defaults, however, can cause users to accept a choice they did not intend.

**Context.** Useful where the system has reliable context or where a domain has a clearly safe default: localisation, scheduling, checkout, notification preferences, settings, and configuration flows.

## Forces

- Reducing effort competes with preserving informed choice; the more consequential the default, the more visible and explainable it must be.
- Personalisation can improve relevance, but inferred defaults can encode bias or stale assumptions.
- Defaults improve speed for the common case, but uncommon users need a clear way to correct them.

## Solution

Choose defaults from evidence and risk, not internal convenience. Prefer protective and reversible values for privacy, cost, and destructive settings; use recent history or explicit profile data only when it is reliable. Make the selected value visible, label why it was chosen when the reason matters, and ensure the change path is obvious before submission.

## When to use

- Most users choose the same value or a value can be reliably derived from context.
- A safe fallback exists if the system is uncertain.
- Accepting the default will not surprise the user with cost, exposure, or irreversible consequences.

## Heuristics

Rules of thumb for applying this pattern well:

- Default to the safest acceptable value when the cost of being wrong is asymmetric.
- Explain consequential defaults in plain language at the point of choice.
- Make changing the default no harder than accepting it.
- Use data to choose defaults, but review them for bias and edge cases.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Simple defaults can make a young product feel polished quickly; the risk is guessing without enough evidence. |
| Growth (scaling team & users) | ●●●●● 5/5 | As repeated use and segmentation grow, smart defaults become a major lever for activation and retention. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential in complex workflows, though defaults may need governance, auditability, and policy review. |

## Examples

### Notification preferences

**❌ Poorer approach**

A new account has every marketing and product email checkbox preselected, with the unsubscribe option hidden in account settings.

**✅ Better approach**

Essential service notifications are enabled, marketing is opt-in, and each category explains what the user will receive before they save.

*The better default respects consent and reduces surprise; convenience does not come at the cost of trust.*

### Booking a delivery slot

**❌ Poorer approach**

The form leaves region, address, and time blank even though the user has ordered before, making them re-enter known information.

**✅ Better approach**

The form defaults to the user's last delivery address and the next available standard slot, clearly labelled with an easy "Change" action.

*Contextual defaults remove repetitive work while making the assumption visible and reversible.*

## Anti-patterns

- Defaulting to a revenue-maximising option such as add-ons, subscriptions, or tracking without informed user intent.
- Hiding a default in collapsed settings so users do not realise a choice has been made.
- Using stale personal history as if it were a current preference.

## Relationships

**Related product / UX patterns**

- [Privacy-by-Default UX](../ux-patterns/privacy-by-default-ux.md) — Privacy-sensitive defaults should choose the least exposing option unless the user deliberately expands sharing.
- [Progressive Disclosure](../ux-patterns/progressive-disclosure.md) — Safe defaults make advanced options optional, enabling a simpler first view without removing control.

**Related software patterns**

- [Options Object](../patterns/implementation/options-object.md) — Software APIs often express defaults through options; the UX must ensure those defaults are safe and intelligible to humans.
- [Secure by Default](../patterns/security/secure-by-default.md) — Security defaults follow the same principle: the easiest path should not be the risky path.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Norman's constraints and good defaults reduce error by putting knowledge in the world rather than in the user's memory.
- [Inclusive Design](../philosophies/inclusive-design.md) — Inclusive defaults consider people with low confidence, low literacy, assistive technology, and varied privacy expectations rather than an imagined average user.

## Tags

- **Tags:** defaults, forms, decision-effort, trust
- **Product stages:** early, growth, enterprise

## References

- [Nielsen Norman Group, Designing with Defaults](https://www.nngroup.com/articles/defaults/)
- Richard H. Thaler and Cass R. Sunstein, Nudge: Improving Decisions About Health, Wealth, and Happiness, (2008)

