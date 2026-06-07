import { basename } from "node:path";
import type { ModuleInfo } from "./project-map.js";
import {
  CAPABILITIES,
  type Capability,
  type CapabilityMechanism,
  type CapabilityUse,
} from "./capability-registry.js";

export { CAPABILITIES } from "./capability-registry.js";
export type { Capability, CapabilityMechanism, CapabilityUse } from "./capability-registry.js";

/**
 * Localised-capability / shared-helper detection (design 14, reuse enforcement).
 *
 * Beyond architecture-scale patterns, teams want a single canonical home for
 * cross-cutting *functions* — date/time handling, JSON (de)serialisation, hashing,
 * HTTP, id generation, money. When the same capability is reached for inline in
 * many files (e.g. `java.time` used directly in twelve places) it is a DRY/reuse
 * smell: either there is no shared helper, or there is one and some callers bypass
 * it. This detector finds those clusters from IMPORT SIGNATURES (language-neutral,
 * already captured in the evidence map) and points at the canonical helper.
 *
 * Advisory only — it never blocks; it tells you where to consolidate.
 */

/** Split a basename into lowercase tokens (camelCase + non-alphanumeric separators). */
function nameTokens(path: string): Set<string> {
  const base = basename(path).replace(/\.[^.]+$/, "");
  return new Set(
    base
      .split(/(?<=[a-z0-9])(?=[A-Z])|[^A-Za-z0-9]+/)
      .map((s) => s.toLowerCase())
      .filter(Boolean),
  );
}

export interface CapabilityCluster {
  id: string;
  title: string;
  /** Non-test modules that reach for the capability directly. */
  usingFiles: string[];
  /** A shared helper module for this capability, if one already exists. */
  canonical?: { path: string; inbound: number };
  /** Using files that bypass the canonical helper (or all of them, if none exists). */
  bypassing: string[];
  recommendation: "extract-shared-helper" | "route-through-canonical";
}

const MIN_USING = 3;
const MIN_BYPASSING = 2;

const mechanismOf = (cap: Capability): CapabilityMechanism => cap.mechanism ?? "inline";

/** Naming roles that mark a module as the deliberate HOME for a shared instance
 *  (a factory/provider/config). Used for di-bean canonical detection, where DI
 *  decouples callers so import-based inbound is an unreliable signal. */
const HOME_ROLE_TOKENS = ["factory", "provider", "config", "configuration", "module", "bean", "registry", "helper"];

/** True when the module imports the underlying library for this capability. */
export function moduleUsesCapability(m: ModuleInfo, cap: Capability): boolean {
  return m.imports.some((i) => cap.importMatchers.some((re) => re.test(i.spec)));
}

/**
 * Classify how a module touches each capability it imports, from its SOURCE.
 * Computed once at parse time (where the content is in hand) and stored on
 * `ModuleInfo.capabilityUse`. This is what lets us tell a real reuse smell from
 * the correct shared-use pattern:
 *   - di-bean      → "inline" only if the module CONSTRUCTS its own instance,
 *                    else "import-only" (it receives the shared bean via DI).
 *   - declarative  → "annotation" if framework annotations are present, else
 *                    "import-only".
 *   - inline       → always "inline" (importing the lib ≈ calling it).
 */
export function classifyCapabilityUse(content: string, importSpecs: string[]): Record<string, CapabilityUse> {
  const out: Record<string, CapabilityUse> = {};
  for (const cap of CAPABILITIES) {
    if (!importSpecs.some((spec) => cap.importMatchers.some((re) => re.test(spec)))) continue;
    switch (mechanismOf(cap)) {
      case "di-bean": {
        // Strip sibling-capability constructions (e.g. YAML mappers) before
        // deciding whether this file constructs ITS capability inline.
        let probe = content;
        for (const ex of cap.excludeInstantiationMatchers ?? []) probe = probe.replace(ex, "");
        out[cap.id] = (cap.instantiationMatchers ?? []).some((re) => re.test(probe)) ? "inline" : "import-only";
        break;
      }
      case "declarative":
        out[cap.id] = (cap.annotationMatchers ?? []).some((re) => re.test(content)) ? "annotation" : "import-only";
        break;
      default:
        out[cap.id] = "inline";
    }
  }
  return out;
}

/**
 * Whether a module genuinely reaches for a capability inline (the reuse smell),
 * as opposed to receiving it via DI or declaring it via annotations. Prefers the
 * parse-time `capabilityUse` signal; falls back to import presence for "inline"
 * capabilities when that signal is absent (e.g. hand-built test fixtures), and
 * treats di-bean/declarative as NOT-inline when unknown to avoid false positives.
 */
export function moduleReachesCapabilityInline(m: ModuleInfo, cap: Capability): boolean {
  const use = m.capabilityUse?.[cap.id];
  if (use !== undefined) return use === "inline";
  return mechanismOf(cap) === "inline" && moduleUsesCapability(m, cap);
}

/** The capability whose import library a raw import specifier matches, if any. */
export function capabilityForSpec(spec: string): Capability | undefined {
  return CAPABILITIES.find((cap) => cap.importMatchers.some((re) => re.test(spec)));
}

/**
 * The existing canonical helper module for a capability in a module set, if one
 * exists: a non-test module that uses the capability, is named like its helper,
 * and is already a dependency hub (inbound >= 2). Used by PR review to decide
 * whether a change should route through an established helper.
 */
export function findCanonicalHelper(modules: ModuleInfo[], cap: Capability): ModuleInfo | undefined {
  // A di-bean's canonical home is the file that CONSTRUCTS the shared instance —
  // a factory/provider/config. DI decouples callers from it, so import-based
  // inbound is unreliable; instead we require it to (a) construct the bean inline,
  // (b) be named like the capability's helper, and (c) carry a home-role token
  // (factory/provider/config/…). Inline capabilities keep the inbound>=2 hub test.
  const diBean = mechanismOf(cap) === "di-bean";
  return modules
    .filter((m) => {
      if (m.isTest || m.isGenerated) return false;
      if (!cap.homeTokens.some((t) => nameTokens(m.path).has(t))) return false;
      if (diBean) {
        const tokens = nameTokens(m.path);
        return moduleReachesCapabilityInline(m, cap) && HOME_ROLE_TOKENS.some((t) => tokens.has(t));
      }
      return moduleUsesCapability(m, cap) && m.inbound >= 2;
    })
    .sort((a, b) => b.inbound - a.inbound)[0];
}

export function detectCapabilities(modules: ModuleInfo[]): CapabilityCluster[] {
  const nonTest = modules.filter((m) => !m.isTest && !m.isGenerated);
  const out: CapabilityCluster[] = [];

  for (const cap of CAPABILITIES) {
    // Declarative capabilities (e.g. annotation-driven validation) are distributed
    // by design — there is no single helper to extract, so we never cluster them.
    if (mechanismOf(cap) === "declarative") continue;

    // "using" = modules that genuinely reach for the capability inline. For di-bean
    // capabilities this excludes files that merely receive the shared bean via DI.
    const using = nonTest.filter((m) => moduleReachesCapabilityInline(m, cap));
    if (using.length < MIN_USING) continue;

    const canonical = findCanonicalHelper(nonTest, cap);

    if (canonical) {
      const bypassing = using.filter(
        (m) => m.path !== canonical.path && !m.imports.some((i) => i.resolved === canonical.path),
      );
      if (bypassing.length >= MIN_BYPASSING) {
        out.push({
          id: cap.id,
          title: cap.title,
          usingFiles: using.map((m) => m.path),
          canonical: { path: canonical.path, inbound: canonical.inbound },
          bypassing: bypassing.map((m) => m.path),
          recommendation: "route-through-canonical",
        });
      }
    } else {
      out.push({
        id: cap.id,
        title: cap.title,
        usingFiles: using.map((m) => m.path),
        bypassing: using.map((m) => m.path),
        recommendation: "extract-shared-helper",
      });
    }
  }

  out.sort((a, b) => b.bypassing.length - a.bypassing.length || a.title.localeCompare(b.title));
  return out;
}
