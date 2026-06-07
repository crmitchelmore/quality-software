import type { CanonicalChoice, DuplicateCluster, Layer, ModuleInfo } from "./project-map.js";

export function deriveDuplicateSymbols(modules: ModuleInfo[], byPath: Map<string, ModuleInfo>): DuplicateCluster[] {
  const symbolToFiles = new Map<string, string[]>();
  for (const m of modules) {
    for (const e of m.exports) {
      if (e.kind === "reexport" || e.name === "default") continue;
      const arr = symbolToFiles.get(e.name) ?? [];
      arr.push(m.path);
      symbolToFiles.set(e.name, arr);
    }
  }

  const duplicateSymbols: DuplicateCluster[] = [];
  for (const [name, files] of symbolToFiles) {
    const unique = [...new Set(files)];
    if (unique.length < 2) continue;
    const layers = [...new Set(unique.map((f) => byPath.get(f)!.layer))];
    duplicateSymbols.push({
      name,
      files: unique,
      sameLayer: layers.length === 1,
      layers,
      canonical: pickCanonical(unique, byPath),
    });
  }
  duplicateSymbols.sort((a, b) => b.files.length - a.files.length || a.name.localeCompare(b.name));
  return duplicateSymbols;
}

/**
 * Scored canonical pick (design 14, critique #1). Inbound imports is ONE signal,
 * not the deciding rule: prefer explicit-quality signals (preferred layer, non-test,
 * non-barrel) and use inbound + short path only to break ties. Always confidence-tagged.
 */
export function pickCanonical(files: string[], byPath: Map<string, ModuleInfo>): CanonicalChoice {
  const PREFERRED: Layer[] = ["domain", "application"];
  const scored = files.map((path) => {
    const m = byPath.get(path)!;
    const reasons: string[] = [];
    let score = 0;
    if (PREFERRED.includes(m.layer)) {
      score += 4;
      reasons.push(`in preferred layer (${m.layer})`);
    } else if (m.layer === "interface") {
      score += 1;
    }
    if (!m.isTest) {
      score += 2;
    } else {
      score -= 3;
      reasons.push("penalised: test/fixture file");
    }
    if (!m.isBarrel) {
      score += 2;
    } else {
      score -= 3;
      reasons.push("penalised: barrel/index re-export");
    }
    if (/(deprecated|legacy|old|example|sample)/i.test(path)) {
      score -= 3;
      reasons.push("penalised: deprecated/legacy/example path");
    }
    score += Math.min(m.inbound, 5) * 0.5;
    if (m.inbound > 0) reasons.push(`${m.inbound} inbound import${m.inbound === 1 ? "" : "s"}`);
    // shorter path is a weak tie-breaker
    score += Math.max(0, 3 - path.split("/").length) * 0.1;
    return { path, score, reasons, layer: m.layer };
  });
  scored.sort((a, b) => b.score - a.score || a.path.length - b.path.length);
  const top = scored[0];
  const runnerUp = scored[1];
  const margin = top.score - (runnerUp?.score ?? -Infinity);

  let confidence: CanonicalChoice["confidence"] = "low";
  if (PREFERRED.includes(top.layer as Layer) && margin >= 3) confidence = "high";
  else if (margin >= 2) confidence = "medium";

  return { path: top.path, confidence, reasons: top.reasons.length ? top.reasons : ["highest combined score"] };
}
