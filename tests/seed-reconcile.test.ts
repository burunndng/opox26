import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isolateDataDir } from './helpers/isolation.ts';
import { seedItems } from '../server/seedData.ts';

const isolatedRoot = isolateDataDir();
const fixture = fileURLToPath(new URL('./fixtures/seed-reconcile-probe.ts', import.meta.url));
const STATE_MARKER = '###SEED_STATE###';

interface CitationContent {
  legal_basis: string | null;
  rule_statement: string | null;
  why_correct: string | null;
  corrective_rule: string | null;
  explanation: string | null;
}

interface AtomContent {
  text: string | null;
  legal_basis: string | null;
}

interface SeedState {
  seedCount: number;
  eligibleCount: number;
  draftIds: string[];
  targetStatus: string | null;
  targetFigureStatus: string | null;
  targetAttemptCount: number;
  targetContent: CitationContent | null;
  seedContent: CitationContent | null;
  targetFormatData: { field: string; value: unknown } | null;
  seedFormatData: { field: string; value: unknown } | null;
  targetAtom: AtomContent | null;
  seedAtom: AtomContent | null;
}

function freshCaseDir(name: string): string {
  const dir = path.join(isolatedRoot, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function runProbe(dir: string, mode: string, itemId?: string): SeedState {
  const args = ['--import', 'tsx', fixture, mode];
  if (itemId) args.push(itemId);
  const stdout = execFileSync(process.execPath, args, {
    env: { ...process.env, OPOSILAB_DATA_DIR: dir, OPOSILAB_OFFLINE: '1' },
    encoding: 'utf-8',
  });
  const markerIndex = stdout.lastIndexOf(STATE_MARKER);
  assert.notEqual(markerIndex, -1, `probe did not report state. stdout:\n${stdout}`);
  return JSON.parse(stdout.slice(markerIndex + STATE_MARKER.length).trim()) as SeedState;
}

describe('Boot reconciliation for untouched seed items (isolated)', () => {
  after(() => fs.rmSync(isolatedRoot, { recursive: true, force: true }));

  test('R1: fresh database seeds 299 practice-eligible items and no drafts', () => {
    const state = runProbe(freshCaseDir('fresh'), 'snapshot');
    // 113 core items + 49 Tema 3 (afiliación e inscripción) items + 70 Tema 8 (incapacidad temporal) items
    // + 61 Tema 15 (acto administrativo) items + 6 retrieval/pretest items.
    assert.equal(state.seedCount, 299, '113 core items plus 49 Tema 3 items plus 70 Tema 8 items plus 61 Tema 15 items plus 6 retrieval/pretest items are seeded');
    assert.equal(state.eligibleCount, 299);
    assert.deepEqual(state.draftIds, []);
  });

  test('R2: boot promotes an untouched draft and syncs its figure metadata', () => {
    const dir = freshCaseDir('untouched');
    runProbe(dir, 'set-draft', 'item-retr-1');

    const state = runProbe(dir, 'snapshot', 'item-retr-1');
    assert.equal(state.targetStatus, 'validated');
    assert.equal(state.targetFigureStatus, null);
    assert.equal(state.targetAttemptCount, 0);
  });

  test('R3: boot preserves status and figure metadata for a seed with an attempt', () => {
    const dir = freshCaseDir('attempted');
    runProbe(dir, 'set-draft-with-attempt', 'item-retr-2');

    const state = runProbe(dir, 'snapshot', 'item-retr-2');
    assert.equal(state.targetStatus, 'draft');
    assert.equal(state.targetFigureStatus, 'ESTIMATED_LPGE');
    assert.equal(state.targetAttemptCount, 1);
  });

  test('R4: reconciliation is idempotent on the following boot', () => {
    const dir = freshCaseDir('idempotent');
    runProbe(dir, 'set-draft', 'item-retr-3');

    const reconciled = runProbe(dir, 'snapshot', 'item-retr-3');
    const secondBoot = runProbe(dir, 'snapshot', 'item-retr-3');
    assert.equal(reconciled.targetStatus, 'validated');
    assert.deepEqual(secondBoot, reconciled);
  });

  test('R5: boot restores citation content on an unattempted seed (nested explanation included)', () => {
    const dir = freshCaseDir('stale-citation');
    runProbe(dir, 'set-stale-citation', 'item-spot-9');

    const state = runProbe(dir, 'snapshot', 'item-spot-9');
    assert.equal(state.targetAttemptCount, 0);
    assert.deepEqual(state.targetContent, state.seedContent);
    assert.equal(state.targetContent?.legal_basis, 'D.T. 39.ª TRLGSS');
    assert.equal(state.targetContent?.explanation, 'El tope legal mensual para 2026 asciende exactamente a 3.359,60 € (D.T. 39.ª TRLGSS).');
  });

  test('R6: boot preserves stale citation content for a seed with an attempt', () => {
    const dir = freshCaseDir('stale-citation-attempted');
    runProbe(dir, 'set-stale-citation-with-attempt', 'item-cloze-12');

    const state = runProbe(dir, 'snapshot', 'item-cloze-12');
    assert.equal(state.targetAttemptCount, 1);
    assert.equal(state.targetContent?.legal_basis, 'Art. 000 STALE');
    assert.equal(state.targetContent?.rule_statement, 'STALE rule');
    assert.equal(state.targetContent?.explanation, 'STALE explanation');
    assert.notDeepEqual(state.targetContent, state.seedContent);
  });

  test('R7: boot restores cloze citation content on an unattempted seed', () => {
    const dir = freshCaseDir('stale-cloze');
    runProbe(dir, 'set-stale-citation', 'item-cloze-12');

    const state = runProbe(dir, 'snapshot', 'item-cloze-12');
    assert.equal(state.targetAttemptCount, 0);
    assert.deepEqual(state.targetContent, state.seedContent);
    assert.equal(state.targetContent?.explanation, 'El valor exacto según los arts. 364 y 370 TRLGSS es 8.803,20 €.');
  });

  test('R8: boot restores stale citation content on a seed atom', () => {
    const dir = freshCaseDir('stale-atom');
    runProbe(dir, 'set-stale-atom', 'atom-14');

    const state = runProbe(dir, 'snapshot', 'atom-14');
    assert.deepEqual(state.targetAtom, state.seedAtom);
    assert.equal(state.targetAtom?.legal_basis, 'Arts. 364 y 370 TRLGSS');
    assert.ok(state.targetAtom?.text?.includes('8.803,20'));
  });

  test('R9: boot restores nested format data (number_sort values) on an unattempted seed', () => {
    const dir = freshCaseDir('stale-format-data');
    runProbe(dir, 'set-stale-format-data', 'item-numsort-7');

    const state = runProbe(dir, 'snapshot', 'item-numsort-7');
    assert.equal(state.targetAttemptCount, 0);
    assert.equal(state.targetFormatData?.field, 'number_sort_data');
    assert.deepEqual(state.targetFormatData, state.seedFormatData);
    const row = (state.targetFormatData?.value as any).items.find((r: any) => r.id === '4');
    assert.equal(row.correct_value, '1 mes (último día hábil del mes siguiente)');
  });

  test('R9b: boot restores stale MCQ options on an unattempted seed', () => {
    const dir = freshCaseDir('stale-options');
    runProbe(dir, 'set-stale-format-data', 'item-mcq-5');

    const state = runProbe(dir, 'snapshot', 'item-mcq-5');
    assert.equal(state.targetAttemptCount, 0);
    assert.deepEqual(state.targetFormatData, state.seedFormatData);
    const options = (state.targetFormatData?.value as any[]).filter((o) => o.is_correct);
    assert.equal(options.length, 1);
    assert.ok(/jubilación contributiva/i.test(options[0].text));
  });

  test('R10: boot preserves nested format data for a seed with an attempt', () => {
    const dir = freshCaseDir('stale-format-data-attempted');
    runProbe(dir, 'set-stale-format-data-with-attempt', 'item-numsort-7');

    const state = runProbe(dir, 'snapshot', 'item-numsort-7');
    assert.equal(state.targetAttemptCount, 1);
    assert.notDeepEqual(state.targetFormatData, state.seedFormatData);
  });
});

describe('Audited seed content stays corrected (bank-vs-PDF audit)', () => {
  const find = (id: string) => {
    const item = seedItems.find((candidate) => candidate.id === id);
    assert.ok(item, `missing seed ${id}`);
    return item as any;
  };

  test('R11: imprescriptibilidad is art. 212/230 and excludes incapacidad permanente', () => {
    const cloze = find('item-cloze-4');
    assert.equal(cloze.legal_basis, 'Arts. 212 y 230 TRLGSS');
    assert.equal(cloze.cloze_data.blanks[1].correct_answer, 'muerte y supervivencia');
    assert.ok(!cloze.cloze_data.template_text.includes('incapacidad permanente'));

    const tree = find('item-tree-4');
    const leaf = tree.exception_tree_data.root_rule.children.find(
      (node: any) => node.id === 'leaf_imprescriptible'
    );
    assert.equal(leaf.legal_basis, 'Art. 212 TRLGSS');
    assert.ok(!leaf.label.includes('incapacidad permanente'));
    assert.ok(
      tree.exception_tree_data.test_cases.some(
        (testCase: any) =>
          testCase.correct_leaf_id === 'leaf_prescripcion_general' &&
          testCase.scenario.includes('incapacidad permanente')
      ),
      'the IP-vs-jubilación distinction must be exercised by a test case'
    );
  });

  test('R12: anticipo cap is attributed to art. 167 TRLGSS, not FOGASA/art. 33 ET', () => {
    const item = find('item-numsort-9');
    assert.ok(!/Art\. 33 ET/.test(item.legal_basis));
    assert.ok(/167/.test(item.legal_basis));
    const row = item.number_sort_data.items.find((r: any) => r.id === '2');
    assert.equal(row.correct_value, '2,5 veces IPREM');
    assert.ok(!/FOGASA/i.test(row.concept));
    assert.ok(/salariales/i.test(item.number_sort_data.items[0].concept));
  });

  test('R13: capital coste deadline follows art. 70 RGRC (not 30 days)', () => {
    const item = find('item-numsort-7');
    const row = item.number_sort_data.items.find((r: any) => r.id === '4');
    assert.equal(row.correct_value, '1 mes (último día hábil del mes siguiente)');
    assert.ok(/1415\/2004/.test(item.legal_basis));
  });

  test('R14: IT duration figures cite arts. 170/174 instead of art. 169', () => {
    const numsort = find('item-numsort-5');
    assert.equal(numsort.legal_basis, 'Arts. 170.1, 170.2 y 174.2 TRLGSS');
    const cloze = find('item-cloze-20');
    assert.equal(cloze.legal_basis, 'Arts. 170.1 y 170.2 TRLGSS');
    const contrast = find('item-contrast-13');
    assert.ok(!/Art\. 169/.test(contrast.legal_basis));
  });

  test('R15: art. 178 age bands are stated with the statutory boundaries', () => {
    const numsort = find('item-numsort-6');
    const concepts = numsort.number_sort_data.items.map((r: any) => r.concept);
    assert.ok(concepts.some((c: string) => c.includes('de 21 a menos de 26 años')));
    assert.ok(concepts.some((c: string) => c.includes('de 26 años o más')));
    assert.ok(!concepts.some((c: string) => c.includes('> 26')));

    const tree = find('item-tree-6');
    const labels = tree.exception_tree_data.root_rule.children.map((node: any) => node.label);
    assert.ok(labels.includes('26 años o más'));
    assert.ok(!labels.includes('Mayor de 26 años'));
  });

  test('R16: no item asserts incapacidad permanente is imprescriptible', () => {
    // spot_error items deliberately carry the false claim in full_statement (the
    // planted error), so only their corrected_text/explanation are asserted truth.
    const assertedText = (seed: any): string => {
      const parts: string[] = [
        seed.why_correct ?? '',
        seed.rule_statement ?? '',
        seed.corrective_rule ?? '',
      ];
      for (const option of seed.options ?? []) {
        if (option.is_correct) parts.push(option.text, option.explanation ?? '');
      }
      if (seed.cloze_data) {
        parts.push(seed.cloze_data.template_text);
        for (const blank of seed.cloze_data.blanks ?? []) {
          parts.push(blank.correct_answer, blank.explanation ?? '');
        }
      }
      const spot = seed.spot_error_data;
      if (spot) parts.push(spot.corrected_text, spot.explanation ?? '');
      for (const row of seed.contrast_data?.rows ?? []) {
        parts.push(row.concept_a_val, row.concept_b_val);
      }
      for (const row of seed.number_sort_data?.items ?? []) {
        parts.push(row.concept, row.correct_value);
      }
      const root = seed.exception_tree_data?.root_rule;
      if (root) {
        parts.push(root.rule_text ?? '');
        const walk = (nodes: any[]): void => {
          for (const node of nodes ?? []) {
            parts.push(node.label ?? '', node.rule_text ?? '');
            walk(node.children);
          }
        };
        walk(root.children);
        for (const testCase of seed.exception_tree_data.test_cases ?? []) {
          parts.push(testCase.explanation ?? '');
        }
      }
      for (const tier of ['tier1', 'tier2']) {
        for (const option of seed.two_tier_data?.[tier]?.options ?? []) {
          if (option.is_correct) parts.push(option.text);
        }
      }
      const variant = seed.fact_variant_data;
      if (variant) {
        parts.push(variant.base_case?.correct_outcome ?? '', variant.base_case?.legal_rule ?? '');
        for (const v of variant.variants ?? []) {
          parts.push(v.correct_outcome ?? '', v.explanation ?? '');
        }
      }
      return parts.join(' | ');
    };

    const offenders: string[] = [];
    for (const seed of seedItems as any[]) {
      const text = assertedText(seed);
      if (!/imprescriptible|imprescriptibilidad/i.test(text)) continue;
      for (const sentence of text.split(/\s*[.;|]\s*/)) {
        if (!/incapacidad permanente/i.test(sentence)) continue;
        // Denials of imprescriptibility for IP are stated in several equivalent ways
        // ("no es imprescriptible", "prescribe a los cinco años", "queda sometida a...").
        const denies = /\bno\b|nunca|salvo|excepto|en cambio|prescribe|sujeta|sometida|queda/i.test(
          sentence
        );
        if (denies) continue;
        offenders.push(`${seed.id}: ${sentence.slice(0, 140)}`);
      }
    }
    assert.deepEqual(offenders, [], `items still asserting IP imprescriptible:\n${offenders.join('\n')}`);
  });

  test('R17: imprescriptible benefits are cited to arts. 212/230, never art. 53.3', () => {
    for (const seed of seedItems as any[]) {
      assert.ok(
        !/Art\. 53\.3/.test(seed.legal_basis ?? ''),
        `${seed.id} still cites Art. 53.3 TRLGSS`
      );
    }
  });
});
