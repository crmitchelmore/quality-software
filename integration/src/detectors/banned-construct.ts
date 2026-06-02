import type { Detector, Finding, ChangeSet, DetectorContext } from "../contract.js";
import { fingerprint } from "../contract.js";
import { relPath } from "./util.js";

/**
 * Banned-construct detector. Flags textual signatures of patterns the profile
 * has explicitly banned (design 09-config `ban:`). Conservative, line-anchored,
 * advisory by default. In production these signatures are Semgrep/ESLint rules
 * (design 13.2); the built-in regex set keeps the MVP self-contained.
 *
 * Signatures are intentionally high-precision (favouring misses over false
 * positives) per design 13.4 — trust beats coverage.
 */

interface Signature {
  patternId: string;
  re: RegExp;
  message: string;
  suggestion: string;
}

const SIGNATURES: Signature[] = [
  {
    patternId: "service-locator",
    re: /\b(ServiceLocator|serviceLocator)\b\s*\.\s*(get|resolve|getService)\s*\(/,
    message: "Service Locator usage hides dependencies; this pattern is banned by the profile.",
    suggestion: "Inject the dependency through the constructor so it is explicit and testable.",
  },
  {
    patternId: "active-record",
    re: /class\s+\w+\s+extends\s+(ActiveRecord|Model)\b/,
    message: "Active Record couples the domain to persistence; this pattern is banned by the profile.",
    suggestion: "Use a persistence-ignorant entity with a Repository / Data Mapper instead.",
  },
  {
    patternId: "singleton",
    re: /static\s+(getInstance|instance)\b/,
    message: "Singleton access detected; the profile prefers DI-scoped lifetimes.",
    suggestion: "Register the type with the container and inject it rather than using a global instance.",
  },
];

export function bannedConstructDetector(bannedPatternIds: Set<string>): Detector {
  const version = "1.0.0";
  const active = SIGNATURES.filter((s) => bannedPatternIds.has(s.patternId));
  return {
    id: "banned-construct.signatures",
    version,
    requiresContext: "file",
    events: ["POST_WRITE_CONTENT", "PR_REVIEW", "BATCH"],
    canBlock: false, // advisory: textual signatures are heuristic
    maxLatencyMs: 30,
    run(change: ChangeSet, ctx: DetectorContext): Finding[] {
      if (active.length === 0) return [];
      const findings: Finding[] = [];
      for (const file of change.files) {
        if (!file.content) continue;
        const rel = relPath(change.repoRoot, file.path);
        if (!/\.(ts|tsx|js|jsx|mjs|cts|mts)$/.test(rel)) continue;
        const lines = file.content.split("\n");
        lines.forEach((text, idx) => {
          for (const sig of active) {
            if (sig.re.test(text)) {
              const rationale = ctx.rationaleFor(sig.patternId);
              const evidence = text.trim().slice(0, 120);
              findings.push({
                fingerprint: fingerprint({
                  patternId: sig.patternId,
                  detectorId: "banned-construct.signatures",
                  detectorVersion: version,
                  symbol: sig.patternId,
                  evidence,
                  scopePath: rel,
                }),
                detectorId: "banned-construct.signatures",
                detectorVersion: version,
                patternId: sig.patternId,
                philosophyId: rationale.philosophyId,
                severity: "advice",
                path: rel,
                line: idx + 1,
                message: sig.message,
                suggestion: sig.suggestion,
                evidence,
                rationale: rationale.rationale,
              });
            }
          }
        });
      }
      return findings;
    },
  };
}
