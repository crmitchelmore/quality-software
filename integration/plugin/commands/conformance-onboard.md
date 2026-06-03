---
description: Onboard a repository into Quality Software conformance artefacts
allowed-tools: Bash, Read, Write
---

Run `conformance onboard --write-profile --write-map --write-anchors` only when the repository does not already have ratified conformance artefacts. If artefacts exist, run `conformance onboard --inventory` and report candidate gaps without overwriting files.

