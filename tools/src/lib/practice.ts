import { readFileSync, globSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { ROOT } from "./patterns.js";

export const PRODUCT_DIR = join(ROOT, "product-patterns");
export const UX_DIR = join(ROOT, "ux-patterns");

export interface Rating {
  score: number;
  notes: string;
}

export interface PracticeExample {
  title?: string;
  poor: string;
  better: string;
  explanation: string;
}

export interface PatternAssoc {
  pattern: string;
  reason: string;
}

export interface PhilosophyAssoc {
  philosophy: string;
  reason: string;
}

export interface PracticeReference {
  title: string;
  author?: string;
  year?: number;
  url?: string;
}

export interface PracticePattern {
  id: string;
  title: string;
  aka?: string[];
  discipline: "product" | "ux";
  category: string;
  maturity: string;
  short_description: string;
  description: string;
  problem: string;
  context?: string;
  forces?: string[];
  solution: string;
  when_to_use?: string[];
  anti_patterns?: string[];
  metrics?: string[];
  heuristics?: string[];
  examples: PracticeExample[];
  related_practice_patterns?: PatternAssoc[];
  related_software_patterns?: PatternAssoc[];
  related_philosophies?: PhilosophyAssoc[];
  tags?: string[];
  product_stages?: string[];
  ratings: { early: Rating; growth: Rating; enterprise: Rating };
  references: PracticeReference[];
  /** absolute path the pattern was loaded from */
  __file: string;
}

export interface LoadError {
  file: string;
  message: string;
}

export interface LoadResult {
  patterns: PracticePattern[];
  errors: LoadError[];
}

export function practiceFiles(): string[] {
  const files: string[] = [];
  for (const dir of [PRODUCT_DIR, UX_DIR]) {
    for (const p of globSync("*.yaml", { cwd: dir })) {
      files.push(join(dir, p));
    }
  }
  return files.sort();
}

export function loadPracticeSafe(): LoadResult {
  const patterns: PracticePattern[] = [];
  const errors: LoadError[] = [];
  for (const file of practiceFiles()) {
    try {
      const data = yaml.load(readFileSync(file, "utf8")) as PracticePattern;
      if (data === null || typeof data !== "object") {
        errors.push({ file, message: "file is empty or not a YAML mapping" });
        continue;
      }
      data.__file = file;
      patterns.push(data);
    } catch (e) {
      errors.push({ file, message: (e as Error).message.split("\n")[0] });
    }
  }
  return { patterns, errors };
}

export function loadPractice(): PracticePattern[] {
  return loadPracticeSafe().patterns;
}
