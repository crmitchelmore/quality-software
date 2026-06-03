# Snapshot Testing

> Compare rendered or serialized output with a stored snapshot, approving intentional diffs and rejecting accidental changes.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** established

**Also known as:** Serialized Snapshot Test, Jest Snapshot, Visual Snapshot

## Description

Snapshot Testing captures structured output such as a component tree, API response, or rendered document and stores it as the expected result. Future test runs diff against that snapshot. It is a narrow form of Golden Master that works best for small, stable outputs with human-reviewable diffs. Blindly updating snapshots turns the practice into a rubber stamp that protects nothing.

**Problem.** Large structured outputs are awkward to assert field-by-field, but accidental output changes still need review.

**Context.** Use for stable UI components, generated markup, serialized responses, and documents where snapshot diffs are small enough to inspect deliberately.

## Consequences / Trade-offs

- Captures broad output regressions with little assertion code.
- Diffs can be easy to review when snapshots are small and deterministic.
- Mass update workflows and volatile fields make snapshots noisy or meaningless.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Helpful for small components or generated outputs if diffs are reviewed. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful with strict snapshot size and update discipline. |
| Large (>100k LOC) | ●●○○○ 2/5 | Large suites often accumulate noisy snapshots unless ownership and review rules are strong. |

## Examples

### Small reviewed component snapshot

**❌ Negative (javascript)**

```javascript
// After every UI change
// npm test -- --updateSnapshot
// All diffs accepted without reading them
```

**✅ Positive (javascript)**

```javascript
test("renders user card", () => {
  const { container } = render(<UserCard name="Ada" role="admin" />)
  expect(container).toMatchSnapshot()
})
// Review the snapshot diff before committing it.
```

*The positive example keeps the snapshot small and reviewable; the negative workflow rubber-stamps every regression by blindly updating stored output.*

## Relationships

**Synergies**

- [Golden Master (Approval)](../testing/golden-master.md) — Snapshot testing is a focused golden-master variant for serialized output.
- [Page Object](../testing/page-object.md) — Page objects can drive UI state while snapshots verify stable rendered fragments.
- [Test Data Builder](../testing/test-data-builder.md) — Builders create deterministic inputs so snapshots avoid mystery data.

**Conflicts with:** [Property-Based Testing](../testing/property-based-testing.md)

**Alternatives:** [Golden Master (Approval)](../testing/golden-master.md), [Parameterised Test](../testing/parameterised-test.md), [Arrange-Act-Assert](../testing/arrange-act-assert.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, react, vue, angular, nodejs, nextjs
- **Project types:** web-frontend, library, web-api, desktop-app, mobile-app
- **Tags:** approval, snapshots, ui-testing, rubber-stamping

