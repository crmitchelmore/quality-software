# Skeleton Loading

> Show lightweight placeholders shaped like the incoming content so waiting feels structured, calm, and shorter than staring at a blank page or generic spinner.

**Discipline:** UX Design · **Category:** feedback-status · **Maturity:** established

## Description

Skeleton loading replaces empty regions with neutral placeholder blocks that approximate the layout of content still being fetched or rendered. It tells users that the page structure exists and that content is on the way, improving perceived performance for feeds, cards, dashboards, and detail views. A good skeleton is brief, stable, and honest: it should not imitate real data too closely, shift the layout when content arrives, or hide a genuinely stuck system. When loading is long, uncertain, or failure-prone, skeletons need escalation into status, retry, or empty/error states.

**Problem.** Blank screens and indefinite spinners make users wonder whether anything is happening, while full loading messages can be too heavy for frequent page transitions.

**Context.** Works best when the shape of the content is known, data usually arrives quickly, and preserving layout continuity matters more than explaining a multi-step process.

## Forces

- Skeletons make waiting calmer, but can become deceptive if content takes a long time or never arrives.
- Matching the eventual layout reduces shift, but overly detailed placeholders can look like disabled real content.
- Animation can signal activity, but excessive shimmer distracts users and can harm people sensitive to motion.

## Solution

Render simple placeholders that match the expected layout and reserve the same space as the real content. Use subtle motion or static tones depending on context and reduced-motion settings. Replace skeletons as soon as content is available, and switch to explicit error, retry, or empty states when loading exceeds a reasonable threshold or fails.

## When to use

- The interface knows the content structure before the content itself arrives.
- Loading is common but usually short enough that a detailed progress message would be distracting.
- Layout stability and perceived speed matter for browsing or scanning.

## Heuristics

Rules of thumb for applying this pattern well:

- Match shape, not content; placeholders should reassure without pretending data exists.
- Keep skeleton duration short and escalate to a meaningful status when waiting becomes exceptional.
- Reserve final layout space so content arrival does not jump the page.
- Use calm motion sparingly and honour reduced-motion settings.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful polish for content-heavy products, but a young team should first make loading reliable and reasonably fast. |
| Growth (scaling team & users) | ●●●●● 5/5 | Highly valuable as traffic, data volume, and device variability make blank loading states more common. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Helps complex dashboards feel stable, but long-running enterprise jobs still need explicit progress and error handling. |

## Examples

### Activity feed

**❌ Poorer approach**

Opening the feed shows a blank white page with a spinner in the centre, then cards jump into place after data arrives.

**✅ Better approach**

The page immediately shows card-shaped skeletons where titles, avatars, and text will appear, then swaps them for real cards without layout shift.

*The better version gives users a stable mental model of the page and makes the wait feel purposeful.*

### Slow report

**❌ Poorer approach**

A quarterly analytics report shows shimmering placeholders for several minutes while the backend job runs.

**✅ Better approach**

The report briefly shows skeleton structure, then changes to an explicit "Preparing report" status with estimated steps and a notification option.

*Skeletons are for short, structural waits; long work needs informative progress and user control.*

## Anti-patterns

- Showing skeletons indefinitely after a request has failed.
- Using skeleton screens for unpredictable long-running jobs where users need real progress.
- Animating large areas aggressively without respecting reduced-motion preferences.

## Relationships

**Related product / UX patterns**

- [Progress Indicator](../ux-patterns/progress-indicator.md) — When waiting becomes longer or measurable, a progress indicator is more informative than a skeleton.
- [System Status Visibility](../ux-patterns/system-status-visibility.md) — Skeletons are one lightweight way to keep the system's loading state visible.
- [Reduced Motion](../ux-patterns/reduced-motion.md) — Animated placeholders must respect users who prefer less motion.

**Related software patterns**

- [Fallback](../patterns/resilience/fallback.md) — Skeletons act as a graceful visual fallback while the real content is temporarily unavailable.
- [Circuit Breaker](../patterns/resilience/circuit-breaker.md) — If upstream content repeatedly fails, the UX should stop waiting forever and surface a fallback state.
- [Lazy Load](../patterns/enterprise-application/lazy-load.md) — Skeletons commonly pair with lazy-loaded sections that appear as data or components arrive.

**Related philosophies**

- [Calm Technology](../philosophies/calm-technology.md) — The pattern keeps waiting information in the periphery without demanding attention unnecessarily.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — It supports visibility of system status by showing that loading is in progress.

## Tags

- **Tags:** loading, perceived-performance, feedback, motion
- **Product stages:** early, growth, enterprise

## References

- [Luke Wroblewski, Skeleton Screens: A Better Way to Load Content](https://www.lukew.com/ff/entry.asp?1797)
- [Jakob Nielsen, Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)

