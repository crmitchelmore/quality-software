# Structured Output (Schema-Constrained Generation)

> Make the model return data that conforms to a declared schema, such as JSON Schema or a typed object, instead of free-form prose.

**Scale:** implementation · **Category:** ai-ml · **Maturity:** cutting-edge

## Description

Structured Output constrains generation to a machine-readable shape so downstream code can parse, validate, and act on results reliably. It may use provider-native JSON modes, function calling, grammar constraints, or post-generation validation and repair. The pattern is not just formatting: schema design should encode required fields, enums, numeric ranges, nullable values, and versioning so invalid states are rejected before they drive application behaviour.

**Problem.** Free-form LLM responses are brittle to parse and often omit required fields, invent enum values, or mix explanation with data.

**Context.** Use whenever model output is consumed by software, stored, evaluated, or passed to tools. Free-form prose is acceptable only when humans are the sole consumers.

## Consequences / Trade-offs

- Reduces parser fragility and makes model outputs testable with normal validation tools.
- Complex schemas can reduce generation quality or increase retries if the model struggles to satisfy them.
- Schema changes are API changes for prompts, clients, and stored outputs.
- Deterministic validators are still needed because provider guarantees vary.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent even in small projects because it prevents brittle parsing with little overhead. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Essential for reliable LLM integrations and testable workflows. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational at scale; pair with schema versioning, contract tests, and telemetry on validation failures. |

## Examples

### Ask for typed JSON, then validate it

**❌ Negative (python)**

```python
text = llm.complete("Extract priority and owner from this ticket. Reply naturally.")
priority = text.split("priority:")[1].split()[0]
```

**✅ Positive (python)**

```python
class TicketFields(BaseModel):
    priority: Literal["low", "medium", "high", "critical"]
    owner_email: EmailStr | None
    summary: str

raw = llm.complete_json(
    prompt="Extract ticket fields. Return only JSON matching the schema.",
    schema=TicketFields.model_json_schema(),
    input=ticket_text,
)
fields = TicketFields.model_validate(raw)
```

*The positive version declares valid enum values and types, then validates the model response before application code depends on it.*

## Relationships

**Synergies**

- [Tool Use / Function Calling](../ai-ml/tool-use-function-calling.md) — Function calling is a common provider-native way to obtain schema-shaped arguments.
- [Guardrails & Output Validation](../ai-ml/guardrails-output-validation.md) — Structured output gives guardrails concrete fields and enums to validate.
- [Contract-First API (OpenAPI)](../api-design/contract-first-api.md) — Output schemas should be designed and versioned like API contracts.
- [Prompt Chaining](../ai-ml/prompt-chaining.md) — Prompt chains are more reliable when each stage exchanges typed objects.

**Conflicts with:** [Fluent Interface](../implementation/fluent-interface.md)

**Alternatives:** [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md), [Contract-First API (OpenAPI)](../api-design/contract-first-api.md), [Command](../gof-behavioural/command.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** openai, anthropic, langchain, semantic-kernel, none
- **Project types:** ml-system, backend-service, library, web-api
- **Tags:** json-schema, parsing, typed-output

