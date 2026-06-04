import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { buildEvidenceMap } from "../model/project-map.js";
import type { Policy } from "../policy/types.js";
import { evaluateBlockingPromotion, type BlockingCase, type BlockingPromotionResult } from "./harness.js";

const BOUNDARY_POLICY: Policy = {
  id: "boundary:domain->infrastructure",
  patternId: "hexagonal-architecture",
  philosophyId: "domain-driven-design",
  predicate: { kind: "forbidden-layer-edge", from: "domain", to: "infrastructure" },
  severity: "block",
  message: "Domain modules must not depend on infrastructure.",
};

function writeFile(root: string, rel: string, content: string): void {
  const abs = join(root, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
}

function project(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "conformance-blocking-calibration-"));
  for (const [rel, content] of Object.entries(files)) writeFile(root, rel, content);
  return root;
}

function cases(): { roots: string[]; cases: BlockingCase[] } {
  const violating = project({
    "src/domain/order.ts":
      "import { Db } from '../infrastructure/db';\nexport class Order { constructor(private db: Db) {} }\n",
    "src/infrastructure/db.ts": "export class Db {}\n",
  });
  const conforming = project({
    "src/domain/order.ts": "export class Order {}\n",
    "src/infrastructure/db.ts":
      "import { Order } from '../domain/order';\nexport class Db { save(order: Order) {} }\n",
  });
  return {
    roots: [violating, conforming],
    cases: [
      {
        id: "boundary-domain-imports-infrastructure",
        label: "violates",
        map: buildEvidenceMap(violating),
        policies: [BOUNDARY_POLICY],
      },
      {
        id: "boundary-infrastructure-imports-domain",
        label: "conforms",
        map: buildEvidenceMap(conforming),
        policies: [BOUNDARY_POLICY],
      },
    ],
  };
}

export function runBuiltInBlockingCalibration(): BlockingPromotionResult {
  const fixture = cases();
  try {
    return evaluateBlockingPromotion(fixture.cases);
  } finally {
    for (const root of fixture.roots) rmSync(root, { recursive: true, force: true });
  }
}

function isMain(): boolean {
  return process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
}

if (isMain()) {
  const result = runBuiltInBlockingCalibration();
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  if (!result.promotable) process.exitCode = 1;
}
