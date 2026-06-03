import type { FileFacts, LanguageProvider, ResolveCtx, ModuleId, SymbolFact, SymbolKind } from "./types.js";

/**
 * L0 UNIVERSAL provider (design 15.4). Line-level regex extraction that works for
 * ANY language we have not built a richer provider for yet. Low confidence by
 * construction — its facts never block on their own (design 16.2). It exists so a
 * Kotlin/Go/Python/Java/Rust/C#/Ruby repo produces a usable structural evidence
 * map immediately, and so the LLM judge has structural grounding everywhere.
 *
 * Module identity is the file path (like JS). For FQN languages it also records a
 * `packageName` in semanticFacts so the evidence-map orchestrator can resolve
 * package-qualified imports to files (design 15.5) — that cross-file step lives in
 * the orchestrator, not here, because resolution needs the whole-project index.
 */

const VERSION = "1.0.0";

interface LangSpec {
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

function specFor(file: string): LangSpec | undefined {
  return SPECS.find((s) => s.exts.test(file));
}

function isTest(path: string, lang: string): boolean {
  if (/(^|\/)(test|tests|spec|__tests__)(\/|$)/.test(path)) return true;
  if (/src\/test\//.test(path)) return true; // gradle/maven convention
  if (/(Test|Tests|Spec|IT)\.\w+$/.test(path)) return true;
  if (lang === "go" && /_test\.go$/.test(path)) return true;
  if (lang === "python" && /(^|\/)test_\w+\.py$/.test(path)) return true;
  return false;
}

export const universalProvider: LanguageProvider = {
  id: "universal",
  tier: 0,
  claims(file: string): boolean {
    return specFor(file) !== undefined;
  },
  extract(path: string, content: string): FileFacts {
    const spec = specFor(path)!;
    const lines = content.split("\n");
    const exports: SymbolFact[] = [];
    const imports: FileFacts["imports"] = [];
    let packageName: string | undefined;

    lines.forEach((text, idx) => {
      if (spec.packageRe && packageName === undefined) {
        const pm = spec.packageRe.exec(text);
        if (pm) packageName = pm[1];
      }
      for (const ire of spec.importRes) {
        const im = ire.exec(text);
        if (im) {
          const raw = im[1].replace(/\.\*$/, "").replace(/::\{.*$/, "").trim();
          if (raw) imports.push({ raw, span: { startLine: idx + 1, endLine: idx + 1 } });
          break;
        }
      }
      for (const d of spec.declRes) {
        const dm = d.re.exec(text);
        if (dm) {
          exports.push({ name: dm[1], kind: d.kind, span: { startLine: idx + 1, endLine: idx + 1 } });
          break;
        }
      }
    });

    return {
      path,
      moduleId: path,
      language: spec.id,
      isBarrel: false,
      isTest: isTest(path, spec.id),
      isGenerated: /(^|\/)(generated|__generated__)(\/|$)/.test(path),
      exports,
      imports,
      semanticFacts: packageName ? { packageName, fqn: spec.fqn } : { fqn: spec.fqn },
      provenance: { provider: "universal", tier: 0, confidence: "low", method: "regex-line", version: VERSION },
    };
  },
  resolveRef(raw: string, ctx: ResolveCtx): ModuleId | undefined {
    // Relative-path imports (Python relative, Ruby require_relative) resolve like JS.
    if (raw.startsWith(".") && (raw.includes("/") || raw.startsWith("./") || raw.startsWith("../"))) {
      const dir = ctx.fromModule.split("/").slice(0, -1);
      for (const part of raw.split("/")) {
        if (part === "." || part === "") continue;
        else if (part === "..") dir.pop();
        else dir.push(part);
      }
      const base = dir.join("/");
      const cands = [base, `${base}.py`, `${base}.rb`, `${base}/index.ts`];
      return cands.find((c) => ctx.known.has(c));
    }
    // FQN imports (com.foo.Bar) are resolved by the orchestrator's symbol index.
    return undefined;
  },
};
