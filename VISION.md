# Vision: Quality Software

## The north star

Quality Software helps teams preserve codebase coherence while delegating larger scopes of work to AI agents.

It turns a repository's chosen philosophies, patterns, and canonical abstractions into reviewable guardrails that guide agents, support reviewers, and catch drift before it becomes architecture debt.

The first promise is narrow: reduce duplicate implementation and architecture drift in AI-authored pull requests.

## Why this matters now

AI coding tools can produce plausible local changes faster than teams can manually restate every architectural decision.

Their failure mode is usually not syntax; it is inconsistency across time, files, agents, and context windows.

Existing quality tools remain essential, but they do not answer the project-specific question: does this change follow the design choices this repository has deliberately made?

## The core belief

Code quality is not just the absence of bugs; it is the preservation of conceptual integrity over time.

For AI-assisted work, conceptual integrity requires explicit intent, discoverable prior art, timely feedback, and enforcement that is no stronger than the evidence behind it.

## The product model

1. **A knowledge catalogue** of software patterns, product practices, UX practices, and design philosophies.
2. **A project profile** that records what a repository actually chooses to adopt, reject, warn about, or enforce.
3. **A conformance engine** that evaluates write-time changes, pull requests, and whole-codebase evidence against that profile.

The catalogue is the menu. The profile is the contract. The engine is the feedback loop.

## Who it serves

For maintainers, it turns implicit engineering taste into explicit project guardrails.

For agents, it supplies the missing context: what this project values, where the canonical implementations live, and which shortcuts create drift.

For reviewers, it provides evidence-backed advice about whether a PR introduces net-new inconsistency.

For platform teams, it offers a reusable rollout path without pretending every repository should share the same architecture.

## Product principles

### Philosophy first, patterns second

Patterns should not be detached rules; every meaningful finding should explain the chain from philosophy, to pattern, to concrete fix.

### Advisory by default

The system earns trust by being useful before it becomes strict, so most findings should advise rather than block.

Blocking should be reserved for deterministic or certified checks with explicit project configuration, measured false-positive rates, and clear remediation paths.

### Brownfield before enforcement

Existing projects need evidence before rules, so onboarding should discover the architecture, conventions, canonical helpers, and inconsistencies already present before proposing a candidate profile.

The system must not mistake accidental legacy structure for intended architecture.

### Catch drift early, but only where reliable

Write-time feedback should catch cheap local issues, PR review should catch net-new architectural and reuse drift, and whole-codebase review should identify systemic problems.

Each phase should do the work it is reliable enough to do.

### Reuse before reinvention

The product should make canonical abstractions visible and flag likely parallel implementations before they spread.

### Runtime-agnostic core, thin adapters

The conformance engine should remain independent of any one AI runtime, with Copilot CLI, GitHub Actions, MCP, hooks, skills, and future integrations adapting to the same profile, contracts, and findings.

### Evidence over vibes

Every finding should carry enough evidence for a maintainer to understand, challenge, or accept it.

LLM judgement can interpret broad patterns, but it should never be presented as deterministic truth.

## The first market wedge

The strongest initial market is teams using AI agents on medium-to-large repositories where maintainability risk is already visible.

The first measurable outcomes are fewer duplicate abstractions, fewer boundary violations, fewer bypassed canonical helpers, high accepted-suggestion rates, low false-positive rates, and low check-disable rates.

## What success looks like

Quality Software is succeeding when:

- teams can onboard a brownfield repository and get a useful evidence map;
- maintainers can ratify a profile that accurately reflects project intent;
- agents receive concise, actionable conformance context during work;
- PR reviews catch real net-new drift that humans would otherwise miss;
- advisory findings are accepted often enough to prove value;
- blocking findings remain rare, deterministic, and trusted;
- teams keep the hooks and checks enabled because they help rather than annoy;
- codebases using the system show less duplication and more consistent module boundaries over time.

## What this project must prove

This repository is the reference implementation and the first proof point.

It must demonstrate that the same principles it recommends also improve itself:

- deep modules with narrow public interfaces;
- clear runtime adapters around a shared contract;
- reusable profile, catalogue, and evidence-map abstractions;
- behaviour-focused integration tests;
- advisory-first conformance output;
- deterministic gates only where evidence justifies them.

If the conformance system cannot keep its own architecture coherent, it will not credibly help other projects.

## What it should not become

Quality Software should not become:

- a giant markdown document that agents are expected to obey;
- a subjective LLM reviewer that blocks merges on taste;
- a replacement for tests, linters, type checking, security scanning, or code review;
- a universal architecture prescription;
- a tool that forces brownfield projects to pretend they are cleaner than they are;
- a noisy rule engine that teams disable after the first week.

The product wins by being specific, evidence-bearing, and useful inside real development workflows.

## Strategic bets

1. **AI code quality problems are often consistency problems.** Agents need help seeing and preserving a project's existing shape.
2. **Project-specific profiles beat generic best-practice lists.** Good guidance depends on what this repository has chosen.
3. **Advisory systems can still change behaviour.** Timely, high-signal feedback can guide agents without blocking work.
4. **Deterministic certification is the path to trusted enforcement.** Blocking needs measured evidence, not confidence language.
5. **Brownfield discovery is a product, not a setup step.** Understanding what a repository already does is valuable before any rule is enforced.

## Review questions

When reviewing this vision, the key questions are:

1. Is the north star specific enough, or should it be narrower?
2. Is the first market wedge the right one?
3. Are we positioning this as too much of a product, or still too much of a tool?
4. What proof would convince us this works across other repositories?
5. Which parts should be in the vision, and which belong in product requirements or roadmap documents?
