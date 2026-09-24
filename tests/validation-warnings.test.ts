import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../server/seedData.ts';
import { seedItemsRetrieval } from '../server/seedDataRetrieval.ts';
import { buildValidationWarnings } from '../server/validationWarnings.ts';

const validMcq = seedItems.find((item) => item.id === 'item-mcq-1')!;

describe('Complete item-bank validation warnings', () => {
  test('V1: includes pedagogical diagnostics from the learning-design audit', () => {
    const correctText = validMcq.options!.find((option) => option.is_correct)!.text;
    const item = {
      ...validMcq,
      id: 'validation-warning-answer-leak',
      stem: `La respuesta que se debe recordar es: ${correctText}`,
    };

    const warnings = buildValidationWarnings([item]);

    assert.ok(
      warnings.some((warning) => warning.item_id === item.id && warning.rule === 'answer_in_stem'),
      'expected the pedagogical answer-in-stem diagnostic',
    );
  });

  test('V2: equivalent inline and pedagogical checks are returned once per item and rule', () => {
    const item = { ...validMcq, id: 'validation-warning-no-basis', legal_basis: ' ' };

    const warnings = buildValidationWarnings([item]);
    const matchingWarnings = warnings.filter(
      (warning) =>
        warning.item_id === item.id &&
        (warning.rule === 'missing_legal_basis' || warning.rule === 'legal_basis_required'),
    );

    assert.equal(matchingWarnings.length, 1);
  });

  test('V3: estimated figures produce a non-critical warning', () => {
    const item = { ...validMcq, id: 'validation-warning-estimated-figure', figure_status: 'ESTIMATED_LPGE' as const };

    const warnings = buildValidationWarnings([item]);
    const warning = warnings.find((entry) => entry.item_id === item.id && entry.rule === 'estimated_figure');

    assert.ok(warning, 'expected an estimated-figure warning');
    assert.notEqual(warning.severity, 'critical');
  });

  test('V4: the complete seed bank has no critical validation warnings', () => {
    const warnings = buildValidationWarnings([...seedItems, ...seedItemsRetrieval]);
    const criticalWarnings = warnings.filter((warning) => warning.severity === 'critical');

    assert.deepEqual(
      criticalWarnings.map((warning) => `${warning.item_id}:${warning.rule}`),
      [],
      `Critical seed warnings: ${criticalWarnings.map((warning) => `${warning.item_id}:${warning.rule}`).join(', ')}`,
    );
  });
});
