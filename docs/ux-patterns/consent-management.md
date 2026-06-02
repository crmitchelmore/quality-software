# Consent Management

> Let users understand, grant, refuse, review, and change consent for optional data use through clear, granular, and durable controls.

**Discipline:** UX Design · **Category:** trust-safety · **Maturity:** established

## Description

Consent management is the experience layer for optional data processing, tracking, communications, integrations, and sensitive permissions. It should make consent informed, specific, freely given, and easy to withdraw. Good consent management separates necessary service functions from optional purposes, avoids bundled or preselected choices, records the user's decision, and exposes a settings surface where people can change their mind later. It is both a trust pattern and a governance pattern: the interface, copy, and backend records must agree about what was asked and what was granted.

**Problem.** Consent requests are often vague, bundled, or manipulative, leaving users unsure what they agreed to and leaving organisations with fragile trust and compliance risk.

**Context.** Applies to cookies, analytics, marketing, profiling, AI training, third-party sharing, health or financial processing, and communication preferences.

## Forces

- Granularity gives control, but too many choices can overwhelm users.
- Business teams want broad consent, while valid consent requires a real ability to refuse.
- Consent is a user experience and a durable record; both must remain synchronised.

## Solution

Present consent at the point where it is relevant, with plain-language purposes and equal-weight accept, reject, and manage paths. Separate required processing from optional purposes, avoid preselected optional boxes, and persist a record of the choice. Provide a settings area where users can review, change, or withdraw consent with effects explained.

## When to use

- Data use is optional, sensitive, or legally requires consent.
- Users need to distinguish service necessity from additional business purposes.
- The product must honour consent consistently across channels and systems.

## Heuristics

Rules of thumb for applying this pattern well:

- Make refusal as easy and visible as acceptance.
- Ask for purposes users can understand, not legal abstractions.
- Separate necessary processing from optional use.
- Treat withdrawal as a first-class flow with clear consequences and confirmation.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Important as soon as optional tracking or marketing exists; simpler early data use keeps the surface manageable. |
| Growth (scaling team & users) | ●●●●● 5/5 | Critical as analytics, lifecycle messaging, and integrations multiply. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Required for regulated procurement, regional compliance, and account-level governance. |

## Examples

### Cookie consent

**❌ Poorer approach**

A banner says "We value your privacy" with a large Accept button, while rejection requires opening a settings panel and toggling twenty vendors individually.

**✅ Better approach**

The banner offers Accept optional cookies, Reject optional cookies, and Manage preferences, with clear categories and no preselected optional tracking.

*The better design makes consent a real choice rather than a maze.*

### AI feature data use

**❌ Poorer approach**

A writing assistant enables training on customer documents by default under broad terms of service.

**✅ Better approach**

The assistant explains optional model-improvement use separately from core processing, leaves it off by default, and records account-level consent with an easy withdrawal path.

*Sensitive secondary use requires explicit, understandable, and durable consent.*

## Anti-patterns

- Using a banner with a bright "Accept all" button and a hidden reject path.
- Bundling unrelated purposes into one all-or-nothing consent.
- Letting users withdraw consent in the UI while downstream systems continue processing.

## Relationships

**Related product / UX patterns**

- [Privacy-by-Default UX](../ux-patterns/privacy-by-default-ux.md) — Consent management should start from protective defaults and optional opt-in rather than assumed use.
- [Transparency Disclosure](../ux-patterns/transparency-disclosure.md) — Clear disclosure of purposes, parties, and consequences is necessary for informed consent.
- [Permission Priming](../ux-patterns/permission-priming.md) — Permission prompts and consent flows both require contextual explanation and respect for refusal.

**Related software patterns**

- [Audit Logging](../patterns/security/audit-logging.md) — Consent decisions need durable records of what was presented and what the user chose.
- [Gatekeeper](../patterns/cloud-distributed/gatekeeper.md) — Consent preferences must be enforced by the systems that control access to processing or sharing.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Consent must be understandable and usable for people with different literacy, language, ability, and risk contexts.
- [Human-Centred Design](../philosophies/human-centered-design.md) — The pattern respects human agency over organisational convenience in data use.

## Tags

- **Tags:** consent, privacy, trust, governance
- **Product stages:** early, growth, enterprise

## References

- European Union, General Data Protection Regulation, (2016)
- Forbrukerrådet, Deceived by Design, (2018)

