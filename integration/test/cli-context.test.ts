import { test, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { cleanupAll, makeProject, REPO_ROOT } from "./helpers.js";

after(cleanupAll);

test("CLI falls back to the bundled catalogue when CONFORMANCE_CATALOGUE_ROOT is unset", () => {
  const dir = makeProject({ profile: "projectSize: small\nadopt: []\nban: []\n" });
  const { CONFORMANCE_CATALOGUE_ROOT: _catalogueRoot, ...env } = process.env;

  const out = execFileSync(process.execPath, [join(REPO_ROOT, "integration", "bin", "conformance.mjs"), "doctor"], {
    cwd: dir,
    encoding: "utf8",
    env,
  });

  assert.match(out, /catalogue root: .*quality-software/);
  assert.match(out, /resolved profile: 0 adopted pattern/);
});
