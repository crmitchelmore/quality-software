# Product and UX conformance scope

`product.md` extends the conformance idea beyond software architecture into product and UX practices. That does not mean subjective product or design taste should block code changes.

## Trust line

| Type | Examples | Default action |
| --- | --- | --- |
| Product philosophy or practice | Product principles, Product Strategy Stack, Working-Backwards PR/FAQ, Guardrail Metrics | Advisory context and PR checklist |
| UX philosophy or practice | Progressive Disclosure, System Status Visibility, Error Message Design, WCAG Conformance | Advisory context and PR checklist |
| Deterministic product/UX sub-check | Required accessibility metadata, documented destructive-action confirmation for dangerous flows, generated-doc link validity | May become a certified rulepack after fixtures and precision measurement |
| LLM-only product/UX judgement | "This flow feels confusing" or "This does not match the product principle" | Advisory only |

## Candidate practices for this repository

- `product-principles` - keep conformance decisions tied to maintainability, trust, and reuse.
- `product-strategy-stack` - keep product goals, target state, MVP, and rollout in one chain.
- `definition-of-ready-done` - require evidence before promoting rulepacks.
- `guardrail-metrics` - measure false positives, waiver rate, disable rate, latency, flapping, and accepted suggestions.
- `working-backwards-prfaq` - justify new integrations and rulepacks from user value.
- `progressive-disclosure` - show concise findings first, with evidence and rationale available.
- `system-status-visibility` - make advisory, warning, block, and fail-open states explicit.
- `error-message-design` - findings should state the problem, impact, and smallest fix.
- `wcag-conformance` - generated docs and future UI should stay accessible.

## Promotion criteria

A product or UX concern can move beyond advisory only when it is decomposed into a narrow, evidence-bearing rulepack:

1. The rule describes an observable contract, not a broad preference.
2. Fixtures include positive, negative, and non-applicable examples.
3. The checker has measured precision on real or representative changes.
4. Findings include evidence and a smallest-fix suggestion.
5. The project profile explicitly opts into the rule.

