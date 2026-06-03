import { test, after } from "node:test";
import assert from "node:assert/strict";
import { reuseDetector } from "../src/detectors/reuse.js";
import { makeProject, writeFile, cleanupAll } from "./helpers.js";
import type { ChangeSet, DetectorContext } from "../src/contract.js";

after(cleanupAll);

const ctx = {} as DetectorContext;

async function run(dir: string, changedRel: string, content: string) {
  const det = reuseDetector(["src"]);
  const change: ChangeSet = {
    event: "POST_WRITE_CONTENT",
    repoRoot: dir,
    files: [{ path: `${dir}/${changedRel}`, content }],
  };
  return await det.run(change, ctx);
}

test("reuse flags a genuine domain-specific duplicate", async () => {
  const dir = makeProject({ profile: "version: 1\nphilosophies: []\npatterns:\n  ban: []\n" });
  writeFile(dir, "src/money/vat.ts", "export function calculateVatAmount(n: number) { return n * 0.2; }\n");
  const findings = await run(dir, "src/billing/charge.ts", "export function calculateVatAmount(n: number) { return n * 0.2; }\n");
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /calculateVatAmount/);
});

test("reuse suppresses noisy common names (Result, Options, Service)", async () => {
  const dir = makeProject({ profile: "version: 1\nphilosophies: []\npatterns:\n  ban: []\n" });
  writeFile(dir, "src/a/types.ts", "export type Result = string;\nexport interface Options {}\nexport class Service {}\n");
  const findings = await run(dir, "src/b/types.ts", "export type Result = number;\nexport interface Options {}\nexport class Service {}\n");
  assert.equal(findings.length, 0, "common names must not be flagged as reuse");
});

test("reuse ignores test files and barrels as canonical homes", async () => {
  const dir = makeProject({ profile: "version: 1\nphilosophies: []\npatterns:\n  ban: []\n" });
  writeFile(dir, "src/util/index.ts", "export function parseInvoiceLine(s: string) { return s; }\n");
  writeFile(dir, "src/util/parser.test.ts", "export function parseInvoiceLine(s: string) { return s; }\n");
  const findings = await run(dir, "src/feature/new.ts", "export function parseInvoiceLine(s: string) { return s; }\n");
  assert.equal(findings.length, 0, "barrels and tests are not reuse homes");
});

test("reuse ignores short names", async () => {
  const dir = makeProject({ profile: "version: 1\nphilosophies: []\npatterns:\n  ban: []\n" });
  writeFile(dir, "src/a.ts", "export function fn() {}\nexport const ab = 1;\n");
  const findings = await run(dir, "src/b.ts", "export function fn() {}\nexport const ab = 2;\n");
  assert.equal(findings.length, 0);
});
