import { Item, ConfidenceLevel } from '../types.ts';

export type ResponsePayload = {
  selectedOption?: string | null;
  clozeInput?: string;
  clozeInputs?: Record<string, string>;
  numberSortMatches?: Record<string, string>;
  spotSelectedSpanId?: string | null;
  userReasoning?: string | null;
  blank?: boolean;
};

export type EvaluationResult = {
  correct: boolean;
  blank: boolean;
  expectedDisplay: string;
  errorCode?: string;
};

function normalizeStr(s?: string | null): string {
  return (s || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
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
    };
  }

  let correct = false;
  let errorCode = confidence === 3 ? 'E8' : 'E1';
  let expectedDisplay =
    item.options?.find((o: any) => o.id === item.correct_answer)?.text ||
    item.correct_answer ||
    'Opción correcta';

  switch (item.item_type) {
    case 'cover_and_generate_mcq':
    case 'pretest_item':
    case 'retrieval_prompt': {
      const correctOpt = item.options?.find((o) => o.is_correct);
      const targetId = correctOpt?.id || item.correct_answer;
      correct = !!response.selectedOption && response.selectedOption === targetId;
      if (!correct) {
        errorCode = confidence === 3 ? 'E8' : 'E3';
      }
      if (correctOpt?.text) {
        expectedDisplay = `${correctOpt.id}: ${correctOpt.text}`;
      }
      break;
    }

    case 'cloze': {
      // 1. Check if user selected via discrete phrasing options (exact phrasing discrimination)
      if (response.selectedOption) {
        const correctOpt = item.options?.find((o) => o.is_correct);
        const targetId = correctOpt?.id || item.correct_answer || 'A';
        correct = response.selectedOption === targetId;
        if (correctOpt) {
          expectedDisplay = correctOpt.text;
        }
        break;
      }

      // 2. Multi-blank evaluation (one input per cloze gap)
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

        const results = resolvedEntries.map((entry) => {
          const userVal = normalizeStr(response.clozeInputs![entry.id]);
          const targets = [entry.answer, ...entry.synonyms]
            .filter((value): value is string => Boolean(value))
            .map(normalizeStr)
            .filter((value) => value.length > 0);
          return targets.some((target) => target === userVal || (userVal.length >= 3 && target.includes(userVal)));
        });

        correct = resolvedEntries.length > 0 && results.every(Boolean);
        if (!correct) {
          const userValues = resolvedEntries.map((entry) => normalizeStr(response.clozeInputs![entry.id]));
          if (userValues.some((value) => /\d+/.test(value)) && resolvedEntries.some((entry) => /\d+/.test(entry.answer))) {
            errorCode = 'E6';
          } else {
            errorCode = confidence === 3 ? 'E8' : 'E1';
          }
        }
        expectedDisplay = resolvedEntries.map((entry) => entry.answer).filter(Boolean).join(' · ');
        break;
      }

      // 3. Legacy single-input evaluation
      const userVal = normalizeStr(response.clozeInput);
      const validTargets: string[] = [];

      if (item.correct_answer) validTargets.push(normalizeStr(item.correct_answer));
      if (item.cloze_data?.target_answer) validTargets.push(normalizeStr(item.cloze_data.target_answer));

      // Extract {{cN::answer}} targets from template
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

      correct = validTargets.length > 0 && validTargets.some((tgt) => tgt === userVal || (userVal.length >= 3 && tgt.includes(userVal)));

      if (!correct) {
        if (/\d+/.test(userVal) && validTargets.some((t) => /\d+/.test(t))) {
          errorCode = 'E6'; // numeric/deadline confusion
        } else {
          errorCode = confidence === 3 ? 'E8' : 'E1';
        }
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
          if (!matches[pair.id] || matches[pair.id].trim() !== pair.correct_value.trim()) {
            allMatch = false;
            break;
          }
        }
        correct = allMatch;
      } else {
        const expectedMap = (item.options as any)?.expected_matches || {};
        const keys = Object.keys(expectedMap);
        if (keys.length > 0) {
          correct = keys.every((k) => matches[k] === expectedMap[k]);
        } else {
          correct = Object.keys(matches).length > 0;
        }
      }
      if (!correct) errorCode = 'E6'; // wrong number/deadline/amount
      expectedDisplay = items.map((p) => `${p.concept}: ${p.correct_value}`).join(' | ');
      break;
    }

    case 'spot_error': {
      const selected = response.spotSelectedSpanId;
      const spotData = item.spot_error_data;
      if (spotData?.erroneous_span) {
        const normSelected = normalizeStr(selected);
        const normErr = normalizeStr(spotData.erroneous_span);
        correct = normSelected === normErr || normErr.includes(normSelected) || normSelected.includes(normErr);
        expectedDisplay = `Error legal: "${spotData.erroneous_span}" → Corrección: "${spotData.corrected_text || 'Regla correcta'}"`;
      } else if (spotData?.error_spans && spotData.error_spans.length > 0) {
        const found = spotData.error_spans.find((s: any) => s.id === selected || s.text === selected);
        correct = !!found?.is_error;
        expectedDisplay = spotData.error_spans.find((s: any) => s.is_error)?.text || 'Proposición infractora';
      } else {
        correct = !!response.selectedOption && response.selectedOption === item.correct_answer;
      }
      if (!correct) errorCode = confidence === 3 ? 'E8' : 'E4';
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

      correct = tier1Correct && tier2Correct;
      if (!correct) {
        if (tier1Correct && !tier2Correct) {
          errorCode = 'E7'; // Guessed correctly by lucky recognition without causal foundation
        } else {
          errorCode = confidence === 3 ? 'E8' : 'E1';
        }
      }
      expectedDisplay = `Nivel 1: [${tier1Expected}] · Nivel 2: [${tier2Expected}]`;
      break;
    }

    case 'exception_tree': {
      const testCase = item.exception_tree_data?.test_cases?.[0];
      const expectedLeaf = testCase?.correct_leaf_id || item.correct_answer || 'A';
      correct = !!response.selectedOption && response.selectedOption === expectedLeaf;
      if (!correct) errorCode = confidence === 3 ? 'E8' : 'E4';
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
      expectedDisplay = variant?.explanation || `Consecuencia jurídica: ${expectedAnswer}`;
      break;
    }

    default: {
      correct = !!response.selectedOption && response.selectedOption === item.correct_answer;
      break;
    }
  }

  return {
    correct,
    blank: false,
    expectedDisplay,
    errorCode,
  };
}
