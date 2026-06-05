---
description: Run a baseline-aware Quality Software conformance review
allowed-tools: Bash, Read
---

Run `conformance review --base origin/main` unless the PR base is known to be different. Report findings as advisory unless the tool returns a blocking decision from a certified deterministic rule.
