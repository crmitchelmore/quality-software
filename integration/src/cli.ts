import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runHook, type Phase, type Dialect } from "./adapters/runtimes.js";
import { loadCatalogue } from "./catalogue.js";
import { loadProfile, ProfileError } from "./profile.js";
import { proposeProfile } from "./init.js";
import { Engine } from "./engine.js";
import type { ChangeSet, Finding } from "./contract.js";
import { walkSourceFiles } from "./fs-util.js";
import { buildEvidenceMap } from "./model/project-map.js";
import { proposeProfileFromEvidence } from "./model/proposal.js";
import { renderOnboardingReport, renderAnchorsYaml } from "./model/report.js";
import { buildInventory, renderInventory } from "./model/inventory.js";
import { buildPatternMap, renderPatternMapYaml } from "./model/pattern-map.js";
import { reviewPRWithLLM, changesFromGit, gitBaseContent } from "./review/pr-review.js";
import { layerPrefixesFromProfile } from "./model/layers.js";
import { boundaryProfileLayerWarnings } from "./model/validation.js";
import { llmClientFromEnv } from "./llm/config.js";
import { copilotPluginInstalled, copilotPluginName, copilotPluginPaths, installCopilotPlugin } from "./plugin/install.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

async function cmdHook(which: string, rest: string[]): Promise<void> {
  const raw = await readStdin();
  let payload: Record<string, unknown> = {};
  try {
    payload = raw.trim() ? JSON.parse(raw) : {};
  } catch {
    payload = {};
  }
  const rIdx = rest.indexOf("--runtime");
  const dialect = (rIdx >= 0 ? rest[rIdx + 1] : "copilot") as Dialect;
  const phases: Phase[] = ["session-start", "post-write", "guard-shell", "turn-end"];
  if (!phases.includes(which as Phase)) {
    process.stdout.write("{}");
    return;
  }
  process.stdout.write(await runHook(which as Phase, dialect, payload));
}

function cmdInit(write: boolean): void {
  const cwd = process.cwd();
  const catalogue = loadActiveCatalogue(cwd);
  const { yaml, report } = proposeProfile(cwd, catalogue, {});
  process.stderr.write(report + "\n\n");
  const target = join(cwd, "patterns.config.yaml");
  if (write) {
    if (existsSync(target)) {
      process.stderr.write(`Refusing to overwrite existing ${target}. Remove it first.\n`);
      process.exitCode = 1;
      return;
    }
    writeFileSync(target, yaml);
    process.stderr.write(`Wrote candidate ${target}. Review and ratify via PR.\n`);
  } else {
    process.stdout.write(yaml);
  }
}

function changedFiles(cwd: string, base?: string): string[] {
  try {
    const ref = base ?? "HEAD";
    const out = execFileSync("git", ["-C", cwd, "diff", "--name-only", "--diff-filter=ACMR", ref], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.split("\n").map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

async function cmdCheck(args: string[]): Promise<void> {
  const cwd = process.cwd();
  const eventIdx = args.indexOf("--event");
  const event = (eventIdx >= 0 ? args[eventIdx + 1] : "PR_REVIEW") as ChangeSet["event"];
  const baseIdx = args.indexOf("--base");
  const base = baseIdx >= 0 ? args[baseIdx + 1] : undefined;
  const explicit = args.filter((a) => !a.startsWith("--") && a !== base && a !== event);

  const profilePath = join(cwd, "patterns.config.yaml");
  const catalogue = loadActiveCatalogue(cwd);
  let profile;
  try {
    profile = loadProfile(profilePath, catalogue);
  } catch (e) {
    process.stderr.write((e as Error).message + "\n");
    process.exitCode = 2;
    return;
  }
  for (const w of profile.warnings) process.stderr.write(`profile warning: ${w}\n`);

  let paths = explicit.length ? explicit : changedFiles(cwd, base);
  if (paths.length === 0) paths = [...walkSourceFiles(join(cwd, "src"))];

  const files = paths
    .map((p) => (isAbsolute(p) ? p : join(cwd, p)))
    .filter((p) => existsSync(p))
    .map((p) => ({ path: p, content: safeRead(p) }))
    .filter((f) => f.content !== undefined) as { path: string; content: string }[];

  const engine = new Engine(profile, catalogue);
  const { findings, verdict } = await engine.evaluate({ event, repoRoot: cwd, files });

  printFindings(findings);
  const failOn = profile.phases.pr.failOn;
  const shouldFail =
    (event === "PR_REVIEW" || event === "BATCH") &&
    // Advisory (LLM-only) findings never gate CI, regardless of severity (design 16.2).
    findings.some((f) => !f.advisory && severityAtLeast(f, failOn));
  process.exitCode = shouldFail ? 1 : 0;
  if (verdict.decision === "deny") process.exitCode = 1;
}

function safeRead(p: string): string | undefined {
  try {
    return readFileSync(p, "utf8");
  } catch {
    return undefined;
  }
}

const ORDER = ["info", "advice", "warning", "block"];
function severityAtLeast(f: Finding, min: string): boolean {
  return ORDER.indexOf(f.severity) >= ORDER.indexOf(min);
}

function printFindings(findings: Finding[]): void {
  if (findings.length === 0) {
    process.stdout.write("✔ No conformance findings.\n");
    return;
  }
  process.stdout.write(`Conformance findings (${findings.length}):\n`);
  for (const f of findings) {
    const loc = f.line ? `${f.path}:${f.line}` : f.path;
    process.stdout.write(`\n  [${f.severity}] ${loc}\n    ${f.message}\n`);
    if (f.suggestion) process.stdout.write(`    fix: ${f.suggestion}\n`);
    if (f.rationale) process.stdout.write(`    why: ${f.rationale}\n`);
  }
  process.stdout.write("\n");
}

function cmdProfile(): void {
  const cwd = process.cwd();
  const catalogue = loadActiveCatalogue(cwd);
  try {
    const profile = loadProfile(join(cwd, "patterns.config.yaml"), catalogue);
    process.stdout.write(JSON.stringify(profile, null, 2) + "\n");
  } catch (e) {
    process.stderr.write((e as Error).message + "\n");
    process.exitCode = e instanceof ProfileError ? 2 : 1;
  }
}

function cmdOnboard(args: string[]): void {
  const cwd = process.cwd();
  const catalogue = loadActiveCatalogue(cwd);
  const profilePath = join(cwd, "patterns.config.yaml");
  let profile: ReturnType<typeof loadProfile> | undefined;
  if (existsSync(profilePath)) {
    try {
      profile = loadProfile(profilePath, catalogue);
    } catch (e) {
      process.stderr.write(`warning: could not load existing profile for onboarding context: ${(e as Error).message}\n`);
    }
  }
  const map = buildEvidenceMap(cwd, { layerPrefixes: profile ? layerPrefixesFromProfile(profile) : undefined });

  // Persist the derived map (gitignored artifact, design 14).
  const outDir = join(cwd, ".conformance");
  try {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "project-map.json"), JSON.stringify(map, null, 2) + "\n");
  } catch (e) {
    process.stderr.write(`warning: could not write project-map.json: ${(e as Error).message}\n`);
  }

  const proposal = proposeProfileFromEvidence(map, catalogue);
  if (profile) proposal.notes.push(...boundaryProfileLayerWarnings(map, profile));
  const inventory = buildInventory(map, catalogue);

  // `--inventory` prints ONLY the altitude-grouped pattern/philosophy inventory.
  if (args.includes("--inventory")) {
    process.stdout.write(renderInventory(inventory));
    return;
  }

  // Default: lead with the inventory (the "what patterns, and where" view), then
  // the fuller evidence preview.
  process.stdout.write(renderInventory(inventory));
  process.stdout.write("\n---\n\n");
  process.stdout.write(renderOnboardingReport(map, proposal));

  if (args.includes("--write-profile")) {
    const target = join(cwd, "patterns.config.yaml");
    if (existsSync(target)) {
      process.stderr.write(`\nRefusing to overwrite existing ${target}; profile already exists.\n`);
      process.exitCode = 1;
    } else {
      writeFileSync(target, proposal.yaml);
      process.stderr.write(`\nWrote warn-only candidate ${target}. Review and ratify before relying on it.\n`);
    }
  }
  if (args.includes("--write-anchors")) {
    writeFileSync(join(cwd, "patterns.anchors.yaml"), renderAnchorsYaml(proposal));
    process.stderr.write(`Wrote patterns.anchors.yaml. Review the canonical anchors before trusting them.\n`);
  }
  if (args.includes("--write-map")) {
    const pm = buildPatternMap(map, catalogue);
    writeFileSync(join(cwd, "patterns.map.yaml"), renderPatternMapYaml(pm));
    process.stderr.write(`Wrote patterns.map.yaml (detailed companion: where patterns live, how & what flavour).\n`);
  }
}

async function cmdReview(args: string[]): Promise<void> {
  const cwd = process.cwd();
  const i = args.indexOf("--base");
  const base = i >= 0 ? args[i + 1] : "origin/main";
  const catalogue = loadActiveCatalogue(cwd);
  let profile;
  try {
    profile = loadProfile(join(cwd, "patterns.config.yaml"), catalogue);
  } catch (e) {
    process.stderr.write((e as Error).message + "\n");
    process.exitCode = e instanceof ProfileError ? 2 : 1;
    return;
  }
  const changes = changesFromGit(cwd, base);
  if (changes.length === 0) {
    if (args.includes("--json")) {
      process.stdout.write(
        JSON.stringify(
          {
            decision: "allow",
            blocking: [],
            advisories: [],
            findings: [],
            summary: `No changes detected against ${base}.`,
          },
          null,
          2,
        ) + "\n",
      );
      return;
    }
    process.stdout.write(`No changes detected against ${base}.\n`);
    return;
  }
  const result = await reviewPRWithLLM({
    repoRoot: cwd,
    profile,
    changes,
    baseContent: gitBaseContent(cwd, base),
    llm: { client: llmClientFromEnv(), catalogueRoot: repoCatalogueRoot() },
  });
  if (args.includes("--json")) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    if (result.decision === "block") process.exitCode = 1;
    return;
  }
  process.stdout.write(result.summary + "\n\n");
  printFindings(result.findings);
  if (result.decision === "block") process.exitCode = 1;
}

function repoCatalogueRoot(): string {
  if (process.env.CONFORMANCE_CATALOGUE_ROOT) return resolve(process.env.CONFORMANCE_CATALOGUE_ROOT);
  return resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
}

function loadActiveCatalogue(cwd: string): ReturnType<typeof loadCatalogue> {
  try {
    return loadCatalogue(cwd);
  } catch {
    return loadCatalogue(repoCatalogueRoot());
  }
}

function cmdInstallCopilot(args: string[]): void {
  const result = installCopilotPlugin({
    catalogueRoot: repoCatalogueRoot(),
    force: args.includes("--force"),
    stdout: process.stdout,
    stderr: process.stderr,
  });
  process.exitCode = result.exitCode;
}

function cmdDoctor(): void {
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

async function main(): Promise<void> {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case "hook":
      await cmdHook(rest[0] ?? "", rest.slice(1));
      break;
    case "init":
      cmdInit(rest.includes("--write"));
      break;
    case "check":
      await cmdCheck(rest);
      break;
    case "profile":
      cmdProfile();
      break;
    case "onboard":
      cmdOnboard(rest);
      break;
    case "review":
      await cmdReview(rest);
      break;
    case "install-copilot":
      cmdInstallCopilot(rest);
      break;
    case "doctor":
      cmdDoctor();
      break;
    default:
      process.stderr.write(
        "Usage:\n" +
          "  conformance hook <session-start|post-write|guard-shell|turn-end> [--runtime copilot|claude|codex|generic]\n" +
          "                                                                    (reads hook JSON on stdin)\n" +
          "  conformance init [--write]                                          (propose a candidate profile)\n" +
          "  conformance onboard [--inventory] [--write-profile] [--write-anchors] [--write-map]  (scan codebase; print pattern inventory + evidence)\n" +
          "  conformance check [--event PR_REVIEW|BATCH] [--base <ref>] [paths…] (run the engine; exit 1 on block)\n" +
          "  conformance review [--base <ref>] [--json]                          (baseline-aware PR review; exit 1 on net-new block)\n" +
          "  conformance install-copilot [--force]                              (install local Copilot CLI plugin bundle)\n" +
          "  conformance doctor                                                  (diagnose catalogue/profile/plugin wiring)\n" +
          "  conformance profile                                                 (print the resolved profile)\n",
      );
      process.exitCode = cmd && !["help", "-h", "--help"].includes(cmd) ? 1 : 0;
  }
}

main();
