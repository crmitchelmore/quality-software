# Interpreter

> Represent a small language grammar as composable expression objects and evaluate those objects against a context.

**Scale:** design · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Abstract Syntax Tree Interpreter

## Description

Interpreter models sentences in a constrained language as an abstract syntax tree where each node knows how to interpret itself. It is appropriate for small, stable domain languages such as rules, filters, formulas, permissions, or search predicates where the grammar is more important than raw execution speed. The parser builds expression objects; evaluation walks the tree with a context, making grammar rules explicit and testable instead of scattering string parsing across business code.

**Problem.** Domain rules or expressions are stored as strings or ad hoc conditionals, so parsing, validation, and execution are duplicated and unsafe.

**Context.** Use for small DSLs whose grammar can be expressed with a manageable class or function hierarchy. Avoid for general-purpose languages, highly optimised query execution, or grammars that change constantly without tooling support.

## Consequences / Trade-offs

- Makes grammar concepts explicit and easy to unit test node by node.
- Enables safe evaluation of constrained expressions without handing arbitrary strings to eval or SQL.
- Class count grows with grammar complexity and performance can suffer on large expression trees.
- Requires a clear parser boundary; do not let unvalidated strings construct arbitrary operations.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely worth it unless the product genuinely exposes a small rule language; direct functions are clearer for fixed business logic. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for rules, filters, and formulas where explicit grammar pays for itself but a full parser generator would be heavy. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful inside bounded rule engines, but large organisations should invest in tooling, validation, versioning, and observability around the DSL. |

## Examples

### Feature flag rule evaluation

**❌ Negative (typescript)**

```typescript
type User = { country: string; plan: string; beta: boolean };

function isEnabled(rule: string, user: User): boolean {
  if (rule === "beta") return user.beta;
  if (rule === "paid") return user.plan === "pro" || user.plan === "team";
  if (rule.startsWith("country=")) {
    return user.country === rule.slice("country=".length);
  }
  throw new Error("unknown rule");
}
```

**✅ Positive (typescript)**

```typescript
type User = { country: string; plan: string; beta: boolean };

interface Expression {
  evaluate(user: User): boolean;
}

class IsBeta implements Expression {
  evaluate(user: User): boolean {
    return user.beta;
  }
}

class HasPlan implements Expression {
  constructor(private readonly plans: string[]) {}

  evaluate(user: User): boolean {
    return this.plans.includes(user.plan);
  }
}

class And implements Expression {
  constructor(private readonly left: Expression, private readonly right: Expression) {}

  evaluate(user: User): boolean {
    return this.left.evaluate(user) && this.right.evaluate(user);
  }
}

const paidBetaRule = new And(new IsBeta(), new HasPlan(["pro", "team"]));
const enabled = paidBetaRule.evaluate({ country: "GB", plan: "pro", beta: true });
```

*The positive version represents the rule language as typed expression nodes. Combining rules no longer requires editing a string switch, and the evaluator can reject unsupported grammar before runtime.*

## Relationships

**Synergies**

- [Composite](../gof-structural/composite.md) — Expression trees are composites: leaves and compound expressions share the same evaluation interface.
- [Visitor](../gof-behavioural/visitor.md) — Visitors add formatting, optimisation, or static analysis over the expression tree without changing node classes.
- [Specification](../ddd-tactical/specification.md) — Specifications can be implemented as interpretable predicates for business rules and queries.
- [Query Object](../enterprise-application/query-object.md) — A query object can hold the parsed expression and translate it to database criteria.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Strategy](../gof-behavioural/strategy.md), [Specification](../ddd-tactical/specification.md), [Query Object](../enterprise-application/query-object.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none
- **Project types:** library, backend-service, web-api, data-pipeline
- **Tags:** dsl, expression-tree, rules, parsing

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

