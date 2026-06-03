# Humble Object

> Move logic out of hard-to-test framework or boundary code into a plain object that can be tested directly.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** Passive View, Humble Dialog Box, Presenter Extraction

## Description

Humble Object keeps the unavoidable boundary object deliberately thin: UI widgets, timers, controllers, or framework callbacks only translate events into calls on a plain collaborator. The extracted object owns decisions and formatting, so tests can exercise it without live UI frameworks, sleeping timers, or container bootstrapping.

**Problem.** Important logic is trapped inside framework callbacks, UI classes, timers, or asynchronous infrastructure that makes tests slow and brittle.

**Context.** Use when a boundary is difficult to instantiate or observe, but its decisions can be expressed in a plain object or function.

## Consequences / Trade-offs

- Fast tests cover the extracted logic without launching the framework.
- Boundary code becomes intentionally boring and easier to smoke-test at a higher level.
- Can add indirection if applied to trivial glue with no meaningful logic.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when a small UI or timer has real logic worth extracting. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for framework-heavy applications where container or UI tests are slow. |
| Large (>100k LOC) | ●●●●○ 4/5 | Keeps boundary logic maintainable as teams and UI surfaces grow. |

## Examples

### Timer presenter extraction

**❌ Negative (python)**

```python
class TimerView:
    def on_tick(self):
        self.elapsed += 1
        self.label.text = f"{self.elapsed}s"
```

**✅ Positive (python)**

```python
class TimerView:
    def on_tick(self):
        self.presenter.tick()

class TimerPresenter:
    def tick(self): self.elapsed += 1
    def display(self): return f"{self.elapsed}s"

def test_tick_increments_elapsed():
    p = TimerPresenter()
    p.tick(); p.tick()
    assert p.display() == "2s"
```

*The boundary only forwards events; the presenter holds logic and can be tested without a live widget toolkit or real timer.*

## Relationships

**Synergies**

- [Page Object](../testing/page-object.md) — Page objects can exercise the humble boundary at UI level while presenter logic is tested directly.
- [Hexagonal Test Boundaries](../testing/hexagonal-test-boundaries.md) — Both push decisions inward and leave adapters or framework edges thin.
- [Sociable and Solitary Tests](../testing/sociable-and-solitary-tests.md) — The extracted object can be tested sociably with real domain collaborators or solitarily with doubles.

**Conflicts with:** [Golden Master (Approval)](../testing/golden-master.md)

**Alternatives:** [Test Pyramid](../testing/test-pyramid.md), [Page Object](../testing/page-object.md), [Hexagonal Test Boundaries](../testing/hexagonal-test-boundaries.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java, csharp
- **Frameworks:** none, react, angular, vue, spring-boot, dotnet
- **Project types:** web-frontend, desktop-app, mobile-app, web-api, monolith
- **Tags:** testability, ui-boundary, presenter, passive-view

