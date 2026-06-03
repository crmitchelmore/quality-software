import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { makeProject, todoProfile } from "./helpers.js";
import { loadCatalogue } from "../src/catalogue.js";
import { loadProfile } from "../src/profile.js";
import { Engine } from "../src/engine.js";
import type { ChangeSet } from "../src/contract.js";

/**
 * The deterministic write-time flow must cover Kotlin, Java, TypeScript and Python
 * — not just TS (design 15/16). These exercise the neutral detectors end-to-end
 * through the Engine for each language.
 */

function engineFor(dir: string): Engine {
  const catalogue = loadCatalogue(dir);
  return new Engine(loadProfile(join(dir, "patterns.config.yaml"), catalogue), catalogue);
}

async function evaluate(dir: string, event: ChangeSet["event"], path: string, content: string) {
  const change: ChangeSet = { event, repoRoot: dir, files: [{ path: join(dir, path), content }] };
  return engineFor(dir).evaluate(change);
}

const KOTLIN_DOMAIN_BAD = `package com.app.domain
import com.app.infrastructure.PostgresDb
class OrderService(private val db: PostgresDb)
`;

const JAVA_DOMAIN_BAD = `package com.app.domain;
import com.app.infrastructure.PostgresDb;
public class OrderService { private final PostgresDb db; }
`;

const PY_DOMAIN_BAD = `from app.infrastructure.db import PostgresDb
class OrderService:
    def __init__(self, db: PostgresDb): self.db = db
`;

for (const [lang, file, content] of [
  ["Kotlin", "src/domain/OrderService.kt", KOTLIN_DOMAIN_BAD],
  ["Java", "src/domain/OrderService.java", JAVA_DOMAIN_BAD],
  ["Python", "src/domain/order_service.py", PY_DOMAIN_BAD],
] as const) {
  test(`${lang}: domain→infrastructure import is flagged at write time (neutral detector)`, async () => {
    const dir = makeProject({ profile: todoProfile("warn") });
    const { findings } = await evaluate(dir, "POST_WRITE_CONTENT", file, content);
    const boundary = findings.filter((f) => f.detectorId === "forbidden-import.dependency-rule");
    assert.equal(boundary.length, 1, `${lang} boundary crossing detected`);
    assert.equal(boundary[0].patternId, "hexagonal-architecture");
    assert.equal(boundary[0].heuristic, true, "FQN import resolution is heuristic (not index-resolved)");
  });

  test(`${lang}: a heuristic FQN finding is NEVER escalated to block, even at PR-time with enforcement: block`, async () => {
    const dir = makeProject({ profile: todoProfile("block") });
    const { findings } = await evaluate(dir, "PR_REVIEW", file, content);
    const boundary = findings.find((f) => f.detectorId === "forbidden-import.dependency-rule");
    assert.ok(boundary, `${lang} boundary finding present`);
    assert.notEqual(boundary!.severity, "block", "heuristic findings cap below block; the certifier is authoritative");
  });
}

test("Python: reuse detector flags a duplicate def across .py modules", async () => {
  const dir = makeProject({
    profile: todoProfile("warn"),
    files: { "src/util/text.py": "def slugify(s):\n    return s.lower()\n" },
  });
  const { findings } = await evaluate(
    dir,
    "POST_WRITE_CONTENT",
    "src/domain/naming.py",
    "def slugify(s):\n    return s.strip().lower()\n",
  );
  const reuse = findings.filter((f) => f.detectorId === "reuse.duplicate-export");
  assert.ok(
    reuse.some((f) => /slugify/.test(f.message) && /text\.py/.test(f.message)),
    "duplicate Python symbol surfaced with the existing location",
  );
});

const SINGLETON_BAN = `projectSize: small
philosophies: { adopt: [], reject: [] }
adopt: []
ban:
  - id: singleton
    reason: Prefer DI-scoped lifetimes.
phases:
  write: { enabled: true, mode: advise, failMode: open, llm: false, block: false }
  pr:    { enabled: true, llm: false, failOn: block }
  later: { enabled: true }
`;

test("Java: banned Singleton (static getInstance) is flagged by the neutral signature set", async () => {
  const dir = makeProject({ profile: SINGLETON_BAN });
  const java = `package com.app.infrastructure;
public class Config {
  private static Config instance;
  public static Config getInstance() { return instance; }
}
`;
  const { findings } = await evaluate(dir, "POST_WRITE_CONTENT", "src/infrastructure/Config.java", java);
  const banned = findings.filter((f) => f.detectorId === "banned-construct.signatures" && f.patternId === "singleton");
  assert.equal(banned.length, 1, "Java static getInstance caught");
});

test("Kotlin: banned Singleton (object) is flagged; a plain class is not", async () => {
  const dir = makeProject({ profile: SINGLETON_BAN });
  const bad = await evaluate(dir, "POST_WRITE_CONTENT", "src/infrastructure/Config.kt", "package com.app.infrastructure\nobject Config { val x = 1 }\n");
  assert.ok(
    bad.findings.some((f) => f.detectorId === "banned-construct.signatures" && f.patternId === "singleton"),
    "Kotlin object singleton caught",
  );
  const ok = await evaluate(dir, "POST_WRITE_CONTENT", "src/infrastructure/Plain.kt", "package com.app.infrastructure\nclass Plain(val x: Int)\n");
  assert.equal(
    ok.findings.filter((f) => f.detectorId === "banned-construct.signatures").length,
    0,
    "a plain Kotlin class is not flagged",
  );
});
