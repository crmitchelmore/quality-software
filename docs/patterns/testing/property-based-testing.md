# Property-Based Testing

> Generate many inputs and assert general properties that must always hold, revealing edge cases example-based tests miss.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** established

**Also known as:** Generative testing, QuickCheck-style testing

## Description

Property-Based Testing describes invariants rather than individual examples: sorting preserves length and order, serialise/parse round-trips, debits never create money, encoders never emit unsafe output. A generator produces many inputs, and the framework shrinks failures to a minimal counterexample. The pattern is strongest for pure, deterministic logic with clear algebraic or domain invariants; it is weaker for workflow-heavy code with costly setup.

**Problem.** Example tests cover the cases engineers remembered, leaving boundary conditions and surprising combinations untested.

**Context.** Use for parsers, validators, pricing rules, transformations, state machines, and security-sensitive encoders where invariants are known.

## Consequences / Trade-offs

- Finds edge cases and minimal counterexamples beyond hand-written examples.
- Encourages clearer invariants and more deterministic design.
- Generators and properties require skill; poor properties only restate the implementation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational but powerful for small libraries with pure logic. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for validators, parsers, and business rules once teams learn generator design. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large critical systems where rare combinations and boundary cases are costly. |

## Examples

### Pytest round-trip property

**❌ Negative (python)**

```python
def test_slug_examples():
    assert slugify("Hello World") == "hello-world"
    assert slugify("  A+B  ") == "a-b"
```

**✅ Positive (python)**

```python
from hypothesis import given, strategies as st

@given(st.text())
def test_slug_is_safe_and_idempotent(value):
    slug = slugify(value)

    assert slug == slugify(slug)
    assert all(ch.islower() or ch.isdigit() or ch == "-" for ch in slug)
    assert "--" not in slug
```

*The positive test checks durable properties across many generated strings and shrinks failures to a minimal counterexample, rather than relying on two remembered examples.*

## Relationships

**Synergies**

- [Pure Function](../functional/pure-function.md) — Pure functions are ideal because generated inputs produce repeatable results without fixture noise.
- [Input Validation (Allow-List)](../security/input-validation.md) — Generated invalid inputs pressure-test allow-list validators and boundary handling.
- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — Each generated case still benefits from clear arrange, act, and property assertion structure.

**Alternatives:** [Golden Master (Approval)](../testing/golden-master.md), [Arrange-Act-Assert](../testing/arrange-act-assert.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java, haskell, scala
- **Frameworks:** none, nodejs, spring-boot, fastapi
- **Project types:** library, web-api, backend-service, data-pipeline, safety-critical
- **Tags:** generative-testing, invariants, edge-cases

