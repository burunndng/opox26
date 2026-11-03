import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Static regression guard for form-label association (a11y): every form field
 * (<input>, <select>, <textarea>) in UI code must have an accessible name by
 * one of the four valid w3 mechanisms:
 *   1. aria-label / aria-labelledby on the control
 *   2. id referenced by a <label htmlFor=...> in the same file
 *   3. implicit association: the control is nested inside <label>...</label>
 *
 * The implicit check uses a lastIndexOf heuristic: a field is inside a label
 * when the last <label opening before the field has no closing </label>
 * between them. Fields with dynamic label text (e.g. aria-label={expr})
 * still carry the attribute and therefore pass mechanism 1.
 */
const roots = [
  path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/components'),
  path.join(path.dirname(fileURLToPath(import.meta.url)), '../src'),
];

describe('Form controls have an accessible name', () => {
  const files = new Set<string>();
  for (const root of roots) {
    for (const name of readdirSync(root)) {
      if (name.endsWith('.tsx') || (name.endsWith('.ts') && name === 'App.tsx')) {
        files.add(path.join(root, name));
      }
    }
  }

  test('at least some form fields exist to guard (sanity: fixture not empty)', () => {
    assert.ok(files.size >= 15, `expected >= 15 scanned files, found ${files.size}`);
  });

  for (const file of files) {
    let text = readFileSync(file, 'utf8');
    // JSX comment blocks may mention elements in prose ("the <select> on each
    // row is the keyboard alternative"); they never render, so strip them.
    text = text.replace(/\{\/\*[\s\S]*?\*\//g, '');
    const htmlForIds = new Set([...text.matchAll(/htmlFor="([^"]+)"/g)].map((m) => m[1]));

    for (const match of text.matchAll(/<(input|select|textarea)\b/g)) {
      const idx = match.index;
      const lineNo = (text.slice(0, idx).match(/\n/g) || []).length + 1;
      const rel = path.relative(process.cwd(), file);

      test(`${rel}:${lineNo} <${match[1]}> has label association or aria-label`, () => {
        const nextTag = text.slice(idx + 4).search(/<\/?[a-zA-Z][\w.-]*[\s/>]/);
        const block = text.slice(idx, nextTag > 0 ? idx + 4 + nextTag : text.length);

        if (block.includes('aria-label') || block.includes('aria-labelledby')) return;
        const idMatch = block.match(/\bid="?([^"{}]+)"?/);
        if (idMatch && htmlForIds.has(idMatch[1])) return;

        const labelOpen = text.slice(0, idx).lastIndexOf('<label');
        const labelClose = text.slice(0, idx).lastIndexOf('</label>');
        if (labelOpen !== -1 && (labelClose === -1 || labelClose < labelOpen)) return;

        const snippet = block.slice(0, 80).replace(/\s+/g, ' ');
        assert.fail(`unlabeled form field: ${snippet}`);
      });
    }
  }
});
