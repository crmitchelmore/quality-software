# Tree Testing

> Test a proposed navigation hierarchy as a plain text tree so teams can measure whether users can find items before visual design and interaction details obscure IA problems.

**Discipline:** UX Design · **Category:** user-research · **Maturity:** established

**Also known as:** Reverse Card Sorting, IA Findability Test

## Description

Tree testing evaluates the findability of an information architecture by presenting participants with a stripped-down hierarchy of labels and asking them where they would go to complete specific tasks. Because the test removes visual design, search, content previews, and page layout, it isolates whether the labels and hierarchy make sense. It is the validation counterpart to card sorting: where card sorting helps discover possible groupings, tree testing checks whether a candidate structure supports realistic retrieval tasks. The method is particularly useful for sitemaps, global navigation, help centres, documentation, product catalogues, and intranets where people must locate information quickly.

**Problem.** Teams often discover IA problems only after a navigation design is visually polished or implemented, making it hard to tell whether failures come from labels, hierarchy, layout, or interaction design.

**Context.** Use once there is a candidate hierarchy to test, especially after card sorting, stakeholder taxonomy work, or a navigation redesign. It can run before wireframes and therefore catches findability issues cheaply.

## Forces

- Removing visual context isolates IA quality, but it may understate cues available in the final interface.
- Task wording must be realistic without repeating the exact navigation labels.
- A hierarchy can perform well overall while failing critical high-value tasks that deserve redesign.
- Users may need multiple paths to cross-cutting content, challenging the desire for a tidy single tree.

## Solution

Build a text-only tree from the proposed IA, write realistic findability tasks that avoid label leakage, and recruit participants from the target audience. Track first choice, final destination, directness, backtracking, success, and confidence. Analyse failures by task and branch to identify misleading labels, misplaced content, missing categories, and over-deep structures. Revise the IA and retest until critical tasks are findable enough to move into interaction design.

## When to use

- A proposed sitemap, menu, taxonomy, or help structure needs validation before design or build.
- Card sorting or stakeholder work has produced candidate categories but not evidence of findability.
- Analytics show search, backtracking, or support issues that may stem from navigation labels or hierarchy.

## Heuristics

Rules of thumb for applying this pattern well:

- Write tasks in the user's vocabulary; do not hide the answer in the wording.
- Watch first click as well as final answer; early wrong turns reveal label and grouping confusion.
- Prioritise critical task failures over a high aggregate score.
- Retest revised trees; IA quality improves through iteration, not one pass.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful when the product already has meaningful content structure, but many early products can learn faster with simpler usability tests. |
| Growth (scaling team & users) | ●●●●● 5/5 | Excellent for redesigning navigation as features and content grow; cheap tests prevent expensive IA mistakes. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for large websites, intranets, documentation, and support portals where findability failures create major productivity and support costs. |

## Examples

### Testing a support taxonomy

**❌ Poorer approach**

The task says, "Find the article under Account Administration about changing your administrator", and most participants succeed because the task repeats the intended category label.

**✅ Better approach**

The task says, "Your teammate is leaving and someone else needs to manage billing and users. Where would you look for how to make that change?"

*The better task tests whether the IA speaks the user's language, not whether participants can match words from the prompt to the tree.*

### Acting on first clicks

**❌ Poorer approach**

Participants eventually find pricing settings after several backtracks, so the team marks the task as successful and keeps the structure.

**✅ Better approach**

The team notes that most first clicks go to Plans rather than Billing, renames and cross-links the area, then retests the critical task.

*Final success can hide expensive wayfinding friction. First-click and path data reveal whether the structure makes sense immediately.*

## Anti-patterns

- Testing tasks that use the same words as the tree labels, inflating success artificially.
- Averaging all tasks together and ignoring failures on the few journeys that matter most.
- Treating the tree as the final UI and rejecting visual cues that could still help in the designed navigation.
- Testing only with internal staff who already know the organisation's structure.

## Relationships

**Related product / UX patterns**

- [Card Sorting](../ux-patterns/card-sorting.md) — Card sorting helps generate the category structure that tree testing later validates against specific findability tasks.
- [First-Click Test](../ux-patterns/first-click-test.md) — Tree testing often analyses first choice in a hierarchy, while first-click tests examine the same commitment within a visual interface.
- [Global Navigation](../ux-patterns/global-navigation.md) — Global navigation structures should usually be tree-tested before they become expensive visual and engineering commitments.

**Related software patterns**

- [Composite](../patterns/gof-structural/composite.md) — A navigation tree is commonly represented as a composite structure of parent and child nodes in the implementation.
- [Routing Slip](../patterns/enterprise-integration/routing-slip.md) — Tree-test paths expose the expected routing through content destinations, analogous to planning the route a request or task follows through a system.

**Related philosophies**

- [Human-Centred Design](../philosophies/human-centered-design.md) — Tree testing evaluates information structures against users' actual expectations and retrieval behaviour rather than stakeholder preference.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Strong tree results support recognition rather than recall and match between the system and the real world.

## Tags

- **Tags:** findability, navigation-testing, taxonomy, information-architecture
- **Product stages:** early, growth, enterprise

## References

- [Jakob Nielsen, Tree Testing: Fast, Iterative Evaluation of Menu Labels and Categories](https://www.nngroup.com/articles/tree-testing/)
- Donna Spencer, A Practical Guide to Information Architecture, (2010)

