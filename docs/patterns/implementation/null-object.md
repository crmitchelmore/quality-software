# Null Object

> Replace absent collaborators with an object that implements the same interface and performs safe default behaviour, removing repetitive null checks from clients.

**Scale:** design · **Category:** implementation · **Maturity:** time-tested

**Also known as:** Null Object Pattern, Do-Nothing Object

## Description

Null Object supplies a real implementation for the "nothing to do" case. Instead of returning null and forcing every caller to branch before using a dependency, the provider returns an object with neutral, explicit behaviour: a logger that discards messages, a discount policy that returns zero, or a notifier that records nothing. The important design work is choosing a default that is honest and safe, not merely hiding absence.

**Problem.** Optional collaborators spread defensive checks through the codebase, so callers duplicate absence handling and often forget one branch.

**Context.** Use when a dependency is optional but the client protocol is still meaningful with a safe no-op or neutral result.

## Consequences / Trade-offs

- Removes noisy null checks and keeps the main flow focused on behaviour.
- Makes the default behaviour explicit and testable behind the same interface.
- Can hide configuration mistakes if the no-op object is used where work was required.
- Works poorly when absence must be reported to the user or audited.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Useful for optional collaborators, though plain conditionals are often enough. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong fit once the same null check appears across several services or handlers. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable, but must be monitored so no-op defaults do not mask wiring defects. |

## Examples

### Optional audit sink

**❌ Negative (typescript)**

```typescript
interface AuditSink {
  record(event: string): void;
}

function approve(orderId: string, audit?: AuditSink) {
  // business work
  if (audit) {
    audit.record(`approved:${orderId}`);
  }
}
```

**✅ Positive (typescript)**

```typescript
interface AuditSink {
  record(event: string): void;
}

class NullAuditSink implements AuditSink {
  record(_event: string): void {}
}

function approve(orderId: string, audit: AuditSink = new NullAuditSink()) {
  // business work
  audit.record(`approved:${orderId}`);
}
```

*The positive version preserves one protocol for real and absent audit sinks, making callers simpler while keeping the neutral behaviour named and testable.*

## Relationships

**Synergies**

- [Guard Clause (Early Return)](../implementation/guard-clause.md) — Guard clauses reject invalid input while null objects handle valid-but-absent collaborators without extra branches.
- [Special Case](../enterprise-application/special-case.md) — Null Object is a small-scale form of Special Case where the special value obeys the normal interface.
- [Option / Maybe](../functional/option-maybe.md) — Option/Maybe is a better fit when absence is semantically important and callers must make an explicit choice.

**Conflicts with:** [Fail Fast](../implementation/fail-fast.md)

**Alternatives:** [Option / Maybe](../functional/option-maybe.md), [Special Case](../enterprise-application/special-case.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, spring, dotnet
- **Project types:** library, web-api, backend-service, modular-monolith
- **Tags:** polymorphism, absence, readability

## References

- Bobby Woolf, Pattern Languages of Program Design 3, (1997)

