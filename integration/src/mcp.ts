import { createInterface } from "node:readline";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { pathToFileURL } from "node:url";
import { loadCatalogue } from "./catalogue.js";
import { loadProfile } from "./profile.js";
import { proposeProfile } from "./init.js";
import { Engine } from "./engine.js";
import type { ChangeSet } from "./contract.js";

/**
 * Minimal MCP stdio server (design 12.4). Hand-rolled newline-delimited JSON-RPC
 * 2.0 — no SDK dependency, so the package stays self-contained and tests stay
 * hermetic. Exposes advisory conformance tools any MCP-capable runtime (Copilot
 * CLI, Claude Code, OpenCode, Codex) can call.
 *
 * All tools are advisory/read-only except `conformance_init` which only writes a
 * candidate profile when explicitly asked (write:true).
 */

interface RpcRequest {
  jsonrpc: "2.0";
  id?: number | string | null;
  method: string;
  params?: unknown;
}

type JsonRecord = Record<string, unknown>;

interface ToolFileParam {
  path: string;
  content?: string;
}

const TOOLS = [
  {
    name: "conformance_profile",
    description: "Return the resolved conformance profile (adopted philosophies, patterns, bans) for the project at `cwd`.",
    inputSchema: {
      type: "object",
      properties: { cwd: { type: "string", description: "Project root (defaults to server cwd)." } },
    },
  },
  {
    name: "conformance_check_change",
    description:
      "Check one or more files against the project's conformance profile. Returns advisory findings with the philosophy → pattern → fix rationale.",
    inputSchema: {
      type: "object",
      properties: {
        cwd: { type: "string" },
        files: {
          type: "array",
          description: "Files to check.",
          items: {
            type: "object",
            properties: { path: { type: "string" }, content: { type: "string" } },
            required: ["path"],
          },
        },
      },
      required: ["files"],
    },
  },
  {
    name: "conformance_suggest_reuse",
    description: "Given a proposed exported symbol name, report whether an equivalent abstraction already exists (reuse-first).",
    inputSchema: {
      type: "object",
      properties: {
        cwd: { type: "string" },
        path: { type: "string", description: "Intended file path of the new symbol." },
        content: { type: "string", description: "Proposed file content (or a snippet declaring the export)." },
      },
      required: ["content"],
    },
  },
  {
    name: "conformance_init",
    description: "Propose a CANDIDATE conformance profile for the project (philosophy-first). Set write:true to write patterns.config.yaml.",
    inputSchema: {
      type: "object",
      properties: { cwd: { type: "string" }, write: { type: "boolean" } },
    },
  },
];

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringParam(params: unknown, key: string): string | undefined {
  if (!isRecord(params)) return undefined;
  const value = params[key];
  return typeof value === "string" ? value : undefined;
}

function booleanParam(params: unknown, key: string): boolean | undefined {
  if (!isRecord(params)) return undefined;
  const value = params[key];
  return typeof value === "boolean" ? value : undefined;
}

function resolveCwd(params: unknown): string {
  return stringParam(params, "cwd") ?? process.cwd();
}

function fileParams(params: unknown): ToolFileParam[] {
  if (!isRecord(params) || !Array.isArray(params.files)) return [];
  return params.files.flatMap((file): ToolFileParam[] => {
    if (!isRecord(file)) return [];
    const path = file.path;
    if (typeof path !== "string") return [];
    const content = typeof file.content === "string" ? file.content : undefined;
    return [{ path, content }];
  });
}

async function runCheck(event: ChangeSet["event"], cwd: string, files: ToolFileParam[]) {
  const catalogue = loadCatalogue(cwd);
  const profile = loadProfile(join(cwd, "patterns.config.yaml"), catalogue);
  const engine = new Engine(profile, catalogue);
  const norm = files.map((f) => ({
    path: isAbsolute(f.path) ? f.path : join(cwd, f.path),
    content:
      f.content ?? (existsSync(isAbsolute(f.path) ? f.path : join(cwd, f.path))
        ? readFileSync(isAbsolute(f.path) ? f.path : join(cwd, f.path), "utf8")
        : undefined),
  }));
  return engine.evaluate({ event, repoRoot: cwd, files: norm });
}

export async function callTool(name: string, params: unknown): Promise<{ text: string }> {
  const cwd = resolveCwd(params);
  switch (name) {
    case "conformance_profile": {
      const catalogue = loadCatalogue(cwd);
      const profile = loadProfile(join(cwd, "patterns.config.yaml"), catalogue);
      return { text: JSON.stringify(profile, null, 2) };
    }
    case "conformance_check_change": {
      const { findings } = await runCheck("BATCH", cwd, fileParams(params));
      return { text: findings.length ? JSON.stringify(findings, null, 2) : "No conformance findings." };
    }
    case "conformance_suggest_reuse": {
      const path = stringParam(params, "path") ?? "src/__proposed__.ts";
      const content = stringParam(params, "content") ?? "";
      const { findings } = await runCheck("BATCH", cwd, [
        { path, content },
      ]);
      const reuse = findings.filter((f) => f.detectorId === "reuse.duplicate-export");
      return { text: reuse.length ? JSON.stringify(reuse, null, 2) : "No existing equivalent found — safe to add." };
    }
    case "conformance_init": {
      const catalogue = loadCatalogue(cwd);
      const { yaml, report } = proposeProfile(cwd, catalogue, {});
      if (booleanParam(params, "write") === true) {
        const target = join(cwd, "patterns.config.yaml");
        if (existsSync(target)) return { text: `Refusing to overwrite existing ${target}.` };
        writeFileSync(target, yaml);
        return { text: `${report}\n\nWrote ${target}.` };
      }
      return { text: `${report}\n\n--- proposed patterns.config.yaml ---\n${yaml}` };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function send(msg: object): void {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

export async function handle(req: RpcRequest): Promise<void> {
  if (req.method === "notifications/initialized" || req.id === undefined || req.id === null) return;
  try {
    switch (req.method) {
      case "initialize":
        send({
          jsonrpc: "2.0",
          id: req.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "conformance", version: "0.2.0" },
          },
        });
        return;
      case "tools/list":
        send({ jsonrpc: "2.0", id: req.id, result: { tools: TOOLS } });
        return;
      case "tools/call": {
        const toolParams = isRecord(req.params) ? req.params : {};
        const name = typeof toolParams.name === "string" ? toolParams.name : undefined;
        const args = toolParams.arguments;
        if (!name) {
          send({
            jsonrpc: "2.0",
            id: req.id,
            result: { content: [{ type: "text", text: "Error: tools/call requires a string tool name." }], isError: true },
          });
          return;
        }
        try {
          const out = await callTool(name, args ?? {});
          send({ jsonrpc: "2.0", id: req.id, result: { content: [{ type: "text", text: out.text }] } });
        } catch (e) {
          send({
            jsonrpc: "2.0",
            id: req.id,
            result: { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true },
          });
        }
        return;
      }
      default:
        send({ jsonrpc: "2.0", id: req.id, error: { code: -32601, message: `Method not found: ${req.method}` } });
    }
  } catch (e) {
    send({ jsonrpc: "2.0", id: req.id, error: { code: -32603, message: (e as Error).message } });
  }
}

export function main(): void {
  const rl = createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let req: RpcRequest;
    try {
      req = JSON.parse(trimmed);
    } catch {
      return;
    }
    void handle(req);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
