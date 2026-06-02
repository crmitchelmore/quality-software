# Progressive Onboarding

> Teach capabilities gradually at the moment they become useful, helping users build competence through use rather than front-loaded instruction.

**Discipline:** UX Design · **Category:** onboarding-education · **Maturity:** established

## Description

Progressive onboarding spreads education across the user's journey. Instead of a single exhaustive tour, it reveals guidance, defaults, prompts, and practice tasks when the user reaches a relevant context or maturity level. The pattern recognises that users learn by doing and retain information best when they have a goal. It can combine empty states, checklists, contextual tooltips, templates, and just-in-time prompts, but it must remain respectful: guidance should be dismissible, adaptive, and tied to genuine user value rather than product team desire to advertise features.

**Problem.** Users forget front-loaded training and can be overwhelmed by advanced features before they understand the basics, while products still need to teach depth over time.

**Context.** Best for products with layered capability, repeated use, multiple roles, or a path from novice to expert where learning everything at first login is unrealistic.

## Forces

- Gradual teaching improves retention, but hidden guidance can delay discovery if triggers are poorly chosen.
- Personalised prompts feel relevant, but over-targeting can become intrusive or manipulative.
- Teams want feature adoption, while users want help only when it serves their current goal.

## Solution

Map the user's journey from first value to deeper competence, then attach guidance to moments where a concept is needed. Start with the minimum needed for activation, use behaviour and role to reveal later help, and let users dismiss, replay, or seek guidance on demand. Measure learning by successful task completion rather than exposure to prompts.

## When to use

- The product has advanced capabilities that are valuable only after foundational use.
- Users return repeatedly and can learn over multiple sessions.
- Context is available to decide which guidance is relevant now.

## Heuristics

Rules of thumb for applying this pattern well:

- Teach at the moment of need, not at the moment of product launch.
- Move from first value to deeper mastery in observable stages.
- Let users dismiss, defer, and rediscover help.
- Trigger guidance from user goals and behaviour, not internal feature priorities.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Useful when the product has real depth, though early teams should first find the shortest path to first value. |
| Growth (scaling team & users) | ●●●●● 5/5 | Excellent fit as segments, roles, and advanced capabilities expand. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for complex tools where roles, permissions, and workflows require staged learning. |

## Examples

### Project-management product

**❌ Poorer approach**

First login forces a fifteen-slide overview of boards, automations, reports, permissions, and billing.

**✅ Better approach**

The product first helps the user create a project and task; automation guidance appears later after they have repeated a manual workflow several times.

*The better flow teaches depth when the user has a reason to care and enough context to understand it.*

### Advanced search

**❌ Poorer approach**

The search page permanently displays all advanced operators above the input, intimidating casual users.

**✅ Better approach**

Basic search stays simple; after users refine searches repeatedly, a contextual hint introduces one useful operator with an example.

*Progressive education adds power without burdening every search with expert syntax.*

## Anti-patterns

- Sprinkling tooltips everywhere and calling it onboarding.
- Optimising for feature exposure rather than successful user outcomes.
- Re-showing dismissed guidance because the system cannot remember user preference.

## Relationships

**Related product / UX patterns**

- [Progressive Disclosure](../ux-patterns/progressive-disclosure.md) — Progressive onboarding applies staged disclosure over time to learning rather than only to controls.
- [Contextual Tooltips](../ux-patterns/contextual-tooltips.md) — Tooltips are one delivery mechanism for just-in-time onboarding prompts.
- [Checklist Onboarding](../ux-patterns/checklist-onboarding.md) — Checklists can structure the early stage before later contextual learning takes over.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Feature flags can target onboarding prompts by cohort or maturity without changing the whole product.
- [State Machine UI](../patterns/frontend/state-machine-ui.md) — User onboarding stages can be modelled as states so guidance appears predictably and respectfully.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — The pattern builds a conceptual model through timely feedback and visible affordances.
- [Human-Centred Design](../philosophies/human-centered-design.md) — It starts from users' learning needs and contexts rather than a product-centric feature tour.

## Tags

- **Tags:** onboarding, education, activation, progressive-disclosure
- **Product stages:** early, growth, enterprise

## References

- Samuel Hulick, User Onboarding, (2014)
- [Nielsen Norman Group, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)

