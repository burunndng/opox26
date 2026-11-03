import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Static regression guard for the AGENTS.md dialog convention:
 * every overlay using `fixed inset-0 z-50` must implement the real-dialog
 * contract — role="dialog", aria-modal="true", and a useFocusTrap hook —
 * so a new modal can no longer ship without a focus trap or screen-reader
 * semantics (the regression that held for ItemBank / ErrorRepairStudio
 * overlays before the 2026-11 hardening).
 */
const componentsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/components',
);

describe('Modal a11y: every fixed overlay implements the dialog contract', () => {
  const overlayFiles = readdirSync(componentsDir)
    .filter((name) => name.endsWith('.tsx'))
    .filter((name) =>
      readFileSync(path.join(componentsDir, name), 'utf8').includes('fixed inset-0 z-50'),
    );

  test('at least one overlay exists to guard (sanity: fixture not empty)', () => {
    assert.ok(overlayFiles.length >= 8, `expected >= 8 overlay files, found ${overlayFiles.length}`);
    console.log(`overlay files: ${overlayFiles.sort().join(', ')}`);
  });

  for (const file of overlayFiles) {
    const source = readFileSync(path.join(componentsDir, file), 'utf8');

    test(`${file}: declares role="dialog"`, () => {
      assert.match(source, /role="dialog"/);
    });

    test(`${file}: declares aria-modal="true"`, () => {
      assert.match(source, /aria-modal="true"/);
    });

    test(`${file}: wires useFocusTrap`, () => {
      assert.match(source, /useFocusTrap\(/);
    });
  }
});
