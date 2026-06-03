# Template View

> Render dynamic pages by embedding simple presentation logic in a template populated from a model.

**Scale:** design · **Altitude:** medium · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Server-side template, HTML template

## Description

Template View uses an HTML, XML, or text template with placeholders and simple conditionals or loops. A controller supplies a model, and the template produces the response. The pattern is deliberately presentation-oriented: business decisions should be made before rendering, leaving the template to format already-prepared data.

**Problem.** Generating markup through string concatenation or business objects mixes presentation, escaping, and domain logic. It is hard to maintain, unsafe, and inaccessible to designers or frontend specialists.

**Context.** Use for server-rendered web pages, emails, reports, and documents where a view model can be prepared by a controller or service and rendered with framework escaping and layout support.

## Consequences / Trade-offs

- Separates presentation structure from request handling and domain logic.
- Enables layouts, partials, escaping, localisation, and designer-friendly markup.
- Templates become hard to test if they contain business decisions or database access.
- For highly interactive clients, component-based UI or API-driven rendering may be a better boundary.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent for small server-rendered pages, emails, and admin tools. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit when view models stay explicit and templates avoid business logic. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful for server-rendered surfaces, but complex interactive systems may favour component-based or API-driven views. |

## Examples

### Rendering an invoice email

**❌ Negative (python)**

```python
def invoice_email(invoice):
    return "<h1>Invoice " + invoice.number + "</h1>" +         "<p>Total: " + str(invoice.total()) + "</p>" +         "<p>" + invoice.customer.notes + "</p>"
```

**✅ Positive (python)**

```python
# controller/service
view_model = {
    "number": invoice.number,
    "total": money.format(invoice.total),
    "customer_name": invoice.customer_name,
}
return render_template("invoice_email.html", **view_model)

<!-- invoice_email.html -->
<h1>Invoice {{ number }}</h1>
<p>Total: {{ total }}</p>
<p>Customer: {{ customer_name }}</p>
```

*The positive version prepares presentation-ready data before rendering and lets the template engine handle escaping and markup structure. The template does not call domain methods or concatenate unsafe strings.*

## Relationships

**Synergies**

- [Page Controller](../enterprise-application/page-controller.md) — A Page Controller prepares the model and selects the Template View.
- [Front Controller](../enterprise-application/front-controller.md) — A Front Controller can standardise error handling, layouts, and view selection before templates render.
- [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md) — DTOs or view models keep templates from reaching into domain internals.
- [Model-View-Controller (MVC)](../architecture/model-view-controller.md) — Template View commonly implements the view part of MVC in server-rendered applications.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Component-Based UI](../frontend/component-based-ui.md), [Server-Side Rendering](../frontend/server-side-rendering.md), [Model-View-Controller (MVC)](../architecture/model-view-controller.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, python, ruby, php, java, csharp
- **Frameworks:** rails, django, laravel, aspnet, spring-boot, express, nextjs
- **Project types:** web-frontend, monolith, modular-monolith, web-api
- **Tags:** view, server-rendering, html, presentation

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

