---
name: codebase-onboarding
description: Build an evidence map of an existing codebase before adopting or aligning to design patterns. Use when onboarding a new repo, when asked "what patterns does this project use", to find duplication / canonical implementations, or before proposing a patterns.config.yaml. Produces an advisory, preview-first report; the user ratifies before anything is enforced.
---

# Codebase Onboarding

Use this **before** a project has a ratified `patterns.config.yaml`, or when you need to
understand an existing codebase's structure, canonical implementations, and duplication.

It produces an **evidence map**, not a verdict. Nothing is adopted or enforced until the
user ratifies it.

## When to use

- A new/unfamiliar repository needs an initial deep review.
- The user asks "what patterns does this project use?", "where is the canonical X?", or
  "are we duplicating this abstraction?".
- Before proposing or writing a `patterns.config.yaml`.

## How to run

```bash
conformance onboard                    # scan, print the evidence preview, write .conformance/project-map.json
conformance onboard --write-profile    # also write a warn-only candidate patterns.config.yaml (if none exists)
conformance onboard --write-map        # also write patterns.map.yaml with evidence, anchors, and local flavours
conformance onboard --write-anchors    # also write a committable patterns.anchors.yaml of canonical anchors
```

`.conformance/project-map.json` is a **derived** artifact (gitignored). `patterns.anchors.yaml`
and `patterns.config.yaml` are the **curated** outputs the user ratifies. Keep
`patterns.config.yaml` small: core philosophies only, and adopted patterns grouped
as `patterns -> high|medium|low -> adopt`. Put detailed provenance, flavours,
canonical homes, and file references in `patterns.map.yaml`, not the primary config.

## What to do with the output

The report has three tiers of certainty — present them honestly:

1. **Observed structure** (facts) — layers, module counts, dependency edges. Reliable.
2. **Detector-backed signals** — boundary/reuse/banned-construct findings (only once a
   profile exists). Reliable.
3. **Candidate patterns** (advisory) — e.g. "looks hexagonal", `*Repository` ⇒ repository.
   **Low/medium confidence. Do not treat as decided.**

Then:

- Summarise the structure and the **candidate canonical anchors** (each carries a
  confidence + reasons). Flag clusters that span layers as "possibly legitimately distinct".
- Present a high/medium/low pattern inventory with concrete file references. The
  user explicitly expects altitude grouping: high = application/platform, medium =
  component/service, low = method/class/file.
- Present the **recommended conservative (warn-only) profile** as a proposal.
- State plainly: *nothing has been adopted or enforced yet.*
- Ask the user to **ratify**: keep / edit the philosophies & patterns, confirm the canonical
  anchors, and only then save the profile (warn-only) and/or start an alignment pass.

## Guardrails

- Never present candidate patterns as the project's adopted patterns.
- Never auto-ban or propose `enforcement: block` — that is the user's decision.
- Canonical picks are heuristics; verify a flagged "duplicate" is truly the same abstraction
  before recommending consolidation (the same name in two bounded contexts is often fine).
- Avoid capability false positives: declarative mechanisms (for example validation
  annotations) and DI type imports (for example injected mappers/clients) are not
  duplicate helpers. Only call out inline implementation/construction or bypasses of
  an existing canonical helper/factory.
- Do not treat deterministic name/import rules as the full pattern analysis. They are
  supporting evidence; broad pattern/philosophy discovery should be language-neutral and
  catalogue-grounded, using semantic/LLM review where available, and marked advisory until
  the user ratifies it.
- Only after ratification, generate an alignment task list (smallest changes first).
