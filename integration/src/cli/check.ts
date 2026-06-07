import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import type { ChangeSet, Finding } from "../contract.js";
import { Engine } from "../engine.js";
import { walkSourceFiles } from "../fs-util.js";
import { loadProfile } from "../profile.js";
import { loadActiveCatalogue } from "./context.js";
import { printFindings } from "./output.js";

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

export async function cmdCheck(args: string[]): Promise<void> {
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
