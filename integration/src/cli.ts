import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { execSync } from "node:child_process";
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
import { reviewPR, changesFromGit, gitBaseContent } from "./review/pr-review.js";
import { mkdirSync } from "node:fs";

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
  const catalogue = loadCatalogue(cwd);
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
    const out = execSync(`git -C "${cwd}" diff --name-only --diff-filter=ACMR ${ref}`, {
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
  const catalogue = loadCatalogue(cwd);
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
  const catalogue = loadCatalogue(cwd);
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
  const catalogue = loadCatalogue(cwd);
  const map = buildEvidenceMap(cwd, {});

  // Persist the derived map (gitignored artifact, design 14).
  const outDir = join(cwd, ".conformance");
  try {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "project-map.json"), JSON.stringify(map, null, 2) + "\n");
  } catch (e) {
    process.stderr.write(`warning: could not write project-map.json: ${(e as Error).message}\n`);
  }

  const proposal = proposeProfileFromEvidence(map, catalogue);
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
}

function cmdReview(args: string[]): void {
  const cwd = process.cwd();
  const i = args.indexOf("--base");
  const base = i >= 0 ? args[i + 1] : "origin/main";
  const catalogue = loadCatalogue(cwd);
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
    process.stdout.write(`No changes detected against ${base}.\n`);
    return;
  }
  const result = reviewPR({ repoRoot: cwd, profile, changes, baseContent: gitBaseContent(cwd, base) });
  process.stdout.write(result.summary + "\n\n");
  printFindings(result.findings);
  if (result.decision === "block") process.exitCode = 1;
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
      cmdReview(rest);
      break;
    default:
      process.stderr.write(
        "Usage:\n" +
          "  conformance hook <session-start|post-write|guard-shell|turn-end> [--runtime copilot|claude|codex|generic]\n" +
          "                                                                    (reads hook JSON on stdin)\n" +
          "  conformance init [--write]                                          (propose a candidate profile)\n" +
          "  conformance onboard [--inventory] [--write-profile] [--write-anchors]  (scan codebase; print pattern inventory + evidence)\n" +
          "  conformance check [--event PR_REVIEW|BATCH] [--base <ref>] [paths…] (run the engine; exit 1 on block)\n" +
          "  conformance review [--base <ref>]                                   (baseline-aware PR review; exit 1 on net-new block)\n" +
          "  conformance profile                                                 (print the resolved profile)\n",
      );
      process.exitCode = cmd && !["help", "-h", "--help"].includes(cmd) ? 1 : 0;
  }
}

main();
