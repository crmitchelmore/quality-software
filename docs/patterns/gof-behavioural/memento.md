# Memento

> Capture an object's internal state as an opaque snapshot so it can be restored later without exposing its representation.

**Scale:** design · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Snapshot, Restore Point

## Description

Memento separates state capture from state ownership. The originator creates an opaque value that contains enough internal state to restore itself later; a caretaker stores those values for undo, checkpoints, optimistic editing, or rollback, but cannot inspect or mutate their internals. The pattern is strongest when snapshots are small, immutable, and versioned enough to survive reasonable changes in the originator's representation.

**Problem.** Clients need undo or rollback behaviour, but exposing mutable internal fields so they can save and restore state breaks encapsulation and corrupts invariants.

**Context.** Use for editors, wizards, simulations, games, transactional UI flows, and other stateful objects that need local restore points. Prefer event sourcing or audit logs when a durable historical record is the primary requirement.

## Consequences / Trade-offs

- Preserves encapsulation because only the originator understands the snapshot contents.
- Enables undo, redo, checkpoints, and speculative changes without leaking internal representation.
- Snapshots can be memory-heavy; use deltas or bounded history for large state.
- Long-lived persisted mementos need versioning and migration, otherwise internal refactors break restore.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Good for small editors or wizards, but avoid snapshots when simple local variables or form reset logic are enough. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for undoable domain interactions and UI flows with bounded state and clear snapshot ownership. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful as a local mechanism, but large durable systems usually need event logs, audit trails, versioned snapshots, and storage controls. |

## Examples

### Restoring document edits

**❌ Negative (typescript)**

```typescript
class Document {
  public text = "";
  public cursor = 0;
  public selection: [number, number] | null = null;
}

const doc = new Document();
const history: Array<{ text: string; cursor: number; selection: [number, number] | null }> = [];

function save(): void {
  history.push({ text: doc.text, cursor: doc.cursor, selection: doc.selection });
}

function undo(): void {
  const previous = history.pop();
  if (previous) Object.assign(doc, previous);
}
```

**✅ Positive (typescript)**

```typescript
type DocumentMemento = Readonly<{
  text: string;
  cursor: number;
  selection: [number, number] | null;
}>;

class Document {
  private text = "";
  private cursor = 0;
  private selection: [number, number] | null = null;

  insert(value: string): void {
    this.text = this.text.slice(0, this.cursor) + value + this.text.slice(this.cursor);
    this.cursor += value.length;
  }

  createMemento(): DocumentMemento {
    return { text: this.text, cursor: this.cursor, selection: this.selection };
  }

  restore(memento: DocumentMemento): void {
    this.text = memento.text;
    this.cursor = memento.cursor;
    this.selection = memento.selection;
  }
}

class History {
  private readonly snapshots: DocumentMemento[] = [];
  save(document: Document): void { this.snapshots.push(document.createMemento()); }
  undo(document: Document): void {
    const previous = this.snapshots.pop();
    if (previous) document.restore(previous);
  }
}
```

*The positive version keeps document fields private and lets the document own snapshot creation and restoration. History stores opaque immutable values instead of manipulating representation directly.*

## Relationships

**Synergies**

- [Command](../gof-behavioural/command.md) — Undoable commands commonly store a memento before executing and restore it during undo.
- [Immutable Object](../concurrency/immutable-object.md) — Immutable snapshots are safer to store and share without defensive copying.
- [Prototype](../gof-creational/prototype.md) — Prototype-style cloning can produce mementos for objects with copyable state.
- [Event Sourcing](../architecture/event-sourcing.md) — Event sourcing is an alternative for durable history; memento snapshots can speed aggregate rehydration.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Event Sourcing](../architecture/event-sourcing.md), [Copy-on-Write](../concurrency/copy-on-write.md), [Prototype](../gof-creational/prototype.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, react, dotnet
- **Project types:** desktop-app, web-frontend, game, backend-service
- **Tags:** undo, snapshot, encapsulation, rollback

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

