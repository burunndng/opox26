import { Item, ConfidenceLevel } from '../types.ts';
import { normalizeEs, atomKeywords } from '../utils/retrievalMatch.ts';

export type CognitiveState =
  | 'mastered'
  | 'lucky_recognition'
  | 'recognition_failure'
  | 'confident_misconception'
  | 'standard_error'
  | 'blank';

export type TwoTierQuadrant =
  | 'Q1_Mastery'
  | 'Q2_FragileKnowledge'
  | 'Q3_Misread'
  | 'Q4_Misconception';

/**
 * Classification of a two-tier diagnostic attempt into the four cognitive quadrants (spec §9.5).
 * Repair routing lives in src/utils/repairRouting.ts (canonical `RepairRouting` type + `REPAIR_ROUTES`).
 */
export function classifyTwoTierQuadrant(
  tier1Correct: boolean,
  tier2Correct: boolean
): TwoTierQuadrant {
  if (tier1Correct && tier2Correct) return 'Q1_Mastery';
  if (tier1Correct && !tier2Correct) return 'Q2_FragileKnowledge';
  if (!tier1Correct && tier2Correct) return 'Q3_Misread';
  return 'Q4_Misconception';
}

export type ResponsePayload = {
  selectedOption?: string | null;
  generatedAnswer?: string | null;
  clozeInput?: string;
  clozeInputs?: Record<string, string>;
  numberSortMatches?: Record<string, string>;
  spotSelectedSpanId?: string | null;
  spotCorrection?: string | null;
  userReasoning?: string | null;
  blank?: boolean;
};

export type BlankEvaluation = {
  id: string;
  userValue: string;
  targetValue: string;
  correct: boolean;
  nearMiss?: string;
};

export type EvaluationResult = {
  correct: boolean;
  blank: boolean;
  expectedDisplay: string;
  errorCode?: string;
  cognitiveState?: CognitiveState;
  generativeMatch?: boolean;
  nearMissDiagnostic?: string;
  twoTierQuadrant?: TwoTierQuadrant;
  blankResults?: BlankEvaluation[];
};

function normalizeStr(s?: string | null): string {
  return (s || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Compares a free-text generative answer against candidate reference statements
 * using token extraction, numeric invariants, and keyword recall.
 */
export function isGenerativeMatch(userGenText?: string | null, targetTexts: string[] = []): boolean {
  if (!userGenText) return false;
  const normUser = normalizeEs(userGenText).trim();
  if (normUser.length < 2) return false;

  for (const rawTarget of targetTexts) {
    if (!rawTarget) continue;
    const normTarget = normalizeEs(rawTarget).trim();
    if (!normTarget) continue;

    // Direct inclusion
    if (normTarget.includes(normUser) || normUser.includes(normTarget)) {
      return true;
    }

    const keywords = atomKeywords(rawTarget);
    if (keywords.length === 0) continue;

    const matched = keywords.filter((k) => normUser.includes(k));
    const numberKeywords = keywords.filter((k) => /\d/.test(k));
    const allNumbersPresent = numberKeywords.length === 0 || numberKeywords.every((k) => matched.includes(k));
    const coverage = matched.length / keywords.length;

    // Recalled when all number tokens match and at least 40% of distinctive keywords are recalled
    if (allNumbersPresent && coverage >= 0.4) {
      return true;
    }
  }

  return false;
}

/**
 * Inspects a cloze mismatch for typical near-miss confusion patterns (spec §9.4).
 */
export function detectClozeNearMiss(
  userInput?: string | null,
  targetAnswer?: string | null,
  nearMissesConfig?: Record<string, { trigger: string; feedback: string }>
): string | undefined {
  if (!userInput || !targetAnswer) return undefined;
  const normUser = normalizeEs(userInput);
  const normTarget = normalizeEs(targetAnswer);
  if (!normUser || !normTarget) return undefined;

  // 1. Configured near-miss triggers
  if (nearMissesConfig) {
    for (const [key, conf] of Object.entries(nearMissesConfig)) {
      const trigger = normalizeEs(conf.trigger || key);
      if (normUser.includes(trigger)) {
        return conf.feedback;
      }
    }
  }

  // 2. Numeric vs temporal unit confusion (e.g. "5 meses" vs "5 años")
  const userUnitMatch = normUser.match(/(\d+(?:[.,]\d+)?)\s*(anos?|meses?|dias?|horas?|veces|%|euros?|iprem)/i);
  const targetUnitMatch = normTarget.match(/(\d+(?:[.,]\d+)?)\s*(anos?|meses?|dias?|horas?|veces|%|euros?|iprem)/i);

  if (userUnitMatch && targetUnitMatch) {
    const userNum = userUnitMatch[1];
    const userUnit = userUnitMatch[2];
    const targetNum = targetUnitMatch[1];
    const targetUnit = targetUnitMatch[2];

    if (userNum === targetNum && userUnit !== targetUnit) {
      return `Confusión de unidad de magnitud: indicaste "${userNum} ${userUnit}", pero la norma exige "${targetNum} ${targetUnit}".`;
    }
    if (userNum !== targetNum && userUnit === targetUnit) {
      return `Confusión cuantitativa: indicaste "${userNum} ${userUnit}", pero la magnitud exacta es "${targetNum} ${targetUnit}".`;
    }
  }

  // 3. Temporal dies a quo confusion
  if (normTarget.includes('hecho causante') && (normUser.includes('notific') || normUser.includes('solicitud') || normUser.includes('resoluc'))) {
    return 'Confusión de dies a quo: el cómputo inicia con el hecho causante, no con la notificación o solicitud.';
  }
  if (normTarget.includes('notific') && normUser.includes('hecho causante')) {
    return 'Confusión de dies a quo: el cómputo inicia con la notificación de la resolución, no con el hecho causante.';
  }

  // 4. Institutional body confusion (INSS vs TGSS vs Mutua)
  if (normTarget.includes('inss') && normUser.includes('tgss')) {
    return 'Confusión competencial: corresponde al INSS (gestión de prestaciones), no a la TGSS (caja única y afiliación).';
  }
  if (normTarget.includes('tgss') && normUser.includes('inss')) {
    return 'Confusión competencial: corresponde a la TGSS (recaudación y caja única), no al INSS.';
  }

  return undefined;
}

export function evaluateItem(
  item: Item,
  response: ResponsePayload,
  confidence: ConfidenceLevel
): EvaluationResult {
  if (response.blank) {
    return {
      correct: false,
      blank: true,
      expectedDisplay: item.correct_answer || 'Abstención táctica (0 pts)',
      errorCode: 'E9', // Blank / abstention
      cognitiveState: 'blank',
    };
  }

  let correct = false;
  let errorCode: string | undefined = confidence === 3 ? 'E8' : 'E1';
  let cognitiveState: CognitiveState | undefined = undefined;
  let generativeMatch: boolean | undefined = undefined;
  let nearMissDiagnostic: string | undefined = undefined;
  let twoTierQuadrant: TwoTierQuadrant | undefined = undefined;
  let blankResults: BlankEvaluation[] | undefined = undefined;

  let expectedDisplay =
    item.options?.find((o: any) => o.id === item.correct_answer)?.text ||
    item.correct_answer ||
    'Opción correcta';

  switch (item.item_type) {
    case 'cover_and_generate_mcq': {
      const correctOpt = item.options?.find((o) => o.is_correct);
      const targetId = correctOpt?.id || item.correct_answer;
      correct = !!response.selectedOption && response.selectedOption === targetId;

      // Evaluate generative pre-reveal attempt
      const targetsToCompare = [
        correctOpt?.text,
        item.correct_answer,
        item.rule_statement,
      ].filter((t): t is string => Boolean(t));

      const hasGenAnswer = Boolean(response.generatedAnswer && response.generatedAnswer.trim().length > 0);
      generativeMatch = hasGenAnswer ? isGenerativeMatch(response.generatedAnswer, targetsToCompare) : false;

      if (correct) {
        cognitiveState = generativeMatch ? 'mastered' : 'lucky_recognition';
      } else {
        if (generativeMatch) {
          cognitiveState = 'recognition_failure';
          errorCode = 'E3'; // Misreading / distractor trap
        } else if (confidence === 3) {
          cognitiveState = 'confident_misconception';
          errorCode = 'E8';
        } else {
          cognitiveState = 'standard_error';
          errorCode = 'E1';
        }
      }

      if (correctOpt?.text) {
        expectedDisplay = `${correctOpt.id}: ${correctOpt.text}`;
      }
      break;
    }

    case 'retrieval_prompt':
    case 'pretest_item': {
      const hasOptions = item.options && item.options.length > 0;
      if (hasOptions) {
        const correctOpt = item.options?.find((o) => o.is_correct);
        const targetId = correctOpt?.id || item.correct_answer;
        correct = !!response.selectedOption && response.selectedOption === targetId;
        if (!correct) {
          errorCode = confidence === 3 ? 'E8' : 'E3';
          cognitiveState = confidence === 3 ? 'confident_misconception' : 'standard_error';
        } else {
          cognitiveState = 'mastered';
        }
        if (correctOpt?.text) {
          expectedDisplay = `${correctOpt.id}: ${correctOpt.text}`;
        }
      } else {
        // Free-text generative retrieval mode
        const userText = response.generatedAnswer || response.clozeInput || response.userReasoning || '';
        const targets = [item.correct_answer, item.rule_statement].filter((t): t is string => Boolean(t));
        const matched = isGenerativeMatch(userText, targets);
        correct = matched;
        generativeMatch = matched;
        if (correct) {
          cognitiveState = 'mastered';
        } else {
          errorCode = confidence === 3 ? 'E8' : 'E1';
          cognitiveState = confidence === 3 ? 'confident_misconception' : 'standard_error';
        }
        expectedDisplay = item.correct_answer || item.rule_statement || 'Respuesta modelo';
      }
      break;
    }

    case 'cloze': {
      // 1. Phrasing options branch
      if (response.selectedOption) {
        const correctOpt = item.options?.find((o) => o.is_correct);
        const targetId = correctOpt?.id || item.correct_answer || 'A';
        correct = response.selectedOption === targetId;
        if (correctOpt) {
          expectedDisplay = correctOpt.text;
        }
        cognitiveState = correct ? 'mastered' : (confidence === 3 ? 'confident_misconception' : 'standard_error');
        break;
      }

      // 2. Multi-blank evaluation
      const rawText = item.cloze_data?.template_text || item.cloze_data?.text_with_clozes || '';
      const markerAnswers = new Map<string, string>();
      const regex = /\{\{(c\d+)::(.*?)\}\}/g;
      let markerMatch;
      while ((markerMatch = regex.exec(rawText)) !== null) {
        markerAnswers.set(markerMatch[1], markerMatch[2]);
      }

      if (response.clozeInputs && Object.keys(response.clozeInputs).length > 0) {
        const entries = (item.cloze_data?.blanks ?? []).map((b, index) => {
          const id = b.id || `c${(b.index ?? index) + 1}`;
          return {
            id,
            answer: b.correct_answer || b.answer || b.target || markerAnswers.get(id) || '',
            synonyms: b.synonyms ?? [],
          };
        });
        const resolvedEntries = entries.length > 0
          ? entries
          : [...markerAnswers.entries()].map(([id, answer]) => ({ id, answer, synonyms: [] as string[] }));

        blankResults = resolvedEntries.map((entry) => {
          const rawVal = response.clozeInputs![entry.id] ?? '';
          const userVal = normalizeStr(rawVal);
          const targets = [entry.answer, ...entry.synonyms]
            .filter((value): value is string => Boolean(value))
            .map(normalizeStr)
            .filter((value) => value.length > 0);
          const isBlankCorrect = userVal.length > 0 && targets.some((target) => target === userVal);
          const nearMiss = !isBlankCorrect && userVal.length > 0
            ? detectClozeNearMiss(rawVal, entry.answer, item.cloze_data?.near_misses)
            : undefined;

          return {
            id: entry.id,
            userValue: rawVal,
            targetValue: entry.answer,
            correct: isBlankCorrect,
            nearMiss,
          };
        });

        correct = resolvedEntries.length > 0 && blankResults.every((b) => b.correct);
        nearMissDiagnostic = blankResults.find((b) => b.nearMiss)?.nearMiss;

        if (!correct) {
          const userValues = resolvedEntries.map((entry) => normalizeStr(response.clozeInputs![entry.id]));
          if (userValues.some((value) => /\d+/.test(value)) && resolvedEntries.some((entry) => /\d+/.test(entry.answer))) {
            errorCode = 'E6';
          } else {
            errorCode = confidence === 3 ? 'E8' : 'E1';
          }
          cognitiveState = confidence === 3 ? 'confident_misconception' : 'standard_error';
        } else {
          cognitiveState = 'mastered';
        }
        expectedDisplay = resolvedEntries.map((entry) => entry.answer).filter(Boolean).join(' · ');
        break;
      }

      // 3. Legacy single-input evaluation
      const rawUser = response.clozeInput || '';
      const userVal = normalizeStr(rawUser);
      const validTargets: string[] = [];

      if (item.correct_answer) validTargets.push(normalizeStr(item.correct_answer));
      if (item.cloze_data?.target_answer) validTargets.push(normalizeStr(item.cloze_data.target_answer));

      regex.lastIndex = 0;
      while ((markerMatch = regex.exec(rawText)) !== null) {
        if (markerMatch[2]) {
          validTargets.push(normalizeStr(markerMatch[2]));
        }
      }

      if (item.cloze_data?.blanks) {
        for (const b of item.cloze_data.blanks) {
          if (b.answer) validTargets.push(normalizeStr(b.answer));
          if (b.correct_answer) validTargets.push(normalizeStr(b.correct_answer));
          if (b.target) validTargets.push(normalizeStr(b.target));
          for (const synonym of b.synonyms ?? []) validTargets.push(normalizeStr(synonym));
        }
      }

      correct = userVal.length > 0 && validTargets.some((tgt) => tgt === userVal);

      if (!correct) {
        nearMissDiagnostic = detectClozeNearMiss(rawUser, validTargets[0] || item.correct_answer, item.cloze_data?.near_misses);
        if (/\d+/.test(userVal) && validTargets.some((t) => /\d+/.test(t))) {
          errorCode = 'E6'; // numeric/deadline confusion
        } else {
          errorCode = confidence === 3 ? 'E8' : 'E1';
        }
        cognitiveState = confidence === 3 ? 'confident_misconception' : 'standard_error';
      } else {
        cognitiveState = 'mastered';
      }

      expectedDisplay = validTargets[0] || item.correct_answer || 'Término exacto';
      break;
    }

    case 'contrast_card': {
      const expectedAns =
        item.correct_answer ||
        item.contrast_data?.mini_case_answer ||
        'A';
      correct = !!response.selectedOption && response.selectedOption.toUpperCase() === expectedAns.toUpperCase();
      if (!correct) errorCode = 'E5'; // conceptual merger
      cognitiveState = correct ? 'mastered' : (confidence === 3 ? 'confident_misconception' : 'standard_error');
      expectedDisplay = expectedAns === 'A'
        ? item.contrast_data?.concept_a || 'Concepto A'
        : item.contrast_data?.concept_b || 'Concepto B';
      break;
    }

    case 'number_sort': {
      const matches = response.numberSortMatches || {};
      const items = item.number_sort_data?.items || [];
      if (items.length > 0) {
        let allMatch = true;
        for (const pair of items) {
          if (!matches[pair.id] || normalizeStr(matches[pair.id]) !== normalizeStr(pair.correct_value)) {
            allMatch = false;
            break;
          }
        }
        correct = allMatch;
      } else {
        const expectedMap = (item.options as any)?.expected_matches || {};
        const keys = Object.keys(expectedMap);
        if (keys.length > 0) {
          correct = keys.every((k) => normalizeStr(matches[k]) === normalizeStr(expectedMap[k]));
        } else {
          const values = Object.values(matches);
          correct = values.length > 0 && values.every((v) => normalizeStr(v).length > 0);
        }
      }
      if (!correct) errorCode = 'E6'; // wrong number/deadline/amount
      cognitiveState = correct ? 'mastered' : (confidence === 3 ? 'confident_misconception' : 'standard_error');
      expectedDisplay = items.map((p) => `${p.concept}: ${p.correct_value}`).join(' | ');
      break;
    }

    case 'spot_error': {
      const selected = response.spotSelectedSpanId;
      const spotData = item.spot_error_data;
      if (spotData?.erroneous_span) {
        const normSelected = normalizeStr(selected);
        const normErr = normalizeStr(spotData.erroneous_span);
        const exact = normSelected.length > 0 && normSelected === normErr;
        const overlapping = normSelected.length >= 3 && (normErr.includes(normSelected) || normSelected.includes(normErr));
        const spanCorrect = exact || overlapping;

        let correctionCorrect = true;
        if (response.spotCorrection && spotData.corrected_text) {
          const normCorr = normalizeStr(response.spotCorrection);
          const normExp = normalizeStr(spotData.corrected_text);
          correctionCorrect = normCorr.length > 0 && (normExp === normCorr || normExp.includes(normCorr) || normCorr.includes(normExp));
        }

        correct = spanCorrect && correctionCorrect;
        expectedDisplay = `Error legal: "${spotData.erroneous_span}" → Corrección: "${spotData.corrected_text || 'Regla correcta'}"`;
      } else if (spotData?.error_spans && spotData.error_spans.length > 0) {
        const found = spotData.error_spans.find((s: any) => s.id === selected || s.text === selected);
        correct = !!found?.is_error;
        expectedDisplay = spotData.error_spans.find((s: any) => s.is_error)?.text || 'Proposición infractora';
      } else {
        correct = !!response.selectedOption && response.selectedOption === item.correct_answer;
      }
      if (!correct) errorCode = confidence === 3 ? 'E8' : 'E4';
      cognitiveState = correct ? 'mastered' : (confidence === 3 ? 'confident_misconception' : 'standard_error');
      break;
    }

    case 'two_tier': {
      const tier1 = item.two_tier_data?.tier1;
      const tier2 = item.two_tier_data?.tier2;

      const tier1Expected = tier1?.options?.find((o) => o.is_correct)?.id || item.correct_answer || 'A';
      const tier2Expected =
        tier2?.options?.find((o) => o.is_correct)?.id ||
        item.two_tier_data?.correct_tier2_answer ||
        (item.two_tier_data as any)?.correct_reasoning ||
        'A';

      const tier1Correct = response.selectedOption === tier1Expected;
      const tier2Correct = response.userReasoning === tier2Expected;

      twoTierQuadrant = classifyTwoTierQuadrant(tier1Correct, tier2Correct);
      correct = tier1Correct && tier2Correct;

      if (!correct) {
        if (twoTierQuadrant === 'Q2_FragileKnowledge') {
          errorCode = 'E7'; // Lucky guess without causal foundation
          cognitiveState = 'lucky_recognition';
        } else if (twoTierQuadrant === 'Q3_Misread') {
          errorCode = 'E3'; // Misreading / application slip
          cognitiveState = 'recognition_failure';
        } else {
          errorCode = confidence === 3 ? 'E8' : 'E1';
          cognitiveState = confidence === 3 ? 'confident_misconception' : 'standard_error';
        }
      } else {
        cognitiveState = 'mastered';
      }
      expectedDisplay = `Nivel 1: [${tier1Expected}] · Nivel 2: [${tier2Expected}]`;
      break;
    }

    case 'exception_tree': {
      const testCase = item.exception_tree_data?.test_cases?.[0];
      const expectedLeaf = testCase?.correct_leaf_id || item.correct_answer || 'A';
      correct = !!response.selectedOption && response.selectedOption === expectedLeaf;
      if (!correct) errorCode = confidence === 3 ? 'E8' : 'E4';
      cognitiveState = correct ? 'mastered' : (confidence === 3 ? 'confident_misconception' : 'standard_error');
      expectedDisplay = testCase?.explanation || `Rama resolutoria correcta: ${expectedLeaf}`;
      break;
    }

    case 'fact_variant': {
      const variant = item.fact_variant_data?.variants?.[0];
      const expectedAnswer =
        item.correct_answer ||
        (variant?.outcome_changes ? 'A' : 'B') ||
        variant?.correct_outcome ||
        'A';
      correct = !!response.selectedOption && response.selectedOption === expectedAnswer;
      if (!correct) errorCode = confidence === 3 ? 'E8' : 'E6';
      cognitiveState = correct ? 'mastered' : (confidence === 3 ? 'confident_misconception' : 'standard_error');
      expectedDisplay = variant?.explanation || `Consecuencia jurídica: ${expectedAnswer}`;
      break;
    }

    default: {
      correct = !!response.selectedOption && response.selectedOption === item.correct_answer;
      cognitiveState = correct ? 'mastered' : (confidence === 3 ? 'confident_misconception' : 'standard_error');
      break;
    }
  }

  if (correct) {
    // Hygiene: a successful attempt carries no failure diagnostic.
    errorCode = undefined;
  }

  return {
    correct,
    blank: false,
    expectedDisplay,
    errorCode,
    cognitiveState,
    generativeMatch,
    nearMissDiagnostic,
    twoTierQuadrant,
    blankResults,
  };
}
