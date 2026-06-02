---
name: conformance-review
description: Review a code change (or the working tree) against the project's selected design philosophies and patterns defined in patterns.config.yaml. Use when asked to check conformance, review architecture alignment, or before opening a PR. Reports the philosophy → pattern → fix rationale for each finding.
---

# Conformance Review

This project declares its design philosophies and patterns in `patterns.config.yaml`
(philosophy-first; see `design/validator/`). Use the `conformance` CLI to check that
code aligns with them.

## When to use

- The user asks to "check conformance", "review the architecture", "is this aligned
  with our patterns", or similar.
- Before opening a PR, to catch boundary/reuse/banned-construct issues early.
- After a refactor, to confirm it did not drift from the selected patterns.

## How to run

Resolve the active profile:

```bash
conformance profile
```

Check the current change (uncommitted working-tree changes, or specific files):

```bash
conformance check                 # checks changed files (git diff) or src/
conformance check src/domain/order.ts
conformance check --event PR_REVIEW --base origin/main   # PR-style, exits non-zero on a blocking finding
```

## Interpreting findings

Each finding carries:

- **severity** — `advice` / `warning` / `block`. Write-time and most checks are advisory.
- **the philosophy → pattern → fix chain** (the `why:` line) — explains *why* the rule
  exists, tracing back to an adopted philosophy.
- **a concrete suggestion** — the smallest change that restores alignment.

Apply the suggestion, or if the deviation is intentional, record a rationale (hybrid
architectures are legitimate — the profile warns rather than blocks on tensions).

## Reuse first

Before introducing a new abstraction, ask whether one already exists:

```bash
conformance check src/path/new-thing.ts   # surfaces duplicate exports
```

Prefer reusing the existing abstraction over creating a parallel one.
