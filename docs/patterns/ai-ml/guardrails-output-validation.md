# Guardrails & Output Validation

> Validate, constrain, and sometimes repair model outputs before they reach users, tools, or durable state.

**Scale:** design · **Category:** ai-ml · **Maturity:** cutting-edge

## Description

Guardrails and Output Validation put deterministic checks around probabilistic generation. They may enforce JSON schemas, enum values, policy rules, citation support, toxicity thresholds, PII handling, tool permissions, or business invariants. The model can draft or repair, but application code decides whether output is acceptable. This pattern is most valuable when model output crosses a trust boundary into user-visible content, automation, or persistence.

**Problem.** LLMs can produce malformed, unsafe, unsupported, or policy-violating content even when prompts clearly request otherwise.

**Context.** Use for any production LLM feature where output is consumed by software, shown to users, or used to make decisions. Avoid relying on guardrails as a substitute for least-privilege tools and domain validation.

## Consequences / Trade-offs

- Turns many model failures into explicit validation errors rather than silent bad outputs.
- Adds latency and complexity when repair or regeneration loops are needed.
- Rules can become brittle if they encode style preferences instead of safety and contract requirements.
- High-severity failures may need escalation rather than automated repair.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Worth adding early for any user-visible or machine-consumed output. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Essential for production LLM features that must maintain contracts and policy boundaries. |
| Large (>100k LOC) | ●●●●● 5/5 | Load-bearing at scale, with central rule libraries, audit logs, and measured false-positive rates. |

## Examples

### Reject unsafe or malformed output

**❌ Negative (typescript)**

```typescript
const reply = await model.complete(prompt);
await email.send(user.email, reply);
```

**✅ Positive (typescript)**

```typescript
const draft = await model.complete(prompt);
const checked = await validators.run(draft, [validJson, noSecrets, citesKnownSources]);

if (!checked.ok) {
  await reviewQueue.enqueue({ userId: user.id, draft, reasons: checked.errors });
  return { status: "needs_review" };
}

await email.send(user.email, checked.value.safeText);
```

*The positive version treats the model output as untrusted, validates it against concrete rules, and routes failures to review instead of sending immediately.*

## Relationships

**Synergies**

- [Structured Output (Schema-Constrained Generation)](../ai-ml/structured-output.md) — Schema-constrained outputs are easier to validate and reject deterministically.
- [Human-in-the-Loop Approval](../ai-ml/human-in-the-loop.md) — Failed or high-risk validations can route to human approval instead of automatic execution.
- [Guard Clause (Early Return)](../implementation/guard-clause.md) — Guardrails are guard clauses at the AI boundary, rejecting invalid outputs early.
- [Retrieval-Augmented Generation (RAG)](../ai-ml/retrieval-augmented-generation.md) — RAG guardrails can verify that cited claims are supported by retrieved passages.

**Conflicts with:** [Lazy Initialization](../implementation/lazy-initialization.md)

**Alternatives:** [Input Validation (Allow-List)](../security/input-validation.md), [Output Encoding](../security/output-encoding.md), [Human-in-the-Loop Approval](../ai-ml/human-in-the-loop.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** openai, anthropic, langchain, llamaindex, none
- **Project types:** ml-system, web-api, backend-service, safety-critical
- **Tags:** validation, safety, policy

