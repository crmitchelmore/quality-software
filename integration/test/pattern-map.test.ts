import { test, after } from "node:test";
import assert from "node:assert/strict";
import { loadCatalogue } from "../src/catalogue.js";
import { buildEvidenceMap } from "../src/model/project-map.js";
import { buildPatternMap, renderPatternMapYaml } from "../src/model/pattern-map.js";
import { makeProject, cleanupAll, todoProfile, writeFile } from "./helpers.js";

after(cleanupAll);

test("pattern map records flavour, anchors and philosophies; excludes test anchors", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // An Axon-flavoured CQRS/ES slice.
  for (const a of ["Order", "Cart", "Payment"]) {
    writeFile(
      dir,
      `src/domain/${a}Aggregate.kt`,
      `package com.app.domain\nimport org.axonframework.modelling.command.AggregateRoot\nclass ${a}Aggregate\n`,
    );
  }
  for (const e of ["Created", "Paid", "Shipped", "Cancelled", "Refunded"]) {
    writeFile(dir, `src/events/${e}Event.kt`, `package com.app.events\nclass ${e}Event\n`);
  }
  for (const c of ["Place", "Pay", "Ship", "Cancel", "Refund"]) {
    writeFile(dir, `src/commands/${c}Command.kt`, `package com.app.commands\nclass ${c}Command\n`);
  }
  for (const q of ["GetOrder", "ListOrders"]) {
    writeFile(dir, `src/queries/${q}Query.kt`, `package com.app.queries\nclass ${q}Query\n`);
  }
  for (let i = 0; i < 6; i++) {
    writeFile(dir, `src/read/View${i}ReadModel.kt`, `package com.app.read\nclass View${i}ReadModel\n`);
  }
  // A test file that should NOT appear as an anchor.
  writeFile(dir, "src/test/OrderAggregateTest.kt", `package com.app.test\nclass OrderAggregateTest\n`);

  const catalogue = loadCatalogue(dir);
  const map = buildEvidenceMap(dir, {});
  const pm = buildPatternMap(map, catalogue);

  const es = pm.patterns.find((p) => p.id === "event-sourcing");
  assert.ok(es, "expected event-sourcing in the map");
  assert.equal(es!.altitude, "high");
  assert.match(es!.flavour, /Axon/);
  assert.ok(es!.anchors.length > 0);
  assert.ok(!es!.anchors.some((a) => /Test\.kt$/.test(a)), "test anchors must be excluded");

  const cqrs = pm.patterns.find((p) => p.id === "cqrs");
  assert.ok(cqrs, "expected cqrs in the map");
  assert.match(cqrs!.flavour, /Axon command & query buses/);

  // Renders to YAML without throwing and includes the flavour line.
  const yaml = renderPatternMapYaml(pm);
  assert.match(yaml, /patterns:/);
  assert.match(yaml, /flavour:/);
  assert.match(yaml, /event-sourcing/);
});
