# Source-of-truth and generated artefacts

Use this guide when editing the project so agents do not update generated files as if they were canonical.

| Area | Source of truth | Generated or derived outputs | Edit guidance |
| --- | --- | --- | --- |
| Software patterns | `patterns/**/*.yaml`, `catalogue-manifest.yaml`, `schema/pattern.schema.json` | `docs/patterns/**`, `docs/index.md`, graph references | Edit YAML and regenerate docs. |
| Product and UX practices | `product-patterns/**/*.yaml`, `ux-patterns/**/*.yaml`, `practice-manifest.yaml`, `schema/practice-pattern.schema.json` | `docs/product-patterns/**`, `docs/ux-patterns/**`, `docs/cross-source-connections.md` | Edit practice YAML and regenerate docs. |
| Philosophies | `philosophies/**/*.yaml`, `schema/philosophy.schema.json` | `docs/philosophies/**`, philosophy reverse indexes | Edit philosophy YAML and regenerate docs. |
| Knowledge graph | Catalogue, practice, and philosophy YAML | `docs/graph/knowledge-graph.json`, `docs/graph/index.md` | Regenerate from source YAML; do not hand-edit graph output. |
| Product requirements | `product.md` | None | Edit directly when product scope changes. |
| Validator design | `design/validator/*.md` | None | Edit directly; keep `13-mvp-and-trust.md` authoritative when docs conflict. |
| Runtime integration | `integration/src/**`, `integration/package.json`, `integration/test/**` | `integration/bin/*.mjs` if packaging changes | Edit source and tests together. |
| Evaluation benchmarks | `gh-aw-workflow-evals/benchmarks/*/cases.toml`, `case-metadata/**`, fixture manifests with pinned SHAs | `cases.jsonl`, benchmark registry docs | Edit the TOML/metadata, then regenerate and check JSONL/registry with gh-aw-evals. |
| Project conformance profile | `patterns.config.yaml` | Resolved profile in `conformance profile` | Treat this file as candidate until ratified; keep modes warn/advisory unless rulepacks are certified. |
| Evidence map | `patterns.map.yaml`, `patterns.anchors.yaml` when curated | `.conformance/project-map.json` | `.conformance/project-map.json` is derived and local; curate map/anchors before relying on them. |

## Validation commands

```bash
cd tools
npm run validate
npm run validate:practice
npm run validate:phil
npm run docs
npm run docs:practice
npm run docs:phil
npm run docs:graph

cd ../integration
npm test
npm run typecheck
```

## Agent editing rules

- Prefer source YAML over generated Markdown.
- Keep `patterns.config.yaml` small: core philosophies and selected pattern ids only.
- Put provenance, anchors, local flavours, and detailed evidence in `patterns.map.yaml`.
- Never promote a candidate pattern to `enforcement: block` without a certified detector, fixtures, measured precision, and maintainer ratification.
- Keep product and UX practices advisory unless a specific deterministic sub-check is designed and certified.
- Keep generated eval files honest: if `cases.jsonl` or registry updates cannot be regenerated and checked, mark the benchmark as pending rather than hand-editing generated outputs.
