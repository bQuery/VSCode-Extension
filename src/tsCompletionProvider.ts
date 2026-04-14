import * as vscode from 'vscode';

/**
 * Metadata for a bQuery API completion item.
 */
interface ApiCompletion {
  label: string;
  detail: string;
  documentation: string;
  insertText: string;
  kind: vscode.CompletionItemKind;
}

const BQ_API_COMPLETIONS: ApiCompletion[] = [
  // Component
  {
    label: 'component',
    detail: 'bQuery: Register a web component',
    documentation:
      "Creates and registers a custom element with props, optional typed state/signals, shadow mode control, attribute observation, lifecycle hooks, and a render function.\n\n**Module:** `@bquery/bquery/component`",
    insertText: [
      "component('${1:my-component}', {",
      '  props: {',
      '    ${2:name}: { type: ${3|String,Number,Boolean|}, required: ${4|true,false|} }',
      '  },',
      '  render({ props }) {',
      '    return html`<div>\\${props.${2:name}}</div>`;',
      '  },',
      '});',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'defineComponent',
    detail: 'bQuery: Define a component class',
    documentation:
      "Creates a component class without auto-registering it.\n\n**Module:** `@bquery/bquery/component`",
    insertText: [
      "const ${1:MyComponent} = defineComponent('${2:my-component}', {",
      '  props: { ${3:name}: { type: String } },',
      '  render: ({ props }) => html`<div>\\${props.${3:name}}</div>`,',
      '});',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'html',
    detail: 'bQuery: HTML template tag',
    documentation:
      "Tagged template literal for component rendering. Combine with `bool()` for ergonomic boolean attributes.\n\n**Module:** `@bquery/bquery/component`",
    insertText: 'html`${1:template}`',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'bool',
    detail: 'bQuery: Boolean HTML attribute helper',
    documentation:
      "Creates a boolean-attribute marker for `html` / `safeHtml` templates so attributes like `disabled` are only rendered when enabled.\n\n**Module:** `@bquery/bquery/component`",
    insertText: "bool('${1:disabled}', ${2:condition})",
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'useSignal',
    detail: 'bQuery: Create a component-scoped signal',
    documentation:
      "Creates a component-scoped writable signal that is cleaned up automatically when the element disconnects. Call it from component lifecycle hooks rather than `render()`.\n\n**Module:** `@bquery/bquery/component`",
    insertText: 'const ${1:name} = useSignal(${2:initialValue});',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'useComputed',
    detail: 'bQuery: Create a component-scoped computed signal',
    documentation:
      "Creates a component-scoped computed signal that automatically cleans up with the element lifecycle. Call it from component lifecycle hooks rather than `render()`.\n\n**Module:** `@bquery/bquery/component`",
    insertText: 'const ${1:name} = useComputed(() => ${2:expression});',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'useEffect',
    detail: 'bQuery: Create a component-scoped effect',
    documentation:
      "Runs a component-scoped reactive effect that automatically cleans up when the element disconnects. Call it from component lifecycle hooks rather than `render()`.\n\n**Module:** `@bquery/bquery/component`",
    insertText: ['useEffect(() => {', '  ${1:}', '});'].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  // Router
  {
    label: 'createRouter',
    detail: 'bQuery: Create a SPA router',
    documentation:
      "Creates a router instance with route definitions, lazy component loaders, global and per-route guards, redirects, optional scroll restoration, and history API integration.\n\n**Module:** `@bquery/bquery/router`",
    insertText: [
      'const router = createRouter({',
      '  routes: [',
      "    { path: '/', name: '${1:home}', component: () => import('${2:./pages/HomePage}') },",
      "    { path: '${3:/about}', name: '${4:about}', component: () => import('${5:./pages/AboutPage}') },",
      "    { path: '*', component: () => import('${6:./pages/NotFoundPage}') }",
      '  ],',
      '});',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'navigate',
    detail: 'bQuery: Navigate to a path',
    documentation:
      "Programmatically navigates to a URL path. Supports query params and replace mode.\n\n**Module:** `@bquery/bquery/router`",
    insertText: "await navigate('${1:/path}');",
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'currentRoute',
    detail: 'bQuery: Current reactive route',
    documentation:
      "A reactive signal containing the current route information (path, params, query, hash).\n\n**Module:** `@bquery/bquery/router`",
    insertText: 'currentRoute.value',
    kind: vscode.CompletionItemKind.Variable,
  },
  {
    label: 'useRoute',
    detail: 'bQuery: Focused route signals',
    documentation:
      "Returns focused readonly signals for the current route, path, params, query, hash, and matched definition.\n\n**Module:** `@bquery/bquery/router`",
    insertText: 'const { path, params, query, hash, matched } = useRoute();',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'registerBqLink',
    detail: 'bQuery: Register the <bq-link> element',
    documentation:
      "Registers the declarative `<bq-link>` custom element for router-aware navigation links.\n\n**Module:** `@bquery/bquery/router`",
    insertText: 'registerBqLink();',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'interceptLinks',
    detail: 'bQuery: Intercept in-app anchor navigation',
    documentation:
      "Intercepts matching anchor clicks and routes them through the SPA router instead of triggering a full page reload.\n\n**Module:** `@bquery/bquery/router`",
    insertText: 'interceptLinks();',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'isNavigating',
    detail: 'bQuery: Reactive navigation state',
    documentation:
      "A reactive signal that reports whether the router is currently processing a navigation.\n\n**Module:** `@bquery/bquery/router`",
    insertText: 'isNavigating.value',
    kind: vscode.CompletionItemKind.Variable,
  },
  // View
  {
    label: 'mount',
    detail: 'bQuery: Mount reactive view',
    documentation:
      "Mounts reactive bindings to a DOM element. Processes bq-* directives and creates reactive effects.\n\n**Module:** `@bquery/bquery/view`",
    insertText: [
      "const app = mount('${1:#app}', {",
      '  ${2:data},',
      '  ${3:handler}: () => { ${4:} },',
      '});',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'createTemplate',
    detail: 'bQuery: Create a reusable template',
    documentation:
      "Creates a reusable view factory from an HTML template string.\n\n**Module:** `@bquery/bquery/view`",
    insertText: ['const template = createTemplate(`', '  ${1:<div bq-text="message"></div>}', '`);'].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  // Core
  {
    label: '$',
    detail: 'bQuery: Select the first matching element',
    documentation:
      "Selects the first matching DOM element and wraps it in the core bQuery element helper.\n\n**Module:** `@bquery/bquery/core`",
    insertText: "\\$('${1:selector}')",
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: '$$',
    detail: 'bQuery: Select all matching elements',
    documentation:
      "Selects all matching DOM elements and wraps them in a bQuery collection for chained operations.\n\n**Module:** `@bquery/bquery/core`",
    insertText: "\\$\\$('${1:selector}')",
    kind: vscode.CompletionItemKind.Function,
  },
  // Reactive
  {
    label: 'signal',
    detail: 'bQuery: Create a reactive signal',
    documentation:
      "Creates a reactive signal with a `.value` property that triggers updates when changed.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: 'const ${1:name} = signal(${2:initialValue});',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'computed',
    detail: 'bQuery: Create a computed signal',
    documentation:
      "Creates a read-only signal derived from other signals.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: 'const ${1:name} = computed(() => ${2:expression});',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'effect',
    detail: 'bQuery: Create a reactive effect',
    documentation:
      "Runs a function immediately and re-runs it whenever its signal dependencies change.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: ['effect(() => {', '  ${1:}', '});'].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'batch',
    detail: 'bQuery: Batch signal updates',
    documentation:
      "Groups multiple signal updates to only trigger effects once.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: ['batch(() => {', '  ${1:}', '});'].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'watch',
    detail: 'bQuery: Watch a reactive source',
    documentation:
      "Watches a signal or computed value and runs a callback with the new and previous values whenever it changes.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: ['const stop = watch(${1:source}, (${2:newValue}, ${3:oldValue}) => {', '  ${4:}', '});'].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'readonly',
    detail: 'bQuery: Create a read-only signal view',
    documentation:
      "Wraps a signal in a read-only interface so consumers can observe it without mutating `.value`.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: 'const ${1:publicSignal} = readonly(${2:sourceSignal});',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'linkedSignal',
    detail: 'bQuery: Create a writable computed signal',
    documentation:
      "Creates a writable computed-like signal by linking a getter and setter.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: [
      'const ${1:name} = linkedSignal(',
      '  () => ${2:derivedValue},',
      '  (${3:next}) => {',
      '    ${4:}',
      '  }',
      ');',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  // Store
  {
    label: 'createStore',
    detail: 'bQuery: Create a state store',
    documentation:
      "Creates a signal-based state store with getters and actions.\n\n**Module:** `@bquery/bquery/store`",
    insertText: [
      "const ${1:store} = createStore({",
      "  id: '${2:myStore}',",
      '  state: () => ({ ${3:count}: ${4:0} }),',
      '  getters: {',
      '    ${5:doubled}: (state) => state.${3:count} * 2',
      '  },',
      '  actions: {',
      '    ${6:increment}() { this.${3:count}++; }',
      '  },',
      '});',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'defineStore',
    detail: 'bQuery: Define a factory-style store',
    documentation:
      "Creates a store definition factory (Pinia-style). Call the returned function to get the store instance.\n\n**Module:** `@bquery/bquery/store`",
    insertText: [
      "const ${1:useStore} = defineStore('${2:storeName}', {",
      '  state: () => ({ ${3:count}: ${4:0} }),',
      '  actions: {',
      '    ${5:increment}() { this.${3:count}++; }',
      '  },',
      '});',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'createPersistedStore',
    detail: 'bQuery: Create a persisted state store',
    documentation:
      "Creates a store that persists its state with optional custom key, storage backend, serializer, version, and migrate options.\n\n**Module:** `@bquery/bquery/store`",
    insertText: [
      "const ${1:store} = createPersistedStore({",
      "  id: '${2:settings}',",
      "  state: () => ({ ${3:theme}: '${4:dark}' }),",
      '});',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
  },
  // Security
  {
    label: 'sanitize',
    detail: 'bQuery: Sanitize potentially unsafe HTML',
    documentation:
      "Sanitizes HTML before rendering user-controlled or untrusted markup.\n\n**Module:** `@bquery/bquery/security`",
    insertText: 'sanitize(${1:html});',
    kind: vscode.CompletionItemKind.Function,
  },
  {
    label: 'escapeHtml',
    detail: 'bQuery: Escape HTML special characters',
    documentation:
      "Escapes a string for safe HTML text output without interpreting markup.\n\n**Module:** `@bquery/bquery/security`",
    insertText: 'escapeHtml(${1:text});',
    kind: vscode.CompletionItemKind.Function,
  },
  // Platform
  {
    label: 'storage',
    detail: 'bQuery: Access browser storage adapters',
    documentation:
      "Provides typed helpers for local, session, memory, and IndexedDB-backed storage adapters.\n\n**Module:** `@bquery/bquery/platform`",
    insertText: "storage.local('${1:key}', ${2:initialValue});",
    kind: vscode.CompletionItemKind.Variable,
  },
  {
    label: 'notifications',
    detail: 'bQuery: Browser notification helper',
    documentation:
      "Wraps the Web Notifications API with helpers for support checks, permission requests, and sending notifications.\n\n**Module:** `@bquery/bquery/platform`",
    insertText: [
      'await notifications.requestPermission();',
      "notifications.send('${1:Title}', { body: '${2:Done}' });",
    ].join('\n'),
    kind: vscode.CompletionItemKind.Variable,
  },
];

/**
 * Registers the TypeScript/JavaScript completion provider for bQuery APIs.
 */
export function registerTsCompletionProvider(context: vscode.ExtensionContext): void {
  const provider = vscode.languages.registerCompletionItemProvider(
    ['typescript', 'javascript'],
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ): vscode.CompletionItem[] {
        // Scan document text up to cursor for multi-line context detection (limit to 500 lines for performance)
        const startLine = Math.max(0, position.line - 500);
        const textUpToCursor = document.getText(
          new vscode.Range(new vscode.Position(startLine, 0), position)
        );

        // Don't provide completions inside strings or comments
        if (isInsideStringOrComment(textUpToCursor)) {
          return [];
        }

        // Only provide completions when the user has typed a "bq" prefix
        const lineText = document.lineAt(position).text;
        const textBeforeCursor = lineText.substring(0, position.character);
        const prefixMatch = textBeforeCursor.match(/\bbq\w*$/i);
        if (!prefixMatch) {
          return [];
        }

        return BQ_API_COMPLETIONS.map((api) => {
          const item = new vscode.CompletionItem(api.label, api.kind);
          item.detail = api.detail;
          item.documentation = new vscode.MarkdownString(api.documentation);
          item.insertText = new vscode.SnippetString(api.insertText);
          item.filterText = `bq${api.label}`;
          item.sortText = `0_bq_${api.label}`;
          // Replace the typed prefix with the completion
          const startPos = position.translate(0, -prefixMatch[0].length);
          item.range = new vscode.Range(startPos, position);
          return item;
        });
      },
    }
  );

  context.subscriptions.push(provider);
}

/**
 * Basic heuristic to detect if cursor is inside a string literal, line comment,
 * block comment, or template literal text (but not inside `${...}` expressions).
 */
function isInsideStringOrComment(text: string): boolean {
  let inString: string | null = null;
  let inBlockComment = false;
  const templateStack: number[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++; // skip '/'
      }
      continue;
    }

    if (inString) {
      if (ch === inString && !isEscaped(text, i)) {
        inString = null;
      }
      continue;
    }

    const currentTemplateDepth = templateStack[templateStack.length - 1];
    if (currentTemplateDepth !== undefined) {
      if (currentTemplateDepth === 0) {
        if (ch === '\\') {
          i++; // skip escaped character in template text
          continue;
        }
        if (ch === '$' && next === '{') {
          templateStack[templateStack.length - 1] = 1;
          i++; // skip '{'
          continue;
        }
        if (ch === '`') {
          templateStack.pop();
          continue;
        }
        // Inside template text (not in ${...}), skip
        continue;
      }

      // Inside ${...} expression of the current template literal.
      if (ch === '`') {
        templateStack.push(0);
        continue;
      }
      if (ch === '{') {
        templateStack[templateStack.length - 1] = currentTemplateDepth + 1;
        continue;
      }
      if (ch === '}') {
        templateStack[templateStack.length - 1] = Math.max(0, currentTemplateDepth - 1);
        continue;
      }
    }

    // Line comment — only active until end of the current line
    if (ch === '/' && next === '/') {
      const nextNewlineIndex = text.indexOf('\n', i);
      if (nextNewlineIndex === -1) {
        // No newline after: this '//' is on the last line, so the cursor is in a comment.
        return true;
      }
      // Skip ahead to just past the newline and continue scanning.
      i = nextNewlineIndex;
      continue;
    }

    // Block comment start
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i++; // skip '*'
      continue;
    }

    // String start (single and double quotes)
    if (ch === "'" || ch === '"') {
      inString = ch;
      continue;
    }

    // Template literal start
    if (ch === '`') {
      templateStack.push(0);
      continue;
    }
  }

  return (
    inString !== null ||
    inBlockComment ||
    (templateStack.length > 0 && templateStack[templateStack.length - 1] === 0)
  );
}

function isEscaped(text: string, index: number): boolean {
  let backslashCount = 0;

  for (let i = index - 1; i >= 0 && text[i] === '\\'; i--) {
    backslashCount++;
  }

  return backslashCount % 2 === 1;
}
