# Opportunity Solution Tree

> Map a desired outcome to the customer opportunities that could move it, and only then to candidate solutions, so discovery stays anchored to needs rather than jumping straight to features.

**Discipline:** Product Management · **Category:** customer-discovery · **Maturity:** established

**Also known as:** OST

## Description

An Opportunity Solution Tree is a visual structure that connects a single target outcome (at the root) to the customer opportunities — needs, pains and desires surfaced in research — that could influence it, then to the solutions that might address each opportunity, and finally to the experiments that test those solutions. Its purpose is to make a team's thinking explicit and to keep the problem space and solution space distinct. By forcing every proposed solution to hang off a named opportunity which in turn ladders up to the outcome, it resists the common failure of teams generating feature ideas with no traceable link to a real customer need or a business result.

**Problem.** Teams jump from a vague goal straight to a backlog of features, with no shared view of which customer needs those features serve or whether addressing them would actually move the outcome. Prioritisation becomes a contest of opinions and pet ideas.

**Context.** Used by empowered product teams doing continuous discovery, typically alongside regular customer interviews that feed new opportunities into the tree.

## Forces

- Breadth of opportunities competes with depth — too many and the tree is noise, too few and you bias early.
- Stakeholders push favourite solutions; the tree must hold the line that solutions serve opportunities.
- Outcomes must be framed as behaviour change the team can influence, not vanity targets.

## Solution

Anchor the root in one clear, measurable outcome. Populate the opportunity layer only from real research evidence, phrased as customer needs in the customer's words, and group/size them. Branch candidate solutions under specific opportunities, then attach assumption tests under solutions. Revisit the tree continuously as interviews surface new opportunities, and prioritise by which opportunity, if addressed, would most move the outcome.

## When to use

- A team owns an outcome and needs to decide where to focus discovery effort.
- Stakeholders keep proposing solutions and you need a shared way to evaluate them against needs.
- You run continuous customer interviews and need somewhere to organise what you learn.

## Metrics

Signals that tell you whether this pattern is working:

- Movement of the root outcome metric over discovery cycles.
- Share of shipped work traceable to a named opportunity on the tree.
- Number of opportunities sized from primary research vs assumed.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Excellent for keeping a young team honest about serving needs, though with few customers the opportunity set is thin and changes fast. |
| Growth (scaling team & users) | ●●●●● 5/5 | Ideal at growth stage: enough research signal to populate a rich tree and enough competing ideas to need disciplined, outcome-anchored prioritisation. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable per team, but at enterprise scale trees must be federated across many teams and reconciled with portfolio-level outcomes, which adds coordination overhead. |

## Examples

### Opportunities vs solutions

**❌ Poorer approach**

Under the outcome "increase weekly active users" the team lists "add dark mode", "build a mobile app" and "send more emails" as the branches.

**✅ Better approach**

Under the same outcome the opportunity branches read "I lose my place when I come back", "I forget the product exists between visits" and "the app is hard to use at night" — each drawn from interview quotes. Solutions like dark mode then hang under the relevant need.

*The poor version skips the problem space and commits to features no one has tied to a need. The better version keeps opportunities as needs, so solutions can be compared on how well they serve them.*

### Choosing where to focus

**❌ Poorer approach**

The team tackles the opportunity with the most internal excitement and builds three solutions for it.

**✅ Better approach**

The team assesses each opportunity on how many customers feel it, how intensely, and how much addressing it would move the outcome, then targets the highest-leverage one.

*A tree is only useful if it drives prioritisation by impact on the outcome rather than by enthusiasm; the structure makes that comparison visible.*

## Anti-patterns

- Filling the opportunity layer with solutions in disguise ("needs a dashboard") rather than needs.
- Building the tree once and never updating it as research continues.
- Rooting the tree in an output ("ship feature X") instead of an outcome.

## Relationships

**Related product / UX patterns**

- [Feature-Flag Experimentation](../product-patterns/feature-flag-experimentation.md) — Solutions hung off the tree graduate into flag-gated experiments, where each assumption test is run as a controlled experiment against the outcome metric.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — The tree's experiment layer is where Lean Startup's validated-learning loop attaches to specific solution bets.

## Tags

- **Tags:** discovery, prioritization, outcomes, visual-thinking
- **Product stages:** early, growth

## References

- Teresa Torres, Continuous Discovery Habits, (2021)
- [Teresa Torres, Opportunity Solution Trees (Product Talk)](https://www.producttalk.org/opportunity-solution-tree/)

