# bQuery for VSCode

A VSCode Extension to improve the developer experience when working with [@bQuery/bQuery](https://github.com/bQuery/bQuery), especially the component, router and view system.

## Features

### Snippets

Type `bq-` to see all available snippets.

#### TypeScript / JavaScript

| Prefix | Description |
| --- | --- |
| `bq-component` | Create a bQuery web component with props and render |
| `bq-define-component` | Create a component class with `defineComponent` |
| `bq-component-state` | Component with state, props, and lifecycle hooks |
| `bq-router` | Create a SPA router with route definitions |
| `bq-route` | Add a route definition |
| `bq-route-params` | Add a route definition with params |
| `bq-guard` | Add a navigation guard |
| `bq-navigate` | Navigate to a path |
| `bq-mount` | Mount a reactive view with signals |
| `bq-signal` | Create a reactive signal |
| `bq-computed` | Create a computed signal |
| `bq-effect` | Create a reactive effect |
| `bq-watch` | Watch a signal for changes |
| `bq-store` | Create a state store |
| `bq-define-store` | Create a factory-style store (Pinia-style) |
| `bq-persisted-store` | Create a persisted store (localStorage) |
| `bq-linked-signal` | Create a writable computed (linked signal) |
| `bq-import-component` | Import component module |
| `bq-import-router` | Import router module |
| `bq-import-view` | Import view module |
| `bq-import-reactive` | Import reactive module |
| `bq-import-store` | Import store module |
| `bq-import-core` | Import core selectors |
| `bq-import-motion` | Import motion module |

#### HTML

| Prefix | Description |
| --- | --- |
| `bq-text` | Text binding directive |
| `bq-html` | HTML binding directive (sanitized) |
| `bq-if` | Conditional rendering directive |
| `bq-show` | Show/hide directive |
| `bq-for` | List rendering directive |
| `bq-model` | Two-way data binding directive |
| `bq-on` | Event handler directive |
| `bq-class` | Conditional class binding |
| `bq-style` | Dynamic style binding |
| `bq-bind` | Attribute binding directive |
| `bq-ref` | Element reference directive |
| `bq-app` | Full app template with view bindings |
| `bq-for-template` | List rendering template |
| `bq-counter` | Counter template with reactive bindings |

### IntelliSense Completions

- **HTML**: Auto-complete bQuery view directives (`bq-text`, `bq-if`, `bq-for`, `bq-on:event`, `bq-model`, `bq-class`, `bq-style`, `bq-show`, `bq-html`, `bq-bind:attr`, `bq-ref`) when typing inside HTML tags.
- **TypeScript/JavaScript**: Auto-complete bQuery API functions (`component`, `createRouter`, `mount`, `signal`, `computed`, `effect`, `createStore`, and more) with documentation and snippet insertion.

## Requirements

- VSCode 1.85.0 or later
- A project using [@bquery/bquery](https://www.npmjs.com/package/@bquery/bquery)

## License

MIT — see [LICENSE](LICENSE) for details.
