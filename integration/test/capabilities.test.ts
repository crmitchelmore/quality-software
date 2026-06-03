import { test, after } from "node:test";
import assert from "node:assert/strict";
import { buildEvidenceMap } from "../src/model/project-map.js";
import { makeProject, cleanupAll, todoProfile, writeFile } from "./helpers.js";

after(cleanupAll);

test("detects a scattered capability with no canonical helper (extract-shared-helper)", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // Date handling reached for directly in 4 unrelated files, no helper module.
  for (const name of ["OrderService", "InvoiceService", "ReportService", "AuditService"]) {
    writeFile(
      dir,
      `src/svc/${name}.kt`,
      `package com.app.svc\nimport java.time.Instant\nclass ${name} { fun now() = Instant.now() }\n`,
    );
  }
  const map = buildEvidenceMap(dir, {});
  const date = map.capabilityClusters.find((c) => c.id === "date-time");
  assert.ok(date, "expected a date-time cluster");
  assert.equal(date!.recommendation, "extract-shared-helper");
  assert.ok(date!.usingFiles.length >= 3);
  assert.equal(date!.canonical, undefined);
});

test("detects a bypassed canonical helper (route-through-canonical)", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // A genuine shared clock helper that imports the date library and is depended upon.
  writeFile(
    dir,
    "src/util/ClockProvider.kt",
    `package com.app.util\nimport java.time.Instant\nclass ClockProvider { fun now() = Instant.now() }\n`,
  );
  // Two consumers route through it (so inbound >= 2 -> it counts as canonical).
  for (const name of ["GoodA", "GoodB"]) {
    writeFile(
      dir,
      `src/ok/${name}.kt`,
      `package com.app.ok\nimport com.app.util.ClockProvider\nclass ${name}(val clock: ClockProvider)\n`,
    );
  }
  // Three consumers bypass it and use java.time directly.
  for (const name of ["BadA", "BadB", "BadC"]) {
    writeFile(
      dir,
      `src/bad/${name}.kt`,
      `package com.app.bad\nimport java.time.Instant\nclass ${name} { fun now() = Instant.now() }\n`,
    );
  }
  const map = buildEvidenceMap(dir, {});
  const date = map.capabilityClusters.find((c) => c.id === "date-time");
  assert.ok(date, "expected a date-time cluster");
  assert.equal(date!.recommendation, "route-through-canonical");
  assert.match(date!.canonical!.path, /ClockProvider\.kt$/);
  assert.ok(date!.bypassing.length >= 2);
  // The helper itself and the good consumers must not be listed as bypassing.
  assert.ok(!date!.bypassing.some((p) => /ClockProvider\.kt$/.test(p)));
});
