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
  /** Module path for auto-import suggestion */
  module: string;
}

const BQ_API_COMPLETIONS: ApiCompletion[] = [
  // Component
  {
    label: 'component',
    detail: 'bQuery: Register a web component',
    documentation:
      "Creates and registers a custom element with props, lifecycle hooks, and a render function.\n\n**Module:** `@bquery/bquery/component`",
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
    module: '@bquery/bquery/component',
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
    module: '@bquery/bquery/component',
  },
  {
    label: 'html',
    detail: 'bQuery: HTML template tag',
    documentation:
      "Tagged template literal for component rendering. Sanitizes interpolated values.\n\n**Module:** `@bquery/bquery/component`",
    insertText: 'html`${1:template}`',
    kind: vscode.CompletionItemKind.Function,
    module: '@bquery/bquery/component',
  },
  // Router
  {
    label: 'createRouter',
    detail: 'bQuery: Create a SPA router',
    documentation:
      "Creates a router instance with route definitions, navigation guards, and history API integration.\n\n**Module:** `@bquery/bquery/router`",
    insertText: [
      'const router = createRouter({',
      '  routes: [',
      "    { path: '/', name: '${1:home}', component: ${2:HomePage} },",
      "    { path: '${3:/about}', name: '${4:about}', component: ${5:AboutPage} },",
      '    { path: \'*\', component: ${6:NotFound} }',
      '  ],',
      '});',
    ].join('\n'),
    kind: vscode.CompletionItemKind.Function,
    module: '@bquery/bquery/router',
  },
  {
    label: 'navigate',
    detail: 'bQuery: Navigate to a path',
    documentation:
      "Programmatically navigates to a URL path. Supports query params and replace mode.\n\n**Module:** `@bquery/bquery/router`",
    insertText: "await navigate('${1:/path}');",
    kind: vscode.CompletionItemKind.Function,
    module: '@bquery/bquery/router',
  },
  {
    label: 'currentRoute',
    detail: 'bQuery: Current reactive route',
    documentation:
      "A reactive signal containing the current route information (path, params, query, hash).\n\n**Module:** `@bquery/bquery/router`",
    insertText: 'currentRoute.value',
    kind: vscode.CompletionItemKind.Variable,
    module: '@bquery/bquery/router',
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
    module: '@bquery/bquery/view',
  },
  {
    label: 'createTemplate',
    detail: 'bQuery: Create a reusable template',
    documentation:
      "Creates a reusable template that can be mounted multiple times.\n\n**Module:** `@bquery/bquery/view`",
    insertText: "const template = createTemplate('${1:template-id}');",
    kind: vscode.CompletionItemKind.Function,
    module: '@bquery/bquery/view',
  },
  // Reactive
  {
    label: 'signal',
    detail: 'bQuery: Create a reactive signal',
    documentation:
      "Creates a reactive signal with a `.value` property that triggers updates when changed.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: 'const ${1:name} = signal(${2:initialValue});',
    kind: vscode.CompletionItemKind.Function,
    module: '@bquery/bquery/reactive',
  },
  {
    label: 'computed',
    detail: 'bQuery: Create a computed signal',
    documentation:
      "Creates a read-only signal derived from other signals.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: 'const ${1:name} = computed(() => ${2:expression});',
    kind: vscode.CompletionItemKind.Function,
    module: '@bquery/bquery/reactive',
  },
  {
    label: 'effect',
    detail: 'bQuery: Create a reactive effect',
    documentation:
      "Runs a function immediately and re-runs it whenever its signal dependencies change.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: ['effect(() => {', '  ${1:}', '});'].join('\n'),
    kind: vscode.CompletionItemKind.Function,
    module: '@bquery/bquery/reactive',
  },
  {
    label: 'batch',
    detail: 'bQuery: Batch signal updates',
    documentation:
      "Groups multiple signal updates to only trigger effects once.\n\n**Module:** `@bquery/bquery/reactive`",
    insertText: ['batch(() => {', '  ${1:}', '});'].join('\n'),
    kind: vscode.CompletionItemKind.Function,
    module: '@bquery/bquery/reactive',
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
    module: '@bquery/bquery/store',
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
    module: '@bquery/bquery/store',
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
        const lineText = document.lineAt(position).text;
        const textBeforeCursor = lineText.substring(0, position.character);

        // Don't provide completions inside strings or comments
        if (isInsideStringOrComment(textBeforeCursor)) {
          return [];
        }

        return BQ_API_COMPLETIONS.map((api) => {
          const item = new vscode.CompletionItem(api.label, api.kind);
          item.detail = api.detail;
          item.documentation = new vscode.MarkdownString(api.documentation);
          item.insertText = new vscode.SnippetString(api.insertText);
          item.sortText = `0_bq_${api.label}`;
          return item;
        });
      },
    }
  );

  context.subscriptions.push(provider);
}

/**
 * Basic heuristic to detect if cursor is inside a string literal or line comment.
 */
function isInsideStringOrComment(text: string): boolean {
  // Check for line comment
  const commentIndex = text.indexOf('//');
  if (commentIndex !== -1) {
    // Check the // isn't inside a string
    const beforeComment = text.substring(0, commentIndex);
    const singleQuotes = (beforeComment.match(/'/g) || []).length;
    const doubleQuotes = (beforeComment.match(/"/g) || []).length;
    const backticks = (beforeComment.match(/`/g) || []).length;
    if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0 && backticks % 2 === 0) {
      return true;
    }
  }

  // Check for unclosed string
  let inString: string | null = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === inString && text[i - 1] !== '\\') {
        inString = null;
      }
    } else if (ch === "'" || ch === '"' || ch === '`') {
      inString = ch;
    }
  }

  return inString !== null;
}
