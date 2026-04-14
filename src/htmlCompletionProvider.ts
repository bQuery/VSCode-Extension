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

interface UiComponentInfo {
  /** The custom element tag name (e.g. 'bq-button') */
  name: string;
  /** Human-readable description */
  description: string;
  /** Example usage */
  example: string;
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

const BQ_UI_COMPONENTS: UiComponentInfo[] = [
  {
    name: 'bq-button',
    description: 'Accessible action button with variants, sizes, loading state, and icon slots.',
    example: '<bq-button variant="primary">Save changes</bq-button>',
  },
  {
    name: 'bq-icon-button',
    description: 'Compact icon-only action button with accessible label support.',
    example: '<bq-icon-button aria-label="Open settings" icon="settings"></bq-icon-button>',
  },
  {
    name: 'bq-input',
    description: 'Form input with labels, hints, validation, and prefix/suffix slots.',
    example: '<bq-input label="Email" type="email" placeholder="you@example.com"></bq-input>',
  },
  {
    name: 'bq-textarea',
    description: 'Multi-line text input with validation, rows, and hint support.',
    example: '<bq-textarea label="Message" rows="4"></bq-textarea>',
  },
  {
    name: 'bq-select',
    description: 'Native-style select component with placeholder and validation states.',
    example: '<bq-select label="Role"><option>Admin</option><option>Editor</option></bq-select>',
  },
  {
    name: 'bq-segmented-control',
    description: 'Single-choice segmented control with keyboard navigation and form semantics.',
    example: '<bq-segmented-control label="View"></bq-segmented-control>',
  },
  {
    name: 'bq-checkbox',
    description: 'Checkbox input with checked, indeterminate, and hint states.',
    example: '<bq-checkbox checked>Remember me</bq-checkbox>',
  },
  {
    name: 'bq-radio',
    description: 'Radio option component for mutually exclusive choices.',
    example: '<bq-radio name="plan" value="pro">Pro</bq-radio>',
  },
  {
    name: 'bq-switch',
    description: 'Toggle switch for settings and preference controls.',
    example: '<bq-switch checked>Enable notifications</bq-switch>',
  },
  {
    name: 'bq-slider',
    description: 'Range slider with min/max/step support and value display.',
    example: '<bq-slider min="0" max="100" value="50"></bq-slider>',
  },
  {
    name: 'bq-chip',
    description: 'Compact selectable or removable chip for filters and tags.',
    example: '<bq-chip removable>TypeScript</bq-chip>',
  },
  {
    name: 'bq-tabs',
    description: 'Tabs component for switching between related views.',
    example: '<bq-tabs></bq-tabs>',
  },
  {
    name: 'bq-accordion',
    description: 'Accordion disclosure component with keyboard support.',
    example: '<bq-accordion summary="Details">Content</bq-accordion>',
  },
  {
    name: 'bq-breadcrumbs',
    description: 'Hierarchical breadcrumb navigation component.',
    example: '<bq-breadcrumbs></bq-breadcrumbs>',
  },
  {
    name: 'bq-pagination',
    description: 'Pagination component with previous/next controls and ellipsis logic.',
    example: '<bq-pagination page="2" total-pages="10"></bq-pagination>',
  },
  {
    name: 'bq-card',
    description: 'Structured content surface with slots for header, body, and footer content.',
    example: '<bq-card><h3 slot="header">Overview</h3><p>Card content</p></bq-card>',
  },
  {
    name: 'bq-badge',
    description: 'Inline badge for statuses, counts, and labels.',
    example: '<bq-badge variant="success">Active</bq-badge>',
  },
  {
    name: 'bq-avatar',
    description: 'Avatar component with image, initials, and status support.',
    example: '<bq-avatar name="Ada Lovelace"></bq-avatar>',
  },
  {
    name: 'bq-table',
    description: 'Data table with sortable columns and loading or empty states.',
    example: '<bq-table></bq-table>',
  },
  {
    name: 'bq-divider',
    description: 'Horizontal or vertical divider with optional label.',
    example: '<bq-divider label="Details"></bq-divider>',
  },
  {
    name: 'bq-empty-state',
    description: 'Empty state component for no-data and no-results screens.',
    example: '<bq-empty-state title="No projects yet"></bq-empty-state>',
  },
  {
    name: 'bq-stat-card',
    description: 'Dashboard metric card with trend and loading support.',
    example: '<bq-stat-card label="Revenue" value="€12k"></bq-stat-card>',
  },
  {
    name: 'bq-alert',
    description: 'In-page alert with variants, optional title, and dismissible mode.',
    example: '<bq-alert variant="success" title="Saved">Changes have been saved.</bq-alert>',
  },
  {
    name: 'bq-progress',
    description: 'Determinate or indeterminate progress indicator.',
    example: '<bq-progress value="65" max="100"></bq-progress>',
  },
  {
    name: 'bq-spinner',
    description: 'Compact loading spinner with size and variant options.',
    example: '<bq-spinner size="md"></bq-spinner>',
  },
  {
    name: 'bq-skeleton',
    description: 'Skeleton loading placeholder with shimmer variants.',
    example: '<bq-skeleton variant="text"></bq-skeleton>',
  },
  {
    name: 'bq-tooltip',
    description: 'Tooltip for contextual helper text with placement control.',
    example: '<bq-tooltip content="More details"></bq-tooltip>',
  },
  {
    name: 'bq-toast',
    description: 'Toast notification component for transient feedback.',
    example: '<bq-toast open variant="success">Profile updated</bq-toast>',
  },
  {
    name: 'bq-dialog',
    description: 'Dialog overlay with focus management and escape handling.',
    example: '<bq-dialog open><p>Confirm action?</p></bq-dialog>',
  },
  {
    name: 'bq-drawer',
    description: 'Drawer overlay component for side panels and mobile flows.',
    example: '<bq-drawer open placement="end"></bq-drawer>',
  },
  {
    name: 'bq-dropdown-menu',
    description: 'Contextual dropdown menu with keyboard navigation.',
    example: '<bq-dropdown-menu></bq-dropdown-menu>',
  },
];

/**
 * Registers the HTML completion provider for bQuery view directives and `@bquery/ui` tag names.
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

        const tagNamePrefix = extractTagNamePrefix(textUpToCursor);
        if (tagNamePrefix) {
          const lowerTagPrefix = tagNamePrefix.toLowerCase();
          if (lowerTagPrefix === 'bq' || lowerTagPrefix.startsWith('bq-')) {
            return BQ_UI_COMPONENTS.map((component) => {
              const item = new vscode.CompletionItem(
                component.name,
                vscode.CompletionItemKind.Class
              );
              item.detail = 'bQuery UI component';
              item.documentation = new vscode.MarkdownString(
                `${component.description}\n\n**Example:**\n\`\`\`html\n${component.example}\n\`\`\``
              );
              item.insertText = component.name;
              item.sortText = `0_${component.name}`;
              return item;
            });
          }
        }

        // Only offer completions when the attribute prefix looks like a bQuery directive
        const attrPrefix = extractAttributePrefix(textUpToCursor);
        if (!attrPrefix) {
          return [];
        }

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
  // Check if we're inside an HTML comment (<!-- ... -->)
  const lastCommentOpen = textBeforeCursor.lastIndexOf('<!--');
  const lastCommentClose = textBeforeCursor.lastIndexOf('-->');
  if (lastCommentOpen !== -1 && lastCommentOpen > lastCommentClose) {
    return false;
  }

  const lastOpenAngle = textBeforeCursor.lastIndexOf('<');
  const lastCloseAngle = textBeforeCursor.lastIndexOf('>');

  if (lastOpenAngle === -1 || lastOpenAngle <= lastCloseAngle) {
    return false;
  }

  const afterLastOpen = textBeforeCursor.slice(lastOpenAngle);

  // Exclude closing tags (e.g. </div)
  if (afterLastOpen.startsWith('</')) {
    return false;
  }

  return true;
}

function extractTagNamePrefix(textBeforeCursor: string): string | null {
  const tagMatch = textBeforeCursor.match(/<([^\s/>]*)$/);
  return tagMatch ? tagMatch[1] : null;
}

function extractAttributePrefix(textBeforeCursor: string): string {
  const attrMatch = textBeforeCursor.match(/[\s<]([^\s=<>"']*)$/);
  return attrMatch ? attrMatch[1] : '';
}
