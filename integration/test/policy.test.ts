import { test } from "node:test";
import assert from "node:assert/strict";
import { makeProject, writeFile, REPO_ROOT } from "./helpers.js";
import { buildEvidenceMap } from "../src/model/project-map.js";
import { certify, certifiedFindings, corroborate } from "../src/policy/certify.js";
import type { Policy } from "../src/policy/types.js";
import {
  evaluateBlockingPromotion,
  runJudgeEval,
  runBlockingEval,
  type JudgeCase,
  type BlockingCase,
} from "../src/eval/harness.js";
import { runBuiltInBlockingCalibration } from "../src/eval/blocking-calibration.js";
import { LLMJudge } from "../src/judge/judge.js";
import { FakeLLMClient } from "../src/llm/types.js";
import type { CodeRegion } from "../src/judge/schema.js";

// A project whose domain layer illegally imports the infrastructure layer.
function violatingProject() {
  const dir = makeProject({ profile: "projectSize: medium\nadopt: []\nban: []\n" });
  writeFile(dir, "src/domain/order.ts", "import { Db } from '../infrastructure/db';\nexport class Order { constructor(private db: Db) {} }\n");
  writeFile(dir, "src/infrastructure/db.ts", "export class Db {}\n");
  return dir;
}

function cleanProject() {
  const dir = makeProject({ profile: "projectSize: medium\nadopt: []\nban: []\n" });
  writeFile(dir, "src/domain/order.ts", "export class Order {}\n");
  writeFile(dir, "src/infrastructure/db.ts", "import { Order } from '../domain/order';\nexport class Db { save(o: Order) {} }\n");
  return dir;
}

const layerPolicy: Policy = {
  id: "no-domain-to-infra",
  patternId: "hexagonal-architecture",
  philosophyId: "dependency-inversion",
  predicate: { kind: "forbidden-layer-edge", from: "domain", to: "infrastructure" },
  severity: "block",
  message: "Domain modules must not depend on infrastructure (hexagonal boundary).",
};

test("certifier blocks ONLY when the deterministic predicate is satisfied", () => {
  const bad = buildEvidenceMap(violatingProject(), {});
  const good = buildEvidenceMap(cleanProject(), {});
  assert.equal(certify([layerPolicy], bad).length, 1, "violation certified");
  assert.equal(certify([layerPolicy], good).length, 0, "clean project not blocked");
});

test("certifier is deterministic across runs", () => {
  const dir = violatingProject();
  const a = certify([layerPolicy], buildEvidenceMap(dir, {}));
  const b = certify([layerPolicy], buildEvidenceMap(dir, {}));
  assert.deepEqual(a, b);
});

test("certified findings carry block severity and are NOT advisory", () => {
  const map = buildEvidenceMap(violatingProject(), {});
  const findings = certifiedFindings(certify([layerPolicy], map));
  assert.ok(findings.length >= 1);
  assert.equal(findings[0].severity, "block");
  assert.equal(findings[0].advisory, false);
  assert.match(findings[0].rationale!, /Certified by policy 'no-domain-to-infra'/);
});

test("corroboration: an advisory LLM finding maps to a certified block for the same file", () => {
  const map = buildEvidenceMap(violatingProject(), {});
  const violations = certify([layerPolicy], map);
  const llmFinding = {
    fingerprint: "x",
    detectorId: "llm-judge",
    detectorVersion: "1.0.0",
    patternId: "hexagonal-architecture",
    severity: "warning" as const,
    path: "src/domain/order.ts",
    message: "domain imports infrastructure",
    advisory: true,
  };
  const matched = corroborate(llmFinding, violations);
  assert.ok(matched, "LLM finding corroborated by deterministic predicate");
  assert.equal(matched!.policyId, "no-domain-to-infra");

  const unrelated = corroborate({ ...llmFinding, path: "src/elsewhere.ts" }, violations);
  assert.equal(unrelated, null, "no corroboration without a matching predicate");
});

test("forbidden-import predicate certifies a banned dependency", () => {
  const dir = makeProject({ profile: "projectSize: small\nadopt: []\nban: []\n" });
  writeFile(dir, "src/app/handler.ts", "import { v4 } from 'uuid';\nexport const id = v4();\n");
  const map = buildEvidenceMap(dir, {});
  const policy: Policy = {
    id: "no-uuid",
    predicate: { kind: "forbidden-import", importPattern: "^uuid$" },
    severity: "block",
    message: "Use the platform id generator, not uuid.",
  };
  const v = certify([policy], map);
  assert.equal(v.length, 1);
  assert.equal(v[0].evidence[0].path, "src/app/handler.ts");
});

// --- eval harness ---

function region(content: string, file = "src/x.ts"): CodeRegion {
  return { file, startLine: 1, endLine: content.split("\n").length, content };
}

const VIOLATING = "// region-marker: RAWDBHANDLER\napp.post('/o', async (req,res) => { await db.connect(); });";
const CONFORMING = "export class PlaceOrder { constructor(private repo: OrderRepository) {} }";

function scriptedClient() {
  // The fake "model" flags any region carrying our sentinel. The sentinel is
  // chosen to be absent from the catalogue's grounding examples so the conforming
  // case is not flagged by example text leaking into the prompt.
  return new FakeLLMClient((req) => {
    const fenced = req.user.split("## CODE REGION (UNTRUSTED DATA)")[1] ?? "";
    const violates = fenced.includes("RAWDBHANDLER");
    return JSON.stringify({
      patternId: "hexagonal-architecture",
      verdict: violates ? "violates" : "conforms",
      confidence: 0.9,
      claim: "raw DB access in a handler",
      evidenceSpans: violates ? [{ file: "src/x.ts", startLine: 1, endLine: 1 }] : [],
    });
  });
}

test("judge eval computes precision/recall over held-out labelled cases", async () => {
  const judge = new LLMJudge({ repoRoot: REPO_ROOT, client: scriptedClient(), event: "PR_REVIEW" });
  const cases: JudgeCase[] = [
    { id: "c1", set: "calibration", patternId: "hexagonal-architecture", region: region(VIOLATING), label: "violates" },
    { id: "c2", set: "calibration", patternId: "hexagonal-architecture", region: region(CONFORMING), label: "conforms" },
    { id: "c3", set: "cross-language", patternId: "hexagonal-architecture", region: region(VIOLATING), label: "violates" },
  ];
  const m = await runJudgeEval(cases, judge);
  assert.equal(m.truePositives, 2);
  assert.equal(m.trueNegatives, 1);
  assert.equal(m.falsePositives, 0);
  assert.equal(m.precision, 1);
  assert.equal(m.recall, 1);
  assert.equal(m.bySet["calibration"].correct, 2);
});

test("blocking eval: false-block rate is the promotion gate", () => {
  const badMap = buildEvidenceMap(violatingProject(), {});
  const goodMap = buildEvidenceMap(cleanProject(), {});
  const cases: BlockingCase[] = [
    { id: "v1", label: "violates", map: badMap, policies: [layerPolicy] },
    { id: "ok1", label: "conforms", map: goodMap, policies: [layerPolicy] },
  ];
  const m = runBlockingEval(cases);
  assert.equal(m.trueBlocks, 1);
  assert.deepEqual(m.falseBlocks, []);
  assert.equal(m.falseBlockRate, 0);
  assert.equal(m.promotable, true);
});

test("blocking eval: a policy that blocks a conforming case is NOT promotable", () => {
  const goodMap = buildEvidenceMap(cleanProject(), {});
  // An over-broad policy that forbids the legitimate infra->domain edge.
  const overBroad: Policy = {
    id: "too-strict",
    predicate: { kind: "forbidden-layer-edge", from: "infrastructure", to: "domain" },
    severity: "block",
    message: "over-broad",
  };
  const m = runBlockingEval([{ id: "ok1", label: "conforms", map: goodMap, policies: [overBroad] }]);
  assert.equal(m.promotable, false);
  assert.deepEqual(m.falseBlocks, ["ok1"]);
});

test("blocking promotion requires at least one true block", () => {
  const goodMap = buildEvidenceMap(cleanProject(), {});
  const noOp: Policy = {
    id: "no-op",
    predicate: { kind: "forbidden-layer-edge", from: "domain", to: "infrastructure" },
    severity: "block",
    message: "no-op",
  };
  const m = evaluateBlockingPromotion([{ id: "ok1", label: "conforms", map: goodMap, policies: [noOp] }]);
  assert.equal(m.promotable, false);
  assert.ok(m.reasons.some((r) => /true blocks/.test(r)));
});

test("built-in blocking calibration is promotable", () => {
  const m = runBuiltInBlockingCalibration();
  assert.equal(m.promotable, true);
  assert.equal(m.trueBlocks, 1);
  assert.equal(m.falseBlockRate, 0);
});
