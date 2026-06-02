# Tool Use / Function Calling

> Expose typed, permissioned functions to an LLM so it can request external actions through controlled contracts rather than free-form text.

**Scale:** integration · **Category:** ai-ml · **Maturity:** cutting-edge

## Description

Tool Use or Function Calling turns model intent into structured calls against application capabilities such as search, calculation, ticket creation, or database-backed commands. The application owns tool definitions, validation, authorisation, execution, and result summarisation; the model proposes calls but does not bypass the boundary. Good tool design keeps functions narrow, idempotent where possible, observable, and safe under retries or malformed arguments.

**Problem.** Free-form model text cannot safely mutate systems, fetch sensitive data, or call APIs because arguments, permissions, and side effects are ambiguous.

**Context.** Use when a model needs current data or external actions. Avoid exposing broad administrative functions or raw query tools without validation and least privilege.

## Consequences / Trade-offs

- Converts model requests into typed contracts that application code can validate, authorise, and audit.
- Tool schemas become public API surfaces for the model and need stable semantics.
- Side effects must be idempotent or guarded because models and clients may retry calls.
- Overly broad tools recreate prompt injection and privilege-escalation risks at the integration boundary.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for small assistants that need one or two safe actions, but broad tool surfaces are risky. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for product copilots and support workflows that need controlled integration with live systems. |
| Large (>100k LOC) | ●●●●● 5/5 | Foundational for enterprise agents, provided tools are versioned, audited, rate-limited, and least-privileged. |

## Examples

### Validate tool arguments and permissions

**❌ Negative (typescript)**

```typescript
const toolName = modelOutput.split(" ")[0];
const rawArgs = modelOutput.slice(toolName.length);
const result = await (tools as any)[toolName](JSON.parse(rawArgs));
```

**✅ Positive (typescript)**

```typescript
const createRefund = tool({
  name: "create_refund_draft",
  schema: z.object({ orderId: z.string(), amountCents: z.number().int().positive() }),
  async execute(args, ctx) {
    await ctx.auth.require("refund:draft");
    return refunds.createDraft(args.orderId, args.amountCents, ctx.requestId);
  }
});

const call = parseToolCall(modelMessage, [createRefund]);
const result = await createRefund.execute(call.args, context);
```

*The positive version uses an allow-listed tool, schema validation, authorisation, and an idempotent request identifier instead of executing arbitrary model-named functions.*

## Relationships

**Synergies**

- [Agent Orchestration](../ai-ml/agent-orchestration.md) — Agents rely on tool calls as their safe actuator layer for real-world work.
- [Contract-First API (OpenAPI)](../api-design/contract-first-api.md) — Tool schemas benefit from the same explicit contract and compatibility discipline as APIs.
- [Idempotency Key](../api-design/idempotency-key.md) — Mutating tool calls should accept stable operation keys so repeated attempts do not duplicate side effects.
- [Principle of Least Privilege](../security/least-privilege.md) — Each tool should expose only the minimum capability the model needs for a task.

**Conflicts with:** [Service Locator](../implementation/service-locator.md)

**Alternatives:** [REST](../api-design/rest.md), [Command](../gof-behavioural/command.md), [Gateway](../enterprise-application/gateway.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** openai, anthropic, langchain, semantic-kernel, none
- **Project types:** ml-system, backend-service, web-api, sdk
- **Tags:** function-calling, tools, contracts

