# Pilot rollout guide

Pilot repositories should start in advisory mode. The goal is to gather evidence, tune anchors, and measure noise before any blocking policy is considered.

## Pilot repos

| Repo | Initial state | Activation |
|---|---|---|
| `justspeaktoit` | Candidate config, map, and anchors | Advisory PR workflow added. |
| `pasta` | Candidate config, map, and anchors | Advisory PR workflow added. |
| `todo` | Candidate config, map, and anchors | Advisory PR workflow added. |
| `standards-compliance` | Existing config/map retained; anchors added | Refresh existing profile after validation. |
| `gh-aw-workflow-evals` | Benchmark seed in progress | Use to validate the review workflow. |

## Required artefacts

Each pilot needs:

- `patterns.config.yaml` for selected philosophies, phases, and trust policy.
- `patterns.map.yaml` for observed architecture, patterns, gaps, and file-path evidence.
- `patterns.anchors.yaml` for canonical helpers, modules, and examples agents should reuse.
- An advisory activation path, preferably `.github/workflows/conformance-advisory.yml`.

## Operating rules

1. Keep `phases.pr.failOn: block` while configs are advisory-only.
2. Do not add `enforcement: block` until the finding type is deterministic or certified.
3. Treat LLM-only findings as advisory, even when they are high-confidence.
4. Refresh hand-authored maps with generated onboarding output once the CLI is stable.
5. Convert useful pilot findings into eval cases before promoting rules.
6. Keep advisory PR workflows reproducible: prefer the shared `conformance-pr-review` action
   pinned to `v0.2.0` or a commit SHA, pin external action refs, pin Node.js, avoid unused token
   permissions, and emit/upload a skipped JSON artefact when repository checkout, catalogue
   install, or base comparison is unavailable.

## Validation loop

For each pilot:

1. Run onboarding to refresh map and anchors.
2. Open or reuse a representative PR.
3. Run advisory conformance review in CI.
4. Classify findings as useful, noisy, missed gap, or unsafe.
5. Add at least one useful or missed case to `gh-aw-workflow-evals`.

For new pilots, use the [alpha quickstart](alpha-quickstart.md).
