# Plain Language

> Write interface and product content so users can understand it the first time they read it and act on it confidently.

**Discipline:** UX Design · **Category:** content-design · **Maturity:** time-tested

**Also known as:** Plain English, Clear Language

## Description

Plain language is the practice of choosing words, sentence structures, and information order that help readers find, understand, and use content quickly. In UX, it means writing for the user's task rather than the organisation's internal vocabulary: familiar words, active voice, concrete examples, short sentences, and headings that answer real questions. Plain language is not oversimplification; it is precision in the reader's context. It is especially important for errors, consent, payments, healthcare, government, finance, and any moment where misunderstanding has consequences.

**Problem.** Users abandon tasks, make wrong choices, or need support when content is written in jargon, legalese, marketing abstractions, or organisation-centric terms they do not share.

**Context.** Applies to labels, forms, help, policies, notifications, onboarding, error messages, product education, and cross-functional vocabulary across a service.

## Forces

- Legal, compliance, or domain precision may require exact terms, but unexplained precision can become exclusionary jargon.
- Brevity helps scanning, but removing necessary context can make content ambiguous.
- Internal stakeholders may prefer brand or expert terminology that users do not recognise.

## Solution

Start with the user's question and put the answer first. Use common words, active voice, concrete nouns, and short sentences. Define necessary technical or legal terms at the point of use, remove ornamental phrasing, and test content with people who resemble the audience. Maintain a shared vocabulary so the same concept is named consistently across product, support, and documentation.

## When to use

- Users must understand content to make a decision, complete a task, or give informed consent.
- Research or support logs show confusion caused by terminology or sentence complexity.
- The product crosses expertise levels, languages, literacy levels, or regulatory contexts.

## Heuristics

Rules of thumb for applying this pattern well:

- Put the user's task or answer first; background comes later.
- Prefer familiar words over impressive words unless precision truly requires the term.
- Define necessary jargon where it appears, not in a separate glossary only.
- Read content aloud; if it sounds like a policy memo, simplify it.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | One of the cheapest ways to improve activation, trust, and support load from the beginning. |
| Growth (scaling team & users) | ●●●●● 5/5 | Essential as more teams write product content and inconsistent terminology starts to fragment the experience. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Critical in regulated and global contexts, though legal review, localisation, and domain terminology require governance. |

## Examples

### Consent wording

**❌ Poorer approach**

A consent screen says "Authorise third-party data processing for service optimisation purposes" with no explanation of what data or benefit is involved.

**✅ Better approach**

The screen says "Allow Acme Analytics to use your usage data to show performance reports. You can turn this off in settings.".

*The better version keeps the necessary meaning while using concrete actors, data, purpose, and control.*

### Navigation label

**❌ Poorer approach**

A customer portal labels a section "Entitlements", a term used internally by billing teams but not by customers.

**✅ Better approach**

The section is labelled "Plans and licences", matching the language customers use when managing access.

*Plain language aligns labels with users' vocabulary so navigation does not require translation.*

## Anti-patterns

- Replacing clear task language with marketing slogans in functional UI.
- Copying legal or technical wording into the interface without explanation.
- Using different names for the same concept across product, help, and support.

## Relationships

**Related product / UX patterns**

- [Microcopy](../ux-patterns/microcopy.md) — Microcopy is where plain-language choices most visibly shape moment-by-moment comprehension.
- [Error Message Design](../ux-patterns/error-message-design.md) — Error messages must be plain enough for users to recover without support or technical translation.
- [Content-First Design](../ux-patterns/content-first-design.md) — Content-first work uses plain language to clarify structure and task intent before visual design hardens.

**Related software patterns**

- [Ubiquitous Language](../patterns/ddd-strategic/ubiquitous-language.md) — Plain language and ubiquitous language both depend on consistent shared vocabulary, with UX prioritising user comprehension.
- [Problem Details (RFC 7807 Errors)](../patterns/api-design/problem-details.md) — Human-readable problem titles and details should be written plainly so API-driven errors can become useful UI messages.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — Plain language reduces the mental translation users must perform before acting.
- [Human-Centred Design](../philosophies/human-centered-design.md) — Writing from the user's vocabulary and context is a direct human-centred design practice.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Nielsen's match between system and real world heuristic calls for user language rather than system terms.

## Tags

- **Tags:** clarity, ux-writing, accessibility, comprehension
- **Product stages:** early, growth, enterprise

## References

- [Plain Language Action and Information Network, Federal Plain Language Guidelines](https://www.plainlanguage.gov/guidelines/)
- Janice Redish, Letting Go of the Words, (2012)

