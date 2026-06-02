# Product Tour

> Introduce a product's core concepts and first actions in a short, skippable sequence that orients users without delaying real use.

**Discipline:** UX Design · **Category:** onboarding-education · **Maturity:** established

## Description

A product tour is a guided introduction shown near first use or after a major change. It highlights the product's purpose, main areas, or first valuable actions through a small number of screens, coach marks, or interactive steps. A good tour is selective and contextual: it explains enough to reduce disorientation, then hands the user back to the product with a clear next action. A poor tour tries to teach every feature before the user has motivation or context, becoming a slideshow users skip and forget.

**Problem.** New users can arrive with little understanding of where to start, but front-loading a complete explanation delays value and creates information they cannot yet retain.

**Context.** Best for products with unfamiliar concepts, multiple navigation regions, or a first-run setup path that benefits from orientation before doing.

## Forces

- Orientation reduces anxiety, but passive instruction before need is quickly forgotten.
- Tours can draw attention to important capabilities, but they can also block exploration.
- Product teams want to showcase breadth, while users want the shortest path to value.

## Solution

Keep the tour short, skippable, and anchored to the first meaningful outcome. Use plain language, show one idea per step, and prefer interactive doing over passive reading. Offer a way to revisit the tour later, and follow it with contextual onboarding that appears when the user reaches a relevant feature.

## When to use

- First-time users need orientation before they can safely or confidently act.
- A major redesign changes navigation or mental models for existing users.
- The product has one or two core concepts that unlock the rest of the experience.

## Heuristics

Rules of thumb for applying this pattern well:

- Teach only what the user needs for the next valuable action.
- Make every tour skippable and easy to replay.
- Prefer interactive steps over passive slides where the product can safely support them.
- Stop before attention drops; three to five focused steps is often enough.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Helpful when the product is novel, but early teams should prioritise making the first task obvious. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Useful as acquisition channels diversify and new cohorts need faster orientation. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable for complex suites and redesigns, though tours must coexist with training, roles, and documentation. |

## Examples

### Analytics dashboard

**❌ Poorer approach**

First login opens a twelve-step overlay describing every chart, export, filter, and administrative feature before the dashboard can be used.

**✅ Better approach**

A three-step tour explains the dashboard's main question, the date filter, and the first report to open, then leaves advanced exports to contextual help.

*The better tour orients the user to immediate value without pretending they can retain the whole product at once.*

### Redesign announcement

**❌ Poorer approach**

After a navigation redesign, users see a marketing modal saying the product is "new and improved" but not where familiar actions moved.

**✅ Better approach**

A concise tour points to the relocated search, settings, and create button, with a persistent "What changed?" link for later reference.

*The tour focuses on reducing disruption rather than celebrating internal design work.*

## Anti-patterns

- Forcing a long, unskippable tour before users can inspect the product.
- Explaining advanced features before the user has completed a first meaningful task.
- Using tours to compensate for confusing navigation that should be redesigned.

## Relationships

**Related product / UX patterns**

- [Progressive Onboarding](../ux-patterns/progressive-onboarding.md) — Product tours should be the opening orientation, not the entire onboarding strategy.
- [Contextual Tooltips](../ux-patterns/contextual-tooltips.md) — Tooltips can teach secondary features later when users encounter the relevant context.

**Related software patterns**

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Tours for new features or redesigns are often released gradually alongside the feature itself.
- [State Machine UI](../patterns/frontend/state-machine-ui.md) — Guided tours benefit from explicit step states so users can skip, resume, or replay reliably.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — A tour should reduce initial uncertainty, not add another interface users must decipher.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — It supports help and documentation while preserving user control through skip and replay.

## Tags

- **Tags:** onboarding, education, first-run, guidance
- **Product stages:** early, growth, enterprise

## References

- Samuel Hulick, User Onboarding, (2014)
- Steve Krug, Don't Make Me Think, Revisited, (2014)

