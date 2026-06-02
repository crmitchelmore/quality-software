import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "node:fs";
import yaml from "js-yaml";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const PATTERNS_DIR = join(ROOT, "patterns");

export interface Rating {
  score: number;
  notes: string;
}

export interface Example {
  language: string;
  title?: string;
  negative: string;
  positive: string;
  explanation: string;
}

export interface Synergy {
  pattern: string;
  reason: string;
}

export interface Reference {
  title: string;
  author?: string;
  url?: string;
  year?: number;
}

export interface Pattern {
  id: string;
  title: string;
  aka?: string[];
  scale: string;
  category: string;
  maturity: string;
  short_description: string;
  description: string;
  problem?: string;
  context?: string;
  consequences?: string[];
  works_well_with?: string[];
  synergies?: Synergy[];
  conflicts_with?: string[];
  alternatives?: string[];
  languages: string[];
  frameworks: string[];
  project_types: string[];
  tags?: string[];
  diagram?: string;
  examples: Example[];
  ratings: { small: Rating; medium: Rating; large: Rating };
  references?: Reference[];
  /** absolute path the pattern was loaded from */
  __file: string;
}

export interface Vocabularies {
  scales: string[];
  categories: string[];
  maturity: string[];
  languages: string[];
  frameworks: string[];
  project_types: string[];
}

export function loadVocabularies(): Vocabularies {
  const raw = readFileSync(join(ROOT, "schema", "vocabularies.yaml"), "utf8");
  return yaml.load(raw) as Vocabularies;
}

export function patternFiles(): string[] {
  // Node 22+ ships globSync under node:fs.
  return globSync("**/*.yaml", { cwd: PATTERNS_DIR }).map((p) => join(PATTERNS_DIR, p)).sort();
}

export function loadPatterns(): Pattern[] {
  return patternFiles().map((file) => {
    const data = yaml.load(readFileSync(file, "utf8")) as Pattern;
    data.__file = file;
    return data;
  });
}
