import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Phase } from "../adapters/runtimes.js";

export interface CopilotPluginPaths {
  cacheTarget: string;
  sourceTarget: string;
}

export interface InstallCopilotPluginOptions {
  catalogueRoot: string;
  force: boolean;
  stdout?: Pick<NodeJS.WriteStream, "write">;
  stderr?: Pick<NodeJS.WriteStream, "write">;
  homeDir?: string;
  nodePath?: string;
  execFile?: typeof execFileSync;
}

export interface InstallCopilotPluginResult {
  exitCode: number;
}

const PLUGIN_DIRECTORY = "quality-software--conformance";

export function copilotPluginManifest(): Record<string, unknown> {
  return {
    name: "quality-software-conformance",
    version: "0.2.0",
    description: "Repo-local pattern conformance for Copilot CLI: advisory hooks, skills, commands, and MCP tools.",
    author: { name: "Quality Software" },
    repository: "https://github.com/crmitchelmore/quality-software",
    license: "MIT",
    keywords: ["copilot-cli", "conformance", "patterns", "architecture", "code-review"],
    skills: "skills/",
    commands: "commands/",
    hooks: "hooks/hooks.json",
    mcpServers: ".mcp.json",
  };
}

export function copilotPluginName(): string {
  return copilotPluginManifest().name as string;
}

export function copilotPluginPaths(homeDir = homedir()): CopilotPluginPaths {
  return {
    cacheTarget: join(homeDir, ".copilot", "installed-plugins", "_direct", PLUGIN_DIRECTORY),
    sourceTarget: join(homeDir, ".copilot", "local-plugins", PLUGIN_DIRECTORY),
  };
}

export function installCopilotPlugin(options: InstallCopilotPluginOptions): InstallCopilotPluginResult {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  const execFile = options.execFile ?? execFileSync;
  const paths = copilotPluginPaths(options.homeDir);
  const pluginName = copilotPluginName();

  if (existsSync(paths.cacheTarget)) {
    if (!options.force) {
      stderr.write(`Plugin already installed at ${paths.cacheTarget}. Re-run with --force to replace it.\n`);
      return { exitCode: 1 };
    }
    if (!unregisterCopilotPluginForForce(pluginName, execFile, stderr)) return { exitCode: 1 };
    rmSync(paths.cacheTarget, { recursive: true, force: true });
  }

  rmSync(paths.sourceTarget, { recursive: true, force: true });
  writePluginBundle(paths.sourceTarget, options.catalogueRoot, options.nodePath ?? process.execPath);

  stdout.write(`Prepared Quality Software conformance plugin bundle at ${paths.sourceTarget}\n`);
  if (!registerCopilotPlugin(paths.sourceTarget, execFile, stdout, stderr)) return { exitCode: 1 };
  stdout.write(`Installed Quality Software conformance plugin at ${paths.cacheTarget}\n`);
  stdout.write(`Persistent local plugin source at ${paths.sourceTarget}\n`);
  stdout.write("Restart Copilot CLI or start a new session for plugin hooks and commands to become active.\n");
  return { exitCode: 0 };
}

export function copilotPluginInstalled(homeDir = homedir(), execFile: typeof execFileSync = execFileSync): boolean {
  return existsSync(copilotPluginPaths(homeDir).cacheTarget) && copilotPluginRegistered(copilotPluginName(), execFile);
}

function writePluginBundle(target: string, catalogueRoot: string, nodePath: string): void {
  mkdirSync(join(target, ".claude-plugin"), { recursive: true });
  mkdirSync(join(target, "hooks"), { recursive: true });
  mkdirSync(join(target, "commands"), { recursive: true });
  mkdirSync(join(target, "skills"), { recursive: true });

  writeJson(join(target, "plugin.json"), copilotPluginManifest());
  writeJson(join(target, ".claude-plugin", "plugin.json"), copilotPluginManifest());
  writeJson(join(target, "hooks", "hooks.json"), pluginHooks(catalogueRoot, nodePath));
  writeJson(join(target, ".mcp.json"), pluginMcp(catalogueRoot, nodePath));
  for (const [name, body] of Object.entries(copilotPluginCommandFiles())) {
    writeFileSync(join(target, "commands", name), body);
  }

  const skills = ["conformance-review", "codebase-onboarding", "pr-pattern-review"];
  for (const skill of skills) {
    cpSync(join(catalogueRoot, ".github", "skills", skill), join(target, "skills", skill), {
      recursive: true,
    });
  }
}

function registerCopilotPlugin(
  target: string,
  execFile: typeof execFileSync,
  stdout: Pick<NodeJS.WriteStream, "write">,
  stderr: Pick<NodeJS.WriteStream, "write">,
): boolean {
  try {
    const out = execFile("copilot", ["plugin", "install", target], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (out.trim()) stdout.write(out);
    return true;
  } catch (e) {
    const detail = commandOutput(e);
    stderr.write(
      `Plugin bundle was written, but Copilot CLI did not register it: ${detail}\n` +
        `Run \`copilot plugin install ${target}\` after resolving the error.\n`,
    );
    return false;
  }
}

function unregisterCopilotPluginForForce(
  name: string,
  execFile: typeof execFileSync,
  stderr: Pick<NodeJS.WriteStream, "write">,
): boolean {
  try {
    execFile("copilot", ["plugin", "uninstall", name], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return true;
  } catch (e) {
    const detail = commandOutput(e);
    if (detail.includes(`Plugin "${name}" is not installed`)) return true;
    stderr.write(`Failed to unregister existing Copilot plugin "${name}": ${detail}\n`);
    return false;
  }
}

function copilotPluginRegistered(name: string, execFile: typeof execFileSync): boolean {
  try {
    const out = execFile("copilot", ["plugin", "list"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return out.includes(name);
  } catch {
    return false;
  }
}

function commandOutput(error: unknown): string {
  const maybe = error as { stdout?: Buffer | string; stderr?: Buffer | string; message?: string };
  const stdout = maybe.stdout ? maybe.stdout.toString() : "";
  const stderr = maybe.stderr ? maybe.stderr.toString() : "";
  return `${stdout}${stderr}${maybe.message ?? ""}`.trim();
}

function pluginHooks(catalogueRoot: string, nodePath: string): Record<string, unknown> {
  return {
    hooks: {
      SessionStart: [
        {
          hooks: [{ type: "command", command: hookCommand(catalogueRoot, nodePath, "session-start"), timeout: 5000 }],
        },
      ],
      PostToolUse: [
        {
          matcher: "edit|create|apply_patch|Write|Edit|MultiEdit",
          hooks: [{ type: "command", command: hookCommand(catalogueRoot, nodePath, "post-write"), timeout: 5000 }],
        },
      ],
      AgentStop: [
        {
          hooks: [{ type: "command", command: hookCommand(catalogueRoot, nodePath, "turn-end"), timeout: 5000 }],
        },
      ],
    },
  };
}

function pluginMcp(catalogueRoot: string, nodePath: string): Record<string, unknown> {
  return {
    conformance: {
      type: "stdio",
      command: nodePath,
      args: [join(catalogueRoot, "integration", "bin", "conformance-mcp.mjs")],
      env: {
        CONFORMANCE_CATALOGUE_ROOT: catalogueRoot,
      },
    },
  };
}

export function copilotPluginCommandFiles(): Record<string, string> {
  return {
    "conformance-doctor.md": `---\ndescription: Diagnose the Quality Software conformance plugin and project wiring\nallowed-tools: Bash, Read\n---\n\nRun \`conformance doctor\` in the current repository. If it reports missing artefacts, explain the smallest next command to fix them. Do not promote advisory findings to blocking findings.\n`,
    "conformance-onboard.md": `---\ndescription: Onboard a repository into Quality Software conformance artefacts\nallowed-tools: Bash, Read, Write\n---\n\nRun \`conformance onboard --write-profile --write-map --write-anchors\` only when the repository does not already have ratified conformance artefacts. If artefacts exist, run \`conformance onboard --inventory\` and report candidate gaps without overwriting files.\n`,
    "conformance-review.md": `---\ndescription: Run a baseline-aware Quality Software conformance review\nallowed-tools: Bash, Read\n---\n\nRun \`conformance review --base origin/main\` unless the PR base is known to be different. Report findings as advisory unless the tool returns a blocking decision from a certified deterministic rule.\n`,
  };
}

function hookCommand(catalogueRoot: string, nodePath: string, phase: Phase): string {
  const bin = join(catalogueRoot, "integration", "bin", "conformance.mjs");
  const inner = `CONFORMANCE_CATALOGUE_ROOT=${sh(catalogueRoot)} ${sh(nodePath)} ${sh(bin)} hook ${phase} || printf '{}'`;
  return `/bin/sh -lc ${sh(inner)}`;
}

function sh(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
}
