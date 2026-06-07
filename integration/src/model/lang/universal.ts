import type { FileFacts, LanguageProvider, ResolveCtx, ModuleId, SymbolFact } from "./types.js";
import { isTestPath, specFor } from "./universal-specs.js";

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
      isTest: isTestPath(path, spec.id),
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
