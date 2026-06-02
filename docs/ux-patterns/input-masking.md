# Input Masking

> Guide structured data entry by showing and applying the expected format as the user types, reducing formatting errors without fighting natural input.

**Discipline:** UX Design · **Category:** forms-input · **Maturity:** established

## Description

Input masking constrains or formats an input into a known pattern such as a phone number, credit-card number, date, postcode, currency amount, or serial code. A mask can show placeholders, insert separators, group characters, or restrict impossible characters so users understand the required shape of the value. Done well, it reduces ambiguity and makes review easier. Done badly, it traps users in one locale, blocks copy-paste, confuses screen readers, or rejects valid values that do not match the designer's narrow example. The pattern should assist entry, not turn the field into a puzzle.

**Problem.** Structured values are easy to mistype or format inconsistently, leading to validation errors and support costs. But rigid masks can reject legitimate formats and make correction harder than free text.

**Context.** Best for values with stable, predictable structure and visible grouping benefits: payment cards, short codes, dates in a fixed business context, currency, and national identifiers where format is known.

## Forces

- Format guidance reduces errors, but over-constraining the field can exclude valid international or assistive-technology input.
- Automatic separators improve readability, but cursor movement and deletion must remain predictable.
- Business systems may require canonical storage, while users need flexible, forgiving entry.

## Solution

Use masks only where the accepted structure is well understood. Show the expected format before entry, allow paste and deletion naturally, and normalise the value behind the scenes rather than forcing users to type separators. Prefer forgiving parsing for variable international formats, and test with keyboard, mobile, screen-reader, and copy-paste workflows.

## When to use

- The field has a stable, finite format and grouping helps users check accuracy.
- Incorrect formatting is a common cause of failed submission.
- You can support expected locales and input methods without blocking legitimate values.

## Heuristics

Rules of thumb for applying this pattern well:

- Mask for readability, but store a clean canonical value separately.
- Allow users to paste, delete, and edit in the middle without surprising caret jumps.
- Prefer examples and forgiving parsing when a format varies by country or organisation.
- Test masks with assistive technology before treating them as harmless polish.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●●○○ 3/5 | Useful for obvious structured inputs, but early teams should avoid elaborate masks before they know their audience and locales. |
| Growth (scaling team & users) | ●●●●○ 4/5 | More valuable as scale exposes formatting errors, mobile usage, and internationalisation needs. |
| Enterprise (mature org / regulated) | ●●●●○ 4/5 | Important for high-volume operational forms, though enterprise data diversity makes overly rigid masks risky. |

## Examples

### Credit-card number

**❌ Poorer approach**

The card field requires users to type spaces manually and rejects the entry if they paste a continuous sixteen-digit number.

**✅ Better approach**

The field accepts pasted digits, groups them visually as the user types, and sends only the canonical digits to the payment processor.

*The better version helps visual review without making the formatting itself part of the user's task.*

### International phone number

**❌ Poorer approach**

A global signup form uses a fixed United States phone mask, so users with different country codes or number lengths cannot enter valid numbers.

**✅ Better approach**

The form asks for country first, adapts guidance to that country where possible, and otherwise accepts a broad international number with clear example text.

*Masks are useful only when the domain shape is known; for variable data, forgiving input is more inclusive than rigid control.*

## Anti-patterns

- Forcing a single national phone-number mask on an international product.
- Preventing paste into password, one-time-code, or card fields in the name of security.
- Moving the caret unpredictably when the user edits the middle of a masked value.

## Relationships

**Related product / UX patterns**

- [Inline Validation](../ux-patterns/inline-validation.md) — Masks guide entry before validation, while inline validation explains remaining problems after the user has entered a value.
- [Microcopy](../ux-patterns/microcopy.md) — Example text and field hints often communicate expected format more safely than a rigid mask.

**Related software patterns**

- [Input Validation (Allow-List)](../patterns/security/input-validation.md) — The mask should align with the validation and normalisation rules that decide whether submitted data is acceptable.
- [Canonical Data Model](../patterns/enterprise-integration/canonical-data-model.md) — User-friendly formatted entry should be converted into a canonical representation for storage and downstream processing.

**Related philosophies**

- [Inclusive Design](../philosophies/inclusive-design.md) — Inclusive design cautions against assuming one locale, device, or input method is universal.
- [The Design of Everyday Things](../philosophies/design-of-everyday-things.md) — A good mask is a signifier and constraint that makes the correct action easier without creating new errors.

## Tags

- **Tags:** forms, structured-input, localisation, accessibility
- **Product stages:** early, growth, enterprise

## References

- Adam Silver, Form Design Patterns, (2018)
- [Nielsen Norman Group, Input Masks](https://www.nngroup.com/articles/input-masks/)

