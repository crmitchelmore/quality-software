# Problem Statement Framing

> Write a clear, evidence-backed problem statement that names the affected customer, context, pain, consequence and desired outcome before exploring solutions.

**Discipline:** Product Management · **Category:** problem-framing · **Maturity:** established

**Also known as:** Product Problem Statement

## Description

Problem Statement Framing converts discovery evidence into a shared definition of the problem worth solving. A strong statement identifies who experiences the problem, when it occurs, what makes it painful, why it matters, and how success would be recognised. It deliberately avoids prescribing the solution. The pattern gives teams a stable reference point for ideation, prioritisation and experiment design.

**Problem.** Teams begin with solution ideas or vague complaints, so stakeholders disagree about what is actually wrong and whether proposed features solve it.

**Context.** Use after initial discovery, before ideation, during strategy reviews, or whenever a team needs to align around a problem rather than a feature request.

## Forces

- Specificity improves actionability but can exclude adjacent opportunities if framed too narrowly.
- Stakeholders may smuggle solutions into the problem statement.
- Evidence must cover consequence and frequency, not just customer frustration.

## Solution

Synthesise evidence into a concise statement: customer or segment, situation, problem, consequence and outcome. Add supporting evidence and constraints separately. Review it with stakeholders and customers where possible, then use it to evaluate ideas: a solution is relevant only if it addresses the stated problem and moves the desired outcome.

## When to use

- A feature request needs to be reframed as the underlying customer or business problem.
- Discovery evidence is scattered and the team needs a common problem definition.
- Ideation is starting and you want to keep solutions anchored.

## Metrics

Signals that tell you whether this pattern is working:

- Percentage of solution ideas explicitly mapped to the problem statement.
- Stakeholder agreement on problem clarity before and after framing.
- Outcome metric movement for solutions selected against the framed problem.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Essential for avoiding premature solution commitment when evidence is still forming. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong for aligning cross-functional teams around opportunities rather than stakeholder feature requests. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable for governance and investment decisions, though statements must avoid bureaucratic templates. |

## Examples

### Solution disguised as problem

**❌ Poorer approach**

"Users need an export button on the orders page."

**✅ Better approach**

"Operations managers cannot reconcile shipped orders with finance records at month-end, causing manual spreadsheet work and delayed invoicing."

*The poor version prescribes an interface element. The better version names the user, situation, pain and consequence while leaving multiple solutions possible.*

### Consequence matters

**❌ Poorer approach**

"Customers find onboarding confusing."

**✅ Better approach**

"New administrators abandon onboarding when permissions setup requires security knowledge they lack, delaying team activation by several days."

*Consequence and context make a problem prioritiseable and testable.*

## Anti-patterns

- Writing "the problem is we need a dashboard".
- Framing the problem so broadly that every idea appears relevant.
- Omitting the consequence, making the problem impossible to prioritise.

## Relationships

**Related product / UX patterns**

- [How Might We Framing](../product-patterns/how-might-we.md) — A good problem statement can be transformed into focused How Might We prompts for ideation.
- [Opportunity Solution Tree](../product-patterns/opportunity-solution-tree.md) — Problem statements often become opportunity nodes that connect needs to solutions and experiments.

**Related software patterns**

- [Problem Details (RFC 7807 Errors)](../patterns/api-design/problem-details.md) — Both patterns make problems explicit and structured so downstream responses are clearer and less ad hoc.

**Related philosophies**

- [Design Thinking](../philosophies/design-thinking.md) — Design thinking emphasises defining the problem before ideating solutions.
- [Outcome Over Output](../philosophies/outcome-over-output.md) — The statement focuses teams on solving a problem rather than shipping a requested output.

## Tags

- **Tags:** problem-framing, discovery, alignment, outcomes
- **Product stages:** early, growth, enterprise

## References

- Jake Knapp, John Zeratsky and Braden Kowitz, Sprint, (2016)

