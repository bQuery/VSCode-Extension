import * as vscode from 'vscode';

/**
 * Directive metadata for bQuery view directives.
 */
interface DirectiveInfo {
  /** The attribute name (e.g. 'bq-text') */
  name: string;
  /** Human-readable description */
  description: string;
  /** Example usage */
  example: string;
  /** Whether the directive takes a modifier after ':' (e.g. bq-on:click) */
  hasModifier?: boolean;
  /** Placeholder name for the modifier (e.g. 'event' for bq-on, 'attr' for bq-bind) */
  modifierPlaceholder?: string;
}

const BQ_DIRECTIVES: DirectiveInfo[] = [
  {
    name: 'bq-text',
    description: 'Binds the text content of the element to a reactive expression.',
    example: '<p bq-text="count"></p>',
  },
  {
    name: 'bq-html',
    description: 'Binds the innerHTML of the element (sanitized by default).',
    example: '<div bq-html="content"></div>',
  },
  {
    name: 'bq-if',
    description: 'Conditionally renders the element based on a truthy expression.',
    example: '<div bq-if="count > 5">Count is high!</div>',
  },
  {
    name: 'bq-show',
    description: 'Toggles the element display style based on a truthy expression.',
    example: '<div bq-show="isVisible">Visible content</div>',
  },
  {
    name: 'bq-for',
    description: 'Renders the element for each item in a collection. Use "item in items" syntax.',
    example: '<li bq-for="item in items" bq-text="item"></li>',
  },
  {
    name: 'bq-model',
    description: 'Two-way data binding between a form element and a signal.',
    example: '<input bq-model="name" type="text" />',
  },
  {
    name: 'bq-on',
    description: 'Attaches an event listener. Use bq-on:event syntax (e.g. bq-on:click).',
    example: '<button bq-on:click="handleClick">Click</button>',
    hasModifier: true,
    modifierPlaceholder: 'event',
  },
  {
    name: 'bq-class',
    description: 'Conditionally applies CSS classes using an object expression.',
    example: '<div bq-class="{ active: isActive }"></div>',
  },
  {
    name: 'bq-style',
    description: 'Dynamically sets inline styles using an object expression.',
    example: '<div bq-style="{ color: textColor }"></div>',
  },
  {
    name: 'bq-bind',
    description: 'Binds an attribute value. Use bq-bind:attr syntax (e.g. bq-bind:href).',
    example: '<a bq-bind:href="url">Link</a>',
    hasModifier: true,
    modifierPlaceholder: 'attr',
  },
  {
    name: 'bq-ref',
    description: 'Stores a reference to the DOM element in the binding context.',
    example: '<div bq-ref="myElement"></div>',
  },
];

/**
 * Registers the HTML completion provider for bQuery view directives.
 */
export function registerHtmlCompletionProvider(context: vscode.ExtensionContext): void {
  const provider = vscode.languages.registerCompletionItemProvider(
    'html',
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ): vscode.CompletionItem[] {
        // Scan document text up to cursor for multi-line tag detection (limit to 500 lines for performance)
        const startLine = Math.max(0, position.line - 500);
        const textUpToCursor = document.getText(
          new vscode.Range(new vscode.Position(startLine, 0), position)
        );

        // Only provide completions when typing inside an HTML tag
        const insideTag = isInsideHtmlTag(textUpToCursor);
        if (!insideTag) {
          return [];
        }

        // Only offer completions when the attribute prefix looks like a bQuery directive
        const attrMatch = textUpToCursor.match(/[\s<]([^\s=<>"']*)$/);
        const attrPrefix = attrMatch ? attrMatch[1] : '';
        const lowerPrefix = attrPrefix.toLowerCase();
        if (lowerPrefix !== 'b' && lowerPrefix !== 'bq' && !lowerPrefix.startsWith('bq-')) {
          return [];
        }

        return BQ_DIRECTIVES.map((directive) => {
          const item = new vscode.CompletionItem(
            directive.name,
            vscode.CompletionItemKind.Property
          );
          item.detail = `bQuery directive`;
          item.documentation = new vscode.MarkdownString(
            `${directive.description}\n\n**Example:**\n\`\`\`html\n${directive.example}\n\`\`\``
          );

          if (directive.hasModifier) {
            const placeholder = directive.modifierPlaceholder || 'modifier';
            item.insertText = new vscode.SnippetString(`${directive.name}:\${1:${placeholder}}="\${2:handler}"`);
            item.command = {
              command: 'editor.action.triggerSuggest',
              title: 'Trigger Suggest',
            };
          } else {
            item.insertText = new vscode.SnippetString(`${directive.name}="\${1:}"`);
          }

          item.sortText = `0_${directive.name}`;
          return item;
        });
      },
    },
    'b', // trigger on 'b' character to catch "bq-" prefix
    '-'  // also trigger on '-' for "bq-"
  );

  context.subscriptions.push(provider);
}

/**
 * Checks if the cursor position is inside an HTML opening tag.
 */
function isInsideHtmlTag(textBeforeCursor: string): boolean {
  const lastOpenAngle = textBeforeCursor.lastIndexOf('<');
  const lastCloseAngle = textBeforeCursor.lastIndexOf('>');

  if (lastOpenAngle === -1 || lastOpenAngle <= lastCloseAngle) {
    return false;
  }

  const afterLastOpen = textBeforeCursor.slice(lastOpenAngle);

  // Exclude closing tags (e.g. </div) and HTML comments (e.g. <!-- comment)
  if (afterLastOpen.startsWith('</') || afterLastOpen.startsWith('<!--')) {
    return false;
  }

  return true;
}
