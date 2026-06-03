import { test, after } from "node:test";
import assert from "node:assert/strict";
import { loadCatalogue } from "../src/catalogue.js";
import { buildEvidenceMap } from "../src/model/project-map.js";
import { buildInventory, altitudeOf, renderInventory } from "../src/model/inventory.js";
import { makeProject, cleanupAll, todoProfile, writeFile } from "./helpers.js";

after(cleanupAll);

test("altitudeOf buckets catalogue groups by scale", () => {
  assert.equal(altitudeOf("architecture"), "high");
  assert.equal(altitudeOf("ddd-strategic"), "high");
  assert.equal(altitudeOf("gof-behavioural"), "medium");
  assert.equal(altitudeOf("ddd-tactical"), "medium");
  assert.equal(altitudeOf("implementation"), "low");
});

test("inventory detects CQRS + event sourcing and implies DDD, grouped by altitude", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // A small Axon-style slice: aggregates, events, commands, queries, read-models.
  writeFile(dir, "src/domain/OrderAggregate.kt", "package com.app.domain\nclass OrderAggregate\n");
  writeFile(dir, "src/domain/CartAggregate.kt", "package com.app.domain\nclass CartAggregate\n");
  writeFile(dir, "src/domain/PaymentAggregate.kt", "package com.app.domain\nclass PaymentAggregate\n");
  for (const e of ["OrderPlaced", "OrderShipped", "CartCleared", "PaymentTaken", "PaymentFailed", "OrderCancelled"])
    writeFile(dir, `src/events/${e}Event.kt`, `package com.app.events\nclass ${e}Event\n`);
  for (const c of ["PlaceOrder", "ShipOrder", "TakePayment", "CancelOrder", "ClearCart"])
    writeFile(dir, `src/commands/${c}Command.kt`, `package com.app.commands\nclass ${c}Command\n`);
  for (const q of ["OrderById", "CartById", "PaymentById"])
    writeFile(dir, `src/queries/${q}Query.kt`, `package com.app.queries\nclass ${q}Query\n`);
  for (const r of ["OrderReadModel", "CartReadModel", "PaymentReadModel", "ShipmentReadModel", "InvoiceReadModel"])
    writeFile(dir, `src/read/${r}.kt`, `package com.app.read\nclass ${r}\n`);

  const catalogue = loadCatalogue(dir);
  const map = buildEvidenceMap(dir, {});
  const inv = buildInventory(map, catalogue);

  const highIds = inv.high.map((e) => e.id);
  assert.ok(highIds.includes("cqrs"), `expected cqrs in high, got ${highIds}`);
  assert.ok(highIds.includes("event-sourcing"), `expected event-sourcing in high, got ${highIds}`);

  const medIds = inv.medium.map((e) => e.id);
  assert.ok(medIds.includes("aggregate"));
  assert.ok(medIds.includes("domain-event"));

  // Every entry carries at least one concrete file reference.
  for (const e of [...inv.high, ...inv.medium]) {
    if (e.id === "cqrs" || e.id === "event-sourcing" || e.id === "aggregate" || e.id === "domain-event") {
      assert.ok(e.locations.length > 0, `${e.id} should reference files`);
    }
  }

  assert.ok(inv.philosophies.some((p) => p.id === "domain-driven-design"));

  const md = renderInventory(inv);
  assert.match(md, /High-level — architecture/);
  assert.match(md, /Implied philosophies/);
});
