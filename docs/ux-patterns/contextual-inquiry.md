# Contextual Inquiry

> Study people in the environment where their work happens, combining observation and interview to reveal workflows, artefacts, constraints, and tacit knowledge that lab research misses.

**Discipline:** UX Design · **Category:** user-research · **Maturity:** time-tested

**Also known as:** Contextual Interview, Field Study Interview

## Description

Contextual inquiry is a field research method in which the researcher observes and interviews users in the real context where they perform the activity being studied. Rather than asking people to describe work from memory, the researcher watches the work unfold, asks clarifying questions at natural pauses, and examines the artefacts, tools, interruptions, handoffs, and environmental constraints that shape the experience. Its classic stance is apprenticeship: the participant is the expert in their practice and the researcher learns from them. The method is especially powerful for enterprise, healthcare, operational, and service settings where the official process differs from the workaround-rich reality.

**Problem.** Interviews and workshops often capture what people think they do, what policy says they should do, or what they remember after the fact. They miss tacit routines, interruptions, physical artefacts, social dependencies, and workarounds that determine whether a design will actually fit the environment.

**Context.** Best used when workflows are complex, situated, collaborative, physical, regulated, or poorly understood by the team. It is less suitable when the behaviour is rare, private, unsafe to observe, or when access to the real environment is impossible.

## Forces

- Observing real work yields rich truth, but access, consent, and confidentiality can be difficult.
- Researchers must ask enough questions to understand intent without disrupting the natural flow.
- The field context reveals exceptions and workarounds, yet synthesis can become messy without a clear focus.
- Participants may perform differently when watched, so trust and repeated observation improve fidelity.

## Solution

Define the workflow or decision area to understand, obtain consent from participants and any affected workplace stakeholders, then observe the activity in context. Use an apprenticeship stance: ask the user to show their work, probe artefacts and handoffs, and capture sequence, tools, breakdowns, and environmental factors. Synthesize findings into workflow models, journey maps, opportunity statements, and design constraints that the team can carry into ideation and testing.

## When to use

- The team is designing for specialised work it does not deeply understand.
- Users rely on spreadsheets, sticky notes, shadow systems, or other workarounds around the current product.
- The physical, social, or organisational environment strongly affects the experience.

## Heuristics

Rules of thumb for applying this pattern well:

- Go where the work happens; if the context matters, a remembered account is not enough.
- Ask users to show, not tell, and probe artefacts that carry hidden process knowledge.
- Distinguish official workflow, actual workflow, and workaround; design for the reality you observed.
- Leave the site with concrete sequences, breakdowns, and constraints rather than only themes.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●○ 4/5 | Extremely valuable when entering a new domain, though access may be hard for a small team and lighter interviews may be faster for low-context consumer problems. |
| Growth (scaling team & users) | ●●●●● 5/5 | Growth teams benefit from seeing how different segments and accounts adapt the product, preventing roadmap decisions based only on vocal stakeholders. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Essential for complex enterprise and regulated workflows where environment, policy, and handoffs are often the design problem. |

## Examples

### Discovering shadow systems

**❌ Poorer approach**

A product team interviews operations managers over video and documents the official approval flow, concluding that a single dashboard status is enough.

**✅ Better approach**

The researcher sits with coordinators during a shift and sees that approvals are tracked in email, a spreadsheet, and a paper checklist because exceptions arrive by phone and must be handed over at shift change.

*The better inquiry reveals the real coordination burden and the artefacts the product must either replace or integrate with; the poor version captures only the formal process.*

### Interrupting the work

**❌ Poorer approach**

The researcher stops the participant after every click to ask why they chose it, turning a time-bound support call into an artificial walkthrough.

**✅ Better approach**

The researcher observes the call, marks moments to revisit, then asks short questions during natural pauses and debriefs the whole sequence afterwards.

*Contextual inquiry needs understanding without destroying the context. Pausing strategically preserves the real rhythm of work while still capturing intent.*

## Anti-patterns

- Conducting a conference-room interview and calling it contextual because the topic is work.
- Treating participants as subjects to inspect rather than experts teaching their practice.
- Ignoring non-digital artefacts, interruptions, and handoffs because they sit outside the product screen.
- Generalising from one site without checking which behaviours are local policy, tool limitations, or broader practice.

## Relationships

**Related product / UX patterns**

- [Customer Journey Map](../ux-patterns/customer-journey-map.md) — Contextual inquiry provides the observed evidence needed to build journey maps that reflect real touchpoints, backstage work, and pain points.
- [Service Blueprint](../ux-patterns/service-blueprint.md) — Field observation exposes the frontstage and backstage handoffs that a service blueprint must make visible.

**Related software patterns**

- [Ubiquitous Language](../patterns/ddd-strategic/ubiquitous-language.md) — Observing practitioners in context helps teams adopt the domain language people actually use rather than imposing product terminology.
- [Bounded Context](../patterns/ddd-strategic/bounded-context.md) — Contextual inquiry often reveals where different teams use the same words differently, informing bounded contexts and model boundaries.

**Related philosophies**

- [Human-Centred Design](../philosophies/human-centered-design.md) — The method is a direct human-centred practice because it grounds design decisions in people's lived environment and constraints.
- [Design Thinking](../philosophies/design-thinking.md) — Contextual inquiry strengthens the empathise and define phases of design thinking with first-hand evidence rather than workshop speculation.

## Tags

- **Tags:** field-research, workflow, observation, tacit-knowledge
- **Product stages:** early, growth, enterprise

## References

- Hugh Beyer and Karen Holtzblatt, Contextual Design, (1998)
- Karen Holtzblatt, Jessamyn Burns Wendell, and Shelley Wood, Rapid Contextual Design, (2004)

