/**
 * Canonical, runtime-agnostic conformance contract.
 *
 * This is the stable seam described in design/validator/12-integration-contract.md.
 * Every runtime adapter (Copilot CLI, Claude Code, Codex, ...) translates its native
 * hook payloads to/from these types; no conformance logic lives in an adapter.
 *
 * Design stance (design/validator/13-mvp-and-trust.md): write-time is advisory and
 * fail-open; PR CI is the authoritative gate; the LLM judge is advisory-only in v1.
 */

/** Canonical lifecycle events the engine understands. */
export type CanonicalEvent =
  | "SESSION_START"
  | "PRE_WRITE_INTENT" // tool args only (may be a partial patch) — cheap checks + guardrails
  | "POST_WRITE_CONTENT" // final file on disk — AST-capable, advisory
  | "PRE_SHELL" // before a shell/command tool — destructive-command guardrails
  | "TURN_END" // agent finished a turn — optional loop continuation
  | "PR_REVIEW" // PR opened/updated — authoritative gate
  | "BATCH"; // on demand / scheduled — whole repo

/** A single file under consideration. `content` is absent for PRE_WRITE_INTENT. */
export interface ChangeFile {
  path: string;
  content?: string;
  /** Raw tool arguments when only intent is known (PRE_WRITE_INTENT). */
  intentArgs?: unknown;
}

/** The unit of work handed to the engine. */
export interface ChangeSet {
  event: CanonicalEvent;
  files: ChangeFile[];
  /** Optional shell command for PRE_SHELL. */
  shellCommand?: string;
  /** Absolute repo root. */
  repoRoot: string;
}

export type Severity = "info" | "advice" | "warning" | "block";

/** What an adapter can actually do with a verdict on its runtime. */
export interface RuntimeCapabilities {
  canDeny: boolean;
  canRewriteArgs: boolean;
  canInjectContext: boolean;
  canContinueLoop: boolean;
}

/**
 * A single conformance finding. Identity is a SEMANTIC FINGERPRINT
 * (design 13.5), not (pattern, location), so findings dedupe cleanly across
 * write -> pr -> later and do not flap when lines move.
 */
export interface Finding {
  /** Stable semantic fingerprint — see fingerprint(). */
  fingerprint: string;
  detectorId: string;
  detectorVersion: string;
  /** Catalogue pattern id this relates to (if any). */
  patternId?: string;
  /** Adopted philosophy that motivates the rule (the "why"). */
  philosophyId?: string;
  severity: Severity;
  path: string;
  line?: number;
  message: string;
  /** Concrete, actionable suggestion (ideally a diff hint). */
  suggestion?: string;
  /** Verifiable evidence span(s) — required for LLM findings (design 13.4). */
  evidence?: string;
  /** The philosophy -> pattern -> suggestion rationale chain, for "why" details. */
  rationale?: string;
}

/** The single canonical verdict returned by the engine. */
export interface ConformanceVerdict {
  decision: "allow" | "deny" | "advise";
  findings: Finding[];
  /** Required when decision === "deny". */
  reason?: string;
  /** Optional safe auto-fix of the tool input (only when provably safe). */
  modifiedArgs?: unknown;
  /** Feedback injected into the agent's context (advisory path). */
  additionalContext?: string;
  /** Ask the runtime to run another turn to fix findings. */
  continueLoop?: { prompt: string };
}

/**
 * A detector variant (design 13.6). One pattern may have several, each judged
 * at the altitude where its evidence exists.
 */
export interface Detector {
  id: string;
  version: string;
  patternId?: string;
  /** Lowest context this detector needs. */
  requiresContext: "file" | "module" | "repo";
  /** Canonical events this detector may run in. */
  events: CanonicalEvent[];
  /** Whether this detector is allowed to block. Requires fixtures + measured precision. */
  canBlock: boolean;
  /** Soft latency budget; the governor skips slower detectors at write-time. */
  maxLatencyMs: number;
  /** Run the detector over a change set; return zero or more findings. */
  run(change: ChangeSet, ctx: DetectorContext): Promise<Finding[]> | Finding[];
}

/** Shared context handed to every detector. */
export interface DetectorContext {
  repoRoot: string;
  profile: ResolvedProfile;
  /** Look up the philosophy that motivates a pattern, for the rationale chain. */
  rationaleFor(patternId: string): { philosophyId?: string; rationale?: string };
}

/** A profile entry after resolution against the catalogue. */
export interface AdoptedPattern {
  id: string;
  enforcement: "advise" | "warn" | "block";
  appliesTo?: string[];
  options?: Record<string, unknown>;
  /** Philosophy this pattern was sourced from during bootstrap. */
  sourcePhilosophy?: string;
}

export interface ResolvedProfile {
  projectSize: "small" | "medium" | "large";
  philosophies: { adopt: { id: string; weight: "primary" | "secondary" }[]; reject: string[] };
  adopt: AdoptedPattern[];
  ban: { id: string; enforcement: string; reason?: string }[];
  practicePatterns: AdoptedPattern[];
  phases: {
    write: { enabled: boolean; mode: "advise" | "block"; failMode: "open" | "closed"; llm: boolean; block: boolean };
    pr: { enabled: boolean; llm: boolean; failOn: Severity };
    later: { enabled: boolean };
  };
  /** Non-fatal coherence warnings (design 13.7). */
  warnings: string[];
}

import { createHash } from "node:crypto";

/**
 * Semantic fingerprint for a finding (design 13.5). Deliberately excludes the
 * line number so findings remain stable when surrounding code shifts.
 */
export function fingerprint(parts: {
  patternId?: string;
  detectorId: string;
  detectorVersion: string;
  symbol?: string;
  evidence?: string;
  scopePath: string;
}): string {
  const h = createHash("sha256");
  h.update(
    [
      parts.patternId ?? "",
      parts.detectorId,
      parts.detectorVersion,
      parts.symbol ?? "",
      (parts.evidence ?? "").trim().replace(/\s+/g, " "),
      parts.scopePath,
    ].join("\u0000"),
  );
  return h.digest("hex").slice(0, 16);
}
