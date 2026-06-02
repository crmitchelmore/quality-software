# Atomic Design

> Structure a design system as progressively composed atoms, molecules, organisms, templates and pages.

**Scale:** frontend · **Category:** frontend · **Maturity:** established

## Description

Atomic Design is a taxonomy for building consistent interfaces from small primitives to full pages. Atoms are indivisible elements such as buttons and labels; molecules combine atoms into small controls; organisms form recognisable sections; templates define layout; pages bind real content. The value is not the chemistry metaphor itself, but a shared language for granularity, ownership and reuse in component libraries.

**Problem.** Design systems often become a flat collection of components with unclear reuse expectations, causing teams to duplicate near-identical UI at different levels.

**Context.** Use when a product has a shared design system, multiple teams building screens, or a component catalogue that needs explicit composition levels.

## Consequences / Trade-offs

- Creates a shared vocabulary for design and engineering collaboration.
- Encourages reuse from primitives through page-level composition.
- Can become rigid if every component must fit the taxonomy perfectly.
- Does not replace domain-oriented feature boundaries or accessibility standards.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often too much taxonomy for small products; simple component naming may be enough. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit once a design system and multiple screens need consistency. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large product suites when paired with governance, accessibility checks and versioned component APIs. |

## Examples

### Naming composition levels explicitly

**❌ Negative (typescript)**

```typescript
export function SignupThing({ plan, onSubmit }: Props) {
  return <div className="blue-panel">
    <h2>Start {plan.name}</h2>
    <input placeholder="Email" />
    <button onClick={onSubmit}>Create account</button>
  </div>;
}
```

**✅ Positive (typescript)**

```typescript
export const Button = ({ children, ...props }: ButtonProps) => <button {...props}>{children}</button>;
export const EmailField = (props: FieldProps) => <label>Email<input type="email" {...props} /></label>;

export function SignupForm({ plan, onSubmit }: Props) {
  return <section aria-labelledby="signup-title">
    <h2 id="signup-title">Start {plan.name}</h2>
    <EmailField name="email" />
    <Button onClick={onSubmit}>Create account</Button>
  </section>;
}
```

*The positive version identifies reusable atoms and a molecule/organism boundary, making design-system reuse explicit rather than hidden inside a one-off panel.*

## Relationships

**Synergies**

- [Component-Based UI](../frontend/component-based-ui.md) — Component-Based UI supplies the implementation unit that Atomic Design organises.
- [Container / Presentational](../frontend/container-presentational.md) — Atomic components are usually presentational; containers bind them to application data.
- [Composite](../gof-structural/composite.md) — Larger organisms and templates are composites of smaller UI parts.

**Alternatives:** [Layered (N-Tier) Architecture](../architecture/layered-architecture.md), [Component-Based UI](../frontend/component-based-ui.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react, vue, angular, svelte, solidjs
- **Project types:** web-frontend, mobile-app, library
- **Tags:** design-system, component-library, taxonomy

## References

- [Brad Frost, Atomic Design, (2016)](https://atomicdesign.bradfrost.com/)

