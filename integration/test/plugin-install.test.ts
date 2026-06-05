import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { execFileSync } from "node:child_process";
import {
  copilotPluginCommandFiles,
  copilotPluginManifest,
  copilotPluginPaths,
  installCopilotPlugin,
} from "../src/plugin/install.js";
import { REPO_ROOT } from "./helpers.js";

test("installCopilotPlugin writes a persistent source bundle and registers it", () => {
  const home = mkdtempSync(join(tmpdir(), "conformance-plugin-module-"));
  try {
    const calls: string[] = [];
    const execFile = ((command: string, args?: readonly string[]) => {
      calls.push([command, ...(args ?? [])].join(" "));
      return 'Plugin "quality-software-conformance" installed successfully.\n';
    }) as typeof execFileSync;
    let output = "";

    const result = installCopilotPlugin({
      catalogueRoot: REPO_ROOT,
      force: false,
      homeDir: home,
      nodePath: "/usr/local/bin/node",
      execFile,
      stdout: { write: (text: string) => ((output += text), true) } as never,
      stderr: { write: () => true } as never,
    });

    const paths = copilotPluginPaths(home);
    assert.equal(result.exitCode, 0);
    assert.deepEqual(calls, [`copilot plugin install ${paths.sourceTarget}`]);
    assert.match(output, /Persistent local plugin source/);
    assert.deepEqual(JSON.parse(readFileSync(join(paths.sourceTarget, "plugin.json"), "utf8")), copilotPluginManifest());
    assert.ok(existsSync(join(paths.sourceTarget, ".mcp.json")));
    assert.ok(existsSync(join(paths.sourceTarget, "hooks", "hooks.json")));
    assert.ok(existsSync(join(paths.sourceTarget, "skills", "conformance-review", "SKILL.md")));
    for (const commandName of Object.keys(copilotPluginCommandFiles())) {
      assert.ok(existsSync(join(paths.sourceTarget, "commands", commandName)));
    }
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test("installCopilotPlugin force-uninstalls before replacing an existing cache", () => {
  const home = mkdtempSync(join(tmpdir(), "conformance-plugin-module-"));
  try {
    const paths = copilotPluginPaths(home);
    mkdirSync(paths.cacheTarget, { recursive: true });
    const calls: string[] = [];
    const execFile = ((command: string, args?: readonly string[]) => {
      calls.push([command, ...(args ?? [])].join(" "));
      return args?.[1] === "uninstall" ? "uninstalled\n" : "installed\n";
    }) as typeof execFileSync;

    const result = installCopilotPlugin({
      catalogueRoot: REPO_ROOT,
      force: true,
      homeDir: home,
      execFile,
      stdout: { write: () => true } as never,
      stderr: { write: () => true } as never,
    });

    assert.equal(result.exitCode, 0);
    assert.deepEqual(calls, [
      "copilot plugin uninstall quality-software-conformance",
      `copilot plugin install ${paths.sourceTarget}`,
    ]);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});
