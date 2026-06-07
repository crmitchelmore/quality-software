/**
 * How a capability is normally *consumed*, which decides what counts as
 * "reaching for it inline" (the reuse smell) versus legitimate shared use:
 *
 *  - "inline"      — called directly at the use site (e.g. `Instant.now()`,
 *                    `UUID.randomUUID()`). Importing the library ≈ using it, so
 *                    import spread is a faithful proxy for usage spread.
 *  - "di-bean"     — normally a single shared instance is *injected* (e.g. a
 *                    Jackson `ObjectMapper`, an HTTP client). Importing the TYPE
 *                    is not a smell — receiving the bean is the correct pattern.
 *                    The smell is many places *constructing* their own instance,
 *                    so we count INSTANTIATIONS, not imports.
 *  - "declarative" — applied via annotations/config that are distributed BY
 *                    DESIGN (e.g. Jakarta Bean Validation `@NotNull`/`@NotBlank`
 *                    on each DTO). There is no single helper to extract, so we
 *                    never recommend "extract a shared helper" for these.
 */
export type CapabilityMechanism = "inline" | "di-bean" | "declarative";

/** How a given module touches a capability (computed from source at parse time). */
export type CapabilityUse = "inline" | "import-only" | "annotation";

export interface Capability {
  id: string;
  title: string;
  /** Import-spec matchers (raw specifiers as written). Library = the capability. */
  importMatchers: RegExp[];
  /** Name TOKENS that identify a SHARED helper module for this capability. Matched
   *  against camelCase/separator-split basename tokens (exact token, not substring,
   *  so "invalidate" never matches "date"/"valid"). */
  homeTokens: string[];
  /** How the capability is normally consumed; defaults to "inline". */
  mechanism?: CapabilityMechanism;
  /** di-bean only: source matchers that indicate the module CONSTRUCTS its own
   *  instance (e.g. `ObjectMapper(`). Distinguishes a real smell from a file that
   *  merely receives the bean via DI. */
  instantiationMatchers?: RegExp[];
  /** di-bean only: constructions to EXCLUDE — a distinct sibling capability that
   *  happens to share a constructor (e.g. `ObjectMapper(YAMLFactory())` is YAML,
   *  not JSON). Stripped from the source before instantiation matching, so such a
   *  file is not mis-attributed to this capability. */
  excludeInstantiationMatchers?: RegExp[];
  /** declarative only: source matchers for the annotation usage that proves the
   *  framework is doing the work (e.g. `@field:NotNull`, `@Valid`). */
  annotationMatchers?: RegExp[];
}

export const CAPABILITIES: Capability[] = [
  {
    id: "date-time",
    title: "Date & time handling",
    importMatchers: [/\bjava\.time\b/, /joda/i, /kotlinx\.datetime/, /text\.SimpleDateFormat/, /\bdate-fns\b/, /\bdayjs\b/, /\bluxon\b/, /(^|\/)moment\b/, /(^|\b)datetime\b/],
    homeTokens: ["date", "dates", "time", "datetime", "clock", "calendar", "temporal", "instant"],
  },
  {
    id: "json-serialization",
    title: "JSON serialisation / mapping",
    importMatchers: [/jackson/i, /\bgson\b/i, /kotlinx\.serialization/, /(^|\/)zod\b/, /\bjson\b/i],
    homeTokens: ["json", "serializer", "serialiser", "serialization", "mapper", "objectmapper", "codec", "marshaller"],
    mechanism: "di-bean",
    instantiationMatchers: [
      /\bObjectMapper\s*\(/, // new ObjectMapper(...) / ObjectMapper(YAMLFactory())
      /\bjacksonObjectMapper\s*\(/,
      /\bJsonMapper\s*\.\s*builder\s*\(/,
      /\bGsonBuilder\s*\(/,
      /\bGson\s*\(/,
      /\bJson\s*\{/, // kotlinx.serialization Json { ... }
    ],
    excludeInstantiationMatchers: [
      // A YAML mapper is a distinct serialisation format, not the JSON bean.
      /\b(?:Object|Json|Csv|Xml)?Mapper\s*\(\s*[\w.]*(?:YAML|Yaml|XML|Xml|CSV|Csv|Toml|Properties)Factory[^)]*\)/g,
    ],
  },
  {
    id: "crypto-hashing",
    title: "Cryptography & hashing",
    importMatchers: [/java\.security\.MessageDigest/, /javax\.crypto/, /bouncycastle/i, /\bbcrypt\b/i, /(^|\b)hashlib\b/, /node:crypto/, /(^|\/)crypto\b/],
    homeTokens: ["crypto", "hash", "hasher", "digest", "cipher", "encryption", "signing", "signer"],
  },
  {
    id: "http-client",
    title: "Outbound HTTP",
    importMatchers: [/okhttp/i, /java\.net\.http/, /springframework\.web\.(client|reactive)/, /(^|\b)requests\b/, /(^|\/)axios\b/, /\bundici\b/, /node:https?\b/],
    homeTokens: ["httpclient", "restclient", "webclient", "apiclient", "gateway", "httpgateway"],
    mechanism: "di-bean",
    instantiationMatchers: [
      /\bOkHttpClient(\s*\.\s*Builder)?\s*\(/,
      /\bHttpClient\s*\.\s*new(HttpClient|Builder)\s*\(/,
      /\bWebClient\s*\.\s*(create|builder)\s*\(/,
      /\baxios\s*\.\s*create\s*\(/,
    ],
  },
  {
    id: "id-generation",
    title: "Identifier generation",
    importMatchers: [/java\.util\.UUID/, /(^|\/)uuid\b/, /\buuid4\b/, /nanoid/i],
    homeTokens: ["ids", "idgenerator", "idgen", "uuidgenerator", "identifiers"],
  },
  {
    id: "money-decimal",
    title: "Money & precise decimals",
    importMatchers: [/java\.math\.BigDecimal/, /javax\.money/, /joda\.money/, /dinero/i],
    homeTokens: ["money", "currency", "amount", "price", "decimal"],
  },
  {
    id: "validation",
    title: "Input validation",
    importMatchers: [/javax\.validation/, /jakarta\.validation/, /hibernate\.validator/, /(^|\/)zod\b/, /pydantic/i],
    homeTokens: ["validator", "validators", "validation", "constraints", "verifier", "sanitiser", "sanitizer"],
    mechanism: "declarative",
    annotationMatchers: [
      /@(field:|get:|param:|property:)?(NotNull|NotBlank|NotEmpty|Valid|Size|Pattern|Email|Min|Max|Positive|Negative|Past|Future|Digits|DecimalMin|DecimalMax|AssertTrue|AssertFalse)\b/,
    ],
  },
];
