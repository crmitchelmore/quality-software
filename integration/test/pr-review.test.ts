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

const NAMING_PROFILE = `projectSize: small
philosophies:
  adopt:
    - id: a-philosophy-of-software-design
      weight: primary
  reject: []
adopt:
  - id: repository
    enforcement: warn
    options:
      namingConvention:
        scopeGlob: "src/domain/**"
        exportKind: interface
        namePattern: "^[A-Z][A-Za-z0-9]*Repository$"
phases:
  write: { enabled: true, mode: advise, failMode: open, llm: false, block: false }
  pr:    { enabled: true, llm: true, failOn: block }
  later: { enabled: true }
`;

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

test("configured boundary globs drive PR certifier layer classification", () => {
  const dir = makeProject({
    profile: FEATURE_BOUNDARY_PROFILE,
    files: {
      "src/features/orders/model/order.ts": `import { Db } from "../data/db";\nexport class Order { constructor(private db: Db) {} }\n`,
      "src/features/orders/data/db.ts": DB,
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/features/orders/model/order.ts", status: "modified" }],
    baseContent: (p) =>
      p === "src/features/orders/model/order.ts" ? "export class Order {}\n" : undefined,
  });
  assert.equal(result.decision, "block");
  assert.ok(result.blocking.some((f) => f.path === "src/features/orders/model/order.ts"));
});

test("net-new candidate consistency score is attached to certified PR advisories without duplicate findings", () => {
  const dir = makeProject({
    profile: todoProfile("warn"),
    files: {
      "src/domain/order.ts": BAD_ORDER,
      "src/domain/ports.ts": PORTS,
      "src/infrastructure/db.ts": DB,
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/domain/order.ts", status: "modified" }],
    baseContent: (p) => (p === "src/domain/order.ts" ? GOOD_ORDER : undefined),
  });

  assert.equal(result.decision, "allow");
  const boundary = result.advisories.filter((f) => f.detectorId.startsWith("policy-certifier:boundary"));
  assert.equal(boundary.length, 1, "expected the certified boundary advisory, not a duplicate consistency finding");
  assert.match(boundary[0].message, /Pattern consistency is now/);
  assert.equal(result.advisories.filter((f) => f.detectorId === "consistency.candidate-pattern").length, 0);
});

test("pre-existing candidate consistency violations are not re-advised", () => {
  const dir = makeProject({
    profile: todoProfile("warn"),
    files: {
      "src/domain/order.ts": BAD_ORDER,
      "src/infrastructure/db.ts": DB,
      "src/application/foo.ts": "export const foo = 1;\n",
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/application/foo.ts", status: "added" }],
    baseContent: () => undefined,
  });

  assert.equal(result.decision, "allow");
  assert.equal(result.advisories.filter((f) => /Pattern consistency is now/.test(f.message)).length, 0);
  assert.equal(result.advisories.filter((f) => f.detectorId === "consistency.candidate-pattern").length, 0);
});

test("profile naming-convention policy flags inconsistent exported symbols as advisory", () => {
  const dir = makeProject({
    profile: NAMING_PROFILE,
    files: {
      "src/domain/user.ts": "export interface UserStore { find(id: string): Promise<unknown>; }\n",
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/domain/user.ts", status: "added" }],
    baseContent: () => undefined,
  });

  assert.equal(result.decision, "allow");
  const naming = result.advisories.filter((f) => f.detectorId === "policy-certifier:naming:repository:0");
  assert.equal(naming.length, 1);
  assert.equal(naming[0].severity, "warning");
  assert.match(naming[0].evidence ?? "", /UserStore/);
  assert.match(result.summary, /Policy advisories/);
});

test("patterns.exceptions.yaml suppresses PR review findings by fingerprint", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/domain/order.ts": BAD_ORDER,
      "src/infrastructure/db.ts": DB,
    },
  });
  const profile = profileFor(dir);
  const input = {
    repoRoot: dir,
    profile,
    changes: [{ path: "src/domain/order.ts", status: "modified" as const }],
    baseContent: (p: string) => (p === "src/domain/order.ts" ? GOOD_ORDER : undefined),
  };
  const blocked = reviewPR(input);
  const fp = blocked.blocking[0].fingerprint;
  writeFile(
    dir,
    "patterns.exceptions.yaml",
    `version: 1
exceptions:
  - fingerprint: ${fp}
    reason: Accepted during staged dependency inversion migration.
`,
  );

  const suppressed = reviewPR(input);
  assert.equal(suppressed.decision, "allow");
  assert.equal(suppressed.blocking.length, 0);
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

test("signature-similar implementation raises a semantic reuse advisory when lexically corroborated", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/application/dates.ts": "export function formatDate(value: Date): string { return value.toISOString(); }\n",
      "src/application/iso.ts": "export function toIsoString(input: Date): string { return input.toISOString(); }\n",
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/application/iso.ts", status: "added" }],
    baseContent: () => undefined,
  });

  assert.equal(result.decision, "allow");
  const semantic = result.advisories.filter((a) => a.detectorId === "reuse.signature-baseline");
  assert.equal(semantic.length, 1);
  assert.match(semantic[0].message, /formatDate/);
  assert.match(semantic[0].evidence ?? "", /signature fn\(date\):string/);
  assert.match(result.summary, /Signature-reuse advisories/);
});

test("signature reuse requires lexical corroboration, not just a shared signature shape", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/application/dates.ts": "export function formatDate(value: Date): string { return value.toISOString(); }\n",
      "src/application/users.ts": "export function describeUser(birth: Date): string { return birth.getFullYear().toString(); }\n",
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/application/users.ts", status: "added" }],
    baseContent: () => undefined,
  });

  assert.equal(result.advisories.filter((a) => a.detectorId === "reuse.signature-baseline").length, 0);
});

test("exact-name reuse suppresses duplicate signature reuse noise", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/application/dates.ts": "export function formatDate(value: Date): string { return value.toISOString(); }\n",
      "src/application/format.ts": "export function formatDate(input: Date): string { return input.toISOString(); }\n",
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/application/format.ts", status: "added" }],
    baseContent: () => undefined,
  });

  assert.ok(result.advisories.some((a) => a.detectorId === "reuse.canonical-baseline"));
  assert.equal(result.advisories.filter((a) => a.detectorId === "reuse.signature-baseline").length, 0);
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

test("a PR adding inline capability usage when a canonical helper exists raises a capability-bypass advisory", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      // canonical date helper: uses dayjs and is depended upon by a & b (inbound 2).
      "src/util/clock.ts": `import dayjs from "dayjs";\nexport function now() { return dayjs(); }\n`,
      "src/a.ts": `import { now } from "./util/clock";\nexport const a = now();\n`,
      "src/b.ts": `import { now } from "./util/clock";\nexport const b = now();\n`,
      // PR-added file that reaches for dayjs directly instead of the helper.
      "src/feature/report.ts": `import dayjs from "dayjs";\nexport function report() { return dayjs().toString(); }\n`,
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/feature/report.ts", status: "added" }],
    baseContent: () => undefined,
  });
  assert.equal(result.decision, "allow"); // advisory, never blocks
  const cap = result.advisories.filter((a) => a.detectorId === "reuse.capability-bypass");
  assert.ok(
    cap.some((f) => f.path === "src/feature/report.ts" && /clock\.ts/.test(f.message)),
    "expected a capability-bypass advisory pointing at the clock helper",
  );
});

test("a PR file that routes through the canonical helper raises NO capability-bypass advisory", () => {
  const dir = makeProject({
    profile: todoProfile("block"),
    files: {
      "src/util/clock.ts": `import dayjs from "dayjs";\nexport function now() { return dayjs(); }\n`,
      "src/a.ts": `import { now } from "./util/clock";\nexport const a = now();\n`,
      "src/b.ts": `import { now } from "./util/clock";\nexport const b = now();\n`,
      // PR-added file that correctly reuses the helper (no direct dayjs import).
      "src/feature/report.ts": `import { now } from "../util/clock";\nexport function report() { return now().toString(); }\n`,
    },
  });
  const profile = profileFor(dir);
  const result = reviewPR({
    repoRoot: dir,
    profile,
    changes: [{ path: "src/feature/report.ts", status: "added" }],
    baseContent: () => undefined,
  });
  const cap = result.advisories.filter((a) => a.detectorId === "reuse.capability-bypass");
  assert.equal(cap.length, 0);
});
