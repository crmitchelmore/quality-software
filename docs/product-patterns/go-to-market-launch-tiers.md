# Go-to-Market Launch Tiers

> Classify launches by customer impact, strategic importance and operational risk so product, marketing, sales and support invest the right amount of go-to-market effort.

**Discipline:** Product Management · **Category:** go-to-market · **Maturity:** established

**Also known as:** Launch Tiering, Tiered Launch Planning

## Description

Go-to-market launch tiers create a shared scale for deciding how much cross-functional launch work a release deserves. A tier-one launch may need positioning, analyst or press work, sales enablement, customer migration, support readiness and executive reporting. A tier-three improvement may need only release notes and in-product education. Tiering prevents two common failures: under-launching important changes that require adoption support, and over-launching minor features that consume the organisation. The tier is not a prestige label; it is an operating agreement about audience, readiness, channels, risks, owners and success metrics.

**Problem.** Every release is either treated as a major launch, exhausting go-to-market teams, or shipped quietly with no enablement, causing customers, sales and support to be surprised. Product impact and launch effort are negotiated ad hoc each time.

**Context.** Useful for organisations releasing frequently across multiple customer segments, channels or product lines, especially when marketing, sales, customer success and support must coordinate.

## Forces

- Teams want visibility for their work, but launch effort must match market and customer impact.
- Strategic announcements need narrative polish, while operational changes need readiness and risk controls.
- Tiering must be lightweight enough not to slow small releases.
- A launch can be low marketing tier but high customer-risk tier, such as a migration or deprecation.

## Solution

Define launch tiers with criteria such as revenue impact, customer-visible change, risk, migration effort, competitive importance and required enablement. For each tier, specify required artefacts, approval points, channels, owners and success metrics. Review tier assignment early, revisit it when scope changes, and hold post-launch reviews proportional to the tier.

## When to use

- Multiple functions need a predictable way to plan launches and readiness work.
- Minor releases are being over-marketed or major launches are being under-supported.
- A product portfolio releases often enough that ad hoc launch planning creates confusion.

## Metrics

Signals that tell you whether this pattern is working:

- Launch readiness completion by required tier artefacts and dates.
- Adoption, revenue, activation or retention outcomes against tier-specific launch goals.
- Sales, support and customer-success preparedness indicators before launch.
- Post-launch issue volume, customer confusion and enablement-gap findings by tier.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for discipline, but very early teams should keep tiering lightweight to avoid process overhead. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit as release volume and cross-functional coordination demands increase. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential where launches affect many customers, regions, sales teams and support channels. |

## Examples

### Matching effort to impact

**❌ Poorer approach**

A minor settings rename receives a press-style campaign while a breaking workflow change ships with only a changelog entry, surprising support and customers.

**✅ Better approach**

The settings rename is a low-tier release note; the workflow change is tiered for customer readiness, with migration messaging, support scripts and success metrics.

*Tiering allocates attention to customer and business impact, not internal excitement or feature size alone.*

### Early tier decision

**❌ Poorer approach**

Marketing learns two days before launch that a feature needs sales enablement and customer migration guidance.

**✅ Better approach**

The tier is assigned at discovery exit, so positioning, enablement and migration work are planned alongside delivery and updated as scope changes.

*Launch work is product work. Deciding tier early prevents readiness from becoming a last-minute scramble.*

## Anti-patterns

- Treating tier one as a status symbol rather than a workload and risk classification.
- Letting launch tier be decided after engineering is complete, when enablement is already late.
- Using only marketing reach to tier launches and ignoring support, migration or customer-risk needs.
- Creating so many tiers and gates that small releases slow down unnecessarily.

## Relationships

**Related product / UX patterns**

- [Beta Program](../product-patterns/beta-program.md) — Higher-tier launches often use beta programmes to validate positioning, readiness and customer impact before broad release.
- [Sales-Product Feedback Loop](../product-patterns/sales-product-feedback-loop.md) — Tiered launches depend on sales and customer-facing feedback to prepare enablement and spot launch risks.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Feature toggles allow staged release, customer targeting and rollback for launches whose tier warrants controlled exposure.
- [API Versioning](../patterns/api-design/api-versioning.md) — API or integration launches often need versioning strategy and customer migration planning as part of launch tiering.

**Related philosophies**

- [Working Backwards](../philosophies/working-backwards.md) — Launch tiering benefits from starting with the customer announcement, FAQ and readiness needs before delivery completes.

## Tags

- **Tags:** launch, go-to-market, enablement, release-planning
- **Product stages:** growth, enterprise

## References

- April Dunford, Obviously Awesome, (2019)
- Geoffrey A. Moore, Crossing the Chasm, (1991)

