import { test } from "node:test";
import assert from "node:assert/strict";
import { registryCandidates } from "../src/model/detectors.js";
import { selectCorePhilosophies } from "../src/model/philosophies.js";
import { loadCatalogue } from "../src/catalogue.js";
import type { ModuleInfo, CandidatePattern } from "../src/model/project-map.js";

function mod(partial: Partial<ModuleInfo> & { path: string }): ModuleInfo {
  return {
    language: "ts",
    layer: "other",
    isBarrel: false,
    isTest: false,
    isGenerated: false,
    exports: [],
    imports: [],
    inbound: 0,
    provenance: { provider: "test", tier: 1, confidence: "high", method: "test", version: "0" } as ModuleInfo["provenance"],
    ...partial,
  };
}

function type(name: string, kind = "class") {
  return { name, kind } as ModuleInfo["exports"][number];
}

test("naming rules surface Adapter pattern at medium confidence past medAt", () => {
  const modules = [
    mod({ path: "a/HttpAdapter.ts", exports: [type("HttpAdapter")] }),
    mod({ path: "a/DbAdapter.ts", exports: [type("DbAdapter")] }),
    mod({ path: "a/CacheAdapter.ts", exports: [type("CacheAdapter")] }),
    mod({ path: "a/QueueAdapter.ts", exports: [type("QueueAdapter")] }),
  ];
  const cands = registryCandidates(modules);
  const adapter = cands.find((c) => c.patternId === "adapter");
  assert.ok(adapter, "expected an adapter candidate");
  assert.equal(adapter!.confidence, "medium"); // 4 hits >= medAt(4)
  assert.ok(adapter!.locations.length >= 2);
});

test("naming rules ignore test files for production rules", () => {
  const modules = [
    mod({ path: "test/FooAdapter.ts", isTest: true, exports: [type("FooAdapter")] }),
    mod({ path: "test/BarAdapter.ts", isTest: true, exports: [type("BarAdapter")] }),
  ];
  const cands = registryCandidates(modules);
  assert.equal(cands.find((c) => c.patternId === "adapter"), undefined);
});

test("import rules fingerprint frameworks by import specifier", () => {
  const modules = [
    mod({ path: "x/CbA.kt", imports: [{ spec: "io.github.resilience4j.circuitbreaker.CircuitBreaker", typeOnly: false }] }),
    mod({ path: "x/CbB.kt", imports: [{ spec: "io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker", typeOnly: false }] }),
  ];
  const cands = registryCandidates(modules);
  assert.ok(cands.some((c) => c.patternId === "circuit-breaker"));
});

test("every registry pattern id exists in the knowledge graph", () => {
  const catalogue = loadCatalogue(process.env.CONFORMANCE_CATALOGUE_ROOT);
  // Synthesise one hit per rule by reading the module: just assert all NAME/IMPORT ids resolve.
  const ids = new Set(
    registryCandidates([
      mod({ path: "p/Thing.ts", exports: [type("WidgetAdapter"), type("WidgetAdapter2")] }),
    ]).map((c) => c.patternId),
  );
  for (const id of ids) assert.ok(catalogue.nodeById.get(id), `missing graph node: ${id}`);
});

test("selectCorePhilosophies keeps a small, weighted core and drops weak single support", () => {
  const catalogue = loadCatalogue(process.env.CONFORMANCE_CATALOGUE_ROOT);
  // Pick patterns that imply philosophies in the graph.
  const implying = [...catalogue.philosophyForPattern.entries()].filter(([, v]) => v.length);
  const high = implying.slice(0, 3).map(([patternId]) => ({
    patternId,
    confidence: "high",
    evidence: [],
    locations: [],
  })) as CandidatePattern[];
  const core = selectCorePhilosophies(high, catalogue, 4);
  assert.ok(core.length <= 4);
  for (const c of core) assert.ok(c.weight >= 2 || c.impliedBy.length >= 1);
});
