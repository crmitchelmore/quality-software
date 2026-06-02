import type { Detector, Finding, ChangeSet, DetectorContext, ChangeFile } from "../contract.js";
import { fingerprint } from "../contract.js";
import { matchesAny, relPath } from "./util.js";

/**
 * Forbidden-import boundary detector — the flagship rulepack.
 *
 * Enforces the import-direction invariant shared by Hexagonal Architecture and
 * DDD: domain/application code must not import infrastructure. This is the
 * deterministic projection of the "dependency-rule" tenet (design 11.3).
 *
 * Reads its boundary from the adopted `hexagonal-architecture` (or
 * `clean-architecture`) pattern options:
 *   options:
 *     domainGlobs: ["src/domain/**", "src/application/**"]
 *     forbidImportsFrom: ["src/infrastructure/**"]
 *
 * In production this delegates to dependency-cruiser / eslint-plugin-boundaries
 * (design 13.2); this built-in variant keeps the MVP runnable with no external
 * tool and is the fast write-time path.
 */

const IMPORT_RE = /(?:import\s[^'"]*from\s*|import\s*|require\s*\(\s*|export\s[^'"]*from\s*)['"]([^'"]+)['"]/g;

function importsIn(content: string): { spec: string; line: number }[] {
  const out: { spec: string; line: number }[] = [];
  const lines = content.split("\n");
  lines.forEach((text, idx) => {
    let m: RegExpExecArray | null;
    const re = new RegExp(IMPORT_RE.source, "g");
    while ((m = re.exec(text))) out.push({ spec: m[1], line: idx + 1 });
  });
  return out;
}

/** Resolve a relative import against the importing file to a repo-relative path. */
function resolveImport(fromRel: string, spec: string): string | undefined {
  if (!spec.startsWith(".")) return undefined; // bare/package import — not a local boundary crossing
  const fromDir = fromRel.split("/").slice(0, -1);
  const parts = spec.split("/");
  for (const p of parts) {
    if (p === "." || p === "") continue;
    else if (p === "..") fromDir.pop();
    else fromDir.push(p);
  }
  return fromDir.join("/");
}

export function forbiddenImportDetector(opts: {
  patternId: string;
  domainGlobs: string[];
  forbidImportsFrom: string[];
}): Detector {
  const version = "1.0.0";
  return {
    id: "forbidden-import.dependency-rule",
    version,
    patternId: opts.patternId,
    requiresContext: "file",
    events: ["POST_WRITE_CONTENT", "PR_REVIEW", "BATCH"],
    canBlock: true, // ships fixtures; deterministic. Still advisory until profile enforcement=block.
    maxLatencyMs: 50,
    run(change: ChangeSet, ctx: DetectorContext): Finding[] {
      const findings: Finding[] = [];
      const rationale = ctx.rationaleFor(opts.patternId);
      for (const file of change.files) {
        if (!file.content) continue;
        const rel = relPath(change.repoRoot, file.path);
        if (!/\.(ts|tsx|js|jsx|mjs|cts|mts)$/.test(rel)) continue;
        if (!matchesAny(rel, opts.domainGlobs)) continue;
        for (const imp of importsIn(file.content)) {
          const resolved = resolveImport(rel, imp.spec);
          const target = resolved ?? imp.spec;
          if (matchesAny(target, opts.forbidImportsFrom)) {
            findings.push(buildFinding(file, rel, imp, opts, version, rationale));
          }
        }
      }
      return findings;
    },
  };
}

function buildFinding(
  file: ChangeFile,
  rel: string,
  imp: { spec: string; line: number },
  opts: { patternId: string; forbidImportsFrom: string[] },
  version: string,
  rationale: { philosophyId?: string; rationale?: string },
): Finding {
  const evidence = `import "${imp.spec}"`;
  return {
    fingerprint: fingerprint({
      patternId: opts.patternId,
      detectorId: "forbidden-import.dependency-rule",
      detectorVersion: version,
      symbol: imp.spec,
      evidence,
      scopePath: rel,
    }),
    detectorId: "forbidden-import.dependency-rule",
    detectorVersion: version,
    patternId: opts.patternId,
    philosophyId: rationale.philosophyId,
    severity: "warning",
    path: rel,
    line: imp.line,
    message: `Boundary violation: ${rel} imports from a forbidden layer ("${imp.spec}").`,
    suggestion:
      `Depend on an abstraction (outbound port/interface) owned by the domain instead of importing ` +
      `infrastructure directly; wire the concrete implementation in the composition root.`,
    evidence,
    rationale: rationale.rationale,
  };
}
