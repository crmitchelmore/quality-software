import { test, after } from "node:test";
import assert from "node:assert/strict";
import { sessionPrimer } from "../src/init.js";
import { loadProfile } from "../src/profile.js";
import { loadCatalogue } from "../src/catalogue.js";
import { makeProject, writeFile, cleanupAll } from "./helpers.js";
import { join } from "node:path";

after(cleanupAll);

const catalogue = loadCatalogue(process.env.CONFORMANCE_CATALOGUE_ROOT);

const profileYaml = [
  "version: 1",
  "philosophies:",
  "  - domain-driven-design",
  "patterns:",
  "  medium:",
  "    adopt:",
  "      - id: repository",
  "        enforcement: advise",
  "  ban: []",
].join("\n");

test("session primer injects canonical helper homes from patterns.map.yaml", () => {
  const dir = makeProject({ profile: profileYaml });
  writeFile(
    dir,
    "patterns.map.yaml",
    [
      "meta:",
      "  fileCount: 1",
      "  detector: test",
      "  limitations: []",
      "patterns:",
      "  - id: repository",
      "    title: Repository",
      "    altitude: medium",
      "    confidence: high",
      "    flavour: x",
      "    evidence: []",
      "    anchors:",
      "      - src/persistence/OrderRepository.ts",
      "    philosophies: []",
      "capabilities:",
      "  - id: date-time",
      "    title: Date & time handling",
      "    status: canonical-bypassed",
      "    canonical: src/shared/dates.ts",
      "    usedIn: 9",
      "    sample: []",
    ].join("\n"),
  );
  const profile = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  const primer = sessionPrimer(profile, catalogue, dir);
  assert.match(primer, /Canonical helpers/);
  assert.match(primer, /src\/shared\/dates\.ts/);
  assert.match(primer, /Patterns already live here/);
  assert.match(primer, /src\/persistence\/OrderRepository\.ts/);
});

test("session primer omits canonical homes when no map is present", () => {
  const dir = makeProject({ profile: profileYaml });
  const profile = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  const primer = sessionPrimer(profile, catalogue, dir);
  assert.doesNotMatch(primer, /Canonical helpers/);
  // Still includes the philosophy/pattern priming.
  assert.match(primer, /Design philosophies/);
});
