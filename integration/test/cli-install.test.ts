import test from "node:test";
import assert from "node:assert/strict";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { REPO_ROOT } from "./helpers.js";

test("install-copilot registers the generated bundle with Copilot", () => {
  const dir = mkdtempSync(join(tmpdir(), "conformance-plugin-install-"));
  try {
    const binDir = join(dir, "bin");
    mkdirSync(binDir);
    const log = join(dir, "copilot.log");
    const fakeCopilot = join(binDir, "copilot");
    writeFileSync(
      fakeCopilot,
      `#!/bin/sh
printf '%s\\n' "$*" >> '${log}'
if [ "$1" = "plugin" ] && [ "$2" = "install" ]; then
  test -f "$3/plugin.json"
  test -f "$3/.claude-plugin/plugin.json"
  test -f "$3/hooks/hooks.json"
  printf 'verified %s\\n' "$3" >> '${log}'
  echo 'Plugin "quality-software-conformance" installed successfully.'
  exit 0
fi
echo "unexpected copilot invocation: $*" >&2
exit 1
`,
    );
    chmodSync(fakeCopilot, 0o755);

    const output = execFileSync(process.execPath, [join(REPO_ROOT, "integration", "bin", "conformance.mjs"), "install-copilot"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: {
        ...process.env,
        CONFORMANCE_CATALOGUE_ROOT: REPO_ROOT,
        HOME: dir,
        PATH: `${binDir}:${process.env.PATH ?? ""}`,
      },
    });

    assert.match(output, /Prepared Quality Software conformance plugin bundle/);
    assert.match(output, /Installed Quality Software conformance plugin/);
    assert.match(output, /Persistent local plugin source/);
    assert.match(output, /Plugin "quality-software-conformance" installed successfully/);
    const source = join(dir, ".copilot", "local-plugins", "quality-software--conformance");
    assert.equal(JSON.parse(readFileSync(join(source, "plugin.json"), "utf8")).name, "quality-software-conformance");
    const calls = readFileSync(log, "utf8").trim().split("\n");
    assert.equal(calls[0], `plugin install ${source}`);
    assert.equal(calls[1], `verified ${source}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
