# Quality Software

A two-part project:

1. **Pattern catalogue** — a large, richly-tagged catalogue of software-engineering
   patterns (architecture down to code-level idioms), stored as structured YAML and
   rendered to browsable Markdown.
2. **Pattern-conformance validator** — a design for a mature mechanism that checks
   whether agent/human code changes apply the patterns a project has chosen, across
   three phases (later / write-time / PR-level). See [`design/validator`](design/validator/).

## Layout

```
schema/        pattern.schema.json + vocabularies.yaml (controlled tag values)
patterns/      <category>/<id>.yaml   — one file per pattern (source of truth)
docs/          generated Markdown: index.md + patterns/<category>/<id>.md
tools/         TypeScript tooling: validate, generate-docs, stats
design/        validator design (Part 2)
```

## Each pattern captures

- Title, also-known-as, scale, category, maturity.
- Short description + full description, problem/context, consequences.
- **Relationships**: `works_well_with` / `synergies` (with reasons), `conflicts_with`, `alternatives`.
- **Applicability tags**: `languages`, `frameworks`, `project_types`, free `tags`.
- **Examples**: negative (anti-pattern) vs positive code, with an explanation.
- **Mermaid diagram** (required for architectural-scale patterns).
- **Ratings** for three project sizes: small (<10k LOC), medium (≤100k), large (>100k).

## Tooling

```bash
cd tools
npm install
npm run validate      # schema + vocabulary + cross-reference checks (add --strict for CI)
npm run docs          # regenerate docs/ from patterns/
npm run stats         # catalogue coverage summary
```

`patterns/*.yaml` is the source of truth; `docs/` is generated. Run `npm run build`
(validate + docs) before committing pattern changes.

## Tracking

Work is tracked in [beads](https://github.com/) (`bd list`).
