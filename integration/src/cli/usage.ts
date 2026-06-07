export const USAGE =
  "Usage:\n" +
  "  conformance hook <session-start|post-write|guard-shell|turn-end> [--runtime copilot|claude|codex|generic]\n" +
  "                                                                    (reads hook JSON on stdin)\n" +
  "  conformance init [--write]                                          (propose a candidate profile)\n" +
  "  conformance onboard [--inventory] [--write-profile] [--write-anchors] [--write-map]  (scan codebase; print pattern inventory + evidence)\n" +
  "  conformance check [--event PR_REVIEW|BATCH] [--base <ref>] [paths…] (run the engine; exit 1 on block)\n" +
  "  conformance review [--base <ref>] [--json]                          (baseline-aware PR review; exit 1 on net-new block)\n" +
  "  conformance install-copilot [--force]                              (install local Copilot CLI plugin bundle)\n" +
  "  conformance doctor                                                  (diagnose catalogue/profile/plugin wiring)\n" +
  "  conformance profile                                                 (print the resolved profile)\n";
