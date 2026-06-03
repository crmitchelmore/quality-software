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

test("di-bean capability injected as a shared bean is NOT a reuse smell", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // Four services receive a shared ObjectMapper via DI — they import the TYPE but
  // never construct one. This is correct shared use, not a scattered capability.
  for (const name of ["AService", "BService", "CService", "DService"]) {
    writeFile(
      dir,
      `src/svc/${name}.kt`,
      `package com.app.svc\nimport com.fasterxml.jackson.databind.ObjectMapper\n` +
        `class ${name}(private val objectMapper: ObjectMapper) {\n` +
        `  fun render(x: Any) = objectMapper.writeValueAsString(x)\n}\n`,
    );
  }
  const map = buildEvidenceMap(dir, {});
  const json = map.capabilityClusters.find((c) => c.id === "json-serialization");
  assert.equal(json, undefined, "injected ObjectMapper must not be flagged");
});

test("di-bean capability constructed inline in many files IS a reuse smell", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // Three files each construct their own ObjectMapper — that is the genuine smell.
  for (const name of ["AService", "BService", "CService"]) {
    writeFile(
      dir,
      `src/svc/${name}.kt`,
      `package com.app.svc\nimport com.fasterxml.jackson.databind.ObjectMapper\n` +
        `class ${name} {\n  private val mapper = ObjectMapper()\n  fun render(x: Any) = mapper.writeValueAsString(x)\n}\n`,
    );
  }
  const map = buildEvidenceMap(dir, {});
  const json = map.capabilityClusters.find((c) => c.id === "json-serialization");
  assert.ok(json, "inline-constructed ObjectMapper should be flagged");
  assert.ok(json!.usingFiles.length >= 3);
});

test("declarative validation (annotations) is never clustered as a shared helper", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // Several DTOs annotate fields with Jakarta validation — distributed by design.
  for (const name of ["CreateOrder", "UpdateOrder", "CreateUser", "UpdateUser"]) {
    writeFile(
      dir,
      `src/api/${name}.kt`,
      `package com.app.api\nimport jakarta.validation.constraints.NotBlank\n` +
        `data class ${name}(@field:NotBlank val name: String)\n`,
    );
  }
  const map = buildEvidenceMap(dir, {});
  const validation = map.capabilityClusters.find((c) => c.id === "validation");
  assert.equal(validation, undefined, "annotation-based validation must not be flagged");
});

test("di-bean factory is recognised as the canonical helper despite zero import-inbound", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // The shared factory constructs the bean; it is wired via DI so nothing imports it.
  writeFile(
    dir,
    "src/support/JacksonObjectMapperFactory.kt",
    `package com.app.support\nimport com.fasterxml.jackson.databind.ObjectMapper\n` +
      `class JacksonObjectMapperFactory { fun objectMapper() = ObjectMapper().apply {} }\n`,
  );
  // Two other files construct their own mapper instead of using the factory.
  writeFile(
    dir,
    "src/svc/ReadModel.kt",
    `package com.app.svc\nimport com.fasterxml.jackson.databind.json.JsonMapper\n` +
      `class ReadModel { private val m = JsonMapper.builder().build() }\n`,
  );
  writeFile(
    dir,
    "src/svc/ApiClient.kt",
    `package com.app.svc\nimport com.fasterxml.jackson.databind.ObjectMapper\n` +
      `class ApiClient { private val m = ObjectMapper().apply {} }\n`,
  );
  const map = buildEvidenceMap(dir, {});
  const json = map.capabilityClusters.find((c) => c.id === "json-serialization");
  assert.ok(json, "expected a json-serialization cluster");
  assert.equal(json!.recommendation, "route-through-canonical");
  assert.match(json!.canonical!.path, /JacksonObjectMapperFactory\.kt$/);
  // The factory itself must not be listed as a bypasser.
  assert.ok(!json!.bypassing.some((p) => /JacksonObjectMapperFactory/.test(p)));
  assert.equal(json!.bypassing.length, 2);
});

test("YAML mapper constructions are not attributed to json-serialization", () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // Three files build YAML mappers (a distinct format) and receive the JSON bean via DI.
  for (const name of ["YamlA", "YamlB", "YamlC"]) {
    writeFile(
      dir,
      `src/yaml/${name}.kt`,
      `package com.app.yaml\nimport com.fasterxml.jackson.databind.ObjectMapper\n` +
        `import com.fasterxml.jackson.dataformat.yaml.YAMLFactory\n` +
        `class ${name}(private val jsonMapper: ObjectMapper) {\n` +
        `  private val yamlMapper = ObjectMapper(YAMLFactory())\n}\n`,
    );
  }
  const map = buildEvidenceMap(dir, {});
  const json = map.capabilityClusters.find((c) => c.id === "json-serialization");
  assert.equal(json, undefined, "YAML-only constructors must not count as JSON reuse");
});
