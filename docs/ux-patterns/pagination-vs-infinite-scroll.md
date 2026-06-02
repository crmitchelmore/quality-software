# Pagination vs Infinite Scroll

> Choose between discrete pages, load-more controls, and infinite scrolling based on whether users need orientation, comparison, completion, or effortless exploration.

**Discipline:** UX Design · **Category:** navigation-wayfinding · **Maturity:** time-tested

**Also known as:** Paged Lists vs Continuous Feeds, Load More Decision

## Description

Pagination and infinite scroll are competing navigation patterns for large result sets and feeds. Pagination divides content into stable pages, supporting orientation, progress, bookmarking, footer access, and deliberate comparison. Infinite scroll continuously loads more items as the user moves, supporting low-friction browsing and discovery where completion is not the goal. A load-more button sits between them, preserving user control while reducing page transitions. The right choice depends on task intent, content volatility, accessibility, analytics, and the user's need to return to a known position.

**Problem.** Teams apply infinite scroll or pagination by trend rather than task, causing users either to lose their place in goal-directed lists or to slog through unnecessary page controls in exploratory feeds.

**Context.** Use when designing search results, catalogues, feeds, tables, logs, comments, audit lists, or any large collection where users navigate through many items.

## Forces

- Continuous loading reduces friction but weakens orientation and a sense of completion.
- Pagination supports return and comparison but adds interaction cost between pages.
- Dynamic content can make page boundaries unstable unless sorting and cursors are handled carefully.
- Infinite scroll can harm accessibility, footer access, performance, and browser history if not designed deliberately.

## Solution

Start from user intent. Use pagination when users search, compare, audit, reference, or need stable position and completion. Use infinite scroll when users casually browse a feed where the next item matters more than the exact position. Use load more when exploration benefits from continuity but users still need control. Preserve scroll position, expose result counts where meaningful, support deep links or cursors, and provide accessible loading and keyboard behaviour.

## When to use

- Choosing how users move through large result sets, feeds, or lists.
- Users need to compare items, resume later, or cite a position in the collection.
- The product wants feed-like exploration but must preserve control and accessibility.
- Existing list navigation causes lost position, fatigue, or poor performance.

## Heuristics

Rules of thumb for applying this pattern well:

- Use pagination for goal-directed finding, comparison, audit, and stable reference.
- Use infinite scroll for open-ended discovery where position and completion matter less.
- Use load more when you want continuity with explicit user control.
- Preserve position, focus, and history whichever pattern you choose.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Relevant once lists exceed a single page, but early products often have small enough collections for simple defaults. |
| Growth (scaling team & users) | ●●●●● 5/5 | High leverage as catalogues, feeds, and search results grow and list navigation begins to shape conversion and retention. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Critical for auditability, accessibility, performance, and stable reference in large data-heavy systems. |

## Examples

### Search results need orientation

**❌ Poorer approach**

A legal document search uses infinite scroll, so researchers lose their position after opening a result and cannot cite where they found it.

**✅ Better approach**

Results use pagination with stable sorting, result counts, filters, and preserved return position after opening a document.

*Goal-directed search values orientation, repeatability, and comparison more than effortless consumption.*

### Discovery feed needs flow

**❌ Poorer approach**

A short-form inspiration feed forces users through numbered pages, interrupting casual browsing every twenty items.

**✅ Better approach**

The feed uses infinite scroll with clear loading status, position restoration, accessible announcements, and a reachable footer alternative.

*Exploratory feeds benefit from continuity, but the implementation still must preserve accessibility and recovery.*

## Anti-patterns

- Using infinite scroll for search results where users need to compare, refine, and return to a specific item.
- Paginating a social or discovery feed where users expect effortless continuation.
- Loading content automatically without preserving browser history, focus, or scroll position.
- Hiding important footer or legal links beneath endless loading.

## Relationships

**Related product / UX patterns**

- [Search as Navigation](../ux-patterns/search-as-navigation.md) — Search result pages often need a deliberate choice between pagination, load more, and infinite scroll based on search intent.
- [Faceted Navigation](../ux-patterns/faceted-navigation.md) — Facets and pagination must work together so refinements reset or preserve position in predictable ways.
- [Wayfinding Cues](../ux-patterns/wayfinding-cues.md) — Result counts, page numbers, loading states, and preserved position are wayfinding cues for large collections.

**Related software patterns**

- [Pagination](../patterns/api-design/pagination.md) — The software pagination pattern is the implementation mechanism behind the paged-list side of this UX decision.
- [Lazy Load](../patterns/enterprise-application/lazy-load.md) — Infinite scroll commonly relies on lazy-loading additional content as the user approaches the end of the current list.
- [Iterator](../patterns/gof-behavioural/iterator.md) — Cursor-like iteration through a result set underpins both load-more and infinite-scroll implementations.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — The right list-navigation pattern reduces effort by matching the user's browsing or finding intent.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Clear feedback, constraints, and recovery paths are necessary when lists load more content or divide into pages.

## Tags

- **Tags:** pagination, infinite-scroll, lists, search-results
- **Product stages:** early, growth, enterprise

## References

- [Hoa Loranger, Infinite Scrolling Is Not for Every Website](https://www.nngroup.com/articles/infinite-scrolling/)
- [Baymard Institute, Pagination, Load More Buttons, and Infinite Scrolling](https://baymard.com/blog/pagination-infinite-scrolling-load-more-buttons)

