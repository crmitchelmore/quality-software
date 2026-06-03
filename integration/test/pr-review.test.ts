import { test, after } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadCatalogue } from "../src/catalogue.js";
import { loadProfile } from "../src/profile.js";
import { reviewPR, type ChangeEntry } from "../src/review/pr-review.js";
import { makeProject, writeFile, todoProfile, cleanupAll } from "./helpers.js";

after(cleanupAll);

function profileFor(dir: string) {
  const catalogue = loadCatalogue(dir);
  return loadProfile(join(dir, "patterns.config.yaml"), catalogue);
}

const GOOD_ORDER = `import { OrderRepository } from "./ports";
export class OrderService {
  constructor(private repo: OrderRepository) {}
}
`;
const BAD_ORDER = `import { Db } from "../infrastructure/db";
export class OrderService {
  constructor(private db: Db) {}
}
`;
const DB = `export class Db {}\n`;
const PORTS = `export interface OrderRepository {}\n`;

test("net-new boundary violation introduced by a PR is blocked", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/domain/order.ts": BAD_ORDER, // head (working tree) = violating
      "src/domain/ports.ts": PORTS,
      "src/infrastructure/db.ts": DB,
    },
  });
  const profile = profileFor(dir);
  const changes: ChangeEntry[] = [{ path: "src/domain/order.ts", status: "modified" }];
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes,
    // base version of the changed file did NOT have the infra import.
    baseContent: (p) => (p === "src/domain/order.ts" ? GOOD_ORDER : undefined),
  });
  assert.equal(result.decision, "block");
  assert.ok(result.blocking.some((f) => f.path === "src/domain/order.ts"));
});

test("pre-existing (untouched) violation is NOT blocked", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/domain/order.ts": BAD_ORDER, // violating in BOTH base and head
      "src/infrastructure/db.ts": DB,
      "src/application/foo.ts": "export const foo = 1;\n", // the only change
    },
  });
  const profile = profileFor(dir);
  const changes: ChangeEntry[] = [{ path: "src/application/foo.ts", status: "added" }];
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes,
    // order.ts is unchanged ⇒ base == head; foo.ts is new ⇒ absent at base.
    baseContent: () => undefined,
  });
  assert.equal(result.decision, "allow");
  assert.equal(result.blocking.length, 0);
});

test("a new infra TARGET that makes an unchanged domain import illegal IS blocked", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/domain/order.ts": BAD_ORDER, // imports ../infrastructure/db (unchanged)
      "src/infrastructure/db.ts": DB, // NEWLY added by the PR
    },
  });
  const profile = profileFor(dir);
  const changes: ChangeEntry[] = [{ path: "src/infrastructure/db.ts", status: "added" }];
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes,
    // db.ts did not exist at base ⇒ the domain import resolved to nothing ⇒ no edge.
    baseContent: () => undefined,
  });
  assert.equal(result.decision, "block");
  assert.ok(result.blocking.some((f) => f.path === "src/domain/order.ts"));
});

test("clean PR (no net-new violations) passes", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/domain/order.ts": GOOD_ORDER,
      "src/domain/ports.ts": PORTS,
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/domain/order.ts", status: "added" }],
    baseContent: () => undefined,
  });
  assert.equal(result.decision, "allow");
});

test("re-implementing an existing symbol raises a reuse advisory (never blocks)", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/application/dates.ts": "export function formatDate(d: Date) { return d.toISOString(); }\n",
      "src/application/format.ts": "export function formatDate(d: Date) { return String(d); }\n", // duplicate, added
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/application/format.ts", status: "added" }],
    baseContent: () => undefined, // format.ts is new; dates.ts unchanged
  });
  assert.equal(result.decision, "allow"); // reuse never blocks
  const reuse = result.advisories.filter((a) => a.detectorId === "reuse.canonical-baseline");
  assert.ok(reuse.some((f) => f.path === "src/application/format.ts" && /formatDate/.test(f.message)));
  assert.ok(reuse.every((f) => f.severity !== "block"));
});

test("a modified file's pre-existing own symbol is NOT flagged as a duplicate", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/domain/log.ts": "export class Logger {}\n",
      // head version adds a method but Logger already existed here at base.
      "src/infrastructure/log.ts": "export class Logger { write() {} }\n",
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/infrastructure/log.ts", status: "modified" }],
    baseContent: (p) => (p === "src/infrastructure/log.ts" ? "export class Logger {}\n" : undefined),
  });
  const reuse = result.advisories.filter((a) => a.detectorId === "reuse.canonical-baseline");
  // Logger pre-existed in the modified file itself ⇒ not a net-new re-implementation.
  assert.equal(reuse.length, 0);
});
