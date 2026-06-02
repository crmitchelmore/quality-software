# System Usability Scale (SUS)

> Use the ten-item System Usability Scale after representative use to track perceived usability with a lightweight, comparable questionnaire.

**Discipline:** UX Design · **Category:** usability-evaluation · **Maturity:** time-tested

**Also known as:** SUS Questionnaire, System Usability Score

## Description

The System Usability Scale is a ten-item questionnaire developed by John Brooke for measuring perceived usability after users interact with a system. Respondents rate alternating positive and negative statements on a five-point agreement scale, producing a score from 0 to 100. SUS is quick, technology-agnostic, and widely benchmarked, making it useful for comparing releases, products, or design alternatives. It does not diagnose the cause of usability problems; it should be paired with observation, task outcomes, and qualitative feedback to explain why a score changed.

**Problem.** Teams often rely on anecdotes or isolated task success when they need a lightweight, repeatable signal of perceived usability. Without a standard instrument, scores from different studies or releases are hard to compare.

**Context.** Best used after participants complete realistic tasks in a usability study, beta, pilot, or longitudinal product evaluation where perceived ease and confidence matter.

## Forces

- SUS is fast and comparable, but a single number can hide which parts of the experience are broken.
- Benchmarking is helpful, yet domain, user expertise, and task difficulty affect interpretation.
- Repeated measurement shows trends, but survey fatigue and small samples can make changes noisy.
- The questionnaire measures perception after use, not objective performance or accessibility conformance.

## Solution

Administer the standard ten SUS items immediately after representative product use, keeping wording and scale intact so scores remain comparable. Calculate the score consistently, report sample size and context, and interpret results alongside task completion, errors, time, comments, and observed friction. Use SUS to track perceived usability over time or compare alternatives, not as the sole decision criterion.

## When to use

- A team wants a lightweight, standardised usability perception measure after representative use.
- Product or design changes need trend tracking across releases or variants.
- Stakeholders need a comparable usability signal alongside qualitative findings.

## Heuristics

Rules of thumb for applying this pattern well:

- Keep the ten standard items and scoring method unchanged if you want comparability.
- Administer SUS after representative use, not after a concept explanation or marketing demo.
- Pair the score with observed task evidence and user comments to explain what to improve.
- Report context, sample, and trend; a standalone score is easy to overinterpret.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Can help compare prototypes, but small samples and fast-changing scope mean qualitative observation usually matters more. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Useful for tracking perceived usability as flows mature and releases need comparable evidence. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Strong fit for portfolio benchmarking, procurement evidence, and longitudinal UX quality tracking when interpreted responsibly. |

## Examples

### Measuring a redesign

**❌ Poorer approach**

After showing a prototype walkthrough, the team asks three custom satisfaction questions, averages them, and announces that usability is 92 out of 100 compared with SUS benchmarks.

**✅ Better approach**

After participants complete the same key tasks in old and new designs, the team administers the standard SUS, reports sample and task context, and interprets score movement alongside observed errors.

*The better version preserves the instrument's validity and uses SUS for what it can answer: perceived usability after use, not diagnosis by itself.*

## Anti-patterns

- Changing item wording or scale labels, then comparing the result to standard SUS benchmarks.
- Reporting a SUS score without sample size, participant type, task context, or confidence about noise.
- Treating a high score as proof that accessibility, learnability, and task success are all acceptable.
- Asking SUS before users have performed meaningful tasks with the system.

## Relationships

**Related product / UX patterns**

- [Usability Testing Session](../ux-patterns/usability-testing-session.md) — SUS is commonly administered after usability test tasks to add a standard perceived-usability measure.
- [Heuristic Evaluation](../ux-patterns/heuristic-evaluation.md) — Heuristic evaluation can generate fixes, while SUS can track whether perceived usability improves after release.
- [Data Visualization Design](../ux-patterns/data-visualization-design.md) — SUS results need careful visualisation and annotation so stakeholders do not overread small or noisy changes.

**Related software patterns**

- [LLM Evaluation Harness](../patterns/ai-ml/evaluation-harness.md) — SUS acts as a repeatable human-evaluation instrument, analogous to a lightweight evaluation harness for perceived usability.

**Related philosophies**

- [Human-Centred Design](../philosophies/human-centered-design.md) — SUS keeps evaluation grounded in users' reported experience after interacting with the product.
- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — SUS complements heuristic inspection by measuring perceived usability rather than expert-detected violations.

## Tags

- **Tags:** usability, questionnaire, measurement, research
- **Product stages:** growth, enterprise

## References

- John Brooke, SUS: A 'Quick and Dirty' Usability Scale, (1996)
- William Albert and Thomas Tullis, Measuring the User Experience, (2013)
- Jeff Sauro, A Practical Guide to the System Usability Scale, (2011)

