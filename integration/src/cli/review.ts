import { join } from "node:path";
import { llmClientFromEnv } from "../llm/config.js";
import { loadProfile, ProfileError } from "../profile.js";
import { changesFromGit, gitBaseContent, reviewPRWithLLM } from "../review/pr-review.js";
import { loadActiveCatalogue, repoCatalogueRoot } from "./context.js";
import { printFindings } from "./output.js";

export async function cmdReview(args: string[]): Promise<void> {
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
