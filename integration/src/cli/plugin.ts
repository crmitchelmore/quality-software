import { existsSync } from "node:fs";
import { join } from "node:path";
import { loadProfile } from "../profile.js";
import { copilotPluginInstalled, copilotPluginName, copilotPluginPaths, installCopilotPlugin } from "../plugin/install.js";
import { loadActiveCatalogue, repoCatalogueRoot } from "./context.js";

export function cmdInstallCopilot(args: string[]): void {
  const result = installCopilotPlugin({
    catalogueRoot: repoCatalogueRoot(),
    force: args.includes("--force"),
    stdout: process.stdout,
    stderr: process.stderr,
  });
  process.exitCode = result.exitCode;
}

export function cmdDoctor(): void {
  const cwd = process.cwd();
  const catalogueRoot = repoCatalogueRoot();
  const checks: { label: string; ok: boolean; detail: string }[] = [
    {
      label: "catalogue root",
      ok: existsSync(join(catalogueRoot, "docs", "graph", "knowledge-graph.json")),
      detail: catalogueRoot,
    },
    {
      label: "project profile",
      ok: existsSync(join(cwd, "patterns.config.yaml")),
      detail: join(cwd, "patterns.config.yaml"),
    },
    {
      label: "project map",
      ok: existsSync(join(cwd, "patterns.map.yaml")),
      detail: join(cwd, "patterns.map.yaml"),
    },
    {
      label: "project anchors",
      ok: existsSync(join(cwd, "patterns.anchors.yaml")),
      detail: join(cwd, "patterns.anchors.yaml"),
    },
    {
      label: "copilot plugin",
      ok: copilotPluginInstalled(),
      detail: `${copilotPluginPaths().cacheTarget} (${copilotPluginName()})`,
    },
  ];

  process.stdout.write("Quality Software conformance doctor\n\n");
  for (const c of checks) process.stdout.write(`${c.ok ? "✔" : "✘"} ${c.label}: ${c.detail}\n`);
  process.stdout.write("\n");

  try {
    const catalogue = loadActiveCatalogue(cwd);
    const profile = loadProfile(join(cwd, "patterns.config.yaml"), catalogue);
    process.stdout.write(`✔ resolved profile: ${profile.adopt.length} adopted pattern(s)\n`);
    for (const warning of profile.warnings) process.stdout.write(`profile warning: ${warning}\n`);
  } catch (e) {
    process.stdout.write(`✘ resolved profile: ${(e as Error).message}\n`);
    process.exitCode = 1;
  }
}
