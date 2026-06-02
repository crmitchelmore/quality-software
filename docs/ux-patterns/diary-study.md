# Diary Study

> Ask participants to record experiences as they happen over days or weeks so teams can understand longitudinal behaviour, context, triggers, and emotions that a single session cannot reveal.

**Discipline:** UX Design · **Category:** user-research · **Maturity:** established

**Also known as:** Experience Sampling Diary, Longitudinal User Diary

## Description

A diary study is a longitudinal research method in which participants capture entries about an activity, product, or experience over a defined period. Entries may be text, photos, screen recordings, voice notes, ratings, or prompted check-ins. The method reveals patterns that unfold across time: first-use learning, repeated pain points, workarounds, habit formation, drop-off, environmental triggers, and moments of delight or frustration. Because the researcher is not present for every event, the design challenge is to keep prompts light, timely, and specific enough that participants report real moments rather than vague summaries after the fact.

**Problem.** Many user experiences are episodic, habitual, emotional, or context-dependent. A one-hour interview or usability session compresses them into memory and misses how behaviour changes across days, situations, and repeated exposure.

**Context.** Best for studying routines, onboarding over time, cross-channel journeys, intermittent tasks, mobile use in changing environments, or products where value emerges only after repeated use.

## Forces

- Longitudinal truth competes with participant burden; too many prompts reduce compliance and data quality.
- Self-reported entries capture context and emotion, but they can be incomplete or biased by memory.
- Rich multimedia entries are valuable, yet privacy and consent must be handled carefully.
- The study must be long enough to catch meaningful variation without becoming fatigue-driven noise.

## Solution

Define the behaviours or moments to capture, choose a study length matched to the activity's natural rhythm, and recruit participants who will realistically encounter those moments. Provide simple prompts, examples, and lightweight tools for in-the-moment recording. Monitor participation, nudge gently when needed, and run a closing interview to clarify entries. Synthesize by timelines, triggers, recurring contexts, emotional arcs, unmet needs, and design opportunities.

## When to use

- The key behaviour occurs over time rather than in a single contained task.
- The team needs to understand context, emotion, or triggers at the moment they occur.
- A product's onboarding, retention, or habit loop is poorly understood.

## Heuristics

Rules of thumb for applying this pattern well:

- Prompt at the moment of use where possible; fresh context beats polished recall.
- Keep each entry small enough that completion feels easier than skipping.
- Design the closing interview into the study; diaries show what happened, debriefs explain why.
- Analyse sequences and triggers, not just isolated quotes.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for habit and onboarding questions, but heavier than interviews or usability tests when a young team still needs fast directional learning. |
| Growth (scaling team & users) | ●●●●● 5/5 | Strong fit for scaling products trying to understand activation, retention, and real-life usage across segments and contexts. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Valuable for complex workflows and service journeys, though privacy review, participant management, and analysis effort increase substantially. |

## Examples

### Studying onboarding

**❌ Poorer approach**

The team interviews new users after two weeks and asks them to remember what was confusing during sign-up, receiving only broad comments such as "it was fine" or "I got stuck somewhere".

**✅ Better approach**

New users receive three short prompts during their first week: after initial setup, after their first real task, and after their first failed or abandoned attempt, followed by a debrief interview.

*The diary captures confusion and context while they are fresh, and the debrief connects those moments into an onboarding journey the team can redesign.*

### Managing participant burden

**❌ Poorer approach**

Participants must complete a 20-question form every evening for a month, so entries become sparse, repetitive, and retrospective.

**✅ Better approach**

Participants submit a quick photo or note when the relevant event occurs, with two required fields and optional detail, over ten days matched to the behaviour's natural cadence.

*Lower effort and event-based capture produce more reliable data than an ambitious diary that people cannot sustain.*

## Anti-patterns

- Asking participants to write long daily essays, causing fatigue and shallow end-of-day summaries.
- Running a diary study when a quick usability test would answer the question faster.
- Ignoring missing entries instead of using reminders, follow-up interviews, or analysis boundaries.
- Collecting sensitive screenshots or photos without explicit consent and data handling rules.

## Relationships

**Related product / UX patterns**

- [Customer Journey Map](../ux-patterns/customer-journey-map.md) — Diary studies provide longitudinal evidence for journey maps, especially emotional arcs and delayed pain points between touchpoints.
- [Cohort Analysis](../product-patterns/cohort-analysis.md) — Diary evidence can explain the behaviours behind cohort retention or drop-off patterns seen in analytics.

**Related software patterns**

- [Audit Logging](../patterns/security/audit-logging.md) — Product event logs can complement diary entries by showing what happened automatically while diaries explain the participant's context and interpretation.
- [Event Sourcing](../patterns/architecture/event-sourcing.md) — Thinking in timelines of meaningful events mirrors diary analysis, where the sequence of user events is more revealing than a single final state.

**Related philosophies**

- [Continuous Discovery](../philosophies/continuous-discovery.md) — Diary studies add longitudinal evidence to continuous discovery when repeated behaviour cannot be understood through interviews alone.
- [Human-Centred Design](../philosophies/human-centered-design.md) — The method keeps design grounded in people's real contexts, emotions, and constraints over time.

## Tags

- **Tags:** longitudinal-research, experience-sampling, behaviour-over-time, onboarding
- **Product stages:** early, growth, enterprise

## References

- [Kim Flaherty, Diary Studies: Understanding Long-Term User Behavior and Experiences](https://www.nngroup.com/articles/diary-studies/)
- Bella Martin and Bruce Hanington, Universal Methods of Design, (2012)

