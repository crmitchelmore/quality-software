import type { SymbolKind } from "./types.js";

export interface LangSpec {
  id: string;
  exts: RegExp;
  /** Capture group 1 = imported module/package/path. */
  importRes: RegExp[];
  /** Capture group 1 = keyword, group 2 = symbol name. */
  declRes: { re: RegExp; kind: SymbolKind }[];
  packageRe?: RegExp;
  /** True for languages whose imports are package-qualified FQNs (not file paths). */
  fqn: boolean;
}

const KIND_CLASS: SymbolKind = "class";
const KIND_IFACE: SymbolKind = "interface";
const KIND_FN: SymbolKind = "function";
const KIND_ENUM: SymbolKind = "enum";

const SPECS: LangSpec[] = [
  {
    id: "kotlin",
    exts: /\.kts?$/,
    importRes: [/^\s*import\s+([\w.]+)/],
    declRes: [
      { re: /\b(?:data\s+|sealed\s+|abstract\s+|open\s+|enum\s+|annotation\s+)*class\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\b(?:sealed\s+)?interface\s+([A-Z]\w*)/, kind: KIND_IFACE },
      { re: /\bobject\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\bfun\s+(?:<[^>]*>\s*)?([a-zA-Z_]\w*)\s*\(/, kind: KIND_FN },
    ],
    packageRe: /^\s*package\s+([\w.]+)/,
    fqn: true,
  },
  {
    id: "java",
    exts: /\.java$/,
    importRes: [/^\s*import\s+(?:static\s+)?([\w.]+)/],
    declRes: [
      { re: /\b(?:public\s+|final\s+|abstract\s+)*class\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\b(?:public\s+)?interface\s+([A-Z]\w*)/, kind: KIND_IFACE },
      { re: /\b(?:public\s+)?enum\s+([A-Z]\w*)/, kind: KIND_ENUM },
      { re: /\b(?:public\s+)?record\s+([A-Z]\w*)/, kind: KIND_CLASS },
    ],
    packageRe: /^\s*package\s+([\w.]+)/,
    fqn: true,
  },
  {
    id: "scala",
    exts: /\.scala$/,
    importRes: [/^\s*import\s+([\w.]+)/],
    declRes: [
      { re: /\b(?:case\s+|sealed\s+|abstract\s+)*class\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\b(?:sealed\s+)?trait\s+([A-Z]\w*)/, kind: KIND_IFACE },
      { re: /\bobject\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\bdef\s+([a-zA-Z_]\w*)/, kind: KIND_FN },
    ],
    packageRe: /^\s*package\s+([\w.]+)/,
    fqn: true,
  },
  {
    id: "python",
    exts: /\.py$/,
    importRes: [/^\s*from\s+([\w.]+)\s+import/, /^\s*import\s+([\w.]+)/],
    declRes: [
      { re: /^\s*class\s+(\w+)/, kind: KIND_CLASS },
      { re: /^\s*def\s+(\w+)/, kind: KIND_FN },
    ],
    fqn: true,
  },
  {
    id: "go",
    exts: /\.go$/,
    importRes: [/^\s*"([^"]+)"\s*$/, /^\s*import\s+"([^"]+)"/, /^\s*\w+\s+"([^"]+)"\s*$/],
    declRes: [
      { re: /^\s*type\s+([A-Z]\w*)\s+struct/, kind: KIND_CLASS },
      { re: /^\s*type\s+([A-Z]\w*)\s+interface/, kind: KIND_IFACE },
      { re: /^\s*func\s+(?:\([^)]*\)\s*)?([A-Z]\w*)\s*\(/, kind: KIND_FN },
    ],
    packageRe: /^\s*package\s+(\w+)/,
    fqn: true,
  },
  {
    id: "csharp",
    exts: /\.cs$/,
    importRes: [/^\s*using\s+(?:static\s+)?([\w.]+)\s*;/],
    declRes: [
      { re: /\b(?:public\s+|internal\s+|sealed\s+|abstract\s+)*class\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\b(?:public\s+)?interface\s+([A-Z]\w*)/, kind: KIND_IFACE },
      { re: /\b(?:public\s+)?enum\s+([A-Z]\w*)/, kind: KIND_ENUM },
      { re: /\b(?:public\s+)?record\s+([A-Z]\w*)/, kind: KIND_CLASS },
    ],
    packageRe: /^\s*namespace\s+([\w.]+)/,
    fqn: true,
  },
  {
    id: "rust",
    exts: /\.rs$/,
    importRes: [/^\s*use\s+([\w:]+)/],
    declRes: [
      { re: /\b(?:pub\s+)?struct\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\b(?:pub\s+)?trait\s+([A-Z]\w*)/, kind: KIND_IFACE },
      { re: /\b(?:pub\s+)?enum\s+([A-Z]\w*)/, kind: KIND_ENUM },
      { re: /\b(?:pub\s+)?fn\s+(\w+)/, kind: KIND_FN },
    ],
    fqn: true,
  },
  {
    id: "ruby",
    exts: /\.rb$/,
    importRes: [/^\s*require(?:_relative)?\s+['"]([^'"]+)['"]/],
    declRes: [
      { re: /^\s*class\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /^\s*module\s+([A-Z]\w*)/, kind: KIND_IFACE },
      { re: /^\s*def\s+(\w+)/, kind: KIND_FN },
    ],
    fqn: false,
  },
  {
    id: "php",
    exts: /\.php$/,
    importRes: [/^\s*use\s+([\w\\]+)/],
    declRes: [
      { re: /\b(?:abstract\s+|final\s+)*class\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\binterface\s+([A-Z]\w*)/, kind: KIND_IFACE },
      { re: /\bfunction\s+(\w+)/, kind: KIND_FN },
    ],
    packageRe: /^\s*namespace\s+([\w\\]+)/,
    fqn: true,
  },
  {
    id: "swift",
    exts: /\.swift$/,
    importRes: [/^\s*import\s+(\w+)/],
    declRes: [
      { re: /\b(?:final\s+|public\s+|open\s+)*class\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\b(?:public\s+)?protocol\s+([A-Z]\w*)/, kind: KIND_IFACE },
      { re: /\b(?:public\s+)?struct\s+([A-Z]\w*)/, kind: KIND_CLASS },
      { re: /\b(?:public\s+)?enum\s+([A-Z]\w*)/, kind: KIND_ENUM },
      { re: /\bfunc\s+(\w+)/, kind: KIND_FN },
    ],
    fqn: false,
  },
];

export function specFor(file: string): LangSpec | undefined {
  return SPECS.find((s) => s.exts.test(file));
}

export function isTestPath(path: string, lang: string): boolean {
  if (/(^|\/)(test|tests|spec|__tests__)(\/|$)/.test(path)) return true;
  if (/src\/test\//.test(path)) return true;
  if (/(Test|Tests|Spec|IT)\.\w+$/.test(path)) return true;
  if (lang === "go" && /_test\.go$/.test(path)) return true;
  if (lang === "python" && /(^|\/)test_\w+\.py$/.test(path)) return true;
  return false;
}
