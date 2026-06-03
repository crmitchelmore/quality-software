# Prompt Chaining

> Decompose a complex LLM task into explicit, typed steps where each prompt consumes the previous step's checked output.

**Scale:** design · **Altitude:** medium · **Category:** ai-ml · **Maturity:** cutting-edge

## Description

Prompt Chaining replaces one large, fragile prompt with a sequence of smaller prompts or model calls, each responsible for a clear subtask such as extract, classify, plan, draft, critique, and revise. Intermediate outputs should be structured and validated before they feed the next step. The design improves controllability and observability, but it raises latency and requires careful handling of error propagation when an early step is wrong.

**Problem.** Monolithic prompts become hard to test, debug, and constrain because extraction, reasoning, generation, and validation are tangled together.

**Context.** Use when a task naturally has stages with different instructions, models, tools, or quality gates. Avoid when a deterministic transformation or one simple prompt is enough.

## Consequences / Trade-offs

- Improves debuggability because each intermediate artefact can be logged, validated, and evaluated.
- Increases latency and cost through multiple model calls.
- Errors can cascade unless each stage has validation and fallback behaviour.
- Enables mixing cheaper and stronger models according to the risk of each step.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Helpful for complex prompts, but excessive for one-off prototypes and simple rewrites. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit where reliability matters and individual stages can be tested. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable inside large AI products, though agent orchestration or pipelines may be needed for dynamic branching. |

## Examples

### Validate each intermediate step

**❌ Negative (python)**

```python
def write_release_notes(diff: str) -> str:
    return llm.complete(f"Summarise this diff and write release notes:\n{diff}")
```

**✅ Positive (python)**

```python
def write_release_notes(diff: str) -> str:
    changes = llm.extract_json("Extract user-visible changes", diff, schema=Changes)
    Changes.model_validate(changes)

    risks = llm.extract_json("Classify migration and security risks", changes, schema=Risks)
    Risks.model_validate(risks)

    return llm.complete(
        "Write concise release notes using only these checked fields:\n"
        f"changes={changes}\nrisks={risks}"
    )
```

*The positive version splits extraction, risk classification, and prose generation so each intermediate result can be validated and debugged.*

## Relationships

**Synergies**

- [Structured Output (Schema-Constrained Generation)](../ai-ml/structured-output.md) — Structured stage outputs let later prompts consume typed fields rather than brittle prose.
- [Guardrails & Output Validation](../ai-ml/guardrails-output-validation.md) — Each chain step can reject invalid or unsafe intermediate results before they compound.
- [Strategy](../gof-behavioural/strategy.md) — Different chain strategies can be swapped for task types without rewriting orchestration code.
- [Pipes and Filters](../architecture/pipes-and-filters.md) — Prompt chains are an LLM-era form of staged processing with explicit filters.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Agent Orchestration](../ai-ml/agent-orchestration.md), [Pipes and Filters](../architecture/pipes-and-filters.md), [Template Method](../gof-behavioural/template-method.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** langchain, llamaindex, openai, anthropic, none
- **Project types:** ml-system, backend-service, library, prototype
- **Tags:** prompting, decomposition, workflow

