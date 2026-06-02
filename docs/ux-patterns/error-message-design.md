# Error Message Design

> Explain what went wrong, why it matters, and how to recover in language users can act on immediately.

**Discipline:** UX Design · **Category:** content-design · **Maturity:** time-tested

**Also known as:** Helpful Error Messages, Recovery Copy

## Description

Error message design treats errors as recovery moments, not blame moments. A good error message is specific, local to the problem where possible, calm in tone, and paired with a next step the user can take. It distinguishes validation problems the user can fix, system failures they cannot fix, permission limits, connectivity issues, and irreversible constraints. The goal is not merely to report failure but to keep the user oriented and able to continue. Strong error messages require collaboration between content, design, and engineering because useful copy depends on accurate error classification and data.

**Problem.** Generic, technical, or blaming errors leave users stuck: they do not know whether their work is saved, what caused the failure, or what they should do next.

**Context.** Applies to forms, authentication, payments, uploads, integrations, destructive actions, network failures, and any point where the product cannot complete the user's intended action.

## Forces

- Specificity helps recovery, but exposing internal details can confuse users or create security risk.
- Local errors are easier to fix, while global failures need reassurance about state and next steps.
- Engineering error codes are precise for systems but rarely meaningful for people.

## Solution

Classify errors by user impact and recovery path, then write messages that state the problem, preserve dignity, and offer the next action. Place field-level messages beside the field, show summaries for multi-error forms, and explain system failures with status and retry guidance. Preserve user input, include support references only when useful, and keep technical detail in logs rather than primary copy.

## When to use

- Users can fail validation, lose connectivity, lack permission, or hit a service failure.
- Support tickets show that people cannot recover from current errors unaided.
- A flow has high stakes, such as payment, healthcare, finance, or identity.

## Heuristics

Rules of thumb for applying this pattern well:

- Say what happened, where it happened, and what the user can do next.
- Preserve user input unless keeping it would be unsafe.
- Use technical codes as support aids, not as the message.
- Match placement to fix location: field errors near fields, system errors near system state.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●●● 5/5 | High leverage and relatively cheap; helpful errors reduce abandonment and support even in a young product. |
| Growth (scaling team & users) | ●●●●● 5/5 | Essential as more flows, integrations, and edge cases create more opportunities for failure. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Critical for trust, compliance, support deflection, and operational clarity in high-stakes systems. |

## Examples

### Payment failure

**❌ Poorer approach**

A checkout page shows "Error 402" in a red banner and clears the form, forcing the user to re-enter billing details without knowing what failed.

**✅ Better approach**

The page keeps the entered details and says "Your bank declined this card. Try another card or contact your bank. You have not been charged.".

*The better message explains the source, reassures about money, and provides realistic next steps.*

### Form validation

**❌ Poorer approach**

On submit, a profile form jumps to the top and says "Invalid input" while several fields remain visually unchanged.

**✅ Better approach**

The form summary says "Fix 3 fields to save your profile" and each field explains its specific issue beside the input.

*Users need both a global summary and local guidance so they can find and correct every problem.*

## Anti-patterns

- Displaying raw exception text, stack traces, or backend codes as the main user message.
- Saying "Something went wrong" without explaining whether retrying is useful.
- Blaming the user with hostile phrasing such as "You entered an invalid value" when the rule was unclear.

## Relationships

**Related product / UX patterns**

- [Inline Validation](../ux-patterns/inline-validation.md) — Inline validation depends on clear, local error messages that help users correct input before submission.
- [Microcopy](../ux-patterns/microcopy.md) — Error messages are specialised microcopy where clarity, tone, and actionability are especially important.
- [System Status Visibility](../ux-patterns/system-status-visibility.md) — Users need to know whether a failure is local, temporary, saved, retrying, or complete.

**Related software patterns**

- [Problem Details (RFC 7807 Errors)](../patterns/api-design/problem-details.md) — Problem Details provides structured machine-readable error information that can drive consistent user-facing messages.
- [Input Validation (Allow-List)](../patterns/security/input-validation.md) — Validation logic and error-message design must agree so constraints are explained at the point of correction.
- [Either / Result](../patterns/functional/either-result.md) — Explicit success-or-error return types help teams handle recoverable failures deliberately instead of falling through to generic errors.

**Related philosophies**

- [Nielsen's Usability Heuristics](../philosophies/nielsen-usability-heuristics.md) — Nielsen explicitly calls for error messages in plain language that precisely indicate the problem and suggest a solution.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — Norman's error-recovery stance frames errors as design responsibilities rather than user failures.

## Tags

- **Tags:** errors, recovery, ux-writing, forms
- **Product stages:** early, growth, enterprise

## References

- [Jakob Nielsen, Error Message Guidelines (Nielsen Norman Group)](https://www.nngroup.com/articles/error-message-guidelines/)
- Torrey Podmajersky, Strategic Writing for UX, (2019)

