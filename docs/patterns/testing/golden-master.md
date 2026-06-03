# Golden Master (Approval)

> Capture the current output of complex behaviour as an approved reference, then fail future tests when output changes unexpectedly.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** established

**Also known as:** Approval testing, Snapshot testing

## Description

Golden Master testing records representative outputs from a system and compares later runs to those approved artefacts. It is valuable for legacy refactoring, rendering, report generation, compilers, and transformations where specifying every assertion by hand is expensive. The pattern must be used deliberately: approvals should be reviewed like code, inputs should be stable and meaningful, and volatile fields must be normalised to avoid noisy failures.

**Problem.** Complex existing behaviour needs regression protection before it can be safely refactored, but precise assertions are too costly or incomplete.

**Context.** Use for deterministic output-heavy code such as generated documents, serialisation, render trees, search rankings, or legacy calculations.

## Consequences / Trade-offs

- Provides broad regression coverage quickly for legacy or complex outputs.
- Makes intentional output changes explicit through approval review.
- Can bless bugs and create noisy diffs if inputs are poor or volatile data is not normalised.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational: excellent for output-heavy code, unnecessary for straightforward functions. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong for legacy refactors and generated artefacts if approvals are reviewed carefully. |
| Large (>100k LOC) | ●●●●○ 4/5 | Very useful for large legacy systems, but needs governance to avoid mass-approving meaningless snapshots. |

## Examples

### Invoice approval

**❌ Negative (javascript)**

```javascript
test("renders invoice", () => {
  const html = renderInvoice(invoice);
  expect(html).toContain("Total: £42.00");
  expect(html).toContain("Ada Lovelace");
  // dozens of layout and tax details are unprotected
});
```

**✅ Positive (javascript)**

```javascript
test("renders invoice", () => {
  const invoice = anInvoice().withVatRate(0.2).build();
  const html = normaliseDynamicIds(renderInvoice(invoice));

  expect(html).toMatchApprovedSnapshot("invoice-with-vat.html");
});
```

*The positive approval protects the whole rendered artefact, while normalisation removes volatile values. Reviewers can inspect the output diff when rendering changes intentionally.*

## Relationships

**Synergies**

- [Object Mother](../testing/object-mother.md) — Stable named fixtures make approved outputs reproducible and meaningful.
- [Test Data Builder](../testing/test-data-builder.md) — Builders generate focused input variations for approval cases.
- [Pure Function](../functional/pure-function.md) — Pure deterministic functions are ideal targets because identical inputs produce identical approvals.

**Alternatives:** [Property-Based Testing](../testing/property-based-testing.md), [Arrange-Act-Assert](../testing/arrange-act-assert.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, data-pipeline, cli-tool
- **Tags:** approval-testing, legacy-code, snapshots

