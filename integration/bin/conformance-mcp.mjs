#!/usr/bin/env node
// Launcher for the conformance MCP stdio server (tsx loader resolved from this package).
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const server = join(here, "..", "src", "mcp.ts");
const require = createRequire(import.meta.url);
const tsxImport = pathToFileURL(require.resolve("tsx")).href;

const child = spawn(process.execPath, ["--import", tsxImport, server, ...process.argv.slice(2)], {
  stdio: "inherit",
});
child.on("exit", (code) => process.exit(code ?? 0));
