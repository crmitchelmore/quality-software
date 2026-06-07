import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { proposeProfile } from "../init.js";
import { buildEvidenceMap } from "../model/project-map.js";
import { buildInventory, renderInventory } from "../model/inventory.js";
import { buildPatternMap, renderPatternMapYaml } from "../model/pattern-map.js";
import { proposeProfileFromEvidence } from "../model/proposal.js";
import { renderAnchorsYaml, renderOnboardingReport } from "../model/report.js";
import { boundaryProfileLayerWarnings } from "../model/validation.js";
import { layerPrefixesFromProfile } from "../model/layers.js";
import { loadProfile, ProfileError } from "../profile.js";
import { loadActiveCatalogue } from "./context.js";

export function cmdInit(write: boolean): void {
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

export function cmdProfile(): void {
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

export function cmdOnboard(args: string[]): void {
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
