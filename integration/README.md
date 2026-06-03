# `@quality-software/conformance` — agent pattern-conformance integration

The runnable MVP of the validator design (`design/validator/`, authoritative stance in
`13-mvp-and-trust.md`). A **runtime-agnostic engine** that checks code changes against the
**design philosophies and patterns a project has selected**, plus a **GitHub Copilot CLI**
integration (hooks, a skill, an MCP server, a plugin) and a **PR-level GitHub Action**.

> Design stance: **write-time is advisory and fail-open**; the **PR gate is authoritative**;
> the **LLM judge is advisory-only** in v1. Philosophies are the *why* (selection +
> explanation); only a small set of **certified, fixtured detectors** may ever block.

## What it does

A project declares its philosophies + patterns in `patterns.config.yaml` (philosophy-first;
see `examples/patterns.config.yaml`). The engine then:

- **Primes the agent** at session start with the project's north-star philosophies/patterns.
- **Advises at write time** — when a file is created/edited, it flags boundary violations,
  banned constructs, and missed reuse, with a `philosophy → pattern → fix` rationale. It
  **never blocks** a write (fail-open).
- **Guards shells** — denies a tiny allowlist of destructive commands (`rm -rf /`, force-push
  to main, pipe-to-shell).
- **Gates PRs** — re-checks the whole change; patterns marked `enforcement: block` (and backed
  by a certified detector, e.g. the hexagonal/DDD import-boundary rule) fail CI.

## Architecture (the stable seam)

```
native runtime payload ──▶ adapter ──▶ ChangeSet ──▶ Engine(detectors) ──▶ ConformanceVerdict ──▶ adapter ──▶ native response
```

- `src/contract.ts` — canonical events, `Finding` (semantic fingerprint), `ConformanceVerdict`.
- `src/engine.ts` — selects detectors from the profile, runs them fail-open, dedupes by
  fingerprint, projects one verdict per event (deny only `PRE_SHELL`/blocking-`PR`).
- `src/catalogue.ts` — loads the generated knowledge graph (`docs/graph/knowledge-graph.json`)
  for the philosophy↔pattern rationale and bootstrap expansion.
- `src/profile.ts` — resolves `patterns.config.yaml`; warn-not-block coherence.
- `src/detectors/` — `forbidden-import` (flagship, `canBlock`), `banned-construct`, `reuse`.
- `src/adapters/copilot.ts` — Copilot CLI hook translation (fail-open).
- `src/init.ts` — `conformance init` candidate-profile bootstrap.
- `src/cli.ts` / `src/mcp.ts` — CLI + MCP stdio server.

## Install & run

```bash
cd integration && npm install
export CONFORMANCE_CATALOGUE_ROOT=/abs/path/to/quality-software   # this repo (the catalogue)

# in the project you want to govern (must contain patterns.config.yaml):
node /abs/path/to/quality-software/integration/bin/conformance.mjs profile
node /abs/path/to/quality-software/integration/bin/conformance.mjs check --event PR_REVIEW
node /abs/path/to/quality-software/integration/bin/conformance.mjs init        # propose a profile
node /abs/path/to/quality-software/integration/bin/conformance.mjs onboard     # scan codebase, print evidence map
```

`npm link` (or add `bin/` to PATH) to get the `conformance` / `conformance-mcp` commands.

## Onboarding an existing codebase

Before a project has a ratified profile, build an **evidence map** of what it already does:

```bash
conformance onboard                  # scan, print preview, write .conformance/project-map.json (gitignored)
conformance onboard --write-profile  # also write a warn-only candidate patterns.config.yaml (if none exists)
conformance onboard --write-anchors  # also write a committable patterns.anchors.yaml of canonical anchors
```

The report is **preview-first and advisory**: observed structure (facts) → detector-backed
signals → candidate patterns (low/medium confidence) → a conservative warn-only proposal.
Nothing is adopted or enforced until you ratify it. Canonical implementations are picked by a
scored heuristic (`{path, confidence, reasons[]}`), never authoritatively. See
[`design/validator/14-codebase-model.md`](../design/validator/14-codebase-model.md) and the
`codebase-onboarding` skill.

## Wiring into GitHub Copilot CLI

Recommended local install:

```bash
cd /abs/path/to/quality-software/integration
npm link
conformance install-copilot --force
```

The installer writes an Open Plugins-compatible bundle to
`~/.copilot/installed-plugins/_direct/quality-software--conformance`, with:

1. **Advisory hooks** — `SessionStart` (prime), `PostToolUse` on edits (advise), and
   `AgentStop` (nudge). The plugin intentionally does **not** install a `PreToolUse` bash
   guard because local AI development must fail open.
2. **Skills** — conformance review, PR pattern review, and codebase onboarding.
3. **Commands** — `conformance-doctor`, `conformance-onboard`, and `conformance-review`.
4. **MCP config** — `.mcp.json` pointing at the local catalogue checkout.

Run `conformance doctor` inside a target repo to verify that the catalogue, profile, map,
anchors, and plugin install are visible.

For CI, prefer a normal GitHub Action or reusable workflow over an agentic workflow for the
first PR integration. PR checks are reproducible, auditable, and can stay advisory until a
deterministic certified rule is promoted to blocking.

## Multi-runtime & remote

`adapters/` is the expansion seam. See `adapters/README.md` for Claude Code / Codex / OpenCode
wiring (same canonical contract) and `../.github/workflows/` + `copilot-setup-steps.yml` for
remote GitHub agentic environments. (Tracked as beads `72i`, `tk5`.)

## Tests

```bash
npm test        # node --test: engine behaviour, Copilot adapter, and the e2e todo-app build
```

The `test/e2e-todo.test.ts` suite simulates an agent authoring a hexagonal/DDD todo app
file-by-file and asserts that conformant code passes, deviations are caught the moment they
are written, a refactor clears the finding, banned constructs and missed reuse are surfaced,
and the PR gate blocks an unfixed violation.
