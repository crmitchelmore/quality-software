#!/usr/bin/env node
// Launcher for the conformance CLI. Runs the TypeScript entrypoint via the tsx
// loader resolved from THIS package (works regardless of the caller's cwd).
// For a production install this would point at a compiled dist/cli.js instead.
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "src", "cli.ts");
const require = createRequire(import.meta.url);
const tsxImport = pathToFileURL(require.resolve("tsx")).href;

const child = spawn(process.execPath, ["--import", tsxImport, cli, ...process.argv.slice(2)], {
  stdio: "inherit",
});
child.on("exit", (code) => process.exit(code ?? 0));
