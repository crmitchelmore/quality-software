import { createHash } from "node:crypto";

/**
 * Auditability is a core data-model concept (design 16.8). Every LLM finding
 * carries a full record so trust, debugging, appeals and drift analysis are
 * possible, and so a blocking decision can later be replayed (design 16.7).
 */

export interface AuditRecord {
  patternId: string;
  judgeId: string;
  judgeVersion: string;
  clientId: string;
  modelId: string;
  promptVersion: string;
  catalogueVersion: string;
  providerTier: number;
  inputFingerprint: string;
  outputFingerprint: string;
  verdict: string;
  confidence: number;
  /** Why this finding is/ isn't eligible to block (design 16.6). Always set. */
  blockingEligibility: string;
  cacheHit: boolean;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  /** Set when the output was discarded by validation (design 16.9). */
  rejection?: string;
}

export function fingerprintText(s: string): string {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}
