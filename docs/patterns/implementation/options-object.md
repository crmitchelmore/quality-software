# Options Object

> Replace long lists of optional arguments with a single object whose named fields describe configuration choices at the call site.

**Scale:** implementation · **Altitude:** low · **Category:** implementation · **Maturity:** established

**Also known as:** Named Options, Configuration Object

## Description

Options Object is a call-site readability idiom for functions with several optional or defaulted settings. Named fields avoid positional booleans and make future options backwards-compatible. It differs from Parameter Object: options are usually configuration knobs for one operation, not a cohesive domain value that travels through the model.

**Problem.** Positional optional arguments and boolean flags make calls hard to read and fragile when new options are added.

**Context.** Use for APIs with several optional settings, especially in JavaScript/TypeScript or Python where object/dict literals are idiomatic.

## Consequences / Trade-offs

- Makes call sites self-documenting through field names.
- Allows backwards-compatible addition of optional settings.
- Can grow into an unvalidated bag of unrelated switches.
- Required values should still be explicit parameters or validated clearly.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent low-cost readability improvement for optional-heavy APIs. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit, but validate options and avoid broad catch-all objects. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful, though typed parameter objects or builders may age better for core APIs. |

## Examples

### Named optional settings

**❌ Negative (typescript)**

```typescript
renderChart(data, true, false, 'dark', 30);
```

**✅ Positive (typescript)**

```typescript
renderChart(data, {
  animate: true,
  showLegend: false,
  theme: 'dark',
  refreshSeconds: 30,
});
```

*The positive version names each option at the call site, avoiding a sequence of unexplained booleans and preserving room for future settings.*

## Relationships

**Synergies**

- [Parameter Object](../implementation/parameter-object.md) — Parameter Object is better when the fields represent one domain concept rather than loose options.
- [Builder](../gof-creational/builder.md) — Builder may replace Options Object when construction requires staged validation or many combinations.
- [Smart Constructor](../implementation/smart-constructor.md) — Smart constructors validate options before an object observes partial or contradictory settings.
- [Fluent Interface](../implementation/fluent-interface.md) — Fluent Interface is an alternative for APIs where ordered configuration reads better than an object literal.

**Alternatives:** [Parameter Object](../implementation/parameter-object.md), [Builder](../gof-creational/builder.md), [Fluent Interface](../implementation/fluent-interface.md)

## Applicability tags

- **Languages:** typescript, javascript, python, ruby, php
- **Frameworks:** nodejs, react, django, rails, none
- **Project types:** library, sdk, web-frontend, web-api
- **Tags:** api-design, parameters, configuration

## References

- Martin Fowler, Refactoring; Introduce Parameter Object, (2018)

