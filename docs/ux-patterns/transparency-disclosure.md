# Transparency Disclosure

> Explain important system behaviour, data use, automation, sponsorship, or limitations in context so users can act with informed trust.

**Discipline:** UX Design · **Category:** trust-safety · **Maturity:** established

## Description

Transparency disclosure makes hidden or non-obvious product behaviour visible when it affects user decisions. It can cover data collection, algorithmic ranking, AI generation, advertising relationships, content moderation, pricing limits, availability, or human review. The point is not to dump policy text everywhere; it is to disclose the right information at the point where it changes what a reasonable user would choose. Good disclosures are specific, plain-language, timely, and layered: a short explanation in context with access to deeper detail when needed.

**Problem.** Products often make consequential choices invisibly, causing users to misinterpret recommendations, underestimate data use, or feel deceived when hidden behaviour is later revealed.

**Context.** Applies wherever the system's source, incentives, automation, uncertainty, data use, or limitations are not obvious and may affect trust or consent.

## Forces

- More transparency can improve trust, but excessive detail at every moment creates fatigue and legalistic noise.
- Business teams may fear disclosure reduces conversion, while hidden behaviour increases long-term trust and regulatory risk.
- Disclosures must be understandable without oversimplifying material limitations.

## Solution

Identify moments where hidden behaviour changes user interpretation or risk. Provide a concise in-context disclosure naming what is happening, why it matters, and what control or detail is available. Layer deeper information behind plain-language links, keep disclosures updated with actual system behaviour, and avoid using them to excuse avoidable harm.

## When to use

- Recommendations, rankings, prices, content, or decisions are shaped by data, sponsorship, automation, or policy users would not otherwise see.
- A limitation or uncertainty could affect a user's decision or safety.
- Users are asked to consent to, rely on, or share information with a system.

## Heuristics

Rules of thumb for applying this pattern well:

- Disclose at the decision point, not only in a policy archive.
- Lead with the fact that changes user understanding.
- Layer detail so the first explanation is short and the deeper explanation is reachable.
- Keep disclosure language aligned with real system behaviour as it changes.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Easier to build transparent explanations before hidden behaviours and growth shortcuts accumulate. |
| Growth (scaling team & users) | ●●●●● 5/5 | Vital as personalisation, ads, AI, and data use expand beyond what users can infer. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Required for regulated, procurement-sensitive, and high-stakes products where trust and auditability shape adoption. |

## Examples

### Sponsored recommendation

**❌ Poorer approach**

A product list ranks paid placements above organic results without indicating sponsorship.

**✅ Better approach**

Sponsored items are labelled in the list, with a short explanation of how sponsorship affects ranking and a link to ad preferences.

*Users can interpret recommendations correctly when incentives are disclosed in the moment of use.*

### AI-generated summary

**❌ Poorer approach**

A support tool presents an AI-generated account summary as authoritative fact with no source or limitation notice.

**✅ Better approach**

The summary is labelled as AI-generated, cites the source tickets used, and notes that agents should verify before taking irreversible action.

*Transparency helps users calibrate trust and avoid over-reliance on uncertain automation.*

## Anti-patterns

- Hiding important data use in a privacy policy while presenting the feature as ordinary local processing.
- Labelling a disclosure vaguely as "Learn more" without saying what it is about.
- Using disclosure as a liability shield while leaving a confusing or harmful default unchanged.

## Relationships

**Related product / UX patterns**

- [Consent Management](../ux-patterns/consent-management.md) — Consent depends on transparent explanation of purposes, parties, and consequences.
- [Permission Priming](../ux-patterns/permission-priming.md) — Permission priming is a just-in-time disclosure about access requested for a feature.
- [Plain Language](../ux-patterns/plain-language.md) — Disclosures only build trust if ordinary users can understand them.

**Related software patterns**

- [Audit Logging](../patterns/security/audit-logging.md) — Transparent claims about decisions and actions are easier to support when systems keep traceable logs.
- [Human-in-the-Loop Approval](../patterns/ai-ml/human-in-the-loop.md) — Disclosures often need to clarify whether automation, humans, or both are involved in a decision.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Transparent disclosures reduce information asymmetry for people with different expertise, power, and risk exposure.
- [Calm Technology](../philosophies/calm-technology.md) — Layered disclosure keeps important information available without overwhelming the primary task.

## Tags

- **Tags:** transparency, trust, disclosure, ai
- **Product stages:** early, growth, enterprise

## References

- [OECD, The Transparency Principle](https://oecd.ai/en/dashboards/ai-principles/P8)
- [PlainLanguage.gov, Plain Language Guidelines](https://www.plainlanguage.gov/guidelines/)

