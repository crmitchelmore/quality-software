# Alpha quickstart

Quality Software is alpha-ready for advisory use. Start fail-open, ratify generated profiles
with humans, and only promote deterministic/certified findings to blocking after eval evidence.

## 1. Greenfield repositories

Use this when a new repository should start with explicit architecture/pattern guidance.

1. Copy or create `patterns.config.yaml` with the selected philosophies and patterns.
2. Add any known canonical helpers to `patterns.anchors.yaml`.
3. Install the local Copilot plugin for write-time guidance:

   ```bash
   cd /path/to/quality-software/integration
   npm ci
   npm link
   conformance install-copilot --force
   ```

4. In the target repository, verify the profile:

   ```bash
   conformance doctor
   conformance profile
   ```

Keep generated profiles warn-only until the team has agreed the profile represents the intended
architecture.

## 2. Brownfield repositories

Use this when a repository already has working conventions and the goal is to capture them.

```bash
conformance onboard
conformance onboard --write-profile --write-map --write-anchors
```

Review the generated artefacts before committing them:

- `patterns.config.yaml` selects the advisory profile.
- `patterns.map.yaml` records observed pattern evidence and gaps.
- `patterns.anchors.yaml` records reusable canonical helpers agents should prefer.
- `.conformance/project-map.json` is local evidence and should stay gitignored.

Treat onboarding PRs as product decisions. Generated suggestions are evidence, not policy.

## 3. PR review action

Add the advisory PR review workflow to `.github/workflows/conformance-pr-review.yml`:

```yaml
name: Conformance PR Review

on:
  pull_request:
    branches:
      - main
  workflow_dispatch: {}

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}-conformance
  cancel-in-progress: true

jobs:
  conformance-pr-review:
    name: Advisory conformance review
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - name: Checkout repository
        continue-on-error: true
        uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6
        with:
          fetch-depth: 0

      - name: Run advisory conformance review
        uses: crmitchelmore/quality-software/.github/actions/conformance-pr-review@v0.1.0
        with:
          base-ref: ${{ github.base_ref || 'main' }}
```

The action runs fail-open and uploads `conformance-review` artefacts containing JSON output.
Make the check required only after the repository has measured enough signal/noise to trust it.

## 4. Local Copilot CLI plugin

Install once from a local checkout:

```bash
cd /path/to/quality-software/integration
npm ci
npm link
conformance install-copilot --force
```

Then restart Copilot CLI and run this inside a target repository:

```bash
conformance doctor
```

The plugin adds session primers, post-write advisory feedback, skills, commands, and MCP wiring.
It deliberately stays advisory for local development.

## 5. Promotion path

1. Pilot in advisory mode.
2. Classify findings as useful, noisy, missed, or unsafe.
3. Convert useful/missed cases into `gh-aw-workflow-evals`.
4. Promote only deterministic or certified rules to blocking, and only when the profile opts in.
