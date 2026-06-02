# Prototype

> Create new objects by copying a configured exemplar, preserving expensive or intricate setup while varying only the changed parts.

**Scale:** design · **Category:** gof-creational · **Maturity:** time-tested

## Description

Prototype treats an existing object as the template for future instances. Instead of reconstructing an object graph from scratch, clients clone or copy a known-good prototype and then customise a small set of fields. It fits systems where setup is expensive, object variants are data-driven, or the concrete type is not known to the caller. The copy boundary must be explicit: shallow copies are fast but can share mutable state accidentally, while deep copies are safer but costlier.

**Problem.** Rebuilding complex objects repeatedly duplicates setup logic, couples callers to concrete classes, and risks inconsistent defaults.

**Context.** Use when objects have many stable defaults, expensive initialisation, or runtime-defined variants that should be copied from exemplars.

## Consequences / Trade-offs

- Reuses a validated configuration and avoids repeated construction boilerplate.
- Lets clients create concrete objects without knowing the concrete class.
- Copy semantics can be subtle, especially with nested mutable state or external resources.
- May obscure lifecycle rules if prototypes carry connections, locks, or identity fields.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely needed for ordinary business objects; simple constructors or object literals are clearer. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful for templates, rules, and configurable products if copy semantics are documented. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still situational; valuable in games, editors, and data-driven platforms but risky around identity and mutable graphs. |

## Examples

### Report template variants

**❌ Negative (typescript)**

```typescript
function monthlySalesReport(region: string): ReportConfig {
  return {
    title: `${region} monthly sales`,
    pageSize: "A4",
    currency: "GBP",
    sections: ["summary", "pipeline", "closed-won"],
    theme: { font: "Inter", colour: "blue" },
    export: { format: "pdf", watermark: false },
  };
}

function monthlyFinanceReport(region: string): ReportConfig {
  return {
    title: `${region} monthly finance`,
    pageSize: "A4",
    currency: "GBP",
    sections: ["summary", "pipeline", "closed-won"],
    theme: { font: "Inter", colour: "blue" },
    export: { format: "pdf", watermark: false },
  };
}
```

**✅ Positive (typescript)**

```typescript
const monthlyPrototype: ReportConfig = Object.freeze({
  title: "monthly report",
  pageSize: "A4",
  currency: "GBP",
  sections: ["summary", "pipeline", "closed-won"],
  theme: { font: "Inter", colour: "blue" },
  export: { format: "pdf", watermark: false },
});

function cloneReport(overrides: Partial<ReportConfig>): ReportConfig {
  return {
    ...monthlyPrototype,
    ...overrides,
    sections: [...(overrides.sections ?? monthlyPrototype.sections)],
    theme: { ...monthlyPrototype.theme, ...overrides.theme },
    export: { ...monthlyPrototype.export, ...overrides.export },
  };
}

const sales = cloneReport({ title: "EMEA monthly sales" });
const finance = cloneReport({ title: "EMEA monthly finance", export: { watermark: true } });
```

*The positive version keeps the shared defaults in one validated prototype and explicitly copies nested mutable structures. The negative version duplicates defaults, so reports drift when one copy is edited.*

## Relationships

**Synergies**

- [Builder](../gof-creational/builder.md) — Builders can produce the initial prototype and offer copy-with methods for safe variation.
- [Factory Method](../gof-creational/factory-method.md) — A factory method can return clones of registered prototypes based on a runtime key.
- [Flyweight](../gof-structural/flyweight.md) — Prototype copies object state, while Flyweight shares intrinsic state; together they separate what should be copied from what should be shared.
- [Memento](../gof-behavioural/memento.md) — Memento captures snapshots that can act as safe prototypes for later restoration.

**Alternatives:** [Builder](../gof-creational/builder.md), [Factory Method](../gof-creational/factory-method.md), [Object Pool](../implementation/object-pool.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java, csharp
- **Frameworks:** none
- **Project types:** library, game, desktop-app, backend-service
- **Tags:** cloning, defaults, copy-semantics

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

