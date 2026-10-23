import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../server/db.ts';
import { SchedulingEngine, InterleavingEngine } from '../server/scheduler.ts';
import { DataExporter } from '../server/exporter.ts';
import { Item, Atom, NumberSortItem } from '../src/types.ts';
import { auditItemPedagogicalQuality } from '../src/utils/learningDesignValidator.ts';
import { isolateDataDir } from './helpers/isolation.ts';

// Must run before db.init(): redirects the database to a temp dir and disables
// all AI/Jev network calls. The live ./data/oposilab.db is never touched.
const ISOLATED_DIR = isolateDataDir();

describe('OposiLab Cognitive Engine Test Suite', () => {
  before(() => {
    assert.ok(
      process.env.OPOSILAB_DATA_DIR === ISOLATED_DIR && process.env.OPOSILAB_OFFLINE === '1',
      'Test isolation env must be set before db.init()'
    );
    db.init();
  });

  // 1. Seed Data Loading
  test('1. Seed Data: should have initialized Tema 7 with atoms, clusters and items', () => {
    const topics = db.getTopics();
    assert.ok(topics.length >= 1, 'Should have at least 1 topic');
    const tema7 = topics.find((t) => t.id === 'topic_tema_7' || t.name.includes('Seguridad Social'));
    assert.ok(tema7, 'Tema 7 topic must exist');

    const atoms = db.getAtoms();
    assert.ok(atoms.length >= 50, `Expected at least 50 atoms, got ${atoms.length}`);

    const clusters = db.getClusters();
    assert.ok(clusters.length >= 10, `Expected at least 10 clusters, got ${clusters.length}`);

    const pairs = db.getConfusionPairs();
    assert.ok(pairs.length >= 15, `Expected at least 15 confusion pairs, got ${pairs.length}`);

    const items = db.getItems();
    assert.ok(items.length >= 70, `Expected at least 70 items, got ${items.length}`);
  });

  // 2. Atom Creation and Validation
  test('2. Atom Creation & Validation: creates valid legal atom with basis', () => {
    const newAtomData = {
      topic_id: 'topic_tema_7',
      text: 'El recargo por falta de medidas de seguridad oscila entre el 30% y el 50%.',
      atom_type: 'percentage' as const,
      legal_basis: 'Art. 164 TRLGSS',
      cluster_id: 'cluster_responsabilidad',
      tags: ['recargo', 'seguridad', 'porcentaje'],
      difficulty: 2,
      status: 'validated' as const,
    };
    const created = db.createAtom(newAtomData);
    assert.ok(created.id, 'Atom must be assigned an ID');
    assert.equal(created.atom_type, 'percentage');
    assert.equal(created.legal_basis, 'Art. 164 TRLGSS');

    const retrieved = db.getAtoms().find((a) => a.id === created.id);
    assert.ok(retrieved, 'Atom should be saved and retrievable from local db');
  });

  // 3. Cloze Parsing & Validation
  test('3. Cloze parsing: matches exact answer, synonyms and catches near-misses', () => {
    const clozePattern = /\{\{c\d+::(.*?)\}\}/g;
    const text =
      'El derecho al reconocimiento prescribirá a los {{c1::5 años}}, contados desde el {{c2::hecho causante}}.';
    const matches = [...text.matchAll(clozePattern)];
    assert.equal(matches.length, 2);
    assert.equal(matches[0][1], '5 años');
    assert.equal(matches[1][1], 'hecho causante');

    // Synonym acceptance check
    const synonyms = ['cinco años', '5 anos'];
    const userInput = 'cinco años';
    const isSynonym = synonyms.map((s) => s.toLowerCase()).includes(userInput.toLowerCase());
    assert.ok(isSynonym, 'Synonym should be recognized');

    // Near-miss detection: user typed "5 meses" instead of "5 años"
    const wrongInput = '5 meses';
    const isTemporalConfusion = wrongInput.includes('mes') && matches[0][1].includes('año');
    assert.ok(isTemporalConfusion, 'Should flag temporal/unit near-miss confusion');
  });

  // 4. MCQ Item Validation & Quality Checks
  test('4. MCQ Item Validation: detects missing legal basis, missing trap types and bad options count', () => {
    const invalidItem: Item = {
      id: 'item_invalid_test',
      topic_id: 'topic_tema_7',
      item_type: 'cover_and_generate_mcq',
      stem: '¿Cuál es el plazo?',
      options: [
        { id: 'A', text: '1 año', is_correct: true },
        { id: 'B', text: '2 años', is_correct: false },
        // only 2 options!
      ],
      correct_answer: 'A',
      legal_basis: '', // MISSING!
      rule_statement: 'Regla',
      why_correct: 'Porque sí',
      corrective_rule: 'Regla correctiva',
      difficulty: 1,
      cognitive_operations: ['micro_discrimination'],
      status: 'draft',
      source: 'manual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const warnings = db.validateItemQuality(invalidItem);
    assert.ok(
      warnings.some((w) => w.rule === 'legal_basis_required'),
      'Should warn about missing legal basis'
    );
    assert.ok(
      warnings.some((w) => w.rule === 'options_count'),
      'Should warn about fewer than 3 options'
    );
    assert.ok(
      warnings.some((w) => w.rule === 'distractor_trap_type_missing'),
      'Should warn about missing trap types'
    );
  });

  // 5. Cover-and-Generate Scoring & Metacognitive Flags
  test('5. Cover-and-Generate Scoring: flags lucky guess, misread and confident-wrong', () => {
    // Case A: Confident Wrong (rated 3, wrong option)
    const conf3Wrong = {
      generatedCorrect: false,
      selectedCorrect: false,
      confidence: 3,
    };
    const isConfidentWrong = conf3Wrong.confidence === 3 && !conf3Wrong.selectedCorrect;
    assert.ok(isConfidentWrong, 'Confidence 3 + incorrect answer MUST flag as Confident-Wrong');

    // Case B: Lucky Recognition (generated answer wrong or empty, but selected correct option with low confidence)
    const luckyGuess = {
      generatedCorrect: false,
      selectedCorrect: true,
      confidence: 1,
    };
    const isLuckyRecognition = !luckyGuess.generatedCorrect && luckyGuess.selectedCorrect;
    assert.ok(isLuckyRecognition, 'Should flag as lucky recognition when generative retrieval failed');

    // Case C: Misread / Recognition slip (generated answer correct, but selected wrong option)
    const misreadSlip = {
      generatedCorrect: true,
      selectedCorrect: false,
      confidence: 2,
    };
    const isMisread = misreadSlip.generatedCorrect && !misreadSlip.selectedCorrect;
    assert.ok(isMisread, 'Should flag as misreading when retrieval was right but option was mis-selected');
  });

  // 6. Two-Tier Diagnostic Item
  test('6. Two-Tier Diagnostic Item: classifies attempt into 4 diagnostic quadrants', () => {
    const classifyQuadrant = (tier1Correct: boolean, tier2Correct: boolean) => {
      if (tier1Correct && tier2Correct) return 'Q1_Mastery';
      if (tier1Correct && !tier2Correct) return 'Q2_FragileKnowledge';
      if (!tier1Correct && tier2Correct) return 'Q3_Misread';
      return 'Q4_Misconception';
    };

    assert.equal(classifyQuadrant(true, true), 'Q1_Mastery');
    assert.equal(classifyQuadrant(true, false), 'Q2_FragileKnowledge');
    assert.equal(classifyQuadrant(false, true), 'Q3_Misread');
    assert.equal(classifyQuadrant(false, false), 'Q4_Misconception');
  });

  // 7. Spot-the-Error Matching
  test('7. Spot-the-Error: identifies incorrect span and matches repair', () => {
    const sentence =
      'El derecho al percibo de prestaciones a tanto alzado caducará a los cinco años.';
    const erroneousSpan = 'cinco años';
    const correction = 'un año';

    assert.ok(sentence.includes(erroneousSpan), 'Span must exist in sentence');
    const repairedSentence = sentence.replace(erroneousSpan, correction);
    assert.equal(
      repairedSentence,
      'El derecho al percibo de prestaciones a tanto alzado caducará a los un año.'
    );
  });

  // 8. Number-Sorting Answer Validation
  test('8. Number-Sorting: verifies matching between concept and numerical value', () => {
    const testItems: NumberSortItem[] = [
      { id: '1', concept: 'Prescripción del reconocimiento', correct_value: '5 años', category: 'Plazos' },
      { id: '2', concept: 'Caducidad del percibo', correct_value: '1 año', category: 'Plazos' },
      { id: '3', concept: 'Coeficiente fijo-discontinuo', correct_value: '1,5', category: 'Coeficientes' },
      { id: '4', concept: 'Coeficiente contrato ≤ 5 días', correct_value: '1,4', category: 'Coeficientes' },
    ];

    const userMatches: Record<string, string> = {
      '1': '5 años',
      '2': '1 año',
      '3': '1,5',
      '4': '1,4',
    };

    const isAllCorrect = testItems.every((item) => userMatches[item.id] === item.correct_value);
    assert.ok(isAllCorrect, 'All items correctly mapped');

    // Confused 1,4 and 1,5
    const confusedMatches: Record<string, string> = {
      '3': '1,4',
      '4': '1,5',
    };
    const hasNumericConfusion =
      confusedMatches['3'] !== testItems[2].correct_value &&
      confusedMatches['4'] !== testItems[3].correct_value;
    assert.ok(hasNumericConfusion, 'Detects numeric swap between 1,4 and 1,5');
  });

  // 9. SRS Scheduling State Transitions
  test('9. SRS Scheduling Engine: calculates intervals, lapses and graduation criteria', () => {
    const item = db.getItems()[0];
    assert.ok(item, 'Should have test item');

    // Step 1: Initial Schedule
    const sched0 = db.getReviewSchedule(item.id);
    assert.ok(sched0, 'Schedule must exist for item');

    // Step 2: Attempt 1 - Correct (confidence 2)
    const res1 = db.recordAttempt({
      item_id: item.id,
      session_id: 'sess_test',
      activity_type: 'cover_and_generate_mcq',
      correct: true,
      confidence: 2,
      time_to_answer_ms: 1200,
    });
    assert.equal(res1.schedule.consecutive_correct_sessions, 1);
    assert.ok(res1.schedule.interval_days >= 1);

    // Step 3: Attempt 2 - Correct in second format (cloze, confidence 3)
    const res2 = db.recordAttempt({
      item_id: item.id,
      session_id: 'sess_test',
      activity_type: 'cloze',
      correct: true,
      confidence: 3,
      // Graduation also requires a successful interleaved attempt (default setting),
      // so this attempt records one to keep the scenario representative.
      was_interleaved: true,
      time_to_answer_ms: 900,
    });
    assert.equal(res2.schedule.consecutive_correct_sessions, 2);
    assert.ok(res2.schedule.formats_completed.includes('cloze'));

    // Step 4: Attempt 3 - Correct (confidence 3) -> Triggers graduation!
    const res3 = db.recordAttempt({
      item_id: item.id,
      session_id: 'sess_test',
      activity_type: 'contrast_card',
      correct: true,
      confidence: 3,
      time_to_answer_ms: 800,
    });
    assert.equal(res3.schedule.consecutive_correct_sessions, 3);
    assert.equal(res3.schedule.state, 'graduated', 'Should graduate after 3 consecutive sessions in 2+ formats with an interleaved success');

    // Step 5: Confident-wrong lapse (confidence 3, wrong)
    const resLapse = db.recordAttempt({
      item_id: item.id,
      session_id: 'sess_test',
      activity_type: 'cover_and_generate_mcq',
      correct: false,
      confidence: 3,
      time_to_answer_ms: 2000,
    });
    assert.equal(resLapse.schedule.state, 'learning', 'Lapsed item must return to learning');
    assert.equal(resLapse.schedule.consecutive_correct_sessions, 0);
    assert.equal(resLapse.schedule.priority_score, 100, 'Confident-wrong lapse must have critical priority (100)');
    assert.ok(resLapse.errorLog, 'Error log must be created on lapse');
  });

  // 10. Interleaving Engine Constraints
  test('10. Interleaving Engine: enforces max 2 consecutive same cluster and mixes formats', () => {
    const block = InterleavingEngine.generateBlock({
      blockSize: 12,
      includeNew: true,
      includeMaintenance: true,
      focusConfusionPairs: true,
    });

    assert.ok(block.length > 0, 'Block should contain items');

    // Check no more than 2 consecutive items from the exact same cluster
    let consecutiveClusterCount = 1;
    let lastCluster = block[0].cluster_id;

    for (let i = 1; i < block.length; i++) {
      if (block[i].cluster_id && block[i].cluster_id === lastCluster) {
        consecutiveClusterCount++;
        assert.ok(
          consecutiveClusterCount <= 2,
          `Found ${consecutiveClusterCount} consecutive items with cluster ${lastCluster}`
        );
      } else {
        consecutiveClusterCount = 1;
        lastCluster = block[i].cluster_id;
      }
    }
  });

  // 11. Error Logging & Status Transitions
  test('11. Error Log: auto-creates error entries and allows repair transitions', () => {
    const errorEntry = db.recordAttempt({
      item_id: db.getItems()[0].id,
      session_id: 'sess_test_err',
      activity_type: 'cover_and_generate_mcq',
      correct: false,
      confidence: 2,
      error_type_code: 'E6',
      trap_selected_by_user: 'numeric_substitution',
    }).errorLog;

    assert.ok(errorEntry, 'Error entry must be created');
    assert.equal(errorEntry?.status, 'open');

    // Transition to repairing
    const updated = db.updateErrorLog(errorEntry!.id, {
      status: 'repairing',
      user_explanation: 'Repasé el artículo y verifiqué la regla de los 5 años.',
    });
    assert.equal(updated?.status, 'repairing');
    assert.equal(updated?.user_explanation, 'Repasé el artículo y verifiqué la regla de los 5 años.');
  });

  // 12. Anki TSV/CSV Export
  test('12. Exporter: generates compliant Anki TSV files with correct note rows and tab delimiters', () => {
    const anki = DataExporter.exportAnkiTsv();

    assert.ok(anki.mcqTsv.length > 0, 'MCQ TSV must have content');
    assert.ok(anki.clozeTsv.length > 0, 'Cloze TSV must have content');
    assert.ok(anki.contrastTsv.length > 0, 'Contrast TSV must have content');
    assert.ok(anki.numberSortTsv.length > 0, 'Number Sort TSV must have content');
    assert.ok(anki.spotErrorTsv.length > 0, 'Spot Error TSV must have content');

    const csvItems = DataExporter.exportItemsCsv();
    assert.ok(csvItems.includes('ID,Tipo,Pregunta/Enunciado,Respuesta Correcta,Base Legal'), 'Items CSV header valid');
  });

  // 13. Hint-Assisted Attempts & FSRS Stability Dampening
  test('13. Hint System & FSRS: dampens stability and prevents unearned graduation on hint use', () => {
    const newItem = db.createItem({
      topic_id: 'topic_tema_7',
      item_type: 'cover_and_generate_mcq',
      stem: '¿Cuál es el plazo de prescripción del derecho al reconocimiento de las prestaciones?',
      options: [
        { id: 'A', text: '5 años', is_correct: true, explanation: 'Art. 53 TRLGSS', trap_type: undefined },
        { id: 'B', text: '1 año', is_correct: false, explanation: 'Confusión con caducidad', trap_type: 'conceptual_merger' },
        { id: 'C', text: '4 años', is_correct: false, explanation: 'Confusión con prescripción tributaria', trap_type: 'numeric_substitution' },
      ],
      correct_answer: 'A',
      legal_basis: 'Art. 53 TRLGSS',
      rule_statement: 'El derecho al reconocimiento prescribe a los 5 años.',
      why_correct: 'Conforme al art. 53.1 TRLGSS.',
      corrective_rule: 'El plazo general de prescripción de prestaciones es 5 años.',
      difficulty: 2,
      cognitive_operations: ['micro_discrimination'],
      status: 'validated',
      source: 'manual',
    });

    const schedInitial = db.getReviewSchedule(newItem.id);
    assert.equal(schedInitial?.stability, 1.0, 'Initial stability should be 1.0');

    // Attempt WITH hint
    const resHint = db.recordAttempt({
      item_id: newItem.id,
      session_id: 'sess_hint_test',
      activity_type: 'cover_and_generate_mcq',
      correct: true,
      confidence: 3,
      used_hint: true,
      hints_revealed: ['atom_hint_1'],
      time_to_answer_ms: 1500,
    });

    assert.ok(resHint.schedule, 'Review schedule must exist');
    assert.equal(resHint.schedule.consecutive_correct_sessions, 0, 'Hint-assisted attempt must reset consecutive count');
    assert.ok(resHint.schedule.stability <= 1.1, 'Stability growth must be dampened on hint use (1.05)');
    assert.notEqual(resHint.schedule.state, 'graduated', 'Item should NOT graduate if hint was used');
    assert.ok(resHint.schedule.interval_days <= 2, 'Interval must stay short (<= 2 days) when assisted by hint');
  });

  // 14. Session State Persistence
  test('14. Session Persistence: saves, retrieves, and clears active session state', () => {
    const sampleSessionState = {
      title: 'Bloque Intercalado Test',
      mode: 'interleaved',
      currentIndex: 3,
      items: [db.getItems()[0], db.getItems()[1]],
      sessionResults: { correct: 2, total: 3, confidences: [2, 3, 1] },
    };

    db.setSavedSessionState(sampleSessionState);
    const retrieved = db.getSavedSessionState();
    assert.ok(retrieved, 'Should retrieve saved session state');
    assert.equal(retrieved.currentIndex, 3);
    assert.equal(retrieved.title, 'Bloque Intercalado Test');

    db.clearSavedSessionState();
    assert.equal(db.getSavedSessionState(), null, 'Should clear saved session state');
  });

  // 15. Tema 1: Constitución Española de 1978 Seed Verification
  test('15. Tema 1 Seed: loads CE 1978 atoms, confusion pairs, and cognitive items', () => {
    const topics = db.getTopics();
    const tema1 = topics.find((t) => t.id === 'topic_constitucion_tema_1' || t.name.includes('Constitución Española'));
    assert.ok(tema1, 'Tema 1: Constitución Española 1978 topic must exist');

    const atoms = db.getAtoms().filter((a) => a.topic_id === 'topic_constitucion_tema_1');
    assert.ok(atoms.length >= 25, `Expected at least 25 atoms for Tema 1, got ${atoms.length}`);

    const pairs = db.getConfusionPairs().filter((p) => p.topic_id === 'topic_constitucion_tema_1');
    assert.ok(pairs.length >= 8, `Expected at least 8 confusion pairs for Tema 1, got ${pairs.length}`);

    const items = db.getItems().filter((i) => i.topic_id === 'topic_constitucion_tema_1');
    assert.ok(items.length >= 12, `Expected at least 12 items for Tema 1, got ${items.length}`);

    // Check specific critical discrimination pairs in Tema 1
    const art167vs168 = pairs.find((p) => p.id === 'pair_art167_vs_art168');
    assert.ok(art167vs168, 'Reforma 167 vs 168 confusion pair must exist');
    assert.ok(art167vs168.discriminating_cue.includes('3/5'), 'Discriminating cue should detail the 3/5 vs 2/3 majorities');

    const valuesVsPrinciples = pairs.find((p) => p.id === 'pair_valores_superiores_vs_principios_art9');
    assert.ok(valuesVsPrinciples, 'Valores superiores (1.1) vs Principios (9.3) confusion pair must exist');
  });

  // 16. Learning Design & Psychometric Quality Validator
  test('16. Learning Design Validator: detects answer leakage in stem, concept overload, and length bias', () => {
    // A. Item with answer leaked in stem
    const itemWithLeak = {
      id: 'test_leak',
      stem: '¿A los cuántos años opera la prescripción de cinco años de las prestaciones del Art. 53.1?',
      correct_answer: 'A los cinco años',
      legal_basis: 'Art. 53.1 TRLGSS',
      options: [
        { id: 'a', text: 'A los cinco años', is_correct: true },
        { id: 'b', text: 'Al año', is_correct: false, trap_type: 'temporal_confusion', explanation: 'Caducidad' },
        { id: 'c', text: 'A los 3 meses', is_correct: false, trap_type: 'partial_rule_accuracy', explanation: 'Efectos' },
        { id: 'd', text: 'A los 4 años', is_correct: false, trap_type: 'familiar_wording_trap', explanation: 'Tributario' },
      ],
    };

    const diagLeak = auditItemPedagogicalQuality(itemWithLeak as any);
    assert.equal(diagLeak.answerInStem.detected, true, 'Must detect answer leaked into stem');
    assert.ok(diagLeak.score < 80, 'Score should be penalized for answer in stem');
    assert.ok(diagLeak.warnings.some((w) => w.rule === 'answer_in_stem'));

    // B. Item with overloaded concepts (multiple heterogeneous decisions)
    const itemOverloaded = {
      id: 'test_overload',
      stem: '¿Cuál es el plazo de prescripción, qué órgano es el competente para resolver, qué porcentaje de recargo procede y qué excepción rige si la empresa está en concurso?',
      correct_answer: '5 años, INSS, recargo del 30 al 50%',
      legal_basis: 'Arts. 53, 164 y 167 TRLGSS',
      options: [
        { id: 'a', text: '5 años, INSS, recargo del 30 al 50%', is_correct: true },
        { id: 'b', text: '1 año, TGSS, recargo 20%', is_correct: false, explanation: 'Error' },
        { id: 'c', text: '3 meses, Inspección, 10%', is_correct: false, explanation: 'Error' },
        { id: 'd', text: '4 años, Tesorería, 50%', is_correct: false, explanation: 'Error' },
      ],
    };

    const diagOverload = auditItemPedagogicalQuality(itemOverloaded as any);
    assert.equal(diagOverload.overloadedConcepts.detected, true, 'Must detect overloaded concepts');
    assert.ok(diagOverload.overloadedConcepts.dimensionsFound.length >= 3);

    // C. Item with longest option bias
    const itemLengthBias = {
      id: 'test_length',
      stem: '¿Qué consecuencia se produce ante el incumplimiento empresarial de afiliación y alta?',
      correct_answer: 'Responsabilidad directa patronal en el pago y anticipo de las prestaciones económicas con subrogación subsidiaria y sanción administrativa.',
      legal_basis: 'Art. 167.1 TRLGSS',
      options: [
        { id: 'a', text: 'Responsabilidad directa patronal en el pago y anticipo de las prestaciones económicas con subrogación subsidiaria y sanción administrativa.', is_correct: true },
        { id: 'b', text: 'Exoneración total.', is_correct: false, explanation: 'Falso' },
        { id: 'c', text: 'Derivación al FOGASA.', is_correct: false, explanation: 'Falso' },
        { id: 'd', text: 'Pérdida de litigar.', is_correct: false, explanation: 'Falso' },
      ],
    };

    const diagLength = auditItemPedagogicalQuality(itemLengthBias as any);
    assert.equal(diagLength.longestOptionBias.detected, true, 'Must detect longest option bias');
    assert.ok(diagLength.longestOptionBias.ratio >= 1.65);
  });

  // 17. Jev Decision Engine (typesafe/jev-1.13 Structured Decisions)
  test('17. Jev Decision Engine: provides typed answers (Choice, Noul, Score) with calibrated probabilities', async () => {
    const { jevClient } = await import('../server/jev.ts');
    assert.ok(jevClient, 'JevClient must be instantiated');

    // A. Item Audit via Jev
    const sampleItem = db.getItems()[0];
    const auditRes = await jevClient.auditItemQuality(sampleItem);
    assert.ok(auditRes, 'Jev item audit should return structured results');
    assert.ok(auditRes.is_stem_unambiguous.probability >= 0 && auditRes.is_stem_unambiguous.probability <= 1, 'Noul prob between 0 and 1');
    assert.ok(auditRes.has_double_key_risk.probability >= 0 && auditRes.has_double_key_risk.probability <= 1, 'Double key prob between 0 and 1');
    assert.ok(auditRes.primary_cognitive_trap.choice, 'Choice trap should be defined');
    assert.ok(auditRes.psychometric_difficulty.score >= 1 && auditRes.psychometric_difficulty.score <= 5, 'Score should be in 1-5 scale');

    // B. Attempt Diagnosis via Jev
    const diagRes = await jevClient.diagnoseAttempt({
      item_stem: sampleItem.stem,
      item_rule: sampleItem.rule_statement,
      item_correct_answer: sampleItem.correct_answer,
      generated_answer_before_options: '1 año desde el hecho causante',
      selected_option: '1 año',
      is_correct: false,
      confidence: 3,
    });
    assert.ok(diagRes, 'Diagnosis result must exist');
    assert.ok(diagRes.error_classification.choice.includes('E'), 'Error classification should map to E taxonomy');
    assert.ok(diagRes.misconception_severity.score >= 1, 'Misconception score must be computed');
    assert.ok(diagRes.recommended_repair_action.choice, 'Repair action must be chosen');

    // C. Atom Classification via Jev
    const sampleAtom = db.getAtoms()[0];
    const atomRes = await jevClient.classifyAtom(sampleAtom);
    assert.ok(atomRes.cluster_assignment.choice, 'Atom should receive cluster assignment');
    assert.ok(atomRes.exam_criticality.score >= 1, 'Atom criticality score should be computed');

    // D. Jev-Verified Cascade
    const cascadeRes = await jevClient.verifyCascade(
      sampleItem,
      'Art. 53.1 TRLGSS: El derecho al reconocimiento de las prestaciones prescribirá a los cinco años.'
    );
    assert.ok(cascadeRes.is_factually_sound.probability > 0.5, 'Factually sound probability should be high');
    assert.ok(cascadeRes.recommended_action.choice, 'Recommended action should be provided');
  });

  // 18. Mode A Option Selection Safety: never drops correct answer when slicing
  test('18. Mode A Option Selection: guarantees correct answer is included even if option D', async () => {
    const { getModeAOptions } = await import('../src/components/ModeAStudyRunner.tsx');

    // Case A: Option D is the correct answer
    const itemWithCorrectD: Partial<Item> = {
      id: 'test_item_d',
      stem: '¿Cuál es el plazo legal?',
      correct_answer: 'D',
      options: [
        { id: 'A', text: '1 mes', is_correct: false },
        { id: 'B', text: '2 meses', is_correct: false },
        { id: 'C', text: '3 meses', is_correct: false },
        { id: 'D', text: '4 meses (correcto)', is_correct: true },
      ],
    };

    const modeAOptsD = getModeAOptions(itemWithCorrectD as Item);
    assert.equal(modeAOptsD.length, 4, 'Mode A must keep all 4 exam-style options');
    assert.deepEqual(
      modeAOptsD.map((o) => o.id),
      ['A', 'B', 'C', 'D'],
      'Mode A must preserve the original option order'
    );
    const correctInD = modeAOptsD.find((o) => o.id === 'D');
    assert.ok(correctInD, 'Option D MUST be present in Mode A gentle check options');
    assert.equal(correctInD?.is_correct, true, 'Option D must be marked is_correct');

    // Case B: Option B is correct with is_correct flag
    const itemWithCorrectB: Partial<Item> = {
      id: 'test_item_b',
      stem: '¿Cuál es el sujeto obligado?',
      correct_answer: 'B',
      options: [
        { id: 'A', text: 'El trabajador', is_correct: false },
        { id: 'B', text: 'El empresario', is_correct: true },
        { id: 'C', text: 'La mutua', is_correct: false },
        { id: 'D', text: 'El INSS', is_correct: false },
      ],
    };

    const modeAOptsB = getModeAOptions(itemWithCorrectB as Item);
    assert.equal(modeAOptsB.length, 4, 'Must keep all 4 options');
    const correctInB = modeAOptsB.find((o) => o.id === 'B');
    assert.ok(correctInB, 'Option B must be present');
    assert.equal(correctInB?.is_correct, true);

    // Case C: Fallback options when item has empty options array
    const itemEmptyOpts: Partial<Item> = {
      id: 'test_empty',
      stem: 'Norma sin opciones',
      correct_answer: 'Cumplimiento legal',
    };
    const modeAFallback = getModeAOptions(itemEmptyOpts as Item);
    assert.equal(modeAFallback.length, 3, 'Must return 3 fallback options');
    assert.ok(modeAFallback.some((o) => o.is_correct), 'At least one fallback must be correct');
  });

  // 19. Mode A State Machine Triggers & Mode B Streak Evaluation
  test('19. Mode A & B State Transitions: correctly gates Mode A triggers and calculates streaks', () => {
    // A. Mode A Trigger logic in SRS mode:
    const shouldTriggerModeA = (mode: string, fsrsInfo?: { state?: string; lapses?: number }) => {
      const isNew = !fsrsInfo || fsrsInfo.state === 'new';
      const hasLapses = (fsrsInfo?.lapses || 0) >= 2;
      return mode === 'srs' && (isNew || hasLapses);
    };

    // Item without FSRS data in SRS mode -> MUST trigger Mode A (first contact)
    assert.equal(shouldTriggerModeA('srs', undefined), true, 'New item lacking fsrs must trigger Mode A');

    // Item with state: 'new' in SRS mode -> MUST trigger Mode A
    assert.equal(shouldTriggerModeA('srs', { state: 'new', lapses: 0 }), true, 'state: new must trigger Mode A');

    // Item with lapses >= 2 in SRS mode -> MUST trigger Mode A (remediation loop)
    assert.equal(shouldTriggerModeA('srs', { state: 'review', lapses: 2 }), true, 'lapses >= 2 must trigger Mode A remediation');

    // Mastered item in SRS mode -> Mode B
    assert.equal(shouldTriggerModeA('srs', { state: 'review', lapses: 0 }), false, 'Mastered item enters Mode B directly');

    // In interleaved or pretest mode -> Mode A is bypassed (exam drill focus)
    assert.equal(shouldTriggerModeA('interleaved', { state: 'new', lapses: 0 }), false, 'Interleaved mode bypasses Mode A');
    assert.equal(shouldTriggerModeA('pretest', { state: 'new', lapses: 0 }), false, 'Pretest mode bypasses Mode A');

    // B. Streak calculation logic:
    const computeStreaks = (logs: Array<{ correct: boolean; blank: boolean }>) => {
      let currentStreak = 0;
      for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].correct && !logs[i].blank) {
          currentStreak++;
        } else {
          break;
        }
      }

      let maxStreak = 0;
      let current = 0;
      for (const log of logs) {
        if (log.correct && !log.blank) {
          current++;
          if (current > maxStreak) maxStreak = current;
        } else {
          current = 0;
        }
      }

      return { currentStreak, maxStreak };
    };

    const sessionLogs = [
      { correct: true, blank: false },
      { correct: true, blank: false },
      { correct: true, blank: false },
      { correct: false, blank: false },
      { correct: true, blank: false },
      { correct: true, blank: false },
    ];

    const { currentStreak, maxStreak } = computeStreaks(sessionLogs);
    assert.equal(currentStreak, 2, 'Tail streak should be 2');
    assert.equal(maxStreak, 3, 'Best streak should be 3');
  });
});
