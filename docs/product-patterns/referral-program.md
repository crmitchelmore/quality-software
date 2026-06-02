# Referral Program

> Create an explicit, trustworthy incentive system that rewards existing users for bringing qualified new users who reach value, not merely for sending invitations.

**Discipline:** Product Management · **Category:** growth · **Maturity:** established

## Description

A referral program formalises word-of-mouth growth with a designed offer, tracking mechanism and reward structure. Unlike a purely viral loop, it makes the incentive explicit: credits, discounts, storage, cash, status or mutual benefit. Good referral programmes reward successful value transfer, not raw invite volume. They are clear about terms, easy to share at moments of user satisfaction, resistant to fraud, and aligned with the economics of the business. The best programmes feel like helping a friend get value, not exploiting a relationship for a coupon.

**Problem.** Teams bolt on referral codes or rewards hoping to lower acquisition cost, but users share indiscriminately, fraud rises, referred users do not activate, and the programme either loses money or damages trust.

**Context.** Useful when the product already has satisfied users, clear target audiences, trackable attribution and unit economics that can fund a reward for qualified acquisition.

## Forces

- Bigger incentives increase participation but may attract low-quality or fraudulent referrals.
- Rewarding the referrer alone can feel extractive; mutual benefit often preserves trust better.
- Attribution windows and eligibility rules must be simple enough to understand but robust enough to enforce.
- Referral success depends on product satisfaction; incentives cannot compensate for weak value.

## Solution

Define who should refer whom, at what moment, and what successful referred activation means. Offer a reward that fits customer motivation and unit economics, preferably benefitting both referrer and recipient. Make terms transparent, track attribution reliably, delay rewards until qualified activation or payment where appropriate, and monitor fraud, margin, activation and retention guardrails.

## When to use

- Existing users are satisfied enough to recommend the product.
- Referred users can be attributed and their activation or payment can be measured.
- The expected lifetime value supports the reward and operational cost.

## Metrics

Signals that tell you whether this pattern is working:

- Referral participation rate among satisfied or activated users.
- Referred-user acceptance, activation, retention and conversion rates.
- Referral cost per qualified acquisition and payback period.
- Fraud rate, support disputes and reward liability.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Can work for high-satisfaction niches, but launching before retention and unit economics are understood risks buying poor-fit users. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit when the product has happy users, measurable activation and economics that support rewards. |
| Enterprise (mature org / regulated) | ●●○○○ 2/5 | Less common for enterprise procurement, though advocate or partner referrals can work with non-consumer incentives. |

## Examples

### Rewarding qualified value

**❌ Poorer approach**

A finance app pays for every referred email signup, attracting fake accounts and users who never link an account or transact.

**✅ Better approach**

Rewards unlock only after the referred user completes identity checks and makes a first qualifying transaction, with clear terms visible before sharing.

*The better programme pays for value-aligned acquisition and reduces fraud. The poor version buys noise.*

### Timing the ask

**❌ Poorer approach**

New users see a referral modal immediately after signup, before they know whether the product works.

**✅ Better approach**

The referral prompt appears after a successful outcome, such as completing a booking or saving money, and provides a message grounded in that value.

*People refer when they have confidence. Asking after value preserves trust and improves conversion.*

## Anti-patterns

- Launching referrals before retention shows the product is recommendable.
- Paying for raw invites or sign-ups rather than qualified activation or purchase.
- Hiding terms, caps or eligibility rules until after users refer.
- Setting incentives so high that fraud becomes the main acquisition channel.

## Relationships

**Related product / UX patterns**

- [Viral Loop](../product-patterns/viral-loop.md) — Referral programmes are incentive-backed viral loops and share the same recipient-value and trust requirements.
- [Growth Loops](../product-patterns/growth-loops.md) — A referral programme should be modelled as a loop whose output is qualified new users who can later refer others.

**Related software patterns**

- [Idempotency Key](../patterns/api-design/idempotency-key.md) — Reward issuance and referral attribution need idempotency so retries do not duplicate credits or payouts.
- [Audit Logging](../patterns/security/audit-logging.md) — Referral programmes need auditable attribution and reward events to investigate fraud and user disputes.

**Related philosophies**

- [Product-Led Growth](../philosophies/product-led-growth.md) — Referrals extend product-led acquisition when user success naturally creates advocates.

## Tags

- **Tags:** referrals, incentives, acquisition, trust
- **Product stages:** growth

## References

- John Jantsch, The Referral Engine, (2010)
- Sean Ellis and Morgan Brown, Hacking Growth, (2017)

