# Accessibility Audit

> Systematically inspect representative product flows against accessibility criteria, assistive-technology behaviour, and user impact to plan remediation.

**Discipline:** UX Design · **Category:** usability-evaluation · **Maturity:** established

**Also known as:** Accessibility Review, A11y Audit

## Description

An accessibility audit is a structured evaluation of how well a product supports disabled users and meets agreed accessibility standards. It combines automated checks, manual inspection, keyboard testing, screen-reader review, colour and zoom checks, content review, and sometimes disabled-user research. The output is not just a defect list; it should include scope, methods, severity, affected users, evidence, responsible owners, and remediation priorities. A good audit creates a credible baseline and a path to improvement while avoiding the false confidence of scanner-only results.

**Problem.** Organisations often do not know the accessibility state of their product until a procurement review, complaint, or legal deadline exposes failures. Unscoped audits then produce overwhelming issue lists that teams struggle to prioritise or fix sustainably.

**Context.** Useful before major launches, procurement submissions, redesigns, design-system adoption, VPAT or accessibility statement updates, and when a legacy product needs a remediation roadmap.

## Forces

- Broad coverage finds systemic issues, but deep manual testing of every path can exceed available time.
- Automated tools provide speed and repeatability, but they miss many keyboard, semantic, cognitive, and screen-reader problems.
- Severity should reflect user impact, legal risk, frequency, and component reuse, not only technical neatness.
- Audits can become performative unless findings feed backlog ownership and design-system fixes.

## Solution

Define audit scope around representative high-value flows and components, target standards, assistive technologies, browsers, and user settings. Run automated scans, manual WCAG review, keyboard-only testing, screen-reader checks, zoom and reflow checks, contrast review, and content inspection. Record evidence and severity, group root causes by component or pattern, and produce a remediation plan that fixes systemic sources before one-off pages. Re-audit changed areas and track known exceptions.

## When to use

- A product needs an accessibility baseline, compliance evidence, or remediation roadmap.
- A launch, redesign, procurement process, or legal obligation requires accessibility confidence.
- Teams suspect systemic component or design-system accessibility defects.

## Heuristics

Rules of thumb for applying this pattern well:

- Scope by user-critical flows and reusable components, then state what was not audited.
- Combine automated checks with manual keyboard, screen-reader, zoom, contrast, and content review.
- Prioritise by affected user impact, task criticality, recurrence, and remediation leverage.
- Turn systemic findings into design-system and acceptance-criteria changes, not only page fixes.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Early teams should build accessible foundations, but a full formal audit may be premature unless the product is public-sector or high-risk. |
| Growth (scaling team & users) | ●●●●● 5/5 | Valuable when product surfaces and customers expand; audits expose systemic issues before they become sales or support blockers. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for compliance, procurement, governance, and remediation planning across large product portfolios. |

## Examples

### Auditing a SaaS onboarding flow

**❌ Poorer approach**

The team runs a browser extension on the onboarding pages, exports colour and missing-alt warnings, and tells sales the product passed because there are no serious automated errors.

**✅ Better approach**

The audit covers account creation, invite acceptance, setup, and billing with automated scans, keyboard walkthroughs, screen-reader checks, zoom and contrast review, then groups findings by component and task severity.

*The better audit reflects how disabled users actually move through the product and gives the team a remediation plan with leverage, rather than a shallow scanner report.*

## Anti-patterns

- Treating a green automated scan as an accessibility audit.
- Auditing every page superficially instead of testing representative tasks and reusable components deeply.
- Filing hundreds of unprioritised tickets without severity, ownership, or root-cause grouping.
- Keeping audit findings separate from product planning, design-system work, and release gates.

## Relationships

**Related product / UX patterns**

- [WCAG Conformance](../ux-patterns/wcag-conformance.md) — Accessibility audits commonly use WCAG as the criteria set for evaluating conformance and documenting exceptions.
- [Keyboard Navigation](../ux-patterns/keyboard-navigation.md) — Keyboard-only walkthroughs are a core audit activity because pointer-only interactions block many users.
- [Screen Reader Semantics](../ux-patterns/screen-reader-semantics.md) — Audits inspect accessible names, roles, states, relationships, and live announcements that automated tools often miss.

**Related software patterns**

- [Audit Logging](../patterns/security/audit-logging.md) — Both practices create evidence trails, though accessibility audits document user-facing barriers rather than system events.
- [LLM Evaluation Harness](../patterns/ai-ml/evaluation-harness.md) — Repeatable audit checklists and assistive-technology scripts function like an evaluation harness for accessibility quality.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Audits reveal where product decisions exclude users and guide teams toward more inclusive defaults.
- [Universal Design](../philosophies/universal-design.md) — Audit remediation often broadens usability for many people, not only those covered by a specific criterion.

## Tags

- **Tags:** accessibility, audit, wcag, evaluation
- **Product stages:** growth, enterprise

## References

- [W3C Web Accessibility Initiative, Web Content Accessibility Guidelines (WCAG) 2.2, (2023)](https://www.w3.org/TR/WCAG22/)
- [W3C Web Accessibility Initiative, Easy Checks: A First Review of Web Accessibility](https://www.w3.org/WAI/test-evaluate/preliminary/)
- Laura Kalbag, Accessibility for Everyone, (2017)

