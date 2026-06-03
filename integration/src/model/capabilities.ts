import { basename } from "node:path";
import type { ModuleInfo } from "./project-map.js";

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

export interface Capability {
  id: string;
  title: string;
  /** Import-spec matchers (raw specifiers as written). Library = the capability. */
  importMatchers: RegExp[];
  /** Name TOKENS that identify a SHARED helper module for this capability. Matched
   *  against camelCase/separator-split basename tokens (exact token, not substring,
   *  so "invalidate" never matches "date"/"valid"). */
  homeTokens: string[];
}

export const CAPABILITIES: Capability[] = [
  {
    id: "date-time",
    title: "Date & time handling",
    importMatchers: [/\bjava\.time\b/, /joda/i, /kotlinx\.datetime/, /text\.SimpleDateFormat/, /\bdate-fns\b/, /\bdayjs\b/, /\bluxon\b/, /(^|\/)moment\b/, /(^|\b)datetime\b/],
    homeTokens: ["date", "dates", "time", "datetime", "clock", "calendar", "temporal", "instant"],
  },
  {
    id: "json-serialization",
    title: "JSON serialisation / mapping",
    importMatchers: [/jackson/i, /\bgson\b/i, /kotlinx\.serialization/, /(^|\/)zod\b/, /\bjson\b/i],
    homeTokens: ["json", "serializer", "serialiser", "serialization", "mapper", "objectmapper", "codec", "marshaller"],
  },
  {
    id: "crypto-hashing",
    title: "Cryptography & hashing",
    importMatchers: [/java\.security\.MessageDigest/, /javax\.crypto/, /bouncycastle/i, /\bbcrypt\b/i, /(^|\b)hashlib\b/, /node:crypto/, /(^|\/)crypto\b/],
    homeTokens: ["crypto", "hash", "hasher", "digest", "cipher", "encryption", "signing", "signer"],
  },
  {
    id: "http-client",
    title: "Outbound HTTP",
    importMatchers: [/okhttp/i, /java\.net\.http/, /springframework\.web\.(client|reactive)/, /(^|\b)requests\b/, /(^|\/)axios\b/, /\bundici\b/, /node:https?\b/],
    homeTokens: ["httpclient", "restclient", "webclient", "apiclient", "gateway", "httpgateway"],
  },
  {
    id: "id-generation",
    title: "Identifier generation",
    importMatchers: [/java\.util\.UUID/, /(^|\/)uuid\b/, /\buuid4\b/, /nanoid/i],
    homeTokens: ["ids", "idgenerator", "idgen", "uuidgenerator", "identifiers"],
  },
  {
    id: "money-decimal",
    title: "Money & precise decimals",
    importMatchers: [/java\.math\.BigDecimal/, /javax\.money/, /joda\.money/, /dinero/i],
    homeTokens: ["money", "currency", "amount", "price", "decimal"],
  },
  {
    id: "validation",
    title: "Input validation",
    importMatchers: [/javax\.validation/, /jakarta\.validation/, /hibernate\.validator/, /(^|\/)zod\b/, /pydantic/i],
    homeTokens: ["validator", "validators", "validation", "constraints", "verifier", "sanitiser", "sanitizer"],
  },
];

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

/** True when the module imports the underlying library for this capability. */
export function moduleUsesCapability(m: ModuleInfo, cap: Capability): boolean {
  return m.imports.some((i) => cap.importMatchers.some((re) => re.test(i.spec)));
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
  return modules
    .filter(
      (m) =>
        !m.isTest &&
        !m.isGenerated &&
        moduleUsesCapability(m, cap) &&
        m.inbound >= 2 &&
        cap.homeTokens.some((t) => nameTokens(m.path).has(t)),
    )
    .sort((a, b) => b.inbound - a.inbound)[0];
}

export function detectCapabilities(modules: ModuleInfo[]): CapabilityCluster[] {
  const nonTest = modules.filter((m) => !m.isTest && !m.isGenerated);
  const out: CapabilityCluster[] = [];

  for (const cap of CAPABILITIES) {
    const using = nonTest.filter((m) => moduleUsesCapability(m, cap));
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
