/**
 * Provider-agnostic LLM access (design 16.11). The judge depends only on this
 * interface so it can run against a host-runtime model (e.g. Copilot CLI), a
 * remote API, or — for tests and offline/air-gapped use — a deterministic fake.
 */

export type ModelTier = "small" | "large";

export interface LLMRequest {
  /** Trusted instruction channel. Code is NEVER placed here (design 16.9). */
  system: string;
  /** Structured user content; code regions live in delimited DATA blocks. */
  user: string;
  tier: ModelTier;
  /** Identifies the concrete model for audit/replay (design 16.7). */
  model: string;
  temperature: number;
  maxOutputTokens: number;
  promptVersion: string;
}

export interface LLMResponse {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LLMClient {
  /** Stable id of the underlying provider, recorded in the audit trail. */
  readonly id: string;
  /** Concrete model id chosen for a tier (pinned for blocking, design 16.7). */
  modelFor(tier: ModelTier): string;
  complete(req: LLMRequest): Promise<LLMResponse>;
}

/**
 * Deterministic fake client (design 16.11). Drives the judge in tests and powers
 * offline mode. The responder is a pure function of the request, so judge logic is
 * verifiable without a live model. Records every call for assertions.
 */
export class FakeLLMClient implements LLMClient {
  readonly id = "fake";
  readonly calls: LLMRequest[] = [];
  constructor(
    private readonly responder: (req: LLMRequest) => string,
    private readonly models: Record<ModelTier, string> = { small: "fake-small", large: "fake-large" },
  ) {}
  modelFor(tier: ModelTier): string {
    return this.models[tier];
  }
  async complete(req: LLMRequest): Promise<LLMResponse> {
    this.calls.push(req);
    const text = this.responder(req);
    return {
      text,
      model: req.model,
      inputTokens: Math.ceil(req.user.length / 4),
      outputTokens: Math.ceil(text.length / 4),
    };
  }
}

/**
 * Offline sentinel: no model available (air-gapped / deterministic-only mode).
 * The judge detects this and emits no LLM findings (design 16.11) — certified
 * deterministic detectors still run elsewhere.
 */
export class OfflineLLMClient implements LLMClient {
  readonly id = "offline";
  modelFor(): string {
    return "none";
  }
  async complete(): Promise<LLMResponse> {
    throw new Error("offline: no LLM available");
  }
}
