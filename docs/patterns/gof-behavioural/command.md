# Command

> Encapsulate a request as an object so it can be queued, logged, authorised, retried, undone, or passed through infrastructure without coupling caller to receiver.

**Scale:** design · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Action Object, Request Object

## Description

Command packages an intention, its input data, and the operation that fulfils it behind a stable interface such as execute. The invoker depends on that interface rather than the receiver's concrete API, which lets the same request move through queues, schedulers, undo stacks, audit logs, and UI actions. Good commands are named in business language, validate their required inputs at the boundary, and keep side effects explicit in the handler or receiver they delegate to.

**Problem.** Callers know too much about receivers and operation details, making it hard to record, defer, retry, authorise, or compose requests consistently.

**Context.** Use when an operation must become a first-class value: menu actions, background jobs, transactional application operations, message handlers, workflow steps, or undoable editor actions.

## Consequences / Trade-offs

- Requests can be queued, logged, retried, authorised, rate-limited, or undone through one interface.
- Decouples invokers from receivers, but can create many small classes or functions.
- Command payloads become contracts; version them carefully when crossing process boundaries.
- Idempotency and audit metadata matter when commands are retried by jobs or agents.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational for small apps; excellent for UI actions or CLI commands, but unnecessary ceremony for one-off service method calls. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit when operations need validation, logging, retries, or authorisation before reaching their receivers. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent in large systems with workflows, job queues, audit requirements, and clear command contracts between modules. |

## Examples

### Editor actions with undo

**❌ Negative (typescript)**

```typescript
class Editor {
  text = "";
  history: string[] = [];

  boldSelection(start: number, end: number): void {
    this.history.push(this.text);
    this.text = this.text.slice(0, start) + "**" +
      this.text.slice(start, end) + "**" + this.text.slice(end);
  }

  insertLink(start: number, end: number, url: string): void {
    this.history.push(this.text);
    this.text = this.text.slice(0, start) + "[" +
      this.text.slice(start, end) + "](" + url + ")" + this.text.slice(end);
  }
}
```

**✅ Positive (typescript)**

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class Editor {
  constructor(public text: string) {}
}

class BoldSelection implements Command {
  private before = "";

  constructor(
    private readonly editor: Editor,
    private readonly start: number,
    private readonly end: number,
  ) {}

  execute(): void {
    this.before = this.editor.text;
    const selected = this.editor.text.slice(this.start, this.end);
    this.editor.text = this.editor.text.slice(0, this.start) +
      "**" + selected + "**" + this.editor.text.slice(this.end);
  }

  undo(): void {
    this.editor.text = this.before;
  }
}

class CommandHistory {
  private readonly done: Command[] = [];

  run(command: Command): void {
    command.execute();
    this.done.push(command);
  }

  undoLast(): void {
    this.done.pop()?.undo();
  }
}
```

*The positive version moves execution and undo into command objects, so UI buttons, keyboard shortcuts, macros, and tests can all invoke the same action through CommandHistory without duplicating editor state management.*

## Relationships

**Synergies**

- [Chain of Responsibility](../gof-behavioural/chain-of-responsibility.md) — A command can pass through validation, authorisation, and dispatch handlers before execution.
- [Memento](../gof-behavioural/memento.md) — Undoable commands often capture a memento before changing receiver state.
- [Transactional Outbox](../cloud-distributed/outbox.md) — Persisted commands or resulting events can be written atomically for reliable asynchronous execution.
- [Idempotency Key](../api-design/idempotency-key.md) — External command submissions need stable keys so retried requests do not duplicate side effects.

**Alternatives:** [Strategy](../gof-behavioural/strategy.md), [Message Endpoint](../enterprise-integration/message-endpoint.md), [Transaction Script](../enterprise-application/transaction-script.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** nestjs, spring-boot, dotnet, nodejs, none
- **Project types:** backend-service, web-api, desktop-app, cli-tool, modular-monolith
- **Tags:** encapsulated-request, undo, queuing, auditability

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

