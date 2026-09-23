/**
 * Phase C tests — retrieval-first micro-lesson keyword matching (spec §9.2).
 * Pure functions only; no DOM, no DB.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { atomKeywords, matchAtomsToAnswer, normalizeEs } from '../src/utils/retrievalMatch.ts';
import { Atom } from '../src/types.ts';

function atom(id: string, text: string): Atom {
  return {
    id,
    topic_id: 'topic_seguridad_social_tema_7',
    text,
    status: 'validated',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  };
}

describe('Phase C: Retrieval keyword matching', () => {
  test('C11. normalizeEs folds accents, case and whitespace', () => {
    assert.equal(normalizeEs('  PRESCRIPCIÓN   Automática '), 'prescripcion automatica');
    assert.equal(normalizeEs('Caducidad  del   PERCIBO'), 'caducidad del percibo');
  });

  test('C12. atomKeywords extracts number+unit tokens and content words, drops stopwords', () => {
    const kws = atomKeywords('El plazo será de 5 años desde el hecho causante, salvo disposición especial.');
    assert.ok(kws.includes('5 anos'), 'number+unit token "5 anos" (accent-folded) captured as one keyword');
    assert.ok(kws.includes('plazo'), 'content word plazo');
    assert.ok(!kws.includes('salvo'), 'stopword salvo excluded');
    assert.ok(!kws.includes('desde'), 'stopword desde excluded');
  });

  test('C13. Recalls an atom when >=50% of keywords are present (accent-insensitive)', () => {
    const atoms = [atom('a1', 'El derecho al reconocimiento prescribe a los 5 años')];
    const good = matchAtomsToAnswer('El derecho al reconocimiento prescribe a los cinco años', atoms);
    assert.equal(good[0].recalled, true);
    assert.ok(good[0].matched.length > 0);
  });

  test('C14. Right concept + wrong unit is NOT a recall (5 meses vs 5 años)', () => {
    const atoms = [atom('a1', 'El derecho al reconocimiento prescribe a los 5 años')];
    const wrongUnit = matchAtomsToAnswer('El derecho al reconocimiento prescribe a los 5 meses', atoms);
    assert.equal(wrongUnit[0].recalled, false, 'number+unit token "5 años" must not be satisfied by "5 meses"');
    const strict = matchAtomsToAnswer('prescribe en treinta días desde la solicitud', atoms);
    assert.equal(strict[0].recalled, false, 'an answer with no key concepts must not count as recalled');
    assert.ok(strict[0].missed.length > 0);
  });

  test('C15. A blank answer recalls nothing', () => {
    const atoms = [atom('a1', 'Caducidad de 1 año desde la notificación del reconocimiento')];
    const result = matchAtomsToAnswer('', atoms);
    assert.equal(result[0].recalled, false);
    assert.equal(result[0].matched.length, 0);
  });

  test('C16. Multiple atoms are scored independently', () => {
    const atoms = [
      atom('a1', 'La antigüedad de 1 año es el requisito'),
      atom('a2', 'La antigüedad de 5 años es el requisito'),
      atom('a3', 'La antigüedad de 3 meses es el requisito'),
    ];
    const result = matchAtomsToAnswer('La antigüedad de 1 año es el requisito', atoms);
    assert.equal(result[0].recalled, true);
    assert.equal(result[1].recalled, false);
    assert.equal(result[2].recalled, false);
  });
});
