# The Design of Everyday Things

> Design so that the right action is obvious and error is hard: make affordances, signifiers, feedback and mappings carry the user's understanding, and put the difficulty in the world rather than the head.

**Discipline:** ux · **Origin:** Don Norman · *The Design of Everyday Things* · (1988)

**Also known as:** Norman's Principles, Human-Centred Design (Norman)

## Description

Don Norman's philosophy holds that usability failures are design failures, not user failures. When a door is pushed the wrong way or a control is operated incorrectly, the fault lies with an interface that failed to communicate how it works. Good design closes two gaps: the gulf of execution (knowing how to act) and the gulf of evaluation (knowing what happened). It does so through a small set of fundamental principles — affordances and signifiers that suggest possible actions, a good conceptual model the user can reason with, natural mappings between controls and effects, immediate and informative feedback, and constraints that make errors difficult. Norman frames design as human-centred: observe real human capabilities and limitations, and shape the artefact to fit them rather than expecting people to adapt. The later edition adds that good design also anticipates error and helps people recover from it.

**In practice.** Make the available actions and current state visible; choose controls whose layout mirrors their effect; acknowledge every action with prompt feedback; constrain inputs so invalid actions are hard; and design the error path as carefully as the happy path. Test with real users and treat their confusion as a defect to fix in the design.

## Core tenets

- Usability problems are design problems; do not blame the user for predictable mistakes.
- Make actions discoverable through affordances and explicit signifiers.
- Give a clear conceptual model so users can predict how the system behaves.
- Provide immediate, informative feedback so users know the result of every action.
- Use natural mappings so the relationship between control and effect is obvious.
- Use constraints and good defaults to prevent errors, and design for graceful recovery when they occur.

## Key ideas

- **Affordance and signifier** — An affordance is a possible action an object offers; a signifier is the perceivable cue that tells the user that action is available and how to do it.
- **Gulf of execution and evaluation** — The gaps between a user's intention and the actions allowed, and between the system's state and the user's ability to perceive and interpret it; good design narrows both.
- **Conceptual model** — The mental model a design conveys about how it works, allowing the user to predict the effects of their actions.
- **Mapping** — The correspondence between controls and their effects; natural mappings exploit spatial and cultural analogies so the right action is self-evident.

## Associated practice patterns

Product / UX patterns that embody or operationalise this philosophy:

- [Optimistic UI Feedback](../ux-patterns/optimistic-ui-feedback.md) — Immediate, visible response to action directly applies Norman's feedback principle and narrows the gulf of evaluation.
- [Progressive Disclosure](../ux-patterns/progressive-disclosure.md) — Managing visible complexity so the right action stays obvious operationalises Norman's emphasis on discoverability and a clear conceptual model.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Apple human interface guidelines and consumer software | Norman's principles (affordances, feedback, mappings, constraints) became foundational vocabulary in mainstream interface design guidelines. | secondary source | The Design of Everyday Things, revised edition |
| Don Norman's tenure leading user experience at Apple | Norman coined the term "user experience" while applying human-centred principles to product design at Apple. | primary source | The Design of Everyday Things, revised edition |
| Usability and HCI education | The book is a standard text underpinning decades of usability practice, heuristic evaluation, and human-centred design curricula. | secondary source | The Design of Everyday Things |

**Best for:** consumer-products, physical-and-digital-interfaces, any-user-facing-system

## Relationships with other philosophies

**Complements:** [A Philosophy of Software Design](a-philosophy-of-software-design.md)

**In tension with**

- [Worse Is Better](worse-is-better.md) — Norman's insistence on getting the human-facing model and feedback right can conflict with a worse-is-better preference for shipping simpler, less polished interfaces sooner.

## Criticisms / limits

- The principles describe what good design achieves but offer less prescriptive method for getting there.
- Originating in physical product design, some examples need translation to dynamic, software-only contexts.
- Universal "obviousness" is harder where users, cultures, and accessibility needs differ widely.

## References

- Don Norman, The Design of Everyday Things, (1988)
- Don Norman, The Design of Everyday Things, revised and expanded edition, (2013)
- Don Norman, Emotional Design, (2004)

