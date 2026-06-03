import ts from "typescript";
import { basename } from "node:path";

/**
 * Syntactic export/import extraction via the TypeScript compiler API (design 14).
 *
 * We parse each file into a SourceFile and walk it — NO Program / type-checker and
 * NO tsconfig resolution is required, so it stays cheap and dependency-light while
 * correctly handling the cases regexes miss: type-only imports, default exports,
 * re-exports, namespace exports, aliases, multiline declarations, decorators.
 *
 * Known limitations (reported in the map's extraction metadata): tsconfig `paths`
 * aliases and monorepo package boundaries are not resolved; dynamic `import()` is
 * not treated as a static dependency.
 */

export interface ExportedSymbol {
  name: string;
  kind: "function" | "class" | "interface" | "type" | "enum" | "const" | "default" | "reexport";
}

export interface ImportRef {
  /** Raw module specifier as written. */
  spec: string;
  /** True for `import type` / type-only specifiers (still a structural dependency). */
  typeOnly: boolean;
}

export interface FileSyntax {
  exports: ExportedSymbol[];
  imports: ImportRef[];
  /** index.* file whose body is (almost) entirely re-exports. */
  isBarrel: boolean;
}

const EXTS = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;

export function isSourceFileName(name: string): boolean {
  return EXTS.test(name);
}

function hasExportModifier(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false)
  );
}

function scriptKindFor(fileName: string): ts.ScriptKind {
  if (fileName.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (fileName.endsWith(".jsx")) return ts.ScriptKind.JSX;
  if (/\.(js|mjs|cjs)$/.test(fileName)) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

export function extractFile(fileName: string, content: string): FileSyntax {
  const sf = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true, scriptKindFor(fileName));
  const exports: ExportedSymbol[] = [];
  const imports: ImportRef[] = [];
  let reexportCount = 0;
  let ownExportCount = 0;

  for (const stmt of sf.statements) {
    // import ... from "x"
    if (ts.isImportDeclaration(stmt) && ts.isStringLiteral(stmt.moduleSpecifier)) {
      const typeOnly = stmt.importClause?.isTypeOnly ?? false;
      imports.push({ spec: stmt.moduleSpecifier.text, typeOnly });
      continue;
    }
    // export ... from "x"  (re-export) OR export { a, b } (local re-binding)
    if (ts.isExportDeclaration(stmt)) {
      const fromSpec =
        stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier) ? stmt.moduleSpecifier.text : undefined;
      if (fromSpec) imports.push({ spec: fromSpec, typeOnly: stmt.isTypeOnly });
      if (stmt.exportClause && ts.isNamedExports(stmt.exportClause)) {
        for (const el of stmt.exportClause.elements) {
          exports.push({ name: el.name.text, kind: "reexport" });
          reexportCount++;
        }
      } else if (!stmt.exportClause) {
        // export * from "x"
        reexportCount++;
      }
      continue;
    }
    if (ts.isImportEqualsDeclaration(stmt)) continue;

    // export default ...
    if (ts.isExportAssignment(stmt)) {
      exports.push({ name: "default", kind: "default" });
      ownExportCount++;
      continue;
    }

    if (!hasExportModifier(stmt)) continue;
    const isDefault =
      ts.canHaveModifiers(stmt) &&
      (ts.getModifiers(stmt)?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) ?? false);

    if (ts.isFunctionDeclaration(stmt)) {
      exports.push({ name: isDefault ? "default" : stmt.name?.text ?? "default", kind: isDefault ? "default" : "function" });
      ownExportCount++;
    } else if (ts.isClassDeclaration(stmt)) {
      exports.push({ name: isDefault ? "default" : stmt.name?.text ?? "default", kind: isDefault ? "default" : "class" });
      ownExportCount++;
    } else if (ts.isInterfaceDeclaration(stmt)) {
      exports.push({ name: stmt.name.text, kind: "interface" });
      ownExportCount++;
    } else if (ts.isTypeAliasDeclaration(stmt)) {
      exports.push({ name: stmt.name.text, kind: "type" });
      ownExportCount++;
    } else if (ts.isEnumDeclaration(stmt)) {
      exports.push({ name: stmt.name.text, kind: "enum" });
      ownExportCount++;
    } else if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) {
          exports.push({ name: decl.name.text, kind: "const" });
          ownExportCount++;
        }
      }
    }
  }

  const isBarrel = /^index\.(t|j)sx?$/.test(basename(fileName)) && reexportCount > 0 && ownExportCount === 0;
  return { exports, imports, isBarrel };
}
