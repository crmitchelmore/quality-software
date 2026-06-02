# Privacy-by-Default UX

> Make the easiest path the least exposing path, with sharing, tracking, and visibility expanded only through clear user intent.

**Discipline:** UX Design · **Category:** trust-safety · **Maturity:** established

## Description

Privacy-by-default UX applies data-minimisation and secure-default thinking to the interface. New accounts, fields, integrations, and sharing controls should begin from protective settings rather than public, trackable, or broadly shared ones. The pattern is more than legal compliance: it shapes expectations and reduces accidental exposure. Good privacy defaults are visible enough to be understood, conservative where risk is high, and paired with clear controls for users who choose more openness. It avoids both dark patterns that nudge oversharing and obscure settings that make privacy impossible to manage.

**Problem.** Users often accept defaults without reading every setting; if defaults expose data or enable tracking, people can suffer privacy harm without meaningful intent.

**Context.** Applies to profiles, visibility settings, analytics consent, notifications, integrations, collaboration, AI features, and any product area that collects or shares personal or sensitive data.

## Forces

- Protective defaults reduce harm, but may require extra steps for users who genuinely want public sharing.
- Legal compliance sets a floor, while trust often requires clearer and more conservative experiences.
- Personalisation benefits can depend on data collection, but users need agency over the trade-off.

## Solution

Start from the minimum collection, visibility, and sharing needed for the user's immediate goal. Make privacy-relevant defaults clear at setup and at the point of sharing, provide granular controls, and avoid preselected optional data use. Where a less-private option creates value, explain the benefit and consequence before the user opts in.

## When to use

- A setting affects who can see, use, retain, or infer personal or sensitive information.
- Users may not revisit settings after setup.
- The product serves vulnerable, regulated, workplace, health, financial, child, or public-facing contexts.

## Heuristics

Rules of thumb for applying this pattern well:

- If exposure could harm the user, default to private or limited visibility.
- Ask for expansion of sharing at the moment it creates value, not as a blanket setup choice.
- Use plain-language labels that name who can see or use the data.
- Review defaults against vulnerable-user scenarios, not only average-user convenience.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Easy to establish before legacy defaults and growth incentives harden into harmful norms. |
| Growth (scaling team & users) | ●●●●● 5/5 | Essential as data collection, sharing, and experimentation expand across more users. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Non-negotiable in regulated and workplace contexts, often tied to procurement and compliance review. |

## Examples

### New profile visibility

**❌ Poorer approach**

New user profiles are public, searchable, and show workplace and location fields unless the user finds privacy settings.

**✅ Better approach**

Profiles start visible only to the user's organisation, with a clear preview and explicit controls for making selected fields public.

*The better default prevents accidental exposure while preserving deliberate sharing.*

### Analytics personalisation

**❌ Poorer approach**

A product preselects "Share usage data with partners" during onboarding and buries the explanation in a legal link.

**✅ Better approach**

Optional data sharing is off by default, explains the benefit in plain language, and can be enabled separately from essential service analytics.

*Privacy-sensitive choices require genuine intent and separation from necessary processing.*

## Anti-patterns

- Making profiles public by default because public content improves growth metrics.
- Prechecking optional data-sharing or marketing consent boxes.
- Hiding privacy controls several levels deep or behind ambiguous labels.

## Relationships

**Related product / UX patterns**

- [Smart Defaults](../ux-patterns/smart-defaults.md) — Privacy-by-default is a specific high-stakes application of choosing safe defaults.
- [Consent Management](../ux-patterns/consent-management.md) — Consent flows should inherit privacy-protective defaults and avoid preselected optional processing.
- [Transparency Disclosure](../ux-patterns/transparency-disclosure.md) — Users need clear disclosure to understand what protective defaults do and what changes when they opt in.

**Related software patterns**

- [Secure by Default](../patterns/security/secure-by-default.md) — The UX principle parallels software defaults that choose safe behaviour unless explicitly changed.
- [Principle of Least Privilege](../patterns/security/least-privilege.md) — Interfaces should ask for and expose only the access needed for the user's chosen task.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Protective defaults recognise that privacy risk is unevenly distributed across people and contexts.
- [Human-Centred Design](../philosophies/human-centered-design.md) — The pattern centres human harm, agency, and context rather than organisational appetite for data.

## Tags

- **Tags:** privacy, defaults, trust, safety
- **Product stages:** early, growth, enterprise

## References

- Ann Cavoukian, Privacy by Design: The 7 Foundational Principles, (2009)
- European Union, General Data Protection Regulation, (2016)

