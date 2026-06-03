import type {
  ChangeSet,
  ConformanceVerdict,
  Detector,
  DetectorContext,
  Finding,
  ResolvedProfile,
  Severity,
} from "./contract.js";
import type { Catalogue } from "./catalogue.js";
import { buildDetectors } from "./detectors/index.js";
import { matchesAny } from "./detectors/util.js";

const SEVERITY_ORDER: Severity[] = ["info", "advice", "warning", "block"];
const sevRank = (s: Severity) => SEVERITY_ORDER.indexOf(s);

export interface EngineResult {
  findings: Finding[];
  verdict: ConformanceVerdict;
}

/**
 * The shared, runtime-agnostic conformance engine (design 02-architecture).
 * Adapters translate native events to a ChangeSet, call evaluate(), and project
 * the returned canonical verdict back onto their runtime.
 */
export class Engine {
  private readonly detectors: Detector[];
  private readonly ctx: DetectorContext;

  constructor(
    private readonly profile: ResolvedProfile,
    private readonly catalogue: Catalogue,
  ) {
    this.detectors = buildDetectors(profile);
    this.ctx = {
      repoRoot: catalogue.repoRoot,
      profile,
      rationaleFor: (patternId: string) => {
        const links = catalogue.philosophyForPattern.get(patternId) ?? [];
        const philosophyId = links[0]?.philosophyId;
        const phName = philosophyId ? catalogue.nodeById.get(philosophyId)?.title : undefined;
        const paName = catalogue.nodeById.get(patternId)?.title ?? patternId;
        return {
          philosophyId,
          rationale: phName ? `${phName} → ${paName}: ${links[0]?.reason ?? ""}`.trim() : undefined,
        };
      },
    };
  }

  async evaluate(change: ChangeSet): Promise<EngineResult> {
    const active = this.detectors.filter((d) => d.events.includes(change.event));
    const raw: Finding[] = [];
    for (const d of active) {
      try {
        const out = await d.run(change, this.ctx);
        raw.push(...out);
      } catch {
        // Fail-open per detector (design 13.3): one broken detector never blocks the agent.
      }
    }

    const findings = this.dedupe(raw.map((f) => this.applyEnforcement(f, change)));
    const verdict = this.project(change, findings);
    return { findings, verdict };
  }

  /** Raise a finding to `block` only when the profile enforces it AND blocking is permitted here. */
  private applyEnforcement(f: Finding, change: ChangeSet): Finding {
    if (!f.patternId) return f;
    // Advisory (LLM-only) findings are never escalated to block (design 16.2).
    if (f.advisory) return f;
    const adopted = this.profile.adopt.find((p) => p.id === f.patternId);
    if (!adopted) return f;
    // appliesTo scoping: drop findings outside the pattern's configured paths.
    if (adopted.appliesTo && !matchesAny(f.path, adopted.appliesTo)) {
      return { ...f, severity: "info" };
    }
    const detector = this.detectors.find((d) => d.id === f.detectorId);
    const blockingAllowedHere = this.blockingAllowed(change.event);
    // Heuristic (unresolved, low-confidence) deterministic findings never hard-block;
    // the certifier over resolved edges is their authoritative gate (design 16.6).
    if (adopted.enforcement === "block" && detector?.canBlock && blockingAllowedHere && !f.heuristic) {
      return { ...f, severity: "block" };
    }
    if (adopted.enforcement === "warn") return { ...f, severity: "warning" };
    return f;
  }

  /** Write-time blocking is off by default (design 13.3); PR/PRE_SHELL may block. */
  private blockingAllowed(event: ChangeSet["event"]): boolean {
    switch (event) {
      case "PRE_SHELL":
        return true; // destructive-command guardrails
      case "PRE_WRITE_INTENT":
        return this.profile.phases.write.block === true;
      case "PR_REVIEW":
      case "BATCH":
        return true;
      default:
        return false; // POST_WRITE_CONTENT, SESSION_START, TURN_END never deny
    }
  }

  private dedupe(findings: Finding[]): Finding[] {
    const byFp = new Map<string, Finding>();
    for (const f of findings) {
      if (f.severity === "info") continue;
      const existing = byFp.get(f.fingerprint);
      if (!existing || sevRank(f.severity) > sevRank(existing.severity)) byFp.set(f.fingerprint, f);
    }
    return [...byFp.values()].sort((a, b) => sevRank(b.severity) - sevRank(a.severity));
  }

  private project(change: ChangeSet, findings: Finding[]): ConformanceVerdict {
    const blocking = findings.filter((f) => f.severity === "block" && !f.advisory);
    const advisory = findings.filter((f) => f.severity !== "block" || f.advisory);

    if (this.blockingAllowed(change.event) && blocking.length > 0) {
      if (change.event === "PRE_WRITE_INTENT" || change.event === "PRE_SHELL") {
        return {
          decision: "deny",
          findings,
          reason: this.summarise(blocking, "Blocked by conformance profile"),
          additionalContext: this.summarise(findings),
        };
      }
    }

    // TURN_END: optionally nudge the agent to self-correct unresolved findings.
    if (change.event === "TURN_END" && findings.length > 0) {
      return {
        decision: "advise",
        findings,
        continueLoop:
          blocking.length > 0
            ? { prompt: this.summarise(blocking, "Please resolve these conformance issues before finishing") }
            : undefined,
        additionalContext: this.summarise(findings),
      };
    }

    if (findings.length === 0) return { decision: "allow", findings: [] };

    return { decision: "advise", findings, additionalContext: this.summarise(findings) };
  }

  /** Human/agent-readable summary with the philosophy → pattern → suggestion chain. */
  private summarise(findings: Finding[], header = "Conformance findings"): string {
    if (findings.length === 0) return "";
    const lines = [`${header}:`];
    for (const f of findings.slice(0, 10)) {
      const loc = f.line ? `${f.path}:${f.line}` : f.path;
      lines.push(`- [${f.severity}] ${loc} — ${f.message}`);
      if (f.suggestion) lines.push(`    fix: ${f.suggestion}`);
      if (f.rationale) lines.push(`    why: ${f.rationale}`);
    }
    if (findings.length > 10) lines.push(`  …and ${findings.length - 10} more.`);
    return lines.join("\n");
  }
}
