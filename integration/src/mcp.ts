import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";
import { callTool, TOOLS } from "./mcp/tools.js";

export { callTool } from "./mcp/tools.js";

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

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
