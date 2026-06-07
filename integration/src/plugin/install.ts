import { existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { copilotPluginManifest, writePluginBundle } from "./bundle.js";

export { COPILOT_PLUGIN_SKILLS, copilotPluginCommandFiles, copilotPluginManifest } from "./bundle.js";
export type { CopilotPluginManifest } from "./bundle.js";

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

export function copilotPluginName(): string {
  return copilotPluginManifest().name;
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
