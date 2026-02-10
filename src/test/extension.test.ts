import * as assert from 'assert';
import * as vscode from 'vscode';

suite('bQuery Extension Test Suite', () => {
  test('Extension should be present', () => {
    const extension = vscode.extensions.getExtension('bquery.bquery');
    assert.ok(extension, 'Extension should be available');
  });

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('bquery.bquery');
    if (extension && !extension.isActive) {
      await extension.activate();
    }
    assert.ok(extension?.isActive, 'Extension should be active');
  });

  test('Snippets should be registered for TypeScript', () => {
    const extension = vscode.extensions.getExtension('bquery.bquery');
    assert.ok(extension);
    const snippets = extension.packageJSON.contributes?.snippets;
    assert.ok(Array.isArray(snippets), 'Snippets should be an array');
    const tsSnippet = snippets.find(
      (s: { language: string }) => s.language === 'typescript'
    );
    assert.ok(tsSnippet, 'Should have TypeScript snippets');
  });

  test('Snippets should be registered for HTML', () => {
    const extension = vscode.extensions.getExtension('bquery.bquery');
    assert.ok(extension);
    const snippets = extension.packageJSON.contributes?.snippets;
    const htmlSnippet = snippets.find(
      (s: { language: string }) => s.language === 'html'
    );
    assert.ok(htmlSnippet, 'Should have HTML snippets');
  });

  test('HTML completion provider should provide bq directives', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'html',
      content: '<div b',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, 6);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    // Check that at least some bq- directives are present
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.label.startsWith('bq-')
        : item.label.label.startsWith('bq-')
    );
    assert.ok(bqItems.length > 0, 'Should include bq-* directive completions');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('HTML completion provider should not provide bq directives inside closing tags', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'html',
      content: '</div b',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.label.startsWith('bq-')
        : item.label.label.startsWith('bq-')
    );
    assert.strictEqual(bqItems.length, 0, 'Should not include bq-* directives inside closing tags');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('HTML completion provider should not provide bq directives inside HTML comments', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'html',
      content: '<!-- <div b',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.label.startsWith('bq-')
        : item.label.label.startsWith('bq-')
    );
    assert.strictEqual(bqItems.length, 0, 'Should not include bq-* directives inside HTML comments');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('HTML completion provider should not provide bq directives in plain text outside tags', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'html',
      content: 'some text bq',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.label.startsWith('bq-')
        : item.label.label.startsWith('bq-')
    );
    assert.strictEqual(bqItems.length, 0, 'Should not include bq-* directives outside of tags');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should provide bQuery API completions when bq prefix is typed', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: 'bq',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, 2);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.detail?.startsWith('bQuery:')
        : false
    );
    assert.ok(bqItems.length > 0, 'Should include bQuery API completions');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should not provide completions inside strings', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: "const x = 'bq",
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.detail?.startsWith('bQuery:')
        : false
    );
    assert.strictEqual(bqItems.length, 0, 'Should not include bQuery completions inside strings');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should not provide completions inside line comments', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: '// bq',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.detail?.startsWith('bQuery:')
        : false
    );
    assert.strictEqual(bqItems.length, 0, 'Should not include bQuery completions inside line comments');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should not provide completions inside block comments', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: '/* bq',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.detail?.startsWith('bQuery:')
        : false
    );
    assert.strictEqual(bqItems.length, 0, 'Should not include bQuery completions inside block comments');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should provide completions after a line comment on a previous line', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: '// comment\nconst x = 1;\nbq',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(2, doc.lineAt(2).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.detail?.startsWith('bQuery:')
        : false
    );
    assert.ok(bqItems.length > 0, 'Should include bQuery completions after a line comment on a previous line');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should suppress completions inside template literal text', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: 'const s = `bq',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.detail?.startsWith('bQuery:')
        : false
    );
    assert.strictEqual(bqItems.length, 0, 'Should not include bQuery completions inside template literal text');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should provide completions inside template expression', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: 'const s = `value: ${bq',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');
    const bqItems = completions.items.filter((item) =>
      typeof item.label === 'string'
        ? item.detail?.startsWith('bQuery:')
        : false
    );
    assert.ok(bqItems.length > 0, 'Should include bQuery completions inside template expressions');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });
});
