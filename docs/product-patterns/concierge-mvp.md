# Concierge MVP

> Deliver the proposed value manually to a small set of customers before automating it, learning whether the outcome is valuable and how the service should work.

**Discipline:** Product Management · **Category:** experimentation · **Maturity:** established

## Description

A Concierge MVP tests a product concept by manually providing the service or result that a future product would automate. Customers know there is human involvement; the team uses that high-touch delivery to learn what customers value, where the workflow breaks, what language they use, and which parts merit automation. The pattern trades scale for depth of learning.

**Problem.** Teams automate a complex workflow before proving that customers value the outcome, understand the process, or will change behaviour enough to use it repeatedly.

**Context.** Best for early-stage products, new workflows, services becoming software, or AI/data products where manual fulfilment can approximate the future value.

## Forces

- Manual delivery creates rich learning but does not prove the economics of automation at scale.
- Customers may value the human service more than the eventual self-serve product.
- The team must be honest about the concierge nature to avoid misleading customers.

## Solution

Select a narrow target segment and manually deliver the promised outcome with clear expectations. Observe every step, measure whether customers return, pay, save time or achieve the desired outcome, and identify which parts are repetitive enough to automate. Stop or pivot if customers do not value the result even with high-touch help.

## When to use

- You can manually simulate the value proposition for a small number of customers.
- The riskiest assumption is desirability or workflow fit, not whether automation is technically possible.
- Deep learning from a few customers is more valuable than broad traffic measurement.

## Metrics

Signals that tell you whether this pattern is working:

- Customer activation, repeat use or retention during concierge delivery.
- Willingness to pay or renewal intent for the manually delivered outcome.
- Time and cost per manual fulfilment, broken down by workflow step.
- Number of product requirements learned from direct service interactions.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Excellent for pre-PMF learning because it substitutes attention and service for premature engineering. |
| Growth (scaling team & users) | ●●●○○ 3/5 | Useful for new product lines or segments, but expensive and hard to scale in core workflows. |
| Enterprise (mature org / regulated) | ●●○○○ 2/5 | Possible in innovation units or pilot programmes, though procurement and service expectations can make the experiment heavy. |

## Examples

### Choosing the experiment

**❌ Poorer approach**

The team treats a weak signal as proof and commits to building the whole feature without a decision threshold or follow-up learning step.

**✅ Better approach**

The team names the riskiest assumption, sets a threshold and guardrail, runs the smallest ethical test, and chooses the next experiment based on the result.

*The better approach keeps experimentation tied to a decision and avoids confusing curiosity, delivery or activity with validated learning.*

### Protecting trust

**❌ Poorer approach**

Users are surprised by an unavailable or manually operated experience in a critical workflow and have no clear explanation or recovery path.

**✅ Better approach**

The test is limited to a safe cohort, explains the state honestly when users engage, and provides a fallback or contact path when the feature is not available.

*Experiment speed must not come at the cost of user trust. Ethical boundaries and guardrails make the learning usable.*

## Anti-patterns

- Hiding human work and presenting the service as fully automated when that affects trust or expectations.
- Scaling manual operations without deciding what evidence will trigger automation or stopping.
- Optimising the concierge service so much that it no longer resembles the intended product economics.

## Relationships

**Related product / UX patterns**

- [Wizard of Oz MVP](../product-patterns/wizard-of-oz-mvp.md) — Both use manual work before automation, but Wizard of Oz hides the manual mechanism while concierge is transparent.
- [Fake Door Test](../product-patterns/fake-door-test.md) — A fake-door signal can identify interested customers to invite into a concierge MVP.

**Related software patterns**

- [Human-in-the-Loop Approval](../patterns/ai-ml/human-in-the-loop.md) — The manual service layer is a deliberate human-in-the-loop substitute for future automation.

**Related philosophies**

- [The Lean Startup](../philosophies/lean-startup.md) — Concierge delivery is a classic Lean Startup MVP for maximising learning with minimal product build.
- [Customer Development](../philosophies/customer-development.md) — The pattern creates direct customer interaction that supports discovery of real problems and buying triggers.

## Tags

- **Tags:** experimentation, mvp, manual-service, learning
- **Product stages:** early

## References

- Eric Ries, The Lean Startup, (2011)
- David J. Bland and Alexander Osterwalder, Testing Business Ideas, (2019)

