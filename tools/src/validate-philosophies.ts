import { readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv from "ajv";
import {
  ROOT,
  loadPatternsSafe,
  loadVocabularies,
} from "./lib/patterns.js";
import {
  loadPhilosophiesSafe,
  type Philosophy,
} from "./lib/philosophies.js";

/**
 * Validates every philosophy YAML against:
 *  1. the JSON schema (shape),
 *  2. cross-reference integrity to the PATTERN catalogue
 *     (associated_patterns / at_odds_patterns must resolve to real pattern ids),
 *  3. cross-reference integrity between philosophies (complements / tensions_with),
 *  4. uniqueness of ids and filename<->id agreement,
 *  5. best_for values are valid project_types from vocabularies.yaml.
 *
 * Unknown cross-references are ERRORS (the pattern catalogue is complete),
 * unlike the pattern validator which tolerates forward references.
 */
function main(): void {
  const schema = JSON.parse(
    readFileSync(join(ROOT, "schema", "philosophy.schema.json"), "utf8"),
  );
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  const vocab = loadVocabularies();
  const patternIds = new Set(loadPatternsSafe().patterns.map((p) => p.id));
  const { philosophies, errors: loadErrors } = loadPhilosophiesSafe();
  const errors: string[] = loadErrors.map(
    (e) => `${e.file.replace(ROOT + "/", "")}: YAML parse error — ${e.message}`,
  );

  const philIds = new Set<string>();
  for (const ph of philosophies) {
    const where = ph.__file.replace(ROOT + "/", "");
    const { __file, ...shape } = ph;
    if (!validate(shape)) {
      for (const e of validate.errors ?? []) {
        errors.push(`${where}: schema ${e.instancePath} ${e.message}`);
      }
      continue;
    }
    if (philIds.has(ph.id)) errors.push(`${where}: duplicate id '${ph.id}'`);
    philIds.add(ph.id);
    if (!ph.__file.endsWith(`${ph.id}.yaml`)) {
      errors.push(`${where}: filename should match id '${ph.id}.yaml'`);
    }
    for (const bf of ph.best_for ?? []) {
      if (!vocab.project_types.includes(bf)) {
        errors.push(`${where}: best_for value '${bf}' not in vocabularies.yaml project_types`);
      }
    }
  }

  // Cross-references (run after all ids collected).
  for (const ph of philosophies) {
    const where = ph.__file.replace(ROOT + "/", "");

    const patternRefs: Array<[string, string[]]> = [
      ["associated_patterns", ph.associated_patterns.map((a) => a.pattern)],
      ["at_odds_patterns", (ph.at_odds_patterns ?? []).map((a) => a.pattern)],
    ];
    for (const [field, list] of patternRefs) {
      for (const ref of list) {
        if (!patternIds.has(ref)) {
          errors.push(`${where}: ${field} references unknown pattern '${ref}'`);
        }
      }
    }

    const philRefs: Array<[string, string[]]> = [
      ["complements", ph.complements ?? []],
      ["tensions_with", (ph.tensions_with ?? []).map((t) => t.philosophy)],
    ];
    for (const [field, list] of philRefs) {
      for (const ref of list) {
        if (ref === ph.id) errors.push(`${where}: ${field} references itself`);
        else if (!philIds.has(ref)) {
          errors.push(`${where}: ${field} references unknown philosophy '${ref}'`);
        }
      }
    }
  }

  report(philosophies, errors);
}

function report(philosophies: Philosophy[], errors: string[]): void {
  if (errors.length) {
    console.error(`\n✖ ${errors.length} validation error(s):\n`);
    for (const e of errors) console.error("  - " + e);
    console.error(`\n${philosophies.length} philosophies checked.`);
    process.exit(1);
  }
  console.log(`\n✔ ${philosophies.length} philosophies valid.`);
}

main();
