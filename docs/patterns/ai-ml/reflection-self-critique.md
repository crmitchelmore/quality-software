# Reflection / Self-Critique Loop

> Ask a model to critique, verify, or revise its own intermediate work under bounded rules before accepting the final output.

**Scale:** design · **Category:** ai-ml · **Maturity:** emerging

## Description

Reflection or Self-Critique introduces one or more deliberate review steps into an LLM workflow. The model may inspect its draft against a rubric, search for missing evidence, compare alternatives, or produce a revised answer. The pattern can improve reasoning and instruction following, but it is not magic: self-critique can reinforce confident mistakes unless it is grounded in external evidence, deterministic checks, or a separate critic prompt, and it must always have strict iteration limits.

**Problem.** First-pass model outputs often miss constraints, overlook edge cases, or include unsupported claims, especially in complex multi-step tasks.

**Context.** Use for high-value generation where a second pass can check explicit criteria. Avoid unbounded loops or purely introspective critique for factual questions without evidence.

## Consequences / Trade-offs

- Can improve completeness, consistency, and adherence to rubrics without involving a human every time.
- Adds latency, cost, and potential over-editing.
- A model may rationalise its own mistake unless critique is evidence-based.
- Requires termination criteria so self-improvement does not become an infinite loop.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often unnecessary for small features unless output quality is visibly improved by a second pass. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for high-value generation with explicit rubrics and measured regression tests. |
| Large (>100k LOC) | ●●●●○ 4/5 | Useful in large workflows, but should be selectively enabled because cost and latency compound quickly. |

## Examples

### Bound reflection with evidence and a rubric

**❌ Negative (python)**

```python
answer = llm.complete(question)
while "not good enough" in llm.complete(f"Critique this: {answer}"):
    answer = llm.complete(f"Improve this answer: {answer}")
```

**✅ Positive (python)**

```python
answer = llm.complete(make_answer_prompt(question, sources))

for _ in range(2):
    critique = llm.json_complete(
        "Find unsupported claims using only the supplied sources. Return JSON.",
        {"answer": answer, "sources": sources},
        schema=Critique.model_json_schema(),
    )
    checked = Critique.model_validate(critique)
    if not checked.unsupported_claims:
        break
    answer = llm.complete(make_revision_prompt(answer, checked, sources))
```

*The positive version limits iterations and grounds critique in sources and a schema, avoiding an unbounded self-referential loop.*

## Relationships

**Synergies**

- [Agent Orchestration](../ai-ml/agent-orchestration.md) — Orchestrators can run reflection as a bounded step before finishing or escalating.
- [LLM-as-Judge / Model-Graded Evaluation](../ai-ml/llm-as-judge.md) — A separate judge prompt can provide a rubric-based critique before revision.
- [LLM Evaluation Harness](../ai-ml/evaluation-harness.md) — Reflection should be measured against baselines because it can improve some cases and degrade others.
- [Timeout](../resilience/timeout.md) — Timeouts and iteration budgets keep critique loops from consuming unbounded resources.

**Conflicts with:** [Fail Fast](../implementation/fail-fast.md)

**Alternatives:** [LLM-as-Judge / Model-Graded Evaluation](../ai-ml/llm-as-judge.md), [Human-in-the-Loop Approval](../ai-ml/human-in-the-loop.md), [Prompt Chaining](../ai-ml/prompt-chaining.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** openai, anthropic, langchain, semantic-kernel, none
- **Project types:** ml-system, backend-service, prototype, library
- **Tags:** critique, revision, reasoning

