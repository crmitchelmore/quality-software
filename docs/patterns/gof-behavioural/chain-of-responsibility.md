# Chain of Responsibility

> Pass a request along an ordered chain of handlers until one handles it or all have declined, decoupling the sender from the concrete receiver.

**Scale:** design · **Altitude:** low · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Chain of Command

## Description

Chain of Responsibility turns a sequence of conditional checks into a linked or iterable set of handler objects with a shared interface. Each handler decides whether it can satisfy the request, whether it should enrich or reject it, and whether processing should continue to the next handler. The sender knows only the first link or pipeline entry, so adding authentication, validation, enrichment, throttling, or fallback behaviour is a matter of inserting a handler rather than editing a central dispatcher.

**Problem.** A request may be handled by one of several behaviours, or must pass through a sequence of optional behaviours, and hard-coding that sequence creates a large, order-sensitive conditional block.

**Context.** Use when processing is naturally ordered, each step can make an independent decision, and the client should not know which concrete handler will act. Typical examples include middleware stacks, support-ticket escalation, validation chains, and command routing.

## Consequences / Trade-offs

- Decouples request senders from concrete handlers and makes insertion/removal of steps local.
- Makes ordering explicit, which is powerful but can hide bugs when handlers depend on previous side effects.
- Can obscure control flow if handlers both mutate and short-circuit without a clear contract.
- Needs observability or tracing in production pipelines so skipped and terminal handlers are visible.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for small HTTP middleware or validation chains, but avoid it for a two-branch decision where a direct conditional is clearer. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | A strong fit once processing steps are owned by different modules and need to be reordered, replaced, or tested independently. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable in large systems with explicit tracing and conventions; without those, long chains become difficult to reason about during incidents. |

## Examples

### Expense approval routing

**❌ Negative (typescript)**

```typescript
type Expense = { amount: number; department: string };

function approve(expense: Expense): string {
  if (expense.amount <= 100) {
    return "approved by team lead";
  }
  if (expense.amount <= 1000 && expense.department !== "security") {
    return "approved by department manager";
  }
  if (expense.amount <= 10000) {
    return "approved by finance";
  }
  throw new Error("board approval required");
}
```

**✅ Positive (typescript)**

```typescript
type Expense = { amount: number; department: string };

interface Approver {
  approve(expense: Expense): string | null;
}

class TeamLead implements Approver {
  approve(expense: Expense): string | null {
    return expense.amount <= 100 ? "approved by team lead" : null;
  }
}

class DepartmentManager implements Approver {
  approve(expense: Expense): string | null {
    if (expense.amount <= 1000 && expense.department !== "security") {
      return "approved by department manager";
    }
    return null;
  }
}

class Finance implements Approver {
  approve(expense: Expense): string | null {
    return expense.amount <= 10000 ? "approved by finance" : null;
  }
}

class ApprovalChain {
  constructor(private readonly approvers: Approver[]) {}

  approve(expense: Expense): string {
    for (const approver of this.approvers) {
      const decision = approver.approve(expense);
      if (decision) return decision;
    }
    throw new Error("board approval required");
  }
}
```

*The positive version makes each approval rule a named handler and keeps the chain order explicit. Adding legal review for one department is an insertion into the configured approvers, not another branch in a growing function.*

## Relationships

**Synergies**

- [Middleware Pipeline](../implementation/middleware-pipeline.md) — Middleware pipelines are a practical chain with standard next-callback semantics for HTTP and message processing.
- [Command](../gof-behavioural/command.md) — Commands provide the request object that flows through the chain without exposing sender internals.
- [Decorator](../gof-structural/decorator.md) — Decorators wrap one operation while a chain composes many optional handlers with similar local responsibilities.
- [Composite](../gof-structural/composite.md) — A composite can group several handlers into one chain segment while preserving the same handler interface.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Strategy](../gof-behavioural/strategy.md), [Message Router](../enterprise-integration/message-router.md), [Content-Based Router](../enterprise-integration/content-based-router.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** express, nestjs, spring-boot, aspnet, none
- **Project types:** web-api, backend-service, modular-monolith, microservices
- **Tags:** request-processing, extensibility, pipeline, decoupling

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

