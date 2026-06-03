import { test, after } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { makeProject, cleanupAll } from "./helpers.js";
import { loadProfile } from "../src/profile.js";
import { loadCatalogue } from "../src/catalogue.js";

after(cleanupAll);

const catalogue = loadCatalogue(process.env.CONFORMANCE_CATALOGUE_ROOT);

test("loadProfile accepts patterns grouped as patterns.<band>.adopt, high→medium→low", () => {
  const dir = makeProject({
    profile: [
      "version: 1",
      "philosophies: []",
      "patterns:",
      "  low:",
      "    adopt:",
      "      - id: strategy",
      "        enforcement: advise",
      "  high:",
      "    adopt:",
      "      - id: event-sourcing",
      "        enforcement: warn",
      "  medium:",
      "    adopt:",
      "      - id: cqrs",
      "        enforcement: warn",
      "  ban: []",
    ].join("\n"),
  });
  const resolved = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  assert.deepEqual(
    resolved.adopt.map((a) => a.id),
    ["event-sourcing", "cqrs", "strategy"],
  );
  assert.equal(resolved.adopt.find((a) => a.id === "cqrs")?.enforcement, "warn");
});

test("loadProfile accepts adopt grouped under patterns.adopt.<band> (earlier form)", () => {
  const dir = makeProject({
    profile: [
      "version: 1",
      "philosophies: []",
      "patterns:",
      "  adopt:",
      "    low:",
      "      - id: strategy",
      "        enforcement: advise",
      "    high:",
      "      - id: event-sourcing",
      "        enforcement: warn",
      "    medium:",
      "      - id: cqrs",
      "        enforcement: warn",
      "  ban: []",
    ].join("\n"),
  });
  const resolved = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  assert.deepEqual(
    resolved.adopt.map((a) => a.id),
    ["event-sourcing", "cqrs", "strategy"],
  );
  assert.equal(resolved.adopt.find((a) => a.id === "cqrs")?.enforcement, "warn");
});

test("loadProfile still accepts a flat adopt list (back-compat)", () => {
  const dir = makeProject({
    profile: [
      "version: 1",
      "patterns:",
      "  adopt:",
      "    - id: repository",
      "      enforcement: advise",
      "    - id: cqrs",
      "      enforcement: warn",
      "  ban: []",
    ].join("\n"),
  });
  const resolved = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  assert.deepEqual(
    resolved.adopt.map((a) => a.id),
    ["repository", "cqrs"],
  );
});

test("loadProfile merges the independent testing section into philosophies + adopt", () => {
  const dir = makeProject({
    profile: [
      "version: 1",
      "philosophies:",
      "  - domain-driven-design",
      "patterns:",
      "  high:",
      "    adopt:",
      "      - id: event-sourcing",
      "        enforcement: warn",
      "  ban: []",
      "testing:",
      "  philosophies:",
      "    - testing-trophy",
      "  patterns:",
      "    adopt:",
      "      - id: mock-object",
      "        enforcement: advise",
      "      - id: property-based-testing",
      "        enforcement: advise",
    ].join("\n"),
  });
  const resolved = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  // Testing philosophy is merged alongside the architecture philosophy.
  assert.deepEqual(
    resolved.philosophies.adopt.map((p) => p.id).sort(),
    ["domain-driven-design", "testing-trophy"],
  );
  // Testing patterns are merged into the enforceable adopt set.
  const ids = resolved.adopt.map((a) => a.id);
  assert.ok(ids.includes("event-sourcing"));
  assert.ok(ids.includes("mock-object"));
  assert.ok(ids.includes("property-based-testing"));
  // No unknown-id warnings for the testing entries.
  assert.ok(!resolved.warnings.some((w) => /testing-trophy|mock-object|property-based-testing/.test(w)));
});
