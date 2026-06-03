import { test, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { makeProject, writeFile, cleanupAll, REPO_ROOT } from "./helpers.js";
import { buildEvidenceMap } from "../src/model/project-map.js";
import { loadCatalogue } from "../src/catalogue.js";
import { proposeProfileFromEvidence } from "../src/model/proposal.js";
import { extractFile } from "../src/model/extract.js";

after(cleanupAll);

/** A small hexagonal project with a deliberate boundary violation + a duplicate symbol. */
function modelProject(): string {
  const dir = makeProject({ profile: "projectSize: small\nadopt: []\nban: []\n" });
  // domain: a Repository interface + an entity that re-declares UserRepository (duplicate)
  writeFile(
    dir,
    "src/domain/user.ts",
    [
      "import type { Db } from '../infrastructure/db';", // boundary violation: domain -> infra
      "export interface UserRepository { find(id: string): Promise<User | null>; }",
      "export class User { constructor(public readonly id: string) {} }",
      "export default function makeUser(id: string): User { return new User(id); }",
    ].join("\n"),
  );
  // infrastructure: another UserRepository (same name, different layer)
  writeFile(
    dir,
    "src/infrastructure/db.ts",
    [
      "export interface Db { query(sql: string): Promise<unknown>; }",
      "export class UserRepository { async find() { return null; } }",
    ].join("\n"),
  );
  // a clean application module
  writeFile(
    dir,
    "src/application/list-users.ts",
    "import type { UserRepository } from '../domain/user';\nexport const listUsers = (r: UserRepository) => r;\n",
  );
  // a barrel that should NOT be canonical
  writeFile(dir, "src/domain/index.ts", "export { User } from './user';\n");
  // a test file referencing User — should be penalised as canonical
  writeFile(dir, "test/user.test.ts", "export class User {}\n");
  return dir;
}

test("TS extractor handles type-only, default, re-export and multiline", () => {
  const r = extractFile(
    "x.ts",
    [
      "import type { A } from './a';",
      "import { b } from './b';",
      "export type T = {",
      "  x: number;",
      "};",
      "export default class C {}",
      "export { foo } from './foo';",
    ].join("\n"),
  );
  assert.equal(r.imports.find((i) => i.spec === "./a")?.typeOnly, true);
  assert.equal(r.imports.find((i) => i.spec === "./b")?.typeOnly, false);
  assert.ok(r.exports.some((e) => e.kind === "type" && e.name === "T"));
  assert.ok(r.exports.some((e) => e.kind === "default"));
  assert.ok(r.exports.some((e) => e.kind === "reexport" && e.name === "foo"));
  // ./foo is a re-export source => counts as an import dependency
  assert.ok(r.imports.some((i) => i.spec === "./foo"));
});

test("barrel detection: index with only re-exports", () => {
  const barrel = extractFile("index.ts", "export { A } from './a';\nexport * from './b';\n");
  assert.equal(barrel.isBarrel, true);
  const notBarrel = extractFile("index.ts", "export const x = 1;\nexport { A } from './a';\n");
  assert.equal(notBarrel.isBarrel, false);
});

test("evidence map: layers, dependency graph, duplicate canonical, hexagonal candidate", () => {
  const dir = modelProject();
  const map = buildEvidenceMap(dir, {});

  // layers classified
  const layerOf = (p: string) => map.modules.find((m) => m.path === p)?.layer;
  assert.equal(layerOf("src/domain/user.ts"), "domain");
  assert.equal(layerOf("src/infrastructure/db.ts"), "infrastructure");
  assert.equal(layerOf("src/application/list-users.ts"), "application");
  assert.equal(layerOf("test/user.test.ts"), "test");

  // dependency edge domain -> infrastructure exists (the violation)
  assert.ok(map.dependencyEdges.some((e) => e.from === "src/domain/user.ts" && e.to === "src/infrastructure/db.ts"));
  // inbound count: domain/user is imported by application + barrel
  const userMod = map.modules.find((m) => m.path === "src/domain/user.ts")!;
  assert.ok(userMod.inbound >= 1);

  // modules carry language + provenance (the neutral model seam, design 15)
  assert.equal(userMod.language, "typescript");
  assert.equal(userMod.provenance.provider, "typescript");
  assert.equal(userMod.provenance.tier, 2);
  assert.ok(map.meta.extraction.providers.includes("typescript"));

  // duplicate symbol UserRepository across domain + infrastructure, different layers
  const dup = map.duplicateSymbols.find((d) => d.name === "UserRepository");
  assert.ok(dup, "expected UserRepository duplicate cluster");
  assert.equal(dup!.sameLayer, false);
  assert.ok(dup!.layers.includes("domain") && dup!.layers.includes("infrastructure"));
  // canonical should prefer the domain (preferred layer, non-test, non-barrel) version
  assert.equal(dup!.canonical?.path, "src/domain/user.ts");

  // User appears in domain/user.ts and test/user.test.ts — canonical must NOT be the test file
  const userDup = map.duplicateSymbols.find((d) => d.name === "User");
  assert.ok(userDup);
  assert.notEqual(userDup!.canonical?.path, "test/user.test.ts");

  // hexagonal candidate present with a violation + consistency < 1
  const hex = map.candidatePatterns.find((c) => c.patternId === "hexagonal-architecture");
  assert.ok(hex, "expected hexagonal candidate");
  assert.ok(hex!.consistency!.violations >= 1);
  assert.ok(hex!.consistency!.score < 1);
  assert.ok(hex!.locations.includes("src/domain/user.ts"));

  // repository candidate present (UserRepository interface)
  assert.ok(map.candidatePatterns.some((c) => c.patternId === "repository"));
});

test("proposal stays warn-only and never auto-bans", () => {
  const dir = modelProject();
  const map = buildEvidenceMap(dir, {});
  const proposal = proposeProfileFromEvidence(map, loadCatalogue(dir));
  assert.ok(!proposal.yaml.includes("enforcement: block"));
  assert.match(proposal.yaml, /ban: \[\]/);
  // adopt is grouped under altitude bands (each band has its own adopt list) when non-empty.
  if (proposal.adopt.length) {
    assert.match(proposal.yaml, /\n {2}(high|medium|low): #[^\n]*\n {4}adopt:\n/);
    for (const a of proposal.adopt) assert.ok(["high", "medium", "low"].includes(a.altitude));
  }
  for (const a of proposal.adopt) assert.notEqual(a.enforcement, "block");
});

test("onboard CLI: exits 0 and prints preview sections", () => {
  const dir = modelProject();
  const out = execFileSync(
    process.execPath,
    [join(REPO_ROOT, "integration", "bin", "conformance.mjs"), "onboard"],
    { cwd: dir, encoding: "utf8", env: { ...process.env, CONFORMANCE_CATALOGUE_ROOT: REPO_ROOT } },
  );
  assert.match(out, /Observed structure/);
  assert.match(out, /Candidate patterns/);
  assert.match(out, /Recommended conservative profile/);
  assert.match(out, /Next steps/);
});

// Universal L0 provider: a non-JS (Kotlin) project produces a usable evidence map
// with FQN cross-file edges resolved by the orchestrator symbol index (design 15.4/15.5).
function kotlinProject() {
  const dir = makeProject({ profile: "projectSize: medium\nadopt: []\nban: []\n" });
  writeFile(
    dir,
    "src/main/kotlin/com/app/domain/User.kt",
    "package com.app.domain\n\ndata class User(val id: String)\n\ninterface UserRepo {\n  fun find(id: String): User?\n}\n",
  );
  writeFile(
    dir,
    "src/main/kotlin/com/app/infrastructure/SqlUserRepo.kt",
    "package com.app.infrastructure\n\nimport com.app.domain.User\nimport com.app.domain.UserRepo\n\nclass SqlUserRepo : UserRepo {\n  override fun find(id: String): User? = null\n}\n",
  );
  writeFile(
    dir,
    "src/test/kotlin/com/app/domain/UserTest.kt",
    "package com.app.domain\n\nclass UserTest {\n  fun testIt() {}\n}\n",
  );
  return dir;
}

test("universal provider: Kotlin modules, layers, FQN edge, provenance", () => {
  const dir = kotlinProject();
  const map = buildEvidenceMap(dir, {});

  const domain = map.modules.find((m) => m.path.endsWith("domain/User.kt"));
  const infra = map.modules.find((m) => m.path.endsWith("SqlUserRepo.kt"));
  const testMod = map.modules.find((m) => m.path.endsWith("UserTest.kt"));
  assert.ok(domain && infra && testMod, "all three kotlin files claimed");

  // language + L0 provenance
  assert.equal(domain!.language, "kotlin");
  assert.equal(domain!.provenance.provider, "universal");
  assert.equal(domain!.provenance.tier, 0);
  assert.equal(domain!.provenance.confidence, "low");
  assert.equal(domain!.packageName, "com.app.domain");

  // layers classified from gradle package paths
  assert.equal(domain!.layer, "domain");
  assert.equal(infra!.layer, "infrastructure");
  assert.equal(testMod!.layer, "test");

  // symbols extracted
  assert.ok(domain!.exports.some((e) => e.name === "User"));
  assert.ok(domain!.exports.some((e) => e.name === "UserRepo"));

  // FQN import com.app.domain.User -> domain file resolved into a dependency edge
  const edge = map.dependencyEdges.find((e) => e.from === infra!.path && e.to === domain!.path);
  assert.ok(edge, "infra->domain FQN edge resolved by orchestrator symbol index");

  // extraction meta records the universal provider
  assert.ok(map.meta.extraction.providers.includes("universal"));
});
