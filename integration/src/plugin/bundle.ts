import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Phase } from "../adapters/runtimes.js";

export interface CopilotPluginManifest {
  name: string;
  version: string;
  description: string;
  author: { name: string };
  repository: string;
  license: string;
  keywords: string[];
  skills: string;
  commands: string;
  hooks: string;
  mcpServers: string;
}

interface PluginHookCommand {
  type: "command";
  command: string;
  timeout: number;
}

interface PluginHookRegistration {
  matcher?: string;
  hooks: PluginHookCommand[];
}

interface PluginHooksConfig {
  hooks: {
    SessionStart: PluginHookRegistration[];
    PostToolUse: PluginHookRegistration[];
    AgentStop: PluginHookRegistration[];
  };
}

interface PluginMcpConfig {
  conformance: {
    type: "stdio";
    command: string;
    args: string[];
    env: { CONFORMANCE_CATALOGUE_ROOT: string };
  };
}

export const COPILOT_PLUGIN_SKILLS = ["conformance-review", "codebase-onboarding", "pr-pattern-review"] as const;

export function copilotPluginManifest(): CopilotPluginManifest {
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

export function writePluginBundle(target: string, catalogueRoot: string, nodePath: string): void {
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

  for (const skill of COPILOT_PLUGIN_SKILLS) {
    cpSync(join(catalogueRoot, ".github", "skills", skill), join(target, "skills", skill), {
      recursive: true,
    });
  }
}

function pluginHooks(catalogueRoot: string, nodePath: string): PluginHooksConfig {
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

function pluginMcp(catalogueRoot: string, nodePath: string): PluginMcpConfig {
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
