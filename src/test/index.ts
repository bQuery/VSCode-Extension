import * as path from 'path';
import * as fs from 'fs/promises';
import Mocha from 'mocha';

async function collectTestFiles(rootDir: string, currentDir = '.'): Promise<string[]> {
  const dirPath = path.resolve(rootDir, currentDir);
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relativePath = currentDir === '.' ? entry.name : path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      const nestedFiles = await collectTestFiles(rootDir, relativePath);
      files.push(...nestedFiles);
    } else if (entry.isFile() && relativePath.endsWith('.test.js')) {
      files.push(relativePath);
    }
  }

  return files;
}

export async function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', color: true });
  const testsRoot = path.resolve(__dirname, '.');

  const files = await collectTestFiles(testsRoot);

  files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

  return new Promise<void>((resolve, reject) => {
    mocha.run((failures: number) => {
      if (failures > 0) {
        reject(new Error(`${failures} tests failed.`));
      } else {
        resolve();
      }
    });
  });
}
