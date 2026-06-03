# Productionisation roadmap

This project is launch-ready only when it can repeatedly prove that advisory pattern reviews improve maintainability without creating noisy or unsafe gates. The next work is therefore validation and packaging, not broad catalogue expansion.

## Launch target

The v1 product should help teams:

1. Onboard an existing repository into explicit philosophies, patterns, canonical anchors, and known gaps.
2. Review PRs against that target state with baseline-aware findings.
3. Keep low-trust findings advisory until deterministic or certified rulepacks are proven enough to block.
4. Use the same artefacts locally, in CI, and in agent workflows.

## MVP scope

Ship the smallest reliable loop:

| Capability | Launch requirement |
|---|---|
| Brownfield onboarding | Generates `patterns.config.yaml`, `patterns.map.yaml`, `patterns.anchors.yaml`, and an advisory report from real repo evidence. |
| PR review | Reviews only net-new conformance drift and reuse/capability bypass opportunities. |
| Trust model | Fails open for local/hooks; CI can block only on certified deterministic `block` findings. |
| Pilot activation | At least three real repos run advisory PR checks without blocking merges. |
| Evaluation | Benchmark cases include true positives, near misses, and a negative control. |

## Workstreams

### 1. Hardening

- Remove shell-string command construction from all git adapters.
- Keep MCP/tool entry points import-safe and typed at external boundaries.
- Treat GitHub Actions expressions as data: pass refs through `env:` and quote them in `run`.
- Make hook failures explicit but non-blocking for write-time local use.

### 2. Validation

- Add gh-aw-workflow-evals coverage for onboarding and conformance review behaviour.
- Track false-positive rate separately from missed-gap rate.
- Keep a curated pilot corpus of real PRs, near misses, and no-op cases.
- Promote a rule to `block` only after it has deterministic evidence, regression coverage, and low false-positive rate across pilots.

### 3. Pilot rollout

- Start advisory-only on `justspeaktoit`, `pasta`, and `todo`.
- Refresh `standards-compliance` rather than replacing its existing conformance profile.
- Use pilot findings to improve anchors and certified checks before widening rollout.
- Capture before/after examples for go-to-market material.

### 4. Packaging

- Provide one documented installation path for CI and one for local/agent use.
- Make generated artefact ownership clear so agents do not hand-edit generated catalogue docs.
- Publish a short "adopt in 30 minutes" guide once pilot workflows run cleanly.

### 5. Go to market

- Position around maintainability of AI-scaled brownfield and greenfield projects.
- Lead with concrete pilot outcomes: duplication found, canonical helpers reused, unsafe gates avoided, and drift fixed earlier.
- Sell advisory-first adoption; blocking is an advanced maturity level, not the default.

## Launch gates

Do not market this as production-ready until:

1. Integration tests pass for MCP and PR review entry points.
2. The eval benchmark compiles and has at least one negative control.
3. Pilot PR advisory workflows run successfully on three repos.
4. The documented trust model matches the implementation.
5. At least one real PR finding is validated by a human and converted into a case study.

