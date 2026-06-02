# Hub-and-Spoke IA

> Organise a section around a central hub that introduces, groups, and routes to related detail pages, giving users a stable place to orient, branch out, and return.

**Discipline:** UX Design · **Category:** information-architecture · **Maturity:** time-tested

**Also known as:** Hub and Detail Navigation, Index-and-Detail Structure

## Description

Hub-and-spoke information architecture uses a central hub page as the organising point for a set of related detail pages, tools, topics, or journeys. The hub explains the domain, surfaces the most important routes, groups spokes into meaningful clusters, and provides a reliable return point. It is common in documentation, marketing sites, product areas, learning centres, dashboards, and mobile apps where users repeatedly branch from an overview into focused detail. The pattern works when the hub is more than a list: it must create orientation, show relationships, highlight priority paths, and help users decide which spoke matches their goal.

**Problem.** Related content often grows as a flat collection of pages with weak relationships, causing users to land deep, lose orientation, and miss adjacent tasks or concepts that would help them complete their goal.

**Context.** Use when a topic, product area, or workflow has several related subpages that users should understand as part of one domain, especially when they may need to compare routes or return to an overview.

## Forces

- A strong hub improves orientation, but it can become a dumping ground if every spoke receives equal weight.
- Deep linking is essential, so spoke pages still need local context and a path back to the hub.
- Hubs must serve both new users seeking orientation and returning users seeking a direct route.
- Maintaining hub summaries and links requires governance as spokes change.

## Solution

Define the domain the hub owns, group related spokes by user goals, and make the hub communicate scope, priority routes, and relationships at a glance. Give each spoke a clear title, summary, and link, and give detail pages reciprocal navigation back to the hub and across sibling spokes where useful. Keep the hub curated and task-oriented rather than automatically listing everything.

## When to use

- A product or content area has many related detail pages that need a shared overview.
- Users commonly compare options or branch from an overview before choosing a specific path.
- Deep-linked users need a way to regain context and explore adjacent material.

## Heuristics

Rules of thumb for applying this pattern well:

- A hub should answer where am I, what belongs here, and which route fits my goal.
- Design spokes to stand alone for deep links, then provide a clear way back to the hub.
- Curate the hub by importance and task, not by organisational ownership.
- Use sibling links when users naturally compare or move between spokes.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for organising a small number of core areas, but a young product may not yet have enough depth to justify many hubs. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit as product areas, docs, and feature sets expand and need stable second-level organisation. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential in large portals and suites, though hub ownership and content governance must be explicit. |

## Examples

### Documentation hub

**❌ Poorer approach**

A docs landing page lists every article under an API in creation order, so beginners cannot tell which pages are tutorials, references, or migration guides.

**✅ Better approach**

The API hub introduces the integration, groups spokes into Get started, Core concepts, Reference, and Troubleshooting, and each spoke links back to the hub and next likely page.

*The better hub teaches the domain structure and likely paths, while the poor hub merely exposes the content inventory.*

### Product-area navigation

**❌ Poorer approach**

Users deep-link into an analytics report and cannot discover related setup, saved views, or alerting pages without returning to global search.

**✅ Better approach**

The report page shows it belongs to the Analytics hub, with a breadcrumb back, sibling links to setup and alerts, and the hub summarising the whole analytics area.

*Hub-and-spoke IA gives deep-linked users local orientation and adjacent paths rather than marooning them on isolated pages.*

## Anti-patterns

- Turning the hub into an alphabetical link farm with no prioritisation, grouping, or explanatory context.
- Making the hub the only route to spokes, preventing direct links and search results from working well.
- Allowing obsolete spokes to remain on the hub after ownership or content changes.
- Using hub-and-spoke for a strict linear process where a wizard or stepper would better match the task.

## Relationships

**Related product / UX patterns**

- [Breadcrumb Trail](../ux-patterns/breadcrumb-trail.md) — Breadcrumbs help users understand when a spoke sits under a hub and provide a lightweight route back to the overview.
- [Global Navigation](../ux-patterns/global-navigation.md) — Global navigation often routes to major hubs, while the hub organises the second-level spokes within a domain.
- [Progressive Information Hierarchy](../ux-patterns/progressive-information-hierarchy.md) — A hub is a structural way to reveal overview first and progressively route users into more detailed layers.

**Related software patterns**

- [Page Controller](../patterns/enterprise-application/page-controller.md) — Hub and spoke pages commonly map to page controllers that coordinate content, navigation, and local state.
- [Composite](../patterns/gof-structural/composite.md) — The hub-spoke relationship is often implemented as a composed tree or graph of content nodes.

**Related philosophies**

- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — A good hub provides a clear conceptual model of the section and signposts the available actions.
- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — Hub pages reduce navigation deliberation by making the section's structure and primary routes obvious.

## Tags

- **Tags:** navigation, content-structure, orientation, documentation
- **Product stages:** early, growth, enterprise

## References

- Louis Rosenfeld, Peter Morville, and Jorge Arango, Information Architecture for the World Wide Web, (2015)
- James Kalbach, Designing Web Navigation, (2007)

