# LLM Evaluation Harness

> Run repeatable test suites over prompts, models, tools, retrieval, and judges so LLM behaviour can be compared and regressed deliberately.

**Scale:** design · **Category:** ai-ml · **Maturity:** cutting-edge

## Description

An LLM Evaluation Harness is the test infrastructure for probabilistic AI features. It stores cases, fixtures, expected behaviours, scoring functions, judge prompts, model settings, and trend reports, then runs them consistently across prompt, model, retrieval, and tool changes. A good harness mixes deterministic assertions, golden examples, human labels, LLM-as-judge scores, and production-derived edge cases, treating evaluation data as first-class source-controlled product knowledge.

**Problem.** Prompt and model changes can silently improve demos while regressing important edge cases, safety behaviours, tool calls, or retrieval grounding.

**Context.** Use for any LLM feature that will be maintained beyond a prototype. Avoid relying only on aggregate scores; keep case-level failures visible and actionable.

## Consequences / Trade-offs

- Makes model and prompt changes reviewable with evidence instead of anecdotes.
- Requires ongoing investment in representative cases, fixtures, and scoring calibration.
- Evaluation can overfit if the suite is too small or too visible to prompt authors.
- Non-determinism means thresholds, variance, retries, and trend analysis matter.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Valuable once a prototype has users, but a tiny experiment may start with a spreadsheet of cases. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Essential for maintaining prompt, model, retrieval, and tool changes with confidence. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational for large AI systems; suites, trends, variance, and case ownership become release gates. |

## Examples

### Track case-level regressions

**❌ Negative (python)**

```python
def test_prompt_once():
    answer = assistant("How do I reset SSO?")
    assert "SSO" in answer
```

**✅ Positive (python)**

```python
def run_eval(case: EvalCase) -> EvalResult:
    output = assistant(case.input, fixtures=case.fixtures, model=case.model)
    checks = [check(output, case) for check in case.deterministic_checks]
    judge = faithfulness_judge.grade(output, case.sources) if case.sources else None
    return EvalResult(case_id=case.id, checks=checks, judge=judge, output=output)

report = harness.run_suite("support-rag", changed_prompt="assistant-v7")
report.fail_if_regressed(required_checks=True, min_faithfulness=4.2)
```

*The positive version runs named cases with fixtures, deterministic checks, judge scores, and regression thresholds instead of one brittle smoke assertion.*

## Relationships

**Synergies**

- [LLM-as-Judge / Model-Graded Evaluation](../ai-ml/llm-as-judge.md) — Model-graded evaluation is one scoring method the harness can run and trend.
- [Retrieval-Augmented Generation (RAG)](../ai-ml/retrieval-augmented-generation.md) — RAG needs case-level checks for retrieval recall, answer faithfulness, and citation quality.
- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — Eval cases benefit from clear setup, invocation, and expected signals.
- [Golden Master (Approval)](../testing/golden-master.md) — Golden outputs can catch unexpected drift, while judge and rubric scores handle acceptable variation.

**Conflicts with:** [Mock Object](../testing/mock-object.md)

**Alternatives:** [Golden Master (Approval)](../testing/golden-master.md), [Property-Based Testing](../testing/property-based-testing.md), [Consumer-Driven Contract Testing](../testing/contract-testing.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** openai, anthropic, huggingface, langchain, none
- **Project types:** ml-system, library, backend-service, prototype
- **Tags:** evaluation, regression-testing, prompt-quality

