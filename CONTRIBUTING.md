# Authoring a pattern

Each pattern is one YAML file at `patterns/<category>/<id>.yaml`. The filename **must**
equal `<id>.yaml`. `patterns/` is the source of truth; `docs/` is generated.

## Process

1. Pick the id/title/category/scale from [`catalogue-manifest.yaml`](catalogue-manifest.yaml).
   Use that exact id and category. Do **not** invent new ids.
2. Copy the shape from an exemplar:
   - `patterns/architecture/hexagonal-architecture.yaml` (architectural + mermaid)
   - `patterns/resilience/circuit-breaker.yaml` (integration + state diagram)
   - `patterns/gof-behavioural/strategy.yaml` (design)
   - `patterns/data-persistence/repository.yaml` (data/design)
   - `patterns/implementation/guard-clause.yaml` (implementation)
3. Only use tag values that exist in [`schema/vocabularies.yaml`](schema/vocabularies.yaml).
4. Only cross-reference ids that exist in `catalogue-manifest.yaml`
   (`works_well_with` / `synergies` / `conflicts_with` / `alternatives`).
5. Validate: `cd tools && npm run validate`. Forward references are warnings; schema and
   vocabulary problems are errors and must be fixed.

## Required fields (see `schema/pattern.schema.json`)

`id, title, scale, category, maturity, short_description, description,
languages, frameworks, project_types, examples, ratings`.

Strongly encouraged: `aka, problem, context, consequences, synergies` (preferred over a
bare `works_well_with`), `alternatives`/`conflicts_with`, `tags`, `references`.

## Quality bar

- **short_description**: 1–2 sentences, ≤320 chars.
- **description**: a substantial paragraph on intent and mechanics.
- **synergies**: 2–5 entries, each `{pattern, reason}` — the *reason* must be specific.
- **languages / frameworks / project_types**: realistic, from the vocab. Use
  `language-agnostic` / `none` where appropriate, but add concrete ones too.
- **examples**: at least one, each with a realistic **negative** (anti-pattern / before)
  and **positive** (pattern applied / after) code block in the same language, plus an
  `explanation` of why the positive is better. Code must be plausible and compile-shaped.
- **diagram**: REQUIRED for `scale: architectural`. Use Mermaid (`flowchart`,
  `sequenceDiagram`, `stateDiagram-v2`, or `C4`-style). Keep node labels short; avoid
  characters that break Mermaid. Optional but welcome for other large-scale patterns.
- **ratings**: `small` (<10k LOC libs/web apps/apis), `medium` (≤100k), `large` (>100k).
  Each is `{score: 1–5, notes}`. Be honest and discriminating — scores should differ
  across sizes where the pattern's value genuinely changes with scale. Use the scale:
  1 = avoid, 2 = rarely, 3 = situational, 4 = good fit, 5 = excellent fit.

## YAML tips

- Use block scalars (`|` or `>-`) for multi-line text and all code examples so colons,
  `#`, and indentation in code don't break parsing.
- Keep code examples indented consistently under the `positive:`/`negative:` `|` block.
- Do not include tabs.
