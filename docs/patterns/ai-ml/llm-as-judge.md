# LLM-as-Judge / Model-Graded Evaluation

> Use a model to grade outputs against a rubric, preferably with calibration, examples, and spot checks against human judgement.

**Scale:** design · **Altitude:** medium · **Category:** ai-ml · **Maturity:** emerging

## Description

LLM-as-Judge uses a language model as an evaluator for qualities that are hard to assert with exact tests, such as helpfulness, faithfulness, tone, instruction following, and completeness. A strong judge prompt includes a clear rubric, reference material, scoring anchors, required rationale, and sometimes pairwise comparison. It should be calibrated against human labels and deterministic checks because model judges can be biased toward verbosity, familiar phrasing, or their own model family.

**Problem.** Many LLM behaviours cannot be evaluated reliably with string equality, yet relying only on manual review is too slow for regression testing.

**Context.** Use as one signal in an evaluation suite, especially for qualitative outputs. Avoid treating judge scores as unquestionable truth for safety-critical, legal, or financial decisions.

## Consequences / Trade-offs

- Scales qualitative review across many prompts and model versions.
- Judge models can be inconsistent, biased, or vulnerable to persuasive bad answers.
- Rubrics and calibration datasets become test assets that need version control and review.
- Numeric scores are useful for trends but should be interpreted with confidence intervals and human spot checks.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for prototypes with subjective quality, but manual review may be cheaper for very small suites. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong signal for regression testing when calibrated with human labels and deterministic checks. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large LLM products, though it must be monitored for judge drift and bias. |

## Examples

### Use a rubric instead of vibes

**❌ Negative (python)**

```python
def is_good(answer: str) -> bool:
    verdict = llm.complete(f"Is this answer good? {answer}")
    return "yes" in verdict.lower()
```

**✅ Positive (python)**

```python
RUBRIC = """
Score 1-5. Grade only factual support, not style.
1: unsupported or contradicts sources
3: mostly supported with minor omissions
5: every factual claim is supported by a cited source
Return JSON: {"score": number, "reason": string}
"""

def grade(answer: str, sources: list[str]) -> JudgeResult:
    result = llm.json_complete(RUBRIC, {"answer": answer, "sources": sources})
    return JudgeResult.model_validate(result)
```

*The positive version constrains the judge to a specific criterion, scoring anchors, sources, and a typed result rather than accepting an uncalibrated yes/no opinion.*

## Relationships

**Synergies**

- [LLM Evaluation Harness](../ai-ml/evaluation-harness.md) — A harness runs judge prompts consistently and tracks trends across model, prompt, and retrieval changes.
- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — Judge cases still need clear setup, candidate output, and expected rubric assertions.
- [Guardrails & Output Validation](../ai-ml/guardrails-output-validation.md) — Deterministic validation should catch schema and policy failures before subjective judging.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Contract tests complement model grading for exact API and tool-call obligations.

**Conflicts with:** [Mock Object](../testing/mock-object.md)

**Alternatives:** [Property-Based Testing](../testing/property-based-testing.md), [Golden Master (Approval)](../testing/golden-master.md), [Arrange-Act-Assert](../testing/arrange-act-assert.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** openai, anthropic, langchain, huggingface, none
- **Project types:** ml-system, backend-service, library, prototype
- **Tags:** evaluation, model-grading, rubric

