# Project alignment review

Status: advisory review, produced from repository inspection and parallel review agents. The candidate profile in `patterns.config.yaml` is deliberately warn/advisory only and should be ratified in a PR before it is treated as an adopted project contract.

## Executive summary

The project is strongly aligned to the product goals in `product.md`: it has a structured catalogue, philosophy/practice catalogues, generated docs, a mature validator design, a runnable conformance MVP, Copilot hooks, skills, MCP, plugin packaging, and PR workflow wiring.

The biggest alignment risk was practical rather than conceptual: the root Copilot hook configuration claimed fail-open behaviour, but an unavailable/erroring `conformance` command caused shell tools to be denied in this session. The hook config now degrades with `|| true` so missing local tooling does not block editing.

## Alignment to product goals

| Product goal | Current evidence | Alignment | Notes |
| --- | --- | --- | --- |
| Explicit target state | `patterns/`, `philosophies/`, `product-patterns/`, `ux-patterns/`, schemas, generated docs, and the candidate `patterns.config.yaml` | Strong | The new root profile selects a small advisory set across philosophies, software patterns, testing, product, and UX. |
| Brownfield onboarding | `integration/src/model/project-map.ts`, `inventory.ts`, `proposal.ts`, `pattern-map.ts`, `report.ts`, `codebase-onboarding` skill | Strong | Evidence-map flow distinguishes observed facts from advisory candidates and never auto-bans. |
| Early drift detection | `.github/hooks/conformance.json`, `integration/src/adapters/copilot.ts`, `engine.ts` | Good | Write-time is advisory and fail-open in code; hook config has been patched to match that intent when the binary is missing. |
| PR-level gate | `.github/workflows/conformance.yml`, `integration/src/review/pr-review.ts`, `policy/certify.ts` | Good | The design correctly treats PR CI as the authoritative gate and deterministic policy certification as the only block source. |
| Whole-codebase evaluation | `conformance onboard`, `BATCH` event, evidence map, pattern inventory | Good | The model exists and is tested; future work is stronger drift history and migration planning. |
| Reuse/duplication control | `detectors/reuse.ts`, `model/capabilities.ts`, `patterns.anchors.yaml`, `patterns.map.yaml` | Good | Duplicate-symbol and capability-bypass logic includes guardrails against common false positives. |
| Product/UX extension | practice catalogue, philosophy catalogue, `practicePatterns` in candidate profile | Partial | Product/UX are correctly advisory, but scope boundaries should remain explicit until certifiable checks exist. |

## Observed structure

- **Catalogue source of truth:** `patterns/`, `catalogue-manifest.yaml`, `schema/pattern.schema.json`.
- **Practice source of truth:** `product-patterns/`, `ux-patterns/`, `practice-manifest.yaml`, `schema/practice-pattern.schema.json`.
- **Philosophy source of truth:** `philosophies/`, `schema/philosophy.schema.json`.
- **Generated docs:** `docs/patterns/`, `docs/product-patterns/`, `docs/ux-patterns/`, `docs/philosophies/`, `docs/graph/`.
- **Tooling:** `tools/src/*` validates and regenerates catalogue docs and graph outputs.
- **Conformance MVP:** `integration/src/contract.ts`, `engine.ts`, `profile.ts`, `model/*`, `detectors/*`, `policy/*`, `judge/*`, `review/*`, `adapters/*`, `cli.ts`, `mcp.ts`.
- **Agent surfaces:** `.github/hooks/conformance.json`, `.github/skills/*`, `.github/workflows/conformance.yml`, `integration/plugin/plugin.json`, `integration/mcp-config.example.json`.

## Candidate pattern inventory

These are recommended candidates only; they are not hard adoption decisions.

### High-level: application / platform

| Candidate | Confidence | Evidence | Recommended mode |
| --- | --- | --- | --- |
| `modular-monolith` | Medium | Repository is a cohesive multi-part system with separate catalogue, tooling, design, integration, schema, and generated-doc areas. | advise |
| `hexagonal-architecture` | Medium | `contract.ts` + `engine.ts` form a runtime-agnostic core; Copilot/MCP/CLI/PR integrations are adapters. | warn |
| `layered-architecture` | Medium | Integration package is split into contract, engine, model, detectors, policy, review, adapters, judge, CLI, and MCP. | warn |
| `microkernel` | Low | Hooks, skills, MCP tools, plugin packaging, and future runtime adapters extend one core. | advise |
| `pipes-and-filters` | Low | Evidence extraction, policy certification, LLM advisory judgement, and finding projection are separable stages. | advise |

### Medium-level: component / service

| Candidate | Confidence | Evidence | Recommended mode |
| --- | --- | --- | --- |
| `adapter` | High | Runtime adapters translate native payloads to/from the canonical contract. | warn |
| `strategy` | Medium | Language providers, detectors, runtime dialects, and LLM routing are swappable. | advise |
| `facade` | Medium | CLI and MCP expose simple operational surfaces over deeper internals. | advise |
| `factory-method` | Medium | Detector, inventory, profile proposal, and pattern map builders centralise construction. | advise |
| `dependency-injection` | Medium | Engine/Judge/model functions receive catalogues, profiles, clients, budgets, and registries explicitly. | advise |
| `contract-first-api` | High | Canonical TypeScript contract, JSON schemas, YAML manifests, and hook/MCP contracts define public seams. | warn |

### Low-level: method / class / file

| Candidate | Confidence | Evidence | Recommended mode |
| --- | --- | --- | --- |
| `guard-clause` | Medium | Missing profile/path/content, offline LLM, unsupported phases, and invalid payloads return early. | advise |
| `arrange-act-assert` | Medium | Node tests mostly arrange representative fixtures, exercise public seams, and assert observable outcomes. | advise |

### Product and UX practice candidates

| Candidate | Discipline | Why it fits |
| --- | --- | --- |
| `product-principles` | Product | Makes quality, trust, and maintainability principles explicit for future conformance decisions. |
| `product-strategy-stack` | Product | Keeps product goals, target state, enforcement model, and MVP sequencing aligned. |
| `definition-of-ready-done` | Product | Conformance rulepacks need clear readiness, ratification, fixture, and validation criteria. |
| `guardrail-metrics` | Product | Promotion from advisory to blocking depends on precision, waiver, disable, latency, and flapping metrics. |
| `working-backwards-prfaq` | Product | New rulepacks and integrations should be justified from user impact, not catalogue completeness. |
| `progressive-disclosure` | UX | Findings should reveal detail gradually: summary, evidence, rationale, fix. |
| `system-status-visibility` | UX | Advisory vs warning vs block vs fail-open state must be obvious to agents and reviewers. |
| `error-message-design` | UX | Findings should state what happened, why it matters, and the smallest fix. |
| `wcag-conformance` | UX | Generated docs and any future UI should remain accessible. |

## Code quality review

| Finding | Evidence | Impact | Recommendation |
| --- | --- | --- | --- |
| Hook fail-open mismatch | `.github/hooks/conformance.json` invoked `conformance` directly; shell commands were denied when the hook errored. | Breaks the write-time fail-open principle and blocks unrelated work. | Patched commands to degrade with `command -v conformance ... || true`. |
| Weak MCP params typing | `integration/src/mcp.ts` uses `any` for JSON-RPC params and tool arguments. | Public boundary accepts untyped shapes; runtime errors are easier to introduce. | Add small param guards/types per MCP tool before expanding the server. |
| Shell command construction | `integration/src/model/project-map.ts` shells out with `execSync` for git metadata. | Low risk locally, but brittle if `repoRoot` is ever derived from untrusted input. | Prefer `execFileSync("git", ["-C", repoRoot, "rev-parse", "--short", "HEAD"])`. |
| Hand-rolled YAML renderers | `proposal.ts`, `pattern-map.ts`, and `report.ts` manually render YAML/Markdown. | Simple today, but fields can drift or break quoting as maps grow. | Extract a tiny rendering helper or use `js-yaml` for YAML documents that are meant to be re-read. |
| Presentation logic mixed with model logic | `pattern-map.ts` owns both map construction and YAML rendering; `proposal.ts` builds and renders profile YAML. | Makes output-format changes riskier and encourages duplicate rendering rules. | Split model builders from renderers when the next output format is added. |
| Product/UX scope needs a trust line | Product goals include product/UX practices; trust doc says they are advisory unless decomposed into rulepacks. | Future contributors may over-enforce subjective checks. | Keep product/UX in `practicePatterns` as advisory and document certifiable sub-checks before gating. |

## Recommended next alignment work

1. Add typed MCP parameter guards before adding more MCP tools.
2. Replace `execSync` string shelling in `project-map.ts` with argument-vector execution.
3. Extract YAML rendering for `patterns.config.yaml`, `patterns.map.yaml`, and anchors into one helper.
4. Add a small fixture-driven precision report for each rulepack before any `warn` candidate is promoted to `block`.
5. Add generated-vs-source docs guidance so agents edit source YAML rather than generated Markdown.
6. Keep product/UX checks advisory until they are decomposed into deterministic, certifiable checks.

## Validation status

Shell-based validation could not run in this session because the preToolUse hook continued to error in the active runtime after the hook config was patched. The validation commands to run locally are:

```bash
cd tools && npm run validate && npm run validate:practice && npm run validate:phil
cd ../integration && npm test && npm run typecheck
```
