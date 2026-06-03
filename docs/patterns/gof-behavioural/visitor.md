# Visitor

> Add operations over a stable object structure by moving the operation into a visitor object that each element accepts.

**Scale:** design · **Altitude:** low · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Double Dispatch Visitor

## Description

Visitor separates operations from the object structure they operate on. Elements expose an accept method that calls the corresponding visitor method for their concrete type, giving the operation type-specific behaviour without instanceof ladders. It works best when the element hierarchy is stable but new operations are frequent, such as AST formatting, validation, code generation, pricing, reporting, or serialisation. It is a poor fit when new element types are common, because every visitor must then be updated.

**Problem.** Many unrelated operations over a heterogeneous object structure are implemented with repeated type checks, scattering operation logic and making new operations risky.

**Context.** Use for compilers, interpreters, document object models, rule trees, and other stable hierarchies where adding operations is more common than adding element classes.

## Consequences / Trade-offs

- Groups one operation across many element types into a single cohesive visitor.
- Avoids type-checking conditionals and enables double dispatch in single-dispatch languages.
- Adding a new element type is expensive because all visitors need a new method.
- Visitors can break encapsulation if elements expose too much internal state for operations.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often over-engineered for small hierarchies; direct methods or pattern matching are simpler when operations are few. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful for stable object structures with several operations, especially in libraries and compilers. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong fit when a stable AST or document model has many independently owned operations, but costly if the element model changes frequently. |

## Examples

### Rendering report nodes

**❌ Negative (typescript)**

```typescript
type ReportNode = Heading | Paragraph;
type Heading = { kind: "heading"; level: number; text: string };
type Paragraph = { kind: "paragraph"; text: string };

function renderMarkdown(node: ReportNode): string {
  if (node.kind === "heading") return "#".repeat(node.level) + " " + node.text;
  if (node.kind === "paragraph") return node.text;
  throw new Error("unknown node");
}

function wordCount(node: ReportNode): number {
  if (node.kind === "heading") return node.text.split(" ").length;
  if (node.kind === "paragraph") return node.text.split(" ").length;
  throw new Error("unknown node");
}
```

**✅ Positive (typescript)**

```typescript
interface ReportVisitor<T> {
  visitHeading(node: Heading): T;
  visitParagraph(node: Paragraph): T;
}

interface ReportNode {
  accept<T>(visitor: ReportVisitor<T>): T;
}

class Heading implements ReportNode {
  constructor(readonly level: number, readonly text: string) {}
  accept<T>(visitor: ReportVisitor<T>): T { return visitor.visitHeading(this); }
}

class Paragraph implements ReportNode {
  constructor(readonly text: string) {}
  accept<T>(visitor: ReportVisitor<T>): T { return visitor.visitParagraph(this); }
}

class MarkdownRenderer implements ReportVisitor<string> {
  visitHeading(node: Heading): string { return "#".repeat(node.level) + " " + node.text; }
  visitParagraph(node: Paragraph): string { return node.text; }
}

class WordCounter implements ReportVisitor<number> {
  visitHeading(node: Heading): number { return node.text.split(" ").length; }
  visitParagraph(node: Paragraph): number { return node.text.split(" ").length; }
}
```

*The positive version groups each operation into its own visitor and removes duplicated kind checks. Adding HTML rendering is a new visitor; adding a new node type intentionally forces all operations to handle it.*

## Relationships

**Synergies**

- [Composite](../gof-structural/composite.md) — Visitors commonly traverse composite object structures such as ASTs and document trees.
- [Interpreter](../gof-behavioural/interpreter.md) — Interpreters often use visitors for evaluation, pretty-printing, optimisation, or validation of expression trees.
- [Iterator](../gof-behavioural/iterator.md) — Iterators can traverse the structure while visitors perform type-specific operations.
- [Pattern Matching](../functional/pattern-matching.md) — Pattern matching is a language-level alternative for closed hierarchies and operation dispatch.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Pattern Matching](../functional/pattern-matching.md), [Strategy](../gof-behavioural/strategy.md), [Iterator](../gof-behavioural/iterator.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** none
- **Project types:** library, sdk, data-pipeline, backend-service, cli-tool
- **Tags:** double-dispatch, ast, extensibility, operations

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

