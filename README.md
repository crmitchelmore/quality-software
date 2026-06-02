# Quality Software

A two-part project:

1. **Pattern catalogue** — a large, richly-tagged catalogue of **275** software-engineering
   patterns (architecture down to code-level idioms, including a cutting-edge `ai-ml`
   category), stored as structured YAML and rendered to browsable Markdown.
2. **Pattern-conformance validator** — a design for a mature mechanism that checks
   whether agent/human code changes apply the patterns a project has chosen, across
   three phases (later / write-time / PR-level). See [`design/validator`](design/validator/).

## Layout

```
schema/        pattern.schema.json + philosophy.schema.json + vocabularies.yaml
patterns/      <category>/<id>.yaml   — one file per pattern (source of truth)
philosophies/  <id>.yaml              — one file per design philosophy
docs/          generated Markdown: index.md + patterns/** + philosophies/**
tools/         TypeScript tooling: validate(:phil), generate-docs(:phil), stats
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

## Design philosophies

`philosophies/` holds distinct schools of software design thought (e.g. *A Philosophy of
Software Design*, the Unix philosophy, Domain-Driven Design, Worse Is Better, Design by
Contract, Data-Oriented Design). Each philosophy:

- captures its originators, origin, core tenets and key ideas;
- **associates patterns** from the catalogue that embody it (and patterns it is at odds with);
- records **where it has reportedly been applied**, each with a source and an
  `evidence_strength` (primary-source / secondary-source / inferred) to avoid over-claiming;
- relates to other philosophies via `complements` / `tensions_with`.

The generated [philosophy index](docs/philosophies/index.md) also includes a reverse
*pattern → philosophies that motivate it* table.

## Tooling

```bash
cd tools
npm install
npm run validate      # pattern schema + vocab + cross-reference checks (add --strict for CI)
npm run validate:phil # philosophy schema + cross-references to real pattern/philosophy ids
npm run docs          # regenerate docs/patterns/** from patterns/
npm run docs:phil     # regenerate docs/philosophies/** from philosophies/
npm run stats         # catalogue coverage summary
npm run build         # validate + validate:phil + docs + docs:phil
```

`patterns/*.yaml` and `philosophies/*.yaml` are the source of truth; `docs/` is generated.
Run `npm run build` before committing changes.

## Tracking

Work is tracked in [beads](https://github.com/) (`bd list`).
