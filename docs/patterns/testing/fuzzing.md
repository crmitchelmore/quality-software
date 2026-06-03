# Fuzzing

> Generate random, malformed, or coverage-guided inputs to find crashes, panics, memory errors, and unhandled exceptions.

**Scale:** integration · **Altitude:** medium · **Category:** testing · **Maturity:** established

**Also known as:** Fuzz Testing, Coverage-Guided Fuzzing, API Fuzzing

## Description

Fuzzing bombards a component, parser, protocol handler, or API with generated inputs. Classic fuzzing seeks crashes and undefined behaviour; coverage-guided fuzzers use instrumentation to explore new paths. It complements property-based testing: a property test asserts invariants, while a fuzzer often starts with the simpler oracle that invalid input must not crash the system.

**Problem.** Hand-written examples miss adversarial boundary cases that can crash parsers, APIs, or security-sensitive components.

**Context.** Use for parsers, codecs, validators, file formats, protocol handlers, public APIs, and unsafe or memory-sensitive code.

## Consequences / Trade-offs

- Finds edge cases humans did not think to write down.
- Coverage-guided tools can explore deep parser and protocol paths.
- Failures must record seeds or corpus entries so they are reproducible and become regression tests.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Valuable for parsers and public inputs, less useful for ordinary CRUD. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for APIs, codecs, validators, and security-sensitive components. |
| Large (>100k LOC) | ●●●●● 5/5 | High leverage when continuously run with corpus management and crash triage. |

## Examples

### Parser must not panic

**❌ Negative (go)**

```go
func TestParseDate(t *testing.T) {
  _, err := ParseDate("not-a-date")
  assert.Error(t, err)
}
```

**✅ Positive (go)**

```go
func FuzzParseDate(f *testing.F) {
  f.Add("2024-01-01")
  f.Fuzz(func(t *testing.T, s string) {
    _, _ = ParseDate(s) // errors are fine; panics are not
  })
}
```

*The fuzzer explores many malformed inputs beyond the examples the test author remembered.*

## Relationships

**Synergies**

- [Property-Based Testing](../testing/property-based-testing.md) — Both generate inputs; properties add stronger semantic oracles to fuzz-discovered cases.
- [Parameterised Test](../testing/parameterised-test.md) — Interesting fuzz discoveries should be promoted into explicit regression rows.
- [Mutation Testing](../testing/mutation-testing.md) — Mutation score and fuzz findings both reveal gaps in fault detection.

**Conflicts with:** [Golden Master (Approval)](../testing/golden-master.md)

**Alternatives:** [Property-Based Testing](../testing/property-based-testing.md), [Mutation Testing](../testing/mutation-testing.md), [Parameterised Test](../testing/parameterised-test.md)

## Applicability tags

- **Languages:** language-agnostic, go, rust, cpp, c, python, java
- **Frameworks:** none, fastapi, nodejs, actix, tokio, spring-boot
- **Project types:** library, web-api, backend-service, embedded, safety-critical, distributed-system
- **Tags:** random-inputs, security, crash-testing, coverage-guided

