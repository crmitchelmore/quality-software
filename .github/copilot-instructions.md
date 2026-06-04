# Copilot instructions for Quality Software

## Conformance product rules

- Treat conformance output as advisory unless a rule is deterministic or certified, the
  profile explicitly allows `enforcement: block`, and the PR phase is configured to fail on
  block findings. Pilot profiles should stay advisory with `phases.pr.failOn: block` and no
  block enforcement.
- Do not claim validation is complete when shell, hooks, or tooling prevent commands from
  running. Report blocked validation plainly and leave generated eval artefacts pending until
  `npm test`, `npm run typecheck`, YAML parsing, and `gh-aw-evals cases compile ... --check`
  have run successfully.
- In `integration/src/**`, do not construct git commands with shell strings. Use
  `execFile`/`execFileSync` and argument arrays. In GitHub Actions, pass GitHub refs through
  `env:` and quote them inside `run:` scripts.
- When installing or testing the Copilot CLI plugin, generated hooks, MCP config, and PR
  workflows must resolve the catalogue from an absolute project root or the active
  catalogue fallback. Do not rely on a consumer repo exporting `CONFORMANCE_CATALOGUE_ROOT`;
  smoke-test from the consumer repo with that variable unset.
- After changing Copilot CLI hook configuration, restart the CLI before re-testing hook
  behaviour. Running sessions and background agents can keep cached `preToolUse` hooks.
- Keep automation output contracts stable. In particular, `conformance review --json` must
  emit JSON for every path, including no-change/no-diff cases, and PR automation paths need
  focused regression coverage.
- Advisory conformance PR workflows that checkout the private `crmitchelmore/quality-software`
  catalogue must fail open when `CONFORMANCE_CATALOGUE_TOKEN` is missing, and should report the
  skipped advisory review in the job summary instead of failing the PR.
- Pilot PR workflows should pin external action refs and the conformance catalogue `ref`, pin
  Node.js for `npm ci`, set `persist-credentials: false` on the external catalogue checkout, and
  upload a minimal skipped JSON artefact when any advisory setup step is unavailable.
- `patterns.map.yaml` `anchors:` entries are file-path evidence consumed by primers/reviews.
  Do not rewrite them to symbolic `patterns.anchors.yaml` names unless the map loader is changed
  to resolve those symbols.
- Do not hand-edit generated catalogue docs under `docs/patterns/**`,
  `docs/product-patterns/**`, `docs/ux-patterns/**`, or `docs/philosophies/**`; edit source
  YAML and regenerate instead.
