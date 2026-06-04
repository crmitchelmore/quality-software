import type { Severity } from "../contract.js";
import type { ExportedSymbol } from "../model/extract.js";
import type { Layer } from "../model/lang/types.js";

/**
 * The evidence contract for blockable findings (design 16.6). A finding may block a
 * merge ONLY when a named, configured Policy's deterministic predicate is satisfied
 * over the neutral code model — never on an LLM's say-so. The LLM may map/explain a
 * finding to a policy, but the blocking decision is re-derived deterministically.
 */

export type PredicateSpec =
  /** No module in layer `from` may depend on a module in layer `to`. */
  | { kind: "forbidden-layer-edge"; from: Layer; to: Layer }
  /** Modules whose path matches `fromGlob` must not import a spec matching `importPattern`. */
  | { kind: "forbidden-import"; fromGlob?: string; importPattern: string }
  /** A symbol must not be declared in more than `max` distinct non-test modules. */
  | { kind: "no-duplicate-symbol"; symbol: string; max?: number }
  /** Exported symbols in `scopeGlob` must match the configured naming regex. */
  | {
      kind: "naming-convention";
      scopeGlob?: string;
      exportKind?: ExportedSymbol["kind"];
      namePattern: string;
    };

export interface Policy {
  /** Stable, configured id — the thing that blocks (not a vague pattern name). */
  id: string;
  /** Catalogue pattern this policy enforces (for the rationale chain). */
  patternId?: string;
  /** Adopted philosophy that motivates the policy. */
  philosophyId?: string;
  predicate: PredicateSpec;
  /** Severity for THIS policy. `block` must be explicitly configured. */
  severity: Severity;
  /** Human-readable explanation surfaced on a violation. */
  message: string;
}

/** A deterministically verified violation — the only thing eligible to block. */
export interface CertifiedViolation {
  policyId: string;
  patternId?: string;
  philosophyId?: string;
  severity: Severity;
  /** Exact evidence that satisfies the predicate. */
  evidence: { path: string; detail: string; line?: number }[];
  message: string;
}
