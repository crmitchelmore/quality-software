# Product Principles

> Define a small set of durable product decision rules that encode what the product will optimise for, protect and deliberately trade off.

**Discipline:** Product Management · **Category:** product-strategy · **Maturity:** established

**Also known as:** Decision Principles, Product Tenets

## Description

Product Principles are explicit beliefs about how a product should behave and how teams should make trade-offs. They sit between broad strategy and detailed design: specific enough to decide between competing solutions, durable enough to survive individual projects, and opinionated enough to make some choices unacceptable. Good principles help distributed teams make consistent decisions without escalating every judgement call.

**Problem.** Teams repeatedly debate the same trade-offs — simplicity versus configurability, self-serve versus assisted, speed versus control — because strategy does not encode how the product should choose when values conflict.

**Context.** Use for multi-team products, design systems, platform products, regulated products and any product where consistency of experience matters across many local decisions.

## Forces

- Principles must be few and memorable; a long list becomes values wallpaper.
- Each principle needs a real trade-off or it will not change decisions.
- Principles may constrain short-term revenue or stakeholder requests to preserve product integrity.

## Solution

Derive principles from strategy, customer needs, brand promise and hard-won lessons. Phrase each as an actionable rule with implications and counterexamples. Socialise them through product reviews and use them explicitly in decision records, roadmap debates and design critiques. Revisit only when strategy or evidence changes materially.

## When to use

- Teams make inconsistent product decisions across squads, surfaces or regions.
- Stakeholders need a shared way to evaluate trade-offs beyond opinion.
- A product is scaling and founding taste is no longer transmitted informally.

## Metrics

Signals that tell you whether this pattern is working:

- Number of product review decisions explicitly resolved using a principle.
- Reduction in repeated escalation of the same trade-off.
- Consistency score from UX audits or customer feedback across product surfaces.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Helpful for founder-led coherence, but principles should not harden before enough customer learning exists. |
| Growth (scaling team & users) | ●●●●● 5/5 | Essential as more teams make local decisions and informal alignment stops scaling. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Critical for consistency across product lines, though governance must avoid turning principles into bureaucracy. |

## Examples

### Trade-off clarity

**❌ Poorer approach**

A principle says "We care about quality".

**✅ Better approach**

A principle says "Prefer safe defaults over maximum configurability for first-time administrators; advanced controls must be progressively disclosed after setup succeeds".

*The poor version is universal and non-decisive. The better version tells teams what to optimise and what to sacrifice.*

### Applying principles in review

**❌ Poorer approach**

A team approves a complex settings page because an enterprise customer requested every option.

**✅ Better approach**

The team applies the principle "make the common path obvious, the uncommon path possible" and moves rare options into an advanced section.

*Principles preserve product coherence when individual requests would otherwise pull the experience apart.*

## Anti-patterns

- Writing generic values such as "be user-friendly" that no one would disagree with.
- Using principles to justify decisions after the fact rather than guide them beforehand.
- Creating so many principles that teams can cherry-pick whichever supports their preference.

## Relationships

**Related product / UX patterns**

- [Product Vision Board](../product-patterns/product-vision-board.md) — Product principles translate the vision board's product intent into repeated decision rules.
- [Design Tokens](../ux-patterns/design-tokens.md) — In UI-heavy products, principles often govern how design-system tokens and components should be used.

**Related software patterns**

- [Clean Architecture](../patterns/architecture/clean-architecture.md) — Architectural rules, like product principles, preserve long-term integrity by making boundaries explicit.

**Related philosophies**

- [Conceptual Integrity](../philosophies/conceptual-integrity.md) — Product principles are a practical mechanism for maintaining conceptual integrity across many contributors.
- [Empowered Product Teams](../philosophies/empowered-product-teams.md) — Teams can be more autonomous when principles make strategic trade-offs explicit.

## Tags

- **Tags:** principles, decision-making, consistency, governance
- **Product stages:** growth, enterprise

## References

- Marty Cagan, Inspired, (2017)

