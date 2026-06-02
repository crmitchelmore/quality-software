# Human-in-the-Loop Approval

> Route high-risk AI outputs or actions to a person for review, approval, correction, or escalation before they affect users or systems.

**Scale:** design · **Category:** ai-ml · **Maturity:** cutting-edge

## Description

Human-in-the-Loop Approval treats human judgement as an explicit control point in an AI workflow rather than an informal fallback. The system defines which decisions require review, what evidence the reviewer sees, how approvals are recorded, what can be edited, and how the workflow resumes. This pattern is especially important when AI proposes irreversible, costly, sensitive, or reputation-affecting actions, and it should be designed as a product flow with queues, SLAs, audit trails, and override rules.

**Problem.** Fully automated AI systems can take unsafe actions or publish poor outputs before uncertainty, policy risk, or missing context is noticed.

**Context.** Use where model confidence, validation failures, legal exposure, data mutation, or customer impact exceeds an agreed risk threshold. Avoid routing every low-risk output to humans, or review queues become ignored bottlenecks.

## Consequences / Trade-offs

- Reduces blast radius by stopping high-risk outputs before they cross a trust boundary.
- Adds latency and operational workload, so routing criteria must be selective and measurable.
- Reviewer decisions become training and evaluation data if captured with reasons and outcomes.
- Poor reviewer UX can lead to rubber-stamping, which creates an illusion of safety.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for risky prototypes, though manual ad hoc review may be enough for very low volume. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for production AI features that affect customers, money, compliance, or durable state. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential at scale, with reviewer queues, SLAs, audit trails, sampling, and escalation policy. |

## Examples

### Route risky actions to approval

**❌ Negative (typescript)**

```typescript
const action = await model.decide(customerComplaint);
await refunds.issue(action.orderId, action.amountCents);
await email.send(customer.email, action.message);
```

**✅ Positive (typescript)**

```typescript
const proposal = await model.proposeRefund(customerComplaint);
const risk = refundPolicy.evaluate(proposal);

if (risk.requiresApproval) {
  await approvalQueue.enqueue({
    proposal,
    evidence: customerComplaint.attachments,
    reasons: risk.reasons,
    requestedBy: "refund-assistant"
  });
  return { status: "awaiting_approval" };
}

await refunds.issueDraft(proposal.orderId, proposal.amountCents, proposal.idempotencyKey);
```

*The positive version makes the model produce a proposal, evaluates risk deterministically, and sends high-impact actions to a review queue instead of executing them immediately.*

## Relationships

**Synergies**

- [Guardrails & Output Validation](../ai-ml/guardrails-output-validation.md) — Guardrail failures can trigger review with concrete reasons instead of silently blocking users.
- [Agent Orchestration](../ai-ml/agent-orchestration.md) — Orchestrators need approval gates before tools perform high-impact or irreversible actions.
- [Audit Logging](../security/audit-logging.md) — Human approvals should record who approved what evidence, when, and under which policy.
- [Rate Limiting](../resilience/rate-limiting.md) — Review queues need rate controls so automation cannot overwhelm available reviewers.

**Conflicts with:** [Scheduler-Agent-Supervisor](../cloud-distributed/scheduler-agent-supervisor.md)

**Alternatives:** [Guardrails & Output Validation](../ai-ml/guardrails-output-validation.md), [Circuit Breaker](../resilience/circuit-breaker.md), [Feature Toggle](../implementation/feature-toggle.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** openai, anthropic, langchain, none
- **Project types:** ml-system, backend-service, web-api, safety-critical
- **Tags:** approval, review, risk-control

