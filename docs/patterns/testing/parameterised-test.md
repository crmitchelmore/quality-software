# Parameterised Test

> Run one test body over many named data rows so variants of the same behaviour are visible and cheap to extend.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** Table-Driven Test, Data-Driven Test, Parameterized Test

## Description

Parameterised tests separate the case table from the test mechanics. Each row supplies inputs and expected outcomes for the same behavioural rule, making boundaries, equivalence classes, and regression cases obvious. They are best when all rows assert the same contract; mixing unrelated behaviours into one table creates a new kind of eager test.

**Problem.** Copy-pasted tests differ only by data, making the case space hard to review and expensive to maintain.

**Context.** Use when multiple examples exercise the same behaviour, especially boundary values, business tiers, parsers, and validation rules.

## Consequences / Trade-offs

- Shows the case matrix in one place and makes new variants cheap to add.
- Reduces duplicated arrange/act/assert mechanics.
- Poorly named rows or mixed behaviours can make failures vague and tables hard to read.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent low-cost pattern for removing copy-paste tests. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Scales well across validation and business-rule suites. |
| Large (>100k LOC) | ●●●●○ 4/5 | Very useful, provided rows are named and tables are not allowed to combine unrelated behaviours. |

## Examples

### Discount tiers as rows

**❌ Negative (python)**

```python
def test_standard(): assert discount(100, "standard") == 100
def test_gold(): assert discount(100, "gold") == 90
def test_platinum(): assert discount(100, "platinum") == 80
```

**✅ Positive (python)**

```python
@pytest.mark.parametrize("price,tier,expected", [
    (100, "standard", 100),
    (100, "gold", 90),
    (100, "platinum", 80),
    (0, "gold", 0),
])
def test_discount(price, tier, expected):
    assert discount(price, tier) == expected
```

*The table makes the behavioural variants and boundary case visible without copy-pasting the test body.*

## Relationships

**Synergies**

- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — One clear test body preserves the same arrange, act, and assert shape for every row.
- [Test Data Builder](../testing/test-data-builder.md) — Builders keep table rows focused on the fields that vary.
- [Property-Based Testing](../testing/property-based-testing.md) — Explicit rows cover known examples while properties explore generated cases.

**Conflicts with:** [Golden Master (Approval)](../testing/golden-master.md)

**Alternatives:** [Property-Based Testing](../testing/property-based-testing.md), [Test Data Builder](../testing/test-data-builder.md), [Object Mother](../testing/object-mother.md)

## Applicability tags

- **Languages:** language-agnostic, python, java, go, typescript, javascript
- **Frameworks:** none, nodejs, spring-boot, fastapi, dotnet
- **Project types:** library, web-api, backend-service, cli-tool, modular-monolith
- **Tags:** table-driven, data-driven, boundary-cases

