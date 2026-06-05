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
- For changes touching blocking eligibility, certified policies, PR review gating, or detector
  enforcement, run `cd integration && npm run eval:blocking` alongside tests/typecheck. Block
  promotion must be backed by labelled calibration fixtures and the Conformance workflow step,
  not a hand-maintained allowlist or manifest.
- Suppress known false positives with `patterns.exceptions.yaml` entries keyed by finding
  fingerprint and a non-empty reason. Do not disable an entire pattern to work around one false
  positive.
- In `integration/src/**`, do not construct git commands with shell strings. Use
  `execFile`/`execFileSync` and argument arrays. In GitHub Actions, pass GitHub refs through
  `env:` and quote them inside `run:` scripts.
- When installing or testing the Copilot CLI plugin, generated hooks, MCP config, and PR
  workflows must resolve the catalogue from an absolute project root or the active
  catalogue fallback. Do not rely on a consumer repo exporting `CONFORMANCE_CATALOGUE_ROOT`;
  smoke-test from the consumer repo with that variable unset. Verify installation through
  Copilot CLI commands such as `copilot plugin list` and `copilot plugin update`; do not switch
  to Claude Code plugin tooling unless the user explicitly asks for that runtime.
- After changing Copilot CLI hook configuration, restart the CLI before re-testing hook
  behaviour. Running sessions and background agents can keep cached `preToolUse` hooks.
- Keep automation output contracts stable. In particular, `conformance review --json` must
  emit JSON for every path, including no-change/no-diff cases, and PR automation paths need
  focused regression coverage.
- Advisory conformance PR workflows should resolve the catalogue without repository secrets by
  using the shared `crmitchelmore/quality-software/.github/actions/conformance-pr-review`
  action or, for unsupported runners, a pinned public tarball/release/package download. If the
  catalogue is unavailable, fail open and report the skipped advisory review in the job summary
  instead of failing the PR.
- Keep consumer repository workflows thin. Put reusable PR review setup, catalogue resolution,
  fallback handling, and reporting logic in the shared action/template rather than duplicating
  verbose shell scripts across pilot repositories.
- After releasing or repinning the shared conformance action, verify downstream pilot pipeline
  logs show `crmitchelmore/quality-software@<expected-ref>` on the PR head commit. Do not treat
  generic green checks as proof that the new action version ran.
- Pilot PR workflows should pin external action refs and the conformance catalogue `ref`, pin
  Node.js for `npm ci`, avoid persisting external checkout credentials, and upload a minimal
  skipped JSON artefact when any advisory setup step is unavailable. Make the
  primary repository checkout fail open too, and do not request `pull-requests: read` unless the
  workflow actually calls the GitHub PR API.
- `patterns.map.yaml` `anchors:` entries are file-path evidence consumed by primers/reviews.
  Do not rewrite them to symbolic `patterns.anchors.yaml` names unless the map loader is changed
  to resolve those symbols.
- Do not hand-edit generated catalogue docs under `docs/patterns/**`,
  `docs/product-patterns/**`, `docs/ux-patterns/**`, or `docs/philosophies/**`; edit source
  YAML and regenerate instead.
