import { test, after } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { makeProject, cleanupAll } from "./helpers.js";
import { loadProfile } from "../src/profile.js";
import { loadCatalogue } from "../src/catalogue.js";

after(cleanupAll);

const catalogue = loadCatalogue(process.env.CONFORMANCE_CATALOGUE_ROOT);

test("loadProfile accepts adopt grouped by altitude band, flattened high→medium→low", () => {
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
