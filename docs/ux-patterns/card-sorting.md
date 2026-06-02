# Card Sorting

> Ask users to group and label content items so the information architecture reflects their mental models rather than the organisation's internal structure.

**Discipline:** UX Design · **Category:** user-research · **Maturity:** time-tested

**Also known as:** Open Card Sort, Closed Card Sort

## Description

Card sorting is a generative research method for understanding how people categorise information. Users receive cards representing pages, topics, tasks, products, or concepts and organise them into groups that make sense to them. In an open sort they name the groups themselves; in a closed sort they place cards into predefined categories; in a hybrid sort they can use existing categories or create new ones. The method does not produce a finished navigation system by itself, but it reveals mental models, ambiguous labels, content that belongs in multiple places, and category schemes worth testing. It is especially useful before redesigning menus, taxonomies, product catalogues, help centres, or intranet structures.

**Problem.** Organisations often structure sites around departments, product lines, or internal terminology, while users arrive with task-based and domain-specific mental models. The result is navigation that makes sense internally but causes outsiders to search, backtrack, or abandon.

**Context.** Use when creating or revising an information architecture, taxonomy, menu, product categorisation, or help structure where the team needs evidence about how target users expect content to be grouped.

## Forces

- User mental models may differ by segment, so aggregate clusters can hide important audience differences.
- Open sorts reveal natural labels, while closed sorts test an existing taxonomy more directly.
- Some content genuinely has multiple homes, forcing design choices about cross-linking, facets, or search.
- Card sorting reveals categories, not whether users can navigate the final structure under task pressure.

## Solution

Choose representative content items, recruit participants from key audiences, and select open, closed, or hybrid sorting based on whether the taxonomy is being discovered or tested. Keep card labels clear but not over-explained, capture groupings and participant labels, and analyse both quantitative clusters and qualitative reasons. Translate findings into candidate IA structures, then validate those structures with tree testing and task-based usability sessions.

## When to use

- A site, app, catalogue, or help centre needs an IA that matches user expectations.
- Existing navigation reflects internal departments or legacy structure rather than user tasks.
- The team must choose labels and groupings before investing in detailed navigation design.

## Heuristics

Rules of thumb for applying this pattern well:

- Sort content users recognise; unknown jargon tests vocabulary confusion, not categorisation.
- Use open sorting to discover groups and closed sorting to test groups.
- Look for disagreement as a design signal; ambiguous items may need cross-links, facets, or clearer labels.
- Validate any resulting structure with tree testing before treating it as navigation.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Helpful when a young product is naming core concepts, though too much taxonomy work can be premature before content breadth exists. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit as content, features, and user segments multiply and informal navigation starts to break down. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for intranets, knowledge bases, and large catalogues, but often needs segmented studies and governance to reconcile competing vocabularies. |

## Examples

### Redesigning a help centre

**❌ Poorer approach**

The company maps help articles to internal teams such as Platform, Growth, and Success because those teams own the content.

**✅ Better approach**

Users sort representative articles into groups such as "billing problems", "setting up my account", and "inviting my team", revealing task language for the new help taxonomy.

*The better approach starts from users' goals and vocabulary, turning the help centre into a path for solving problems rather than a mirror of the org chart.*

### Interpreting mixed results

**❌ Poorer approach**

Because a card appears in three different clusters, the team chooses the largest cluster and removes all other routes to keep the sitemap tidy.

**✅ Better approach**

The team treats disagreement as evidence that the item is cross-cutting, gives it a primary home, and plans related links or facets so users can reach it from multiple plausible paths.

*Ambiguity in card sorting is not a failure of participants; it often reveals where the IA needs redundancy, alternate labels, or faceted navigation.*

## Anti-patterns

- Treating dendrogram clusters as a finished sitemap without design judgement or validation.
- Mixing very different user segments and averaging away meaningful differences in mental models.
- Using vague cards such as "resources" or "tools" that participants cannot interpret consistently.
- Skipping tree testing, so the proposed IA is never checked against real findability tasks.

## Relationships

**Related product / UX patterns**

- [Tree Testing](../ux-patterns/tree-testing.md) — Card sorting suggests candidate categories, while tree testing validates whether users can find specific items within the resulting hierarchy.
- [Faceted Navigation](../ux-patterns/faceted-navigation.md) — When card sorting reveals multiple equally valid ways to group content, faceted navigation can expose those dimensions without forcing one hierarchy.

**Related software patterns**

- [Composite](../patterns/gof-structural/composite.md) — Hierarchical IA structures often map to composite tree structures in implementation, with categories and content nodes composed recursively.
- [Query Object](../patterns/enterprise-application/query-object.md) — Sort findings that reveal filtering dimensions can become query objects or search parameters in the product's navigation model.

**Related philosophies**

- [Human-Centred Design](../philosophies/human-centered-design.md) — Card sorting grounds category design in users' mental models rather than internal assumptions.
- [Design Thinking](../philosophies/design-thinking.md) — The method supports divergent exploration of how people frame the problem space before converging on an IA to prototype and test.

## Tags

- **Tags:** taxonomy, mental-models, information-architecture, categorisation
- **Product stages:** early, growth, enterprise

## References

- Donna Spencer, Card Sorting: Designing Usable Categories, (2009)
- Louis Rosenfeld, Peter Morville, and Jorge Arango, Information Architecture for the World Wide Web, (2015)

