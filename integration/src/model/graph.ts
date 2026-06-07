import type { ProviderRegistry } from "./lang/registry.js";
import type { ModuleInfo } from "./project-map.js";

export interface DependencyGraph {
  edges: { from: string; to: string }[];
  byPath: Map<string, ModuleInfo>;
}

export function deriveDependencyGraph(modules: ModuleInfo[], registry: ProviderRegistry): DependencyGraph {
  const known = new Set(modules.map((m) => m.path));
  const fqnResolve = buildFqnResolver(modules);
  const inbound = new Map<string, number>();
  const edges: { from: string; to: string }[] = [];

  for (const m of modules) {
    const provider = registry.providerFor(m.path);
    const resolvedTargets = new Set<string>();
    for (const imp of m.imports) {
      const direct = provider?.resolveRef(imp.spec, { fromModule: m.path, known });
      const targets = direct ? [direct] : fqnResolve(imp.spec);
      imp.resolved = targets[0];
      for (const t of targets) if (t !== m.path) resolvedTargets.add(t);
    }
    for (const t of resolvedTargets) {
      edges.push({ from: m.path, to: t });
      inbound.set(t, (inbound.get(t) ?? 0) + 1);
    }
  }

  const byPath = new Map(modules.map((m) => [m.path, m]));
  for (const m of modules) m.inbound = inbound.get(m.path) ?? 0;
  return { edges, byPath };
}

function buildFqnResolver(modules: ModuleInfo[]): (raw: string) => string[] {
  // Orchestrator-level FQN/symbol index for package-qualified languages (design 15.5).
  const byFqn = new Map<string, string>(); // "pkg.Symbol" -> file
  const byPackage = new Map<string, string[]>(); // "pkg" -> files
  for (const m of modules) {
    if (!m.packageName) continue;
    const arr = byPackage.get(m.packageName) ?? [];
    arr.push(m.path);
    byPackage.set(m.packageName, arr);
    for (const e of m.exports) {
      byFqn.set(`${m.packageName}.${e.name}`, m.path);
    }
  }

  return (raw: string): string[] => {
    if (raw.startsWith(".")) return [];
    const exact = byFqn.get(raw);
    if (exact) return [exact];
    // wildcard / package import (`com.foo.*` arrives as `com.foo`) -> all package files
    const pkg = byPackage.get(raw);
    if (pkg) return pkg;
    // `com.foo.Bar` where Bar isn't indexed: try the parent package
    const parent = raw.includes(".") ? raw.slice(0, raw.lastIndexOf(".")) : undefined;
    if (parent && byPackage.has(parent)) return byPackage.get(parent)!;
    return [];
  };
}
