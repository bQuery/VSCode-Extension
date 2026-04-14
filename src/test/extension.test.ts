import * as assert from 'assert';
import * as vscode from 'vscode';

function getCompletionLabel(item: vscode.CompletionItem): string {
  return typeof item.label === 'string' ? item.label : item.label.label;
}

function getCompletionRange(item: vscode.CompletionItem): vscode.Range {
  if (item.range instanceof vscode.Range) {
    return item.range;
  }

  if (item.range && typeof item.range === 'object') {
    const insertReplaceRange = item.range as { inserting?: vscode.Range; replacing?: vscode.Range };
    if (insertReplaceRange.replacing instanceof vscode.Range) {
      return insertReplaceRange.replacing;
    }
    if (insertReplaceRange.inserting instanceof vscode.Range) {
      return insertReplaceRange.inserting;
    }
  }

  assert.fail('Completion item should include a range');
}

function getCompletionSnippet(item: vscode.CompletionItem): vscode.SnippetString {
  if (item.insertText instanceof vscode.SnippetString) {
    return item.insertText;
  }

  if (typeof item.insertText === 'string') {
    return new vscode.SnippetString(item.insertText);
  }

  if (item.insertText && typeof item.insertText === 'object' && 'value' in item.insertText) {
    const value = (item.insertText as { value?: unknown }).value;
    if (typeof value === 'string') {
      return new vscode.SnippetString(value);
    }
  }

  assert.fail('Completion item should include snippet insert text');
}

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
    assert.ok(Array.isArray(snippets), 'Snippets should be an array');
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

  test('HTML completion provider should provide @bquery/ui component tags in tag-name context', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'html',
      content: '<bq',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');

    const labels = new Set(
      completions.items.map((item) =>
        typeof item.label === 'string' ? item.label : item.label.label
      )
    );

    assert.ok(labels.has('bq-button'), 'Should include the bq-button component');
    assert.ok(labels.has('bq-input'), 'Should include the bq-input component');
    assert.ok(labels.has('bq-dialog'), 'Should include the bq-dialog component');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('HTML completion provider should not provide @bquery/ui component tags for plain <b prefixes', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'html',
      content: '<b',
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(0, doc.lineAt(0).text.length);

    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      doc.uri,
      position
    );

    assert.ok(completions, 'Should return completions');

    const bQueryComponentLabels = new Set(
      completions.items
        .filter((item) => item.detail === 'bQuery UI component')
        .map((item) =>
          typeof item.label === 'string' ? item.label : item.label.label
        )
    );
    const bQueryDirectiveLabels = new Set(
      completions.items
        .filter((item) => item.detail === 'bQuery directive')
        .map((item) =>
          typeof item.label === 'string' ? item.label : item.label.label
        )
    );

    assert.ok(!bQueryComponentLabels.has('bq-button'), 'Should not include bq-button for plain <b prefixes');
    assert.ok(!bQueryComponentLabels.has('bq-input'), 'Should not include bq-input for plain <b prefixes');
    assert.ok(!bQueryComponentLabels.has('bq-dialog'), 'Should not include bq-dialog for plain <b prefixes');
    assert.strictEqual(
      bQueryDirectiveLabels.size,
      0,
      'Should not include bQuery directive completions while typing an HTML tag name'
    );

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
    assert.ok(
      bqItems.some((item) => item.filterText?.startsWith('bq')),
      'Should set filterText so bq-prefixed suggestions remain visible'
    );

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should include the bool helper for component templates', async () => {
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
    const boolItem = completions.items.find((item) =>
      typeof item.label === 'string' ? item.label === 'bool' : item.label.label === 'bool'
    );
    assert.ok(boolItem, 'Should include the bool helper completion');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should include key bQuery 1.9.0 ecosystem API completions', async () => {
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

    const labels = new Set(
      bqItems.map((item) =>
        typeof item.label === 'string' ? item.label : item.label.label
      )
    );

    assert.ok(labels.has('useSignal'), 'Should include the useSignal completion');
    assert.ok(labels.has('useComputed'), 'Should include the useComputed completion');
    assert.ok(labels.has('useEffect'), 'Should include the useEffect completion');
    assert.ok(labels.has('useRoute'), 'Should include the useRoute completion');
    assert.ok(labels.has('registerBqLink'), 'Should include the registerBqLink completion');
    assert.ok(labels.has('interceptLinks'), 'Should include the interceptLinks completion');
    assert.ok(labels.has('sanitize'), 'Should include the sanitize completion');
    assert.ok(labels.has('storage'), 'Should include the storage completion');
    assert.ok(labels.has('notifications'), 'Should include the notifications completion');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('TS completion provider should insert literal $ characters for $ and $$ selector completions', async () => {
    const assertSelectorCompletionInsertion = async (
      label: string,
      expectedText: string
    ): Promise<void> => {
      const doc = await vscode.workspace.openTextDocument({
        language: 'typescript',
        content: 'bq',
      });
      try {
        const editor = await vscode.window.showTextDocument(doc);
        const position = new vscode.Position(0, 2);

        const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
          'vscode.executeCompletionItemProvider',
          doc.uri,
          position
        );

        assert.ok(completions, 'Should return completions');
        const completion = completions.items.find((item) => getCompletionLabel(item) === label);
        if (!completion) {
          assert.fail(`Should include the ${label} completion`);
        }

        const didInsert = await editor.insertSnippet(
          getCompletionSnippet(completion),
          getCompletionRange(completion)
        );

        assert.ok(didInsert, `Should apply the ${label} completion`);
        assert.strictEqual(
          doc.getText(),
          expectedText,
          `Should insert literal ${label} selector text`
        );
      } finally {
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
      }
    };

    await assertSelectorCompletionInsertion('$', "$('selector')");
    await assertSelectorCompletionInsertion('$$', "$$('selector')");
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

  test('TS completion provider should not treat quotes after even backslashes as escaped', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: String.raw`const value = "a\\"
bq`,
    });
    await vscode.window.showTextDocument(doc);
    const position = new vscode.Position(1, doc.lineAt(1).text.length);

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
    assert.ok(
      bqItems.length > 0,
      'Should include bQuery completions after a string closed by an even number of backslashes'
    );

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

  test('TS completion provider should suppress completions inside nested template literal text', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'typescript',
      content: 'const s = `value: ${`bq',
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
    assert.strictEqual(
      bqItems.length,
      0,
      'Should not include bQuery completions inside nested template literal text'
    );

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });
});
