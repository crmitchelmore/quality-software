# Output Encoding

> Encode untrusted data for the exact output context before rendering it, preventing valid data from becoming executable code.

**Scale:** implementation · **Category:** security · **Maturity:** time-tested

**Also known as:** Contextual escaping, Output escaping

## Description

Output Encoding treats every rendering sink as context-specific: HTML body, HTML attribute, JavaScript string, URL, SQL, shell, and log formats all have different escaping rules. The pattern is especially important for XSS because input can be valid business data yet dangerous in a browser context. Encoding should happen as close to the sink as possible using framework or vetted library encoders; do not pre-escape data at storage time because the correct encoding depends on where it is later used.

**Problem.** Data that is harmless in storage can become executable script, markup, commands, or broken structure when inserted into an output context unencoded.

**Context.** Use whenever user-controlled or external data is rendered into HTML, templates, logs, CSV, URLs, shell commands, or other interpreters.

## Consequences / Trade-offs

- Prevents XSS and context-confusion bugs even for data that passed validation.
- Keeps stored data canonical and encodes only for the target sink.
- Requires developers to understand context; one generic escape function is not enough.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Essential for any small app that renders external data. |
| Medium (≤100k LOC) | ●●●●● 5/5 | A standard secure coding practice across web and API surfaces. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical at scale; enforce with safe templating defaults and review of unsafe sinks. |

## Examples

### HTML context encoding

**❌ Negative (javascript)**

```javascript
app.get("/profile", async (req, res) => {
  const user = await users.find(req.user.id);
  res.send(`<h1>${user.displayName}</h1><p>${user.bio}</p>`);
});
```

**✅ Positive (javascript)**

```javascript
import escapeHtml from "escape-html";

app.get("/profile", async (req, res) => {
  const user = await users.find(req.user.id);
  res.send(
    `<h1>${escapeHtml(user.displayName)}</h1>` +
    `<p>${escapeHtml(user.bio)}</p>`
  );
});
```

*The positive code encodes user-controlled fields for HTML body context at the rendering sink, so a stored script tag is displayed as text rather than executed.*

## Relationships

**Synergies**

- [Input Validation (Allow-List)](../security/input-validation.md) — Validation limits accepted data, while output encoding protects each sink from valid-but-dangerous strings.
- [Defense in Depth](../security/defense-in-depth.md) — Encoding is an inner layer that still works if validation misses a payload.
- [Secure by Default](../security/secure-by-default.md) — Framework auto-escaping makes correct encoding the default path.

**Alternatives:** [Input Validation (Allow-List)](../security/input-validation.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** react, angular, vue, express, django, spring-boot
- **Project types:** web-frontend, web-api, backend-service, monolith, microservices
- **Tags:** xss, escaping, rendering

