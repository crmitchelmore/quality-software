import type { LanguageProvider } from "./types.js";
import { typeScriptProvider } from "./typescript.js";

/**
 * Selects the highest-tier provider that claims a file (design 15.2). Files no
 * longer need a known extension to be considered — providers decide ownership.
 */
export class ProviderRegistry {
  private readonly providers: LanguageProvider[];

  constructor(providers: LanguageProvider[]) {
    // Highest tier first, so a semantic provider wins over a universal one.
    this.providers = [...providers].sort((a, b) => b.tier - a.tier);
  }

  providerFor(file: string): LanguageProvider | undefined {
    return this.providers.find((p) => p.claims(file));
  }

  claims(file: string): boolean {
    return this.providers.some((p) => p.claims(file));
  }
}

/** Default registry. Phase 1 ships the TypeScript provider; later phases add L0/L1. */
export function defaultRegistry(): ProviderRegistry {
  return new ProviderRegistry([typeScriptProvider]);
}
