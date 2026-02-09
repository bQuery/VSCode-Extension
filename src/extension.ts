import * as vscode from 'vscode';
import { registerHtmlCompletionProvider } from './htmlCompletionProvider';
import { registerTsCompletionProvider } from './tsCompletionProvider';

export function activate(context: vscode.ExtensionContext): void {
  registerHtmlCompletionProvider(context);
  registerTsCompletionProvider(context);
}

export function deactivate(): void {
  // nothing to dispose
}
