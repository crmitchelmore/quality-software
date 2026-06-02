import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import Ajv from "ajv";
import { ROOT, loadPatternsSafe } from "./lib/patterns.js";
import { loadPracticeSafe, type PracticePattern } from "./lib/practice.js";
import { loadPhilosophiesSafe } from "./lib/philosophies.js";

interface PracticeVocab {
  maturity: string[];
  pm_categories: string[];
  ux_categories: string[];
  product_stages: string[];
}

/**
 * Validates product-management and UX practice patterns against:
 *  1. the JSON schema (shape, incl. per-discipline required metrics/heuristics),
 *  2. controlled vocabularies (maturity, discipline-specific category, product_stages),
 *  3. GLOBAL id uniqueness across software patterns + practice patterns,
 *  4. cross-collection references — related_software_patterns -> software ids,
 *     related_practice_patterns -> practice ids, related_philosophies -> philosophy ids.
 * Unknown references are hard errors.
 */
function main(): void {
  const schema = JSON.parse(
    readFileSync(join(ROOT, "schema", "practice-pattern.schema.json"), "utf8"),
  );
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  const vocab = yaml.load(
    readFileSync(join(ROOT, "schema", "vocabularies.yaml"), "utf8"),
  ) as PracticeVocab;

  const softwareIds = new Set(loadPatternsSafe().patterns.map((p) => p.id));
  const philIds = new Set(loadPhilosophiesSafe().philosophies.map((p) => p.id));
  const { patterns, errors: loadErrors } = loadPracticeSafe();

  const errors: string[] = loadErrors.map(
    (e) => `${e.file.replace(ROOT + "/", "")}: YAML parse error — ${e.message}`,
  );

  const practiceIds = new Set<string>();
  for (const p of patterns) {
    const where = p.__file.replace(ROOT + "/", "");
    const { __file, ...shape } = p;
    if (!validate(shape)) {
      for (const e of validate.errors ?? []) {
        errors.push(`${where}: schema ${e.instancePath} ${e.message}`);
      }
      continue;
    }

    // Global id uniqueness across software + practice patterns.
    if (softwareIds.has(p.id) || practiceIds.has(p.id)) {
      errors.push(`${where}: duplicate id '${p.id}' (ids must be globally unique across all pattern collections)`);
    }
    practiceIds.add(p.id);

    if (!p.__file.endsWith(`${p.id}.yaml`)) {
      errors.push(`${where}: filename should match id '${p.id}.yaml'`);
    }

    // Discipline must match the directory it lives in.
    const inProduct = p.__file.includes("/product-patterns/");
    if (inProduct && p.discipline !== "product") {
      errors.push(`${where}: file in product-patterns/ must have discipline 'product'`);
    }
    if (!inProduct && p.discipline !== "ux") {
      errors.push(`${where}: file in ux-patterns/ must have discipline 'ux'`);
    }

    if (!vocab.maturity.includes(p.maturity)) {
      errors.push(`${where}: maturity '${p.maturity}' not in vocabularies.yaml`);
    }
    const allowedCats = p.discipline === "product" ? vocab.pm_categories : vocab.ux_categories;
    if (!allowedCats.includes(p.category)) {
      errors.push(`${where}: category '${p.category}' not a valid ${p.discipline} category`);
    }
    for (const s of p.product_stages ?? []) {
      if (!vocab.product_stages.includes(s)) {
        errors.push(`${where}: product_stage '${s}' not in vocabularies.yaml`);
      }
    }
  }

  // Cross-references (after collecting all practice ids).
  for (const p of patterns) {
    const where = p.__file.replace(ROOT + "/", "");
    for (const a of p.related_software_patterns ?? []) {
      if (!softwareIds.has(a.pattern)) {
        errors.push(`${where}: related_software_patterns references unknown software pattern '${a.pattern}'`);
      }
    }
    for (const a of p.related_practice_patterns ?? []) {
      if (a.pattern === p.id) errors.push(`${where}: related_practice_patterns references itself`);
      else if (!practiceIds.has(a.pattern)) {
        errors.push(`${where}: related_practice_patterns references unknown practice pattern '${a.pattern}'`);
      }
    }
    for (const a of p.related_philosophies ?? []) {
      if (!philIds.has(a.philosophy)) {
        errors.push(`${where}: related_philosophies references unknown philosophy '${a.philosophy}'`);
      }
    }
  }

  report(patterns, errors);
}

function report(patterns: PracticePattern[], errors: string[]): void {
  if (errors.length) {
    console.error(`\n✖ ${errors.length} validation error(s):\n`);
    for (const e of errors) console.error("  - " + e);
    console.error(`\n${patterns.length} practice patterns checked.`);
    process.exit(1);
  }
  const pm = patterns.filter((p) => p.discipline === "product").length;
  const ux = patterns.filter((p) => p.discipline === "ux").length;
  console.log(`\n✔ ${patterns.length} practice patterns valid (${pm} product, ${ux} UX).`);
}

main();
