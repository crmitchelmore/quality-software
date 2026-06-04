import { test, after } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadCatalogue } from "../src/catalogue.js";
import { loadProfile, ProfileError } from "../src/profile.js";
import { Engine } from "../src/engine.js";
import type { ChangeSet } from "../src/contract.js";
import { makeProject, todoProfile, cleanupAll, REPO_ROOT } from "./helpers.js";

after(cleanupAll);

function engineFor(dir: string): Engine {
  const catalogue = loadCatalogue(dir);
  const profile = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  return new Engine(profile, catalogue);
}

const DOMAIN_BAD = `import { Db } from "../infrastructure/db";
export class OrderService {
  constructor(private db: Db) {}
}
`;
const DOMAIN_GOOD = `import { OrderRepository } from "./ports";
export class OrderService {
  constructor(private repo: OrderRepository) {}
}
`;

const FEATURE_BOUNDARY_PROFILE = `projectSize: small
philosophies:
  adopt:
    - id: domain-driven-design
      weight: primary
  reject: []
adopt:
  - id: hexagonal-architecture
    enforcement: block
    options:
      domainGlobs: ["src/features/*/model/**"]
      forbidImportsFrom: ["src/features/*/data/**"]
phases:
  write: { enabled: true, mode: advise, failMode: open, llm: false, block: false }
  pr:    { enabled: true, llm: true, failOn: block }
  later: { enabled: true }
`;

test("boundary violation is detected (domain importing infrastructure)", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  const change: ChangeSet = {
    event: "POST_WRITE_CONTENT",
    repoRoot: dir,
    files: [{ path: join(dir, "src/domain/order-service.ts"), content: DOMAIN_BAD }],
  };
  const { findings } = await engineFor(dir).evaluate(change);
  const boundary = findings.filter((f) => f.detectorId === "forbidden-import.dependency-rule");
  assert.equal(boundary.length, 1, "expected one boundary finding");
  assert.equal(boundary[0].severity, "warning", "warn enforcement → warning severity");
  assert.equal(boundary[0].patternId, "hexagonal-architecture");
  assert.ok(boundary[0].rationale?.length, "finding carries a philosophy→pattern rationale");
});

test("clean domain file (depends on a port) produces no boundary finding", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  const change: ChangeSet = {
    event: "POST_WRITE_CONTENT",
    repoRoot: dir,
    files: [{ path: join(dir, "src/domain/order-service.ts"), content: DOMAIN_GOOD }],
  };
  const { findings } = await engineFor(dir).evaluate(change);
  assert.equal(findings.filter((f) => f.detectorId === "forbidden-import.dependency-rule").length, 0);
});

test("configured boundary globs drive write-time layer classification", async () => {
  const dir = makeProject({ profile: FEATURE_BOUNDARY_PROFILE });
  const change: ChangeSet = {
    event: "POST_WRITE_CONTENT",
    repoRoot: dir,
    files: [
      {
        path: join(dir, "src/features/orders/model/order-service.ts"),
        content: `import { Db } from "../data/db";\nexport class OrderService { constructor(private db: Db) {} }\n`,
      },
    ],
  };
  const { findings } = await engineFor(dir).evaluate(change);
  const boundary = findings.filter((f) => f.detectorId === "forbidden-import.dependency-rule");
  assert.equal(boundary.length, 1, "expected configured model→data boundary finding");
  assert.equal(boundary[0].severity, "warning", "write-time remains advisory even when PR enforcement blocks");
});

test("write-time never denies, even when the pattern is enforcement: block", async () => {
  const dir = makeProject({ profile: todoProfile("block") });
  const change: ChangeSet = {
    event: "POST_WRITE_CONTENT",
    repoRoot: dir,
    files: [{ path: join(dir, "src/domain/order-service.ts"), content: DOMAIN_BAD }],
  };
  const { verdict } = await engineFor(dir).evaluate(change);
  assert.notEqual(verdict.decision, "deny", "POST_WRITE_CONTENT must never deny (fail-open, advisory)");
});

test("PR review with enforcement: block yields a blocking finding", async () => {
  const dir = makeProject({ profile: todoProfile("block") });
  const change: ChangeSet = {
    event: "PR_REVIEW",
    repoRoot: dir,
    files: [{ path: join(dir, "src/domain/order-service.ts"), content: DOMAIN_BAD }],
  };
  const { findings } = await engineFor(dir).evaluate(change);
  const boundary = findings.find((f) => f.detectorId === "forbidden-import.dependency-rule");
  assert.equal(boundary?.severity, "block", "at PR-time a blockable certified detector blocks");
});

test("fingerprint is stable across runs and identical findings dedupe", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  const file = { path: join(dir, "src/domain/order-service.ts"), content: DOMAIN_BAD };
  const engine = engineFor(dir);
  const a = await engine.evaluate({ event: "POST_WRITE_CONTENT", repoRoot: dir, files: [file] });
  // Same file passed twice in one change → identical findings must collapse to one.
  const b = await engine.evaluate({ event: "POST_WRITE_CONTENT", repoRoot: dir, files: [file, file] });
  const fpA = a.findings.find((f) => f.detectorId === "forbidden-import.dependency-rule")!.fingerprint;
  const boundaryB = b.findings.filter((f) => f.detectorId === "forbidden-import.dependency-rule");
  assert.equal(boundaryB.length, 1, "duplicate findings dedupe by fingerprint");
  assert.equal(boundaryB[0].fingerprint, fpA, "fingerprint stable across evaluations");
});

test("profile coherence: adopting and banning the same pattern is a hard error", () => {
  const dir = makeProject({
    profile: `projectSize: small
adopt:
  - id: hexagonal-architecture
    enforcement: advise
ban:
  - id: hexagonal-architecture
`,
  });
  const catalogue = loadCatalogue(dir);
  assert.throws(() => loadProfile(join(dir, "patterns.config.yaml"), catalogue), ProfileError);
});

test("profile coherence: unknown catalogue id is a warning, not an error", () => {
  const dir = makeProject({
    profile: `projectSize: small
adopt:
  - id: not-a-real-pattern-xyz
    enforcement: advise
`,
  });
  const catalogue = loadCatalogue(dir);
  const profile = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  assert.ok(profile.warnings.some((w) => w.includes("not-a-real-pattern-xyz")));
});

test("catalogue resolves from CONFORMANCE_CATALOGUE_ROOT", () => {
  const catalogue = loadCatalogue(REPO_ROOT);
  assert.ok(catalogue.nodeById.has("hexagonal-architecture"));
  assert.ok(catalogue.patternsForPhilosophy.get("domain-driven-design")?.length);
});
