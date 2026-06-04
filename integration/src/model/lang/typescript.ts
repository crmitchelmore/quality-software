import { extractFile } from "../extract.js";
import type { FileFacts, LanguageProvider, ResolveCtx, ModuleId } from "./types.js";

/**
 * L2 semantic provider for TypeScript/JavaScript via the TS compiler API
 * (design 15.4). Wraps the syntactic extractor and stamps provenance. Module
 * identity is the repo-relative path; resolution is relative-path with the
 * ESM `.js` -> `.ts` mapping TypeScript projects rely on.
 */

const EXTS = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const VERSION = "1.0.0";

function isTest(path: string): boolean {
  return /(^|\/)(test|tests|__tests__|__mocks__|fixtures|spec)(\/|$)/.test(path) || /\.(test|spec)\.[tj]sx?$/.test(path);
}

export const typeScriptProvider: LanguageProvider = {
  id: "typescript",
  tier: 2,
  claims(file: string): boolean {
    return EXTS.test(file);
  },
  extract(path: string, content: string): FileFacts {
    const syntax = extractFile(path, content);
    return {
      path,
      moduleId: path,
      language: /\.(ts|tsx|mts|cts)$/.test(path) ? "typescript" : "javascript",
      isBarrel: syntax.isBarrel,
      isTest: isTest(path),
      isGenerated: /\.d\.ts$/.test(path) || /(^|\/)(dist|build|generated|__generated__)(\/|$)/.test(path),
      exports: syntax.exports.map((e) => ({
        name: e.name,
        kind: e.kind,
        signatureShape: e.signatureShape,
        lexicalTokens: e.lexicalTokens,
      })),
      imports: syntax.imports.map((i) => ({ raw: i.spec, typeOnly: i.typeOnly })),
      provenance: { provider: "typescript", tier: 2, confidence: "high", method: "ts-compiler", version: VERSION },
    };
  },
  resolveRef(raw: string, ctx: ResolveCtx): ModuleId | undefined {
    if (!raw.startsWith(".")) return undefined; // bare/package import — not a local edge
    const dir = ctx.fromModule.split("/").slice(0, -1);
    for (const part of raw.split("/")) {
      if (part === "." || part === "") continue;
      else if (part === "..") dir.pop();
      else dir.push(part);
    }
    const base = dir.join("/");
    const stripped = base.replace(/\.(js|jsx|mjs|cjs)$/, "");
    const candidates = [
      base,
      base.replace(/\.js$/, ".ts").replace(/\.jsx$/, ".tsx").replace(/\.mjs$/, ".mts"),
      `${stripped}.ts`,
      `${stripped}.tsx`,
      `${stripped}.mts`,
      `${base}.ts`,
      `${base}.tsx`,
      `${base}.js`,
      `${base}.jsx`,
      `${base}.mts`,
      `${stripped}/index.ts`,
      `${stripped}/index.tsx`,
      `${base}/index.ts`,
      `${base}/index.tsx`,
      `${base}/index.js`,
    ];
    return candidates.find((c) => ctx.known.has(c));
  },
};
