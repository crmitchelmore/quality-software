# Product requirements: Pattern conformance for AI-assisted software projects

## Summary

This product helps teams keep AI-assisted codebases coherent as they grow. It lets a project declare the design philosophies, architectural patterns, implementation patterns, product practices, and UX practices it intends to follow, then checks human and agent-authored changes against those commitments at the earliest reliable point.

The core outcome is long-term maintainability: less duplicated code, less architectural drift, and more consistent implementation across large or fast-moving projects, so agents can be trusted with larger scopes of work.

## Problem

AI coding agents can produce locally correct code while degrading the global quality of a codebase over time. The main failure modes are:

1. **Duplication** - agents reimplement behaviour, helpers, abstractions, or patterns that already exist because they have not discovered the relevant prior art.
2. **Scale collapse** - greenfield projects often stay coherent early, but beyond roughly tens of thousands of lines, models need explicit architectural direction or the system tends towards spaghetti.
3. **Inconsistency** - agents introduce different naming conventions, error-handling styles, dependency patterns, testing styles, and architectural choices inside the same project.

Existing tools such as linting, type checking, static analysis, security scanning, and tests remain necessary, but they do not capture the project-specific question: "Does this change follow the patterns and philosophies this codebase has deliberately chosen?"

## Goals

- Make a project's intended design philosophy and pattern profile explicit, versioned, reviewable, and machine-readable.
- Detect drift from selected patterns as early as possible, starting at write time and escalating to PR and whole-codebase review.
- Help agents discover and reuse existing canonical implementations instead of duplicating them.
- Support brownfield onboarding by extracting the patterns, conventions, and inconsistencies already present in a repository.
- Keep enforcement trustworthy by separating deterministic, certifiable checks from advisory LLM judgement.
- Extend the same approach beyond software architecture into product and UX practices where useful.

## Non-goals

- Replace linters, tests, type checkers, security scanners, dependency analysis, or code review.
- Enforce every catalogue pattern against every repository.
- Treat a large markdown file as enforcement.
- Let LLM-only findings block writes or merges in v1.
- Auto-adopt hard bans or blocking rules without human ratification and measured evidence.
- Decide whether a feature should be built or whether it satisfies product requirements; this product focuses on codebase quality and conformance.

## Users

| User | Need |
| --- | --- |
| Maintainer | Define and evolve the project's chosen philosophies, patterns, bans, and enforcement levels. |
| AI coding agent | Receive timely context and feedback so generated code follows existing project conventions. |
| Reviewer | See whether a PR introduces new drift, duplication, or pattern violations. |
| Platform/enablement team | Roll out reusable conformance tooling across many repositories without hard-coding one architecture. |
| Brownfield adopter | Discover what a repository already does before deciding what to standardise or enforce. |

## Product concept

The product has three connected layers:

1. **Knowledge catalogue** - a structured catalogue of software patterns, product practices, UX practices, and design philosophies. This is the menu of possible target states.
2. **Project profile** - a repository-level `patterns.config.yaml` that declares which philosophies and patterns this project adopts, bans, or treats as advisory. This is the contract.
3. **Conformance engine** - a runtime-agnostic checker that evaluates changes against the profile and produces findings with evidence, confidence, severity, and a philosophy-to-pattern-to-fix rationale.

The catalogue explains what patterns mean. The project profile records what this repository has chosen. The engine enforces or advises against that chosen target state.

## Target state and pattern definitions

The system must support definitions at multiple levels of abstraction:

| Level | Examples | Typical evaluation altitude |
| --- | --- | --- |
| Philosophy | A Philosophy of Software Design, Domain-Driven Design, Unix philosophy, Design by Contract, product-led growth, design thinking | Profile selection, onboarding, PR review, whole-codebase review |
| Architecture | Event Sourcing, Hexagonal Architecture, Layered Architecture, Microservices, CQRS | PR review, whole-codebase review |
| Design/integration | Event-driven communication, Repository, Unit of Work, Outbox, Circuit Breaker, Dependency Injection | Write-time advisory, PR review |
| Implementation | Strategy, Factory, Guard Clause, Null Object, naming conventions, error-handling conventions, test layout | Write-time advisory, PR review |
| Product/UX practice | Progressive disclosure, product principles, onboarding tours, feedback loops | PR review and whole-product review, usually advisory |

Philosophies provide the "why". Patterns provide the checkable projection of those philosophies. Product and UX practices use the same model where a repository owns user-facing behaviour or product surfaces.

## Brownfield onboarding

Before enforcing anything in an existing repository, the product must build an evidence map:

- observed architecture, modules, boundaries, dependency directions, and entry points;
- existing naming, testing, error-handling, and dependency conventions;
- canonical implementations and reusable helpers that agents should prefer;
- duplicated or competing implementations of the same idea;
- likely philosophies and patterns already present, with confidence and evidence;
- inconsistencies where the repository appears to follow multiple conflicting approaches.

Onboarding output must be preview-first and advisory. It can propose a candidate `patterns.config.yaml` and anchor canonical implementations, but maintainers must ratify the profile before anything is enforced.

## Enforcement model

Enforcement happens in three phases. Each phase uses the same profile and finding model but trades latency against context.

| Phase | Trigger | Scope | Purpose | Default behaviour |
| --- | --- | --- | --- | --- |
| Write-time | File write or tool call during an agent session | Current file or local context | Catch cheap, local issues while the agent can still self-correct | Advisory, fail-open |
| PR/diff | Pull request opened or updated | Whole diff plus relevant repository context | Detect architectural, design, reuse, and consistency drift introduced by the change | Authoritative gate only for certified blocking rulepacks |
| Whole-codebase | Scheduled, on demand, or onboarding scan | Entire repository | Establish baselines, find systemic drift, and propose migrations | Advisory report and optional refactor branch |

The product should fix issues as early as possible, but only at the lowest level where the judgement is reliable. Naming conventions and local banned constructs can be checked close to write-time. Architectural conformance and reuse across modules generally need PR-level context. Whole-codebase scans are for baseline discovery, drift analysis, and migration planning.

## Trust and blocking policy

The product must maintain a hard line between advisory guidance and blocking enforcement:

- **Certified enforceable rulepacks** may block only when backed by deterministic or externally verifiable evidence, fixtures, measured precision, and explicit project configuration.
- **Advisory catalogue checks** may use LLM judgement to reason over broad patterns, philosophies, and product/UX practices, but they must not block in v1.
- **Write-time hooks** must be advisory and fail-open by default. They should not put editing on a fragile critical path.
- **PR CI** is the authoritative enforcement boundary because it applies to human and agent changes consistently.
- **LLM findings** must carry evidence spans, confidence, and concrete suggestions. They should abstain or demote when evidence is weak.
- **Waivers** must be explicit, scoped, reviewable, and invalidated when the underlying code changes materially.

This keeps the system useful without making it noisy or brittle.

## Functional requirements

### Profile and target-state management

- The system must load a repository-level `patterns.config.yaml`.
- The profile must support adopted philosophies, rejected philosophies, adopted patterns, banned patterns, practice patterns, enforcement levels, scoped path options, and rationale.
- The profile must validate that referenced philosophies, patterns, and practice patterns exist in the catalogue.
- The profile must detect direct contradictions, such as the same pattern being adopted and banned.
- Philosophy and pattern tensions should warn with required rationale rather than block by default.
- Generated profiles must default to advisory mode until a maintainer ratifies stricter enforcement.

### Agent context and write-time feedback

- At session start, the agent should receive a concise summary of the project's adopted philosophies, top patterns, bans, and reuse expectations.
- After file writes, the agent should receive actionable feedback for local conformance issues where latency and evidence are acceptable.
- Write-time feedback should prefer one or a small number of high-signal findings over broad reports.
- Write-time checks must fail open if the conformance engine crashes, times out, or lacks enough context.
- Pre-write blocking should be reserved for narrow security/destructive-command guardrails and explicitly promoted deterministic bans.

### PR and diff review

- The system must evaluate the net-new effect of a PR against the project profile.
- PR findings must identify the selected philosophy or pattern, the evidence, the changed location, the severity, confidence, and a suggested fix.
- PR review must include reuse analysis: whether a change duplicates an existing abstraction or bypasses a canonical implementation.
- Blocking findings must come only from certified rulepacks configured as `block`.
- Advisory findings should be reported without failing CI.
- Findings should deduplicate across write-time, PR-time, and later scans by stable semantic fingerprint.

### Whole-codebase review

- The system must scan an entire repository to identify the patterns and conventions it appears to follow.
- It must distinguish observed facts from inferred patterns and from recommendations.
- It must highlight inconsistent or competing conventions.
- It must produce migration-oriented findings, not just a flat list of violations.
- It should support scheduled drift reports and on-demand brownfield onboarding.

### Reuse and duplication control

- The system must index existing helpers, services, modules, adapters, test utilities, and canonical implementations.
- It must surface likely reuse targets when a change introduces similar behaviour.
- Reuse findings must explain why a target is canonical or likely relevant, with confidence and evidence.
- The system should avoid declaring a canonical implementation authoritatively unless the repository profile or anchors explicitly identify it.

### Runtime integration

- The conformance engine must expose a runtime-agnostic event and verdict contract.
- Runtime adapters should be thin translators with no conformance logic.
- GitHub Copilot CLI is the primary runtime for the first integration, using hooks, a skill, MCP tools, and a PR GitHub Action.
- The design should allow later adapters for Copilot cloud agent, Claude Code, Codex CLI, and OpenCode where their surfaces support it.
- Runtimes with fewer capabilities should degrade to advisory output rather than changing the engine's behaviour.

## MVP

The first useful version should prove the trust model on a narrow vertical slice:

- TypeScript service/backend repositories.
- GitHub Copilot CLI session priming and post-write advisory feedback.
- A PR GitHub Action that gates only certified deterministic rulepacks.
- A small set of high-value rulepacks, such as hexagonal boundary enforcement, banned service locator, banned active record, timeout required on remote calls, retry/circuit breaker guidance, idempotency guidance, outbox guidance, duplicate/reuse detection, and test-structure advice.
- Philosophy-first `conformance init` that proposes an advisory candidate profile from repo evidence.
- PR-level LLM advisory review for broader patterns, with no LLM blocking.
- Evidence map generation for brownfield repositories.

## Later capabilities

- Wider language support through a language-neutral code model.
- More certified rulepacks for common architecture and implementation patterns.
- Stronger whole-codebase architecture drift detection.
- Safer automated refactor branches for accepted migration recommendations.
- Team-level dashboards for drift, reuse, waivers, repeat violations, and rulepack precision.
- Product and UX conformance reviews for repositories with user-facing surfaces.
- Multi-runtime packaging beyond GitHub Copilot CLI.

## Success metrics

- Lower duplicate implementation rate in agent-authored PRs.
- Lower repeat violation rate after feedback is surfaced.
- High accepted-suggestion rate for advisory findings.
- Low false-positive and waiver rate for blocking rulepacks.
- Low disable rate for hooks and PR checks.
- Stable p50/p95 latency within phase budgets.
- Reduced architectural drift in scheduled whole-codebase reports.
- More PRs that reuse existing canonical abstractions.

## Open questions

- What minimum evidence and precision threshold should promote a rulepack from advisory to blocking?
- How should canonical implementations be ratified: profile entries, anchors file, code owners, or observed usage?
- Which product and UX practices can become checkable without becoming subjective or noisy?
- How should findings be presented differently to agents, reviewers, and maintainers?
- What is the right retention and privacy model for codebase evidence maps and LLM evaluation traces?
- How should teams manage profiles across monorepos with multiple bounded contexts or mixed architectures?

