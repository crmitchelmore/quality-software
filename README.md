# Quality Software

A multi-part project:

1. **Pattern catalogue** — a large, richly-tagged catalogue of **275** software-engineering
   patterns (architecture down to code-level idioms, including a cutting-edge `ai-ml`
   category), stored as structured YAML and rendered to browsable Markdown.
2. **Practice catalogue** — product-management and UX-design **practice patterns**
   (`product-patterns/`, `ux-patterns/`) plus cross-domain **design philosophies**, all
   cross-referenced back into the software catalogue. See the generated
   [cross-source connections](docs/cross-source-connections.md).
3. **Pattern-conformance validator** — a design for a mature mechanism that checks
   whether agent/human code changes apply the patterns a project has chosen, across
   three phases (later / write-time / PR-level). See [`design/validator`](design/validator/).
4. **Conformance integration (runnable MVP)** — a runtime-agnostic engine + GitHub Copilot
   CLI integration (hooks, skill, MCP, plugin) + PR Action that guides agents to a project's
   selected philosophies/patterns and keeps changes aligned. See [`integration`](integration/).

The product-level requirements live in [`product.md`](product.md). This repository's
candidate, warn-only conformance profile lives in [`patterns.config.yaml`](patterns.config.yaml),
with supporting evidence in [`patterns.map.yaml`](patterns.map.yaml),
[`patterns.anchors.yaml`](patterns.anchors.yaml), and
[`docs/conformance/alignment-review.md`](docs/conformance/alignment-review.md). Launch readiness is
tracked in [`docs/launch/productionisation-roadmap.md`](docs/launch/productionisation-roadmap.md),
with the initial pilot operating guide in [`docs/launch/pilot-rollout.md`](docs/launch/pilot-rollout.md).

## What is enforced today

The catalogue is intentionally broad; the runtime does **not** enforce all 275 patterns.
In the current alpha, most findings are advisory context for agents and reviewers. Blocking
is only appropriate for deterministic, certified checks that a profile explicitly promotes
to `enforcement: block`; today that means the PR-level boundary/import rule for
hexagonal/clean/onion/layered architectures.

Write-time hooks are fail-open and advisory. LLM-backed judgements are advisory-only. The
shell guard is a narrow denylist for three common footguns (`rm -rf /`, force-push to main,
and pipe-to-shell); it is not a security boundary and does not replace normal permissions,
branch protection, tests, SAST, secret scanning, or code review.

## Layout

```
schema/         pattern.schema.json + practice-pattern.schema.json + philosophy.schema.json + vocabularies.yaml
patterns/       <category>/<id>.yaml   — one file per software pattern (source of truth)
product-patterns/  <id>.yaml           — one file per product-management practice pattern
ux-patterns/    <id>.yaml              — one file per UX-design practice pattern
philosophies/   <id>.yaml              — one file per design philosophy (software / product / ux / cross-cutting)
practice-manifest.yaml  single source of truth for practice-pattern + new philosophy IDs
docs/           generated Markdown: index.md + patterns/** + product-patterns/** + ux-patterns/** + philosophies/**
tools/          TypeScript tooling: validate(:practice/:phil), generate-docs(:practice/:phil), stats
design/         validator design
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

## Product & UX practice patterns

`product-patterns/` and `ux-patterns/` extend the same rigour to product management and
UX design. Each **practice pattern** shares one schema (`schema/practice-pattern.schema.json`)
with a `discipline` of `product` or `ux`, and captures:

- problem / context / forces / solution, plus `when_to_use` and `anti_patterns`;
- **product metrics** (for product patterns) or **UX heuristics** (for UX patterns);
- prose **examples** contrasting a poorer vs better approach;
- **ratings** for three organisation stages: early (pre-PMF), growth, enterprise;
- **cross-references** into the software catalogue (`related_software_patterns`), to other
  practice patterns, and to philosophies — each with a reason.

Philosophies can also be tagged `discipline: product | ux | cross-cutting` and associate
practice patterns (e.g. *The Lean Startup*, *The Design of Everyday Things*, *Design Thinking*).
The generated [cross-source connections](docs/cross-source-connections.md) page is a reverse
index of every software pattern and philosophy referenced by a product or UX pattern.

## Tooling

```bash
cd tools
npm install
npm run validate          # software pattern schema + vocab + cross-reference checks (add --strict for CI)
npm run validate:practice # product/UX practice-pattern schema + global id uniqueness + cross-refs
npm run validate:phil     # philosophy schema + cross-references to real pattern/philosophy ids
npm run docs              # regenerate docs/patterns/** from patterns/
npm run docs:practice     # regenerate docs/product-patterns/**, docs/ux-patterns/**, cross-source index
npm run docs:phil         # regenerate docs/philosophies/** from philosophies/
npm run stats             # catalogue coverage summary
npm run build             # validate (all) + docs (all)
```

Source-of-truth YAML lives in `patterns/`, `product-patterns/`, `ux-patterns/` and
`philosophies/`; `docs/` is generated. Run `npm run build` before committing changes.

## Tracking

Work is tracked in [beads](https://github.com/) (`bd list`).
