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
      "Tagged template literal for component rendering. Sanitizes interpolated values.\n\n**Module:** `@bquery/bquery/component`",
    insertText: 'html`${1:template}`',
    kind: vscode.CompletionItemKind.Function,
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
      "Creates a reusable template that can be mounted multiple times.\n\n**Module:** `@bquery/bquery/view`",
    insertText: "const template = createTemplate('${1:template-id}');",
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
        // Use document text from start to cursor for multi-line context detection
        const textUpToCursor = document.getText(
          new vscode.Range(new vscode.Position(0, 0), position)
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
  let inTemplateLiteral = false;
  let templateDepth = 0;

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
      if (ch === inString && text[i - 1] !== '\\') {
        inString = null;
      }
      continue;
    }

    if (inTemplateLiteral) {
      if (ch === '\\') {
        i++; // skip escaped character
        continue;
      }
      if (ch === '$' && next === '{') {
        templateDepth++;
        i++; // skip '{'
        continue;
      }
      if (ch === '`') {
        inTemplateLiteral = false;
        continue;
      }
      if (templateDepth === 0) {
        // Inside template text (not in ${...}), skip
        continue;
      }
      // Inside ${...} expression — process normally
      if (ch === '{') {
        templateDepth++;
        continue;
      }
      if (ch === '}') {
        templateDepth = Math.max(0, templateDepth - 1);
        continue;
      }
    }

    // Line comment (not inside a string)
    if (ch === '/' && next === '/') {
      return true;
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
      inTemplateLiteral = true;
      templateDepth = 0;
      continue;
    }
  }

  return inString !== null || inBlockComment || (inTemplateLiteral && templateDepth === 0);
}
