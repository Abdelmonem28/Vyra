<div align="center">
  <img src="./public/logo.png" alt="Nebula logo" width="120" />
</div>

# Nebula ✦



> A lightweight TypeScript UI library — template compiler, signals-based reactivity, component composition, and a client-side router. Zero runtime dependencies.

[![Tests](https://img.shields.io/badge/tests-42%20passing-brightgreen)](https://github.com/mon3sh/nebula)
[![npm](https://img.shields.io/npm/v/nebula)](https://www.npmjs.com/package/nebula)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Bundle size](https://img.shields.io/badge/bundle-~6kB%20min%2Bgzip-informational)](https://bundlephobia.com/package/nebula)

---

## What is Nebula?

Nebula is a UI library built from scratch in TypeScript. It gives you:

- A **template compiler** with `{{interpolation}}`, `{{#if}}`, `{{#each}}`, and `{{> child}}` syntax
- **Signals-based reactivity** — state changes automatically re-render the components that use them
- **Component composition** — nest components inside each other's templates with `{{> ComponentName}}`
- A **client-side router** for building SPAs without a full page reload
- **Scoped styles** — inline or external CSS, automatically scoped to each component

It is intentionally small. There is no virtual DOM, no JSX, no build plugin required. If you know HTML, you can use Nebula.

---

## Install

```bash
npm install nebula
```

Or scaffold a new project in one command:

```bash
npx create-nebula-app
```

---

## Quick start

```html
<!-- index.html -->
<div id="Zweb-App"></div>
<script type="module" src="./src/main.js"></script>
```

```js
// src/main.js
import { Component, Router, createState } from 'nebula';

// 1. Create a reactive state value
const [count, setCount] = createState(0);

// 2. Build a component with a template string
const Counter = new Component(
    `<div>
        <h1>Count: {{count}}</h1>
        <button id="inc">Add one</button>
        <button id="reset">Reset</button>
    </div>`,
    'Counter'   // ← sets document.title
);

// 3. Bind state — Counter re-renders automatically when count changes
Counter.bindState('count', count);

// 4. Attach event handlers by element id
Counter.setInteraction('inc',   'click', () => setCount(prev => prev + 1));
Counter.setInteraction('reset', 'click', () => setCount(0));

// 5. Register the route and wire the nav link
const navLink = document.querySelector('#home-link');
Counter.setTrigger(navLink, 'click', '/');
```

That's the whole API for a reactive, routed component. No configuration files needed for basic use.

---

## Template syntax

Nebula templates are plain HTML strings containing `{{ }}` tags.

### Interpolation

```html
<p>Hello, {{name}}!</p>
<p>Nested: {{user.address.city}}</p>
```

Dot paths work for nested objects. Missing keys render as an empty string, never as `"undefined"`.

### Conditionals

```html
{{#if loggedIn}}
  <p>Welcome back, {{user.name}}</p>
{{else}}
  <a href="/login">Sign in</a>
{{/if}}
```

The `else` branch is optional. The condition is a truthy check on a data key.

You can also call a function from your data:

```html
{{#if (isAdmin currentUser)}}
  <button id="delete">Delete</button>
{{/if}}
```

```js
component.data = {
    currentUser: { role: 'admin' },
    isAdmin: (user) => user.role === 'admin',
};
```

### Loops

```html
<ul>
  {{#each todos}}
    <li class="{{#if this.completed}}done{{/if}}">
      {{this.title}}
    </li>
  {{/each}}
</ul>
```

Inside `{{#each}}`, `this` refers to the current item. You can access any property with `this.prop`. Loops and conditionals nest freely.

### Component composition

```html
<div class="page">
  {{> Navbar}}
  <main>{{> Content}}</main>
  {{> Footer}}
</div>
```

Register child components before rendering:

```js
const Page = new Component(`<div>{{> Navbar}}<main>{{title}}</main></div>`);
Page.data.children = { Navbar };
Page.data = { ...Page.data, title: 'Home' };
await Page.view();
```

---

## API reference

### `createState(initialValue)`

Creates a reactive state signal. Returns a `[getter, setter]` pair.

```ts
const [count, setCount] = createState(0);

count()           // → 0           read current value
setCount(1)       // → notify all subscribers
setCount(n => n + 1)  // updater form — always uses latest value
```

The getter is a **function**, not a plain value, so it always returns the current value no matter when you call it.

---

### `new Component(template, title?, data?)`

Creates a new component.

| Parameter  | Type     | Description |
|------------|----------|-------------|
| `template` | `string` | HTML template string with `{{ }}` tags |
| `title`    | `string` | Optional — sets `document.title` on render |
| `data`     | `object` | Optional — initial data for the template |

#### `.bindState(key, getter)`

Binds a state signal to a template key. The component re-renders automatically when the signal changes.

```js
const [user, setUser] = createState({ name: 'Karf' });
Card.bindState('user', user);
// Template can now use {{user.name}}
```

#### `.setInteraction(id, event, handler)`

Attaches an event listener to an element inside the template, matched by `id`.

```js
component.setInteraction('submit-btn', 'click', (event) => {
    event.preventDefault();
    // handle click
});
```

#### `.setStyle(css)`

Injects inline CSS scoped to this component only. Uses a generated class name so styles never leak.

```js
component.setStyle(`
    color: white;
    background: #1a1a2e;
    padding: 1rem;
`);
```

#### `.setStyleSheet(url)`

Fetches an external CSS file and scopes it to this component.

```js
component.setStyleSheet('/styles/card.css');
```

#### `.setTrigger(element, event, path)`

Registers this component as the handler for a URL path, and attaches a click listener to a nav element that navigates via `history.pushState` instead of a full reload.

```js
const aboutLink = document.querySelector('#about-link');
AboutPage.setTrigger(aboutLink, 'click', '/about');
```

#### `.setLoading(loadingComponent)`

Shows a loading component while this component navigates. Useful for async data fetching.

```js
const Spinner = new Component('<div class="spinner">Loading…</div>');
Dashboard.setLoading(Spinner);
```

#### `Component.setLoading(loadingComponent)` (static)

Sets a global fallback loading component used by all components that don't have their own.

```js
Component.setLoading(Spinner);
```

#### `.compile(context?)`

Renders the template to an HTML string without touching the DOM. Useful for server-side rendering or testing.

```js
const html = component.compile({ name: 'Karf' });
// → "<h1>Hello, Karf!</h1>"
```

#### `.dispose()`

Removes all state subscriptions created with `bindState`. Called automatically by the Router when navigating away from a component. Call it manually if you unmount a component yourself.

---

### `Router`

#### `Router.routes`

Array of registered routes. Populated automatically by `setTrigger`. You can also register routes manually:

```js
Router.routes.push({ path: '/about', view: AboutPage });
```

#### `Router.navigateTo(path)`

Navigates to a path programmatically — updates the URL, disposes the current component, and renders the new one.

```js
Router.navigateTo('/dashboard');
```

---

## The template compiler

The compiler is the most technically interesting part of Nebula. It processes templates in three stages:

**1. Tokenize** — walks the template string once and produces a flat list of tokens: `text`, `interp`, `if`, `else`, `endif`, `each`, `endeach`, `component`. This is a single regex pass; no string-position arithmetic.

**2. Parse** — converts the flat token list into a nested AST using a stack. Opening tags (`#if`, `#each`) push a frame onto the stack; closing tags pop it. Nesting is tracked by stack depth, not string search — so two `{{#if loggedIn}}` blocks in the same template, or an `{{#if}}` nested inside `{{#each}}`, both work correctly.

**3. Render** — walks the AST recursively, resolving data values with an explicit dot-path resolver that handles falsy values (`0`, `""`, `false`) correctly.

---

## Examples

Two fully working example apps are included in [`examples/`](./examples):

- **[to-do-list](./examples/to-do-list)** — full CRUD todo app with filtering, inline editing, localStorage persistence, and light/dark theme toggle.
- **[nebula-control-room](./examples/nebula-control-room)** — mission management dashboard with multi-view routing, metrics grid, priority filtering, and real-time clock.

To run either example:

```bash
cd examples/to-do-list
npm install
npm run dev
```

---

## Project structure

```
nebula/
├── src/
│   ├── Compiler/
│   │   ├── tokenizer.ts    # template string → flat Token[]
│   │   ├── parser.ts       # Token[] → nested Node[] AST
│   │   ├── render.ts       # Node[] + data → HTML string
│   │   └── index.ts        # public compile() function
│   ├── Core/
│   │   ├── component.ts    # Component class
│   │   ├── router.ts       # client-side Router
│   │   └── state.ts        # createState() signals
│   ├── types.ts            # shared TypeScript types
│   └── index.ts            # package entry point
├── tests/
│   ├── Compiler/           # unit tests per compiler stage
│   ├── component.test.ts
│   ├── router.test.ts
│   └── index.test.ts
└── examples/
    ├── to-do-list/
    └── nebula-control-room/
```

---

## create-nebula-app

Scaffold a new Nebula project without any manual setup:

```bash
npx create-nebula-app
```

```
  Welcome to Nebula ✦

  App name: my-app
  TypeScript? (y/N): n
  Install dependencies? (Y/n): y

  Created my-app successfully!

  Next steps:

    cd my-app
    npm run dev
```

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Author

Built by [Abdelmonem Ahmed](https://github.com/mon3sh) as a from-scratch exploration of how UI libraries work under the hood.
