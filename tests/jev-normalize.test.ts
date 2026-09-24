import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeJevAnswer,
  normalizeJevAnswers,
  JevClient,
} from '../server/jev.ts';

// This suite must exercise the LIVE code path (stubbed fetch, not the offline
// local heuristic fallback), so OPOSILAB_OFFLINE must be unset for this file.
delete process.env.OPOSILAB_OFFLINE;

/** Answer shapes captured from the real Decisions API (typesafe/jev-1.13-20260917). */
const liveNoul = { type: 'noul', noul: 0.89 };

const liveScoreLegend = {
  '0': 'Nivel 1 - Reconocimiento directo de regla básica',
  '1': 'Nivel 2 - Micro-discriminación entre opciones parecidas',
  '2': 'Nivel 3 - Excepción o aplicación de caso compuesto',
  '3': 'Nivel 4 - Alta interferencia normativa / trampa sutil',
  '4': 'Nivel 5 - Complejidad de rango jurisprudencial',
};

const liveScore = {
  type: 'score',
  score: 0.39,
  legend: liveScoreLegend,
  probabilities: { '0': 0.61, '1': 0.39, '2': 0, '3': 0, '4': 0 },
  confidence: 0.67,
};

const liveChoice = {
  type: 'choice',
  choice: 'temporal_confusion',
  probabilities: { temporal_confusion: 0.7, numeric_substitution: 0.3 },
  confidence: 0.65,
};

describe('Jev Decisions API answer normalization', () => {
  test('J1 noul answers expose .probability for UI consumers', () => {
    const normalized = normalizeJevAnswer(liveNoul);
    assert.equal(typeof normalized.probability, 'number');
    assert.equal(normalized.probability, 0.89);
    // ItemBank / JevLab render formula must not produce NaN
    assert.equal(Math.round(normalized.probability * 100), 89);
  });

  test('J2 zero-based score is mapped to the 1-5 scale with shifted keys', () => {
    const normalized = normalizeJevAnswer(liveScore);
    assert.ok(normalized.score >= 1 && normalized.score <= 5);
    assert.ok(Math.abs(normalized.score - 1.39) < 1e-9);
    assert.deepEqual(Object.keys(normalized.probabilities).sort(), ['1', '2', '3', '4', '5']);
    assert.equal(normalized.probabilities['1'], 0.61);
    assert.equal(normalized.legend['5'], 'Nivel 5 - Complejidad de rango jurisprudencial');
    assert.equal(normalized.confidence, 0.67);
  });

  test('J3 choice answers pass through untouched', () => {
    const normalized = normalizeJevAnswer(liveChoice);
    assert.strictEqual(normalized, liveChoice);
    assert.equal(normalized.choice, 'temporal_confusion');
  });

  test('J4 canonical internal answers are left unchanged (idempotent)', () => {
    const noul = { probability: 0.94 };
    const score = {
      score: 3,
      probabilities: { '1': 0.2, '2': 0.3, '3': 0.5 },
      confidence: 0.85,
    };
    const choice = {
      choice: 'deadline',
      probabilities: { deadline: 1 },
      confidence: 0.9,
    };
    assert.strictEqual(normalizeJevAnswer(noul), noul);
    assert.strictEqual(normalizeJevAnswer(score), score);
    assert.strictEqual(normalizeJevAnswer(choice), choice);
    assert.deepEqual(normalizeJevAnswers(undefined), {});

    const batch = normalizeJevAnswers({ q1: liveNoul, q2: noul });
    assert.equal(batch.q1.probability, 0.89);
    assert.strictEqual(batch.q2, noul);
  });
});

describe('Jev live-path integration (stubbed fetch)', () => {
  function stubFetch(payload: Record<string, unknown>) {
    const original = globalThis.fetch;
    globalThis.fetch = (async () => ({
      ok: true,
      json: async () => payload,
    })) as unknown as typeof fetch;
    return () => {
      globalThis.fetch = original;
    };
  }

  const sampleItem = {
    stem: '¿Cuál es el plazo de prescripción de las cuotas de la Seguridad Social?',
    options: ['4 años', '5 años', '10 años'],
    correct_answer: '4 años',
    legal_basis: 'Art. 21 TRLGSS',
    rule_statement: 'Las cuotas prescriben a los cuatro años.',
    why_correct: 'El art. 21 TRLGSS fija el plazo en 4 años.',
  };

  test('J5 auditItemQuality exposes probabilities and a 1-5 difficulty', async () => {
    const restore = stubFetch({
      model: 'typesafe/jev-1.13-20260917',
      answers: {
        is_stem_unambiguous: { type: 'noul', noul: 0.89 },
        is_correct_answer_verified: { type: 'noul', noul: 0.85 },
        has_double_key_risk: { type: 'noul', noul: 0.11 },
        primary_cognitive_trap: liveChoice,
        psychometric_difficulty: {
          type: 'score',
          score: 2.42,
          legend: { '0': 'Nivel 1', '1': 'Nivel 2', '2': 'Nivel 3', '3': 'Nivel 4', '4': 'Nivel 5' },
          probabilities: { '0': 0.01, '1': 0.06, '2': 0.45, '3': 0.46, '4': 0.02 },
          confidence: 0.49,
        },
        graduation_readiness: { type: 'noul', noul: 0.53 },
      },
      usage: { input_tokens: 384, output_tokens: 34, cost: 0.000016128 },
    });
    try {
      const audit = await JevClient.auditItemQuality(sampleItem, 'TRLGSS');
      assert.equal(audit.is_mock, false);
      assert.equal(audit.is_stem_unambiguous.probability, 0.89);
      assert.equal(audit.is_correct_answer_verified.probability, 0.85);
      assert.equal(audit.has_double_key_risk.probability, 0.11);
      assert.equal(audit.graduation_readiness.probability, 0.53);
      assert.equal(audit.primary_cognitive_trap.choice, 'temporal_confusion');
      assert.ok(audit.psychometric_difficulty.score > 1);
      assert.ok(audit.psychometric_difficulty.score <= 5);
      assert.ok(Math.abs(audit.psychometric_difficulty.score - 3.42) < 1e-9);
      assert.equal(Math.round(audit.is_stem_unambiguous.probability * 100), 89);
    } finally {
      restore();
    }
  });

  test('J6 verifyCascade computes finite confidence from live noul answers', async () => {
    const restore = stubFetch({
      model: 'typesafe/jev-1.13-20260917',
      answers: {
        is_factually_sound: { type: 'noul', noul: 0.9 },
        legal_basis_accurate: { type: 'noul', noul: 0.8 },
        distractors_plausible: { type: 'noul', noul: 0.7 },
        recommended_action: {
          type: 'choice',
          choice: 'accept_and_validate',
          probabilities: {
            accept_and_validate: 0.88,
            needs_human_refinement: 0.1,
            reject_and_regenerate: 0.02,
          },
          confidence: 0.9,
        },
      },
    });
    try {
      const result = await JevClient.verifyCascade(sampleItem, 'Texto normativo fuente.');
      assert.equal(result.is_factually_sound.probability, 0.9);
      assert.equal(result.legal_basis_accurate.probability, 0.8);
      assert.equal(result.distractors_plausible.probability, 0.7);
      assert.ok(Number.isFinite(result.confidence));
      assert.ok(Math.abs(result.confidence - 0.8) < 1e-9);
      assert.equal(result.recommended_action.choice, 'accept_and_validate');
    } finally {
      restore();
    }
  });
});
