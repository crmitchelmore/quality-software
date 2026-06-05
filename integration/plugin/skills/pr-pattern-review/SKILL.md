---
name: pr-pattern-review
description: Review a pull request against the project's selected design philosophies and patterns (patterns.config.yaml). Use when asked to review a PR, check that a change reuses existing helpers and respects architectural boundaries, or before merging. Performs baseline-aware, net-new gating (blocks only violations the PR introduces) plus reuse and capability-bypass advisories, then posts a structured review.
---

# PR Pattern Review

Review a pull request against the patterns and philosophies an onboarded project
has selected in `patterns.config.yaml`. Unlike `conformance check` (which looks at
the working tree in isolation), this is **baseline-aware**: it compares the PR head
against its merge base so it only flags what the PR *introduces*, never pre-existing
debt.

What it catches:

1. **Net-new boundary violations** (the only thing that **blocks**) — e.g. a domain
   file the PR makes import infrastructure directly, breaking the layered/hexagonal
   boundary the project adopted.
2. **Reuse advisories** — the PR re-implements a symbol that already has a canonical
   home elsewhere (`reuse.canonical-baseline`). "You added `formatDate`; it already
   lives at `src/util/dates.ts`."
3. **Capability-bypass advisories** — the PR adds *inline* use of a cross-cutting
   capability (date/time, JSON, crypto, HTTP, id-generation, money, validation) when
   the codebase already has a canonical helper for it (`reuse.capability-bypass`).
   "You called `java.time` directly; route it through `ClockProvider.kt`."

## Prerequisites

- The repo is **onboarded**: a `patterns.config.yaml` exists at the repo root. If it
  does not, run the `codebase-onboarding` skill first (or `conformance onboard
  --write-profile`) and get the user to confirm the profile before reviewing.
- `conformance` CLI available, and `gh` authenticated for PR operations.

## How to run

### 1. Resolve the PR and its base

For a numbered PR:

```bash
gh pr checkout <number>                                  # check out the PR branch
base=$(gh pr view <number> --json baseRefName -q .baseRefName)
git fetch origin "$base"
```

For the current branch, the base is usually `origin/main` (or the repo default).

### 2. Run the baseline-aware review

Human-readable:

```bash
conformance review --base "origin/$base"
```

Machine-readable (preferred when you will post comments) — emits the full
`ReviewResult` as JSON and exits `1` if there is a net-new block:

```bash
conformance review --base "origin/$base" --json
```

The JSON shape:

```jsonc
{
  "decision": "allow" | "block",
  "blocking":   [ Finding ],   // net-new boundary violations (block)
  "advisories": [ Finding ],   // reuse + capability-bypass + soft cert findings
  "findings":   [ Finding ],   // blocking ++ advisories
  "summary":    "…"
}
```

Each `Finding` has: `detectorId`, `severity` (`block`/`warning`/`advice`/`info`),
`path`, `message`, `suggestion`, and `evidence`.

### 3. Post the review

Group findings by `path` and post inline comments where possible, then a summary.

- If `decision === "block"`, request changes and list every `blocking` finding with
  its `message` + `suggestion`. These break an adopted boundary and should be fixed
  before merge.
- For `advisories`, comment but do **not** block — they are reuse/consistency nudges.
  Lead each with the canonical location the author should reuse.

Example using `gh`:

```bash
# Summary review (use --request-changes when decision is "block", else --comment)
gh pr review <number> --comment --body "$(cat review-summary.md)"

# Inline comment on a specific finding (path + line):
gh api repos/{owner}/{repo}/pulls/<number>/comments \
  -f body="<message> — <suggestion>" -f commit_id="$(git rev-parse HEAD)" \
  -f path="<finding.path>" -F line=<line>
```

If you cannot resolve exact lines, post a single summary review grouping findings by
file.

## Writing the summary

Structure the summary so the author sees the rationale, not just a rule id:

```
## Pattern review — <PASS | CHANGES REQUESTED>

**Blocking (N):** net-new boundary violations introduced by this PR
- `src/domain/order.ts` — imports infrastructure directly, breaking the
  domain→infrastructure boundary (Clean Architecture). → depend on the port
  interface instead.

**Reuse (M):**
- `src/feature/report.ts` — re-implements `formatDate`; canonical home is
  `src/util/dates.ts`. Reuse it rather than adding a parallel copy.

**Capability bypass (K):**
- `src/feature/report.ts` — new inline date/time handling; route it through the
  existing `src/util/clock.ts` helper so behaviour stays consistent.
```

Always tie a finding back to **why** (the adopted philosophy/pattern), state the
**canonical location** to reuse, and give the **smallest fix**.

## Notes

- **Net-new only:** the reviewer never blocks on pre-existing violations — only on
  ones the diff introduces (including a new infra module that makes an *unchanged*
  domain file's import illegal). Do not ask the author to fix unrelated debt.
- **Advisories never block.** Reuse and capability-bypass findings are guidance; the
  author may justify a deliberate exception (genuinely distinct concept, different
  layer). Hybrid architectures are legitimate.
- **Avoid capability false positives.** Do not treat declarative mechanisms (for example
  Jakarta validation annotations) or DI type imports (for example injected
  `ObjectMapper`) as bypasses. Capability bypass should mean a net-new inline
  implementation or construction that avoids an existing canonical helper/factory.
- **Intentional deviations:** if the author confirms a deviation is deliberate, record
  the rationale in the PR thread rather than forcing the change.
