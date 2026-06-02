import { readFileSync, globSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { ROOT } from "./patterns.js";

export const PHILOSOPHIES_DIR = join(ROOT, "philosophies");

export interface KeyIdea {
  name: string;
  explanation: string;
}

export interface PatternAssoc {
  pattern: string;
  reason: string;
}

export interface Tension {
  philosophy: string;
  reason: string;
}

export interface AppliedEvidence {
  where: string;
  what: string;
  evidence_strength: "primary-source" | "secondary-source" | "inferred";
  source: { title: string; url?: string; year?: number };
}

export interface PhilosophyReference {
  title: string;
  author?: string;
  year?: number;
  url?: string;
}

export interface Philosophy {
  id: string;
  title: string;
  aka?: string[];
  originators: string[];
  origin: { type: string; title: string; year?: number; era?: string };
  short_description: string;
  description: string;
  core_tenets: string[];
  key_ideas?: KeyIdea[];
  in_practice?: string;
  complements?: string[];
  tensions_with?: Tension[];
  associated_patterns: PatternAssoc[];
  at_odds_patterns?: PatternAssoc[];
  successfully_applied: AppliedEvidence[];
  best_for?: string[];
  criticisms?: string[];
  references: PhilosophyReference[];
  /** absolute path the philosophy was loaded from */
  __file: string;
}

export interface LoadError {
  file: string;
  message: string;
}

export interface LoadResult {
  philosophies: Philosophy[];
  errors: LoadError[];
}

export function philosophyFiles(): string[] {
  return globSync("*.yaml", { cwd: PHILOSOPHIES_DIR })
    .map((p) => join(PHILOSOPHIES_DIR, p))
    .sort();
}

export function loadPhilosophiesSafe(): LoadResult {
  const philosophies: Philosophy[] = [];
  const errors: LoadError[] = [];
  for (const file of philosophyFiles()) {
    try {
      const data = yaml.load(readFileSync(file, "utf8")) as Philosophy;
      if (data === null || typeof data !== "object") {
        errors.push({ file, message: "file is empty or not a YAML mapping" });
        continue;
      }
      data.__file = file;
      philosophies.push(data);
    } catch (e) {
      errors.push({ file, message: (e as Error).message.split("\n")[0] });
    }
  }
  return { philosophies, errors };
}

export function loadPhilosophies(): Philosophy[] {
  return loadPhilosophiesSafe().philosophies;
}
