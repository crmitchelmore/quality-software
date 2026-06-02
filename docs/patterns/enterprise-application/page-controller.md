# Page Controller

> Handle each logical page or route with its own controller action that prepares model data and selects a view.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Action controller, Page handler

## Description

Page Controller assigns a controller to a page, route, or small group of related actions. The controller receives request input, invokes application logic, chooses the view, and supplies the view model. It favours local clarity for page-specific behaviour and is common in server-rendered frameworks.

**Problem.** A single central controller can become too abstract or crowded when most behaviour is page-specific. Teams need an obvious file or method to edit for a particular screen without duplicating low-level plumbing.

**Context.** Use for server-rendered applications, CRUD screens, and route-oriented web apps where each page has modest unique logic and shared concerns are already handled by framework filters or middleware.

## Consequences / Trade-offs

- Easy to navigate: the controller for a page is the place to understand that page flow.
- Works well with Template View and Active Record for small server-rendered applications.
- Cross-cutting behaviour can be duplicated unless filters, middleware, or a Front Controller handle it.
- Can accumulate business logic in controllers if services or domain objects are absent.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent for simple server-rendered pages and CRUD screens. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit if controllers remain thin and shared concerns live in filters or services. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful at the edge, but large systems need service layers and consistent front-controller/middleware conventions to prevent drift. |

## Examples

### Page-specific order action

**❌ Negative (ruby)**

```ruby
class Router
  def call(env)
    if env.path == "/orders"
      # parse, load, authorise, render, and handle errors for every page here
    elsif env.path == "/customers"
      # more page-specific logic in the same central method
    end
  end
end
```

**✅ Positive (ruby)**

```ruby
class OrdersController < ApplicationController
  def index
    @orders = Order.visible_to(current_user).recent
    render :index
  end

  def create
    order = PlaceOrder.call(order_params, current_user)
    redirect_to order_path(order)
  end
end
```

*The positive version gives the Orders page a clear controller while inherited framework behaviour handles common request plumbing. Business-heavy creation is delegated rather than embedded in the action.*

## Relationships

**Synergies**

- [Template View](../enterprise-application/template-view.md) — Page Controller prepares the model that a Template View renders.
- [Active Record](../enterprise-application/active-record.md) — Small page controllers can load and save Active Records directly for simple CRUD flows.
- [Service Layer](../enterprise-application/service-layer.md) — For richer applications, page controllers should delegate use cases to the service layer.
- [Model-View-Controller (MVC)](../architecture/model-view-controller.md) — Page Controller is a route/page-oriented way to realise the controller role in MVC applications.

**Conflicts with:** [Front Controller](../enterprise-application/front-controller.md)

**Alternatives:** [Front Controller](../enterprise-application/front-controller.md), [Application Controller](../enterprise-application/application-controller.md), [Model-View-Controller (MVC)](../architecture/model-view-controller.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby, php
- **Frameworks:** rails, django, aspnet, spring-boot, laravel, express
- **Project types:** web-api, monolith, modular-monolith, web-frontend
- **Tags:** web, controller, server-rendered, page-flow

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

