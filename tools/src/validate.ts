import { readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv from "ajv";
import {
  ROOT,
  loadPatternsSafe,
  loadVocabularies,
  type Pattern,
} from "./lib/patterns.js";

/**
 * Validates every pattern YAML against:
 *  1. the JSON schema (shape),
 *  2. the controlled vocabularies (allowed tag values),
 *  3. cross-reference integrity (works_well_with / conflicts_with / alternatives / synergies),
 *  4. uniqueness of ids and filename<->id agreement,
 *  5. architectural patterns carry a mermaid diagram.
 */
function main(): void {
  const schema = JSON.parse(
    readFileSync(join(ROOT, "schema", "pattern.schema.json"), "utf8"),
  );
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  const strict = process.argv.includes("--strict");
  const vocab = loadVocabularies();
  const { patterns, errors: loadErrors } = loadPatternsSafe();
  const errors: string[] = loadErrors.map(
    (e) => `${e.file.replace(ROOT + "/", "")}: YAML parse error — ${e.message}`,
  );
  const warnings: string[] = [];

  const ids = new Set<string>();
  for (const p of patterns) {
    const where = p.__file.replace(ROOT + "/", "");

    const { __file, ...shape } = p;
    if (!validate(shape)) {
      for (const e of validate.errors ?? []) {
        errors.push(`${where}: schema ${e.instancePath} ${e.message}`);
      }
      continue;
    }

    if (ids.has(p.id)) errors.push(`${where}: duplicate id '${p.id}'`);
    ids.add(p.id);

    if (!p.__file.endsWith(`${p.id}.yaml`)) {
      errors.push(`${where}: filename should match id '${p.id}.yaml'`);
    }

    check(errors, where, "scale", [p.scale], vocab.scales);
    check(errors, where, "category", [p.category], vocab.categories);
    check(errors, where, "altitude", [p.altitude], vocab.altitudes);
    check(errors, where, "maturity", [p.maturity], vocab.maturity);
    check(errors, where, "languages", p.languages, vocab.languages);
    check(errors, where, "frameworks", p.frameworks, vocab.frameworks);
    check(errors, where, "project_types", p.project_types, vocab.project_types);

    if (p.scale === "architectural" && !p.diagram) {
      errors.push(`${where}: architectural patterns require a 'diagram' (mermaid).`);
    }
  }

  // Cross-reference integrity (run after all ids collected).
  for (const p of patterns) {
    const where = p.__file.replace(ROOT + "/", "");
    const refs: Array<[string, string[]]> = [
      ["works_well_with", p.works_well_with ?? []],
      ["conflicts_with", p.conflicts_with ?? []],
      ["alternatives", p.alternatives ?? []],
      ["synergies", (p.synergies ?? []).map((s) => s.pattern)],
    ];
    for (const [field, list] of refs) {
      for (const ref of list) {
        if (ref === p.id) errors.push(`${where}: ${field} references itself`);
        else if (!ids.has(ref)) {
          // Forward references are allowed while the catalogue is being built up;
          // surfaced as warnings unless --strict.
          (strict ? errors : warnings).push(
            `${where}: ${field} references unknown pattern '${ref}'`,
          );
        }
      }
    }
  }

  report(patterns, errors, warnings);
}

function check(
  errors: string[],
  where: string,
  field: string,
  values: string[],
  allowed: string[],
): void {
  for (const v of values) {
    if (!allowed.includes(v)) {
      errors.push(`${where}: ${field} value '${v}' not in vocabularies.yaml`);
    }
  }
}

function report(patterns: Pattern[], errors: string[], warnings: string[]): void {
  if (warnings.length) {
    console.warn(`\n⚠ ${warnings.length} warning(s) (forward references):`);
    for (const w of warnings) console.warn("  - " + w);
  }
  if (errors.length) {
    console.error(`\n✖ ${errors.length} validation error(s):\n`);
    for (const e of errors) console.error("  - " + e);
    console.error(`\n${patterns.length} patterns checked.`);
    process.exit(1);
  }
  console.log(`\n✔ ${patterns.length} patterns valid.`);
}

main();
