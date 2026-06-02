# Microcopy

> Use small pieces of interface text to clarify action, reduce anxiety, prevent mistakes, and guide users at the exact moment they need help.

**Discipline:** UX Design · **Category:** content-design · **Maturity:** established

**Also known as:** Interface Copy, UX Copy

## Description

Microcopy is the short, purposeful text embedded in an interface: button labels, field hints, helper text, empty prompts, error summaries, confirmation messages, tooltips, and permission explanations. It is not decorative wording; it is part of the interaction design. Good microcopy answers the user's immediate question in plain language, sets expectations about what will happen, and removes ambiguity around risk, privacy, cost, or next steps. Because it appears at moments of action, small wording choices can have outsized effects on trust and completion.

**Problem.** Users hesitate, misinterpret controls, or make avoidable errors when interface text is vague, internally worded, overly clever, or missing at the decision point.

**Context.** Applies across forms, onboarding, payments, permissions, destructive actions, search, empty states, settings, and any interface where a few words shape confidence and comprehension.

## Forces

- Brevity is necessary in UI, but too little context can make decisions ambiguous.
- Brand voice can create warmth, but cleverness can obscure meaning at critical moments.
- Helpful text near every control can become clutter unless prioritised by user uncertainty.

## Solution

Write microcopy from the user's task and question, not from the system's implementation. Use specific verbs, concrete nouns, and plain language. Put guidance where the decision happens, explain consequences before commitment, and reserve personality for low-stakes moments. Test copy in prototypes and production support loops, especially where users abandon, ask for help, or make errors.

## When to use

- A user must decide what an action does, what information to enter, or whether a consequence is safe.
- Support questions or usability tests show confusion around a label, state, or requirement.
- The product needs to build trust around permissions, payments, data use, or destructive actions.

## Heuristics

Rules of thumb for applying this pattern well:

- Answer the user's next question in the fewest clear words.
- Use specific action labels: say what will happen, not merely that something will happen.
- Put help before the error when a requirement is predictable.
- Let brand voice support clarity, never compete with it.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | Cheap, fast, and high leverage for shaping trust and comprehension before heavier design investment is possible. |
| Growth (scaling team & users) | ●●●●● 5/5 | Essential as flows multiply and inconsistent labels start to create measurable friction. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Still critical, though governance, localisation, and legal review can make iteration slower. |

## Examples

### Button label

**❌ Poorer approach**

A billing screen ends with a primary button labelled "Submit", leaving users unsure whether they are saving a draft, starting a trial, or charging a card.

**✅ Better approach**

The button says "Start paid plan" and supporting text states "Your card will be charged today".

*The better copy makes the consequence explicit at the moment of commitment, reducing anxiety and surprise.*

### Field helper text

**❌ Poorer approach**

A password field waits until submission to say the password is invalid, without stating the rule.

**✅ Better approach**

Helper text under the field says "Use at least 12 characters" before entry and updates as the user types.

*Predictable requirements belong before or during input so users can succeed without trial and error.*

## Anti-patterns

- Using witty or branded language where users need clarity about risk or recovery.
- Labelling buttons with generic verbs such as "Submit" when the outcome is more specific.
- Explaining a validation rule only after the user violates it.

## Relationships

**Related product / UX patterns**

- [Error Message Design](../ux-patterns/error-message-design.md) — Error messages are a high-stakes form of microcopy with specific recovery requirements.
- [Plain Language](../ux-patterns/plain-language.md) — Plain-language practice keeps short interface text understandable under time pressure.
- [Permission Priming](../ux-patterns/permission-priming.md) — Permission prompts depend on concise copy that explains value and data use before the system dialogue appears.

**Related software patterns**

- [Problem Details (RFC 7807 Errors)](../patterns/api-design/problem-details.md) — Structured error payloads give microcopy reliable fields for human-readable explanations and recovery actions.
- [Input Validation (Allow-List)](../patterns/security/input-validation.md) — Validation rules need clear helper and error copy so constraints become understandable to users.

**Related philosophies**

- [Don't Make Me Think](../philosophies/dont-make-me-think.md) — Microcopy reduces cognitive effort by making actions and consequences self-evident.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Text often acts as the signifier that makes an affordance understandable.

## Tags

- **Tags:** ux-writing, clarity, forms, trust
- **Product stages:** early, growth, enterprise

## References

- Kinneret Yifrah, Microcopy: The Complete Guide, (2017)
- Torrey Podmajersky, Strategic Writing for UX, (2019)

