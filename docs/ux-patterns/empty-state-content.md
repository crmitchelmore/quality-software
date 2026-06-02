# Empty State Content

> Use moments with no data, results, or activity to orient users, explain value, and offer a meaningful next step.

**Discipline:** UX Design · **Category:** content-design · **Maturity:** established

**Also known as:** Blank Slate Content, Zero State Content

## Description

Empty state content appears when a screen has nothing to show yet: no projects, no search results, no notifications, no activity, no permissions, or no configured integrations. These moments are not dead ends; they are opportunities to teach the purpose of the space, explain why it is empty, and guide the next useful action. A strong empty state distinguishes first use from cleared, filtered, failed, and permission-limited states. It should be concise, honest, and actionable, with illustration or tone serving comprehension rather than filling visual space.

**Problem.** Blank or generic empty screens make users wonder whether the product is broken, whether they lack access, or what they should do to get value from the page.

**Context.** Applies to onboarding, dashboards, lists, inboxes, search results, reports, integrations, and any product area where data may be absent for different reasons.

## Forces

- Empty states can teach value, but over-explaining every blank surface creates noise.
- A friendly tone can reduce anxiety, but humour can frustrate users who are blocked.
- The same visual emptiness may mean first use, filters too narrow, no permission, or a system failure.

## Solution

Identify why the state is empty and write content for that cause. State what belongs here, why nothing is visible now, and what the user can do next. Offer the primary action when the user can change the state, provide filter-reset or spelling help for no-results states, and explain permission or system limits when the user cannot fix it themselves. Keep content shorter once the user is no longer new.

## When to use

- A page, list, dashboard, or result set can legitimately have no content.
- First-time users need to understand how to create or connect the thing that will populate the screen.
- Search, filters, permissions, or failures can produce empty-looking results for different reasons.

## Heuristics

Rules of thumb for applying this pattern well:

- Name the reason for emptiness before prescribing the next action.
- Separate first-use, no-results, filtered, permission, and failure states.
- Offer one primary next step when the user can act; explain clearly when they cannot.
- Reduce onboarding copy after the user has already created content once.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Crucial for first value because young products often have sparse data until users create or import something. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Important across expanding surfaces, especially search, dashboards, and collaboration spaces with varied data density. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable but more complex because permissions, retention rules, and integrations can all create empty-looking states. |

## Examples

### No search results

**❌ Poorer approach**

A search page says "No results" after a query with several filters applied, leaving the user to guess whether the spelling, filters, or data set caused the failure.

**✅ Better approach**

The page says "No invoices match 'Acme' with the current filters" and offers "Clear filters" plus a suggestion to check spelling.

*The better state identifies the cause and gives the most likely recovery action.*

### First project

**❌ Poorer approach**

A new workspace dashboard is completely blank except for the navigation frame.

**✅ Better approach**

The dashboard explains "Projects organise your team's work" and offers a prominent "Create project" action with a secondary link to import from an existing tool.

*First-use emptiness should teach the purpose of the space and move users toward first value.*

## Anti-patterns

- Showing the same cheerful illustration for every empty state regardless of cause.
- Saying "Nothing here" without explaining what belongs there or how to proceed.
- Offering a primary action the user lacks permission to take.

## Relationships

**Related product / UX patterns**

- [Empty State Onboarding](../ux-patterns/empty-state-onboarding.md) — First-use empty states often become lightweight onboarding moments that guide users to activation.
- [Microcopy](../ux-patterns/microcopy.md) — Empty states rely on concise interface copy to explain value, cause, and next action.
- [Search as Navigation](../ux-patterns/search-as-navigation.md) — No-results states in search need recovery guidance so search remains a useful navigation path.

**Related software patterns**

- [Null Object](../patterns/implementation/null-object.md) — Empty state content is the UX counterpart to representing absence deliberately rather than letting null leak as broken UI.
- [Special Case](../patterns/enterprise-application/special-case.md) — Different empty causes are special cases that deserve explicit handling instead of one generic blank state.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — Good empty states remove uncertainty about whether the user, data, or system caused the blank screen.
- [Emotional Design](../philosophies/emotional-design.md) — Tone and illustration can reduce anxiety and build confidence when a product would otherwise feel inert.

## Tags

- **Tags:** onboarding, ux-writing, no-results, activation
- **Product stages:** early, growth, enterprise

## References

- Jenifer Tidwell, Charles Brewer, Aynne Valencia, Designing Interfaces, (2020)
- Torrey Podmajersky, Strategic Writing for UX, (2019)

