import { Item, QualityWarning, QualityRuleType } from '../types.ts';

const SPANISH_STOPWORDS = new Set([
  'de', 'la', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no',
  'una', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'ya', 'o', 'este', 'sí', 'porque',
  'esta', 'entre', 'cuando', 'muy', 'sin', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde',
  'quien', 'desde', 'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros',
  'ese', 'eso', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'cuál', 'cuáles',
  'indica', 'señala', 'respecto', 'según', 'siguiente', 'siguientes', 'pregunta', 'caso'
]);

const CITATION_TOKENS = new Set([
  'art', 'arts', 'articulo', 'articulos', 'apdo', 'apartado', 'apartados',
  'ley', 'rd', 'real', 'decreto', 'ce', 'trlgss', 'lgss', 'lpac',
]);

const DISTINCTIVE_NUMBER_WORDS = new Set([
  'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'veinte', 'treinta',
  'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa', 'cien',
  'ciento', 'mil', 'millon', 'millones',
]);

export interface PedagogicalDiagnostic {
  score: number; // 0 - 100
  rating: 'excelente' | 'bueno' | 'necesita_revision' | 'critico';
  answerInStem: {
    detected: boolean;
    leakedPhrases: string[];
    details?: string;
  };
  overloadedConcepts: {
    detected: boolean;
    conceptCount: number;
    dimensionsFound: string[];
    details?: string;
  };
  longestOptionBias: {
    detected: boolean;
    ratio: number;
    details?: string;
  };
  absoluteWording: {
    detected: boolean;
    wordsFound: string[];
  };
  negativeStemIssue: {
    detected: boolean;
    details?: string;
  };
  warnings: QualityWarning[];
  recommendations: string[];
}

/**
 * Normalizes text for linguistic analysis (lowercase, remove punctuation, strip accents)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts meaningful n-grams (2 to 4 words) from text
 */
function extractNgrams(words: string[], minLen = 2, maxLen = 4): string[] {
  const ngrams: string[] = [];
  for (let len = minLen; len <= maxLen; len++) {
    for (let i = 0; i <= words.length - len; i++) {
      const slice = words.slice(i, i + len);
      // Check that not all words are stopwords
      const hasMeaningful = slice.some((w) => !SPANISH_STOPWORDS.has(w) && w.length >= 3);
      if (hasMeaningful) {
        ngrams.push(slice.join(' '));
      }
    }
  }
  return ngrams;
}

/**
 * 1. Checks if the correct answer or a major revealing clue is leaked in the stem.
 */
export function detectAnswerInStem(item: Partial<Item>): {
  detected: boolean;
  leakedPhrases: string[];
  details?: string;
} {
  const stem = item.stem || '';
  if (!stem.trim()) return { detected: false, leakedPhrases: [] };

  const collapseTimes = (text: string) => text.replace(/(\d{1,2})[:.](\d{2})\b/g, '$1$2');
  const normStem = normalizeText(collapseTimes(stem));
  const stemWords = normStem.split(' ').filter(Boolean);

  let correctAnswerText = '';
  if (item.options && item.options.length > 0) {
    const correctOpt = item.options.find((o) => o.is_correct || o.id === item.correct_answer);
    if (correctOpt) {
      correctAnswerText = correctOpt.text;
    }
  } else if (item.correct_answer) {
    correctAnswerText = item.correct_answer;
  }

  if (!correctAnswerText.trim()) {
    return { detected: false, leakedPhrases: [] };
  }

  const normAnswer = normalizeText(collapseTimes(correctAnswerText));
  const answerWords = normAnswer.split(' ').filter(Boolean);

  const leakedPhrases: string[] = [];

  // Check full literal answer match (if answer is >= 2 words or a distinctive single word)
  if (normAnswer.length >= 4 && !SPANISH_STOPWORDS.has(normAnswer)) {
    if (normStem.includes(normAnswer)) {
      leakedPhrases.push(correctAnswerText);
    }
  }

  // Check n-grams of 2-4 words from the correct answer appearing verbatim in the stem.
  // A phrase only counts as a leak when it carries distinctive content: either a
  // quantitative datum, or three-plus words with at least two content tokens.
  // Pure citations ("art. 39.3") and functional/topical bigrams ("del acto",
  // "a disposición", "ejercicio de") are echo, not answer leakage.
  if (answerWords.length >= 2) {
    const answerNgrams = extractNgrams(answerWords, 2, 4);
    for (const phrase of answerNgrams) {
      if (!normStem.includes(phrase) || leakedPhrases.includes(phrase)) continue;

      const phraseWords = phrase.split(' ');
      const isCitationOnly = phraseWords.every(
        (word) => SPANISH_STOPWORDS.has(word) || CITATION_TOKENS.has(word) || /^\d+$/.test(word),
      );
      if (isCitationOnly) continue;

      const contentTokens = phraseWords.filter(
        (word) => word.length >= 4 && !SPANISH_STOPWORDS.has(word) && !/^\d+$/.test(word),
      );
      const hasDistinctiveNumeral = phraseWords.some(
        (word) => /^\d+$/.test(word) || DISTINCTIVE_NUMBER_WORDS.has(word),
      );
      const isLeak = hasDistinctiveNumeral
        ? contentTokens.length >= 1
        : contentTokens.length >= 2 && phraseWords.length >= 3;

      if (isLeak) leakedPhrases.push(phrase);
    }
  }

  // Check specific distinctive numerical / proper noun leakage (e.g. "5 años", "TGSS", "1,5")
  for (const word of answerWords) {
    if (
      (word.length >= 4 || /\d/.test(word)) &&
      !SPANISH_STOPWORDS.has(word) &&
      !['articulo', 'ley', 'trlgss', 'parrafo', 'apartado'].includes(word)
    ) {
      // If the answer is short (1-2 words), check if the exact word is already in the question
      if (answerWords.length <= 2 && stemWords.includes(word) && !leakedPhrases.includes(word)) {
        leakedPhrases.push(word);
      }
    }
  }

  const detected = leakedPhrases.length > 0;
  let details: string | undefined;
  if (detected) {
    details = `El enunciado contiene el fragmento clave de la respuesta correcta ("${leakedPhrases.slice(0, 2).join('", "')}"). Esto permite al opositor resolver el ítem por mero emparejamiento superficial en vez de discriminación real.`;
  }

  return { detected, leakedPhrases, details };
}

/**
 * 2. Checks if an item is overloaded with too many concepts or heterogeneous cognitive tasks.
 */
export function detectOverloadedConcepts(item: Partial<Item>): {
  detected: boolean;
  conceptCount: number;
  dimensionsFound: string[];
  details?: string;
} {
  const stem = item.stem || '';
  const normStem = normalizeText(stem);

  const dimensionsFound: string[] = [];

  // 1. Numeric / Deadline dimension
  if (/\b(plazo|dias|meses|anos|porcentaje|cuantia|euros|coeficiente|interes|recargo|escala|limite|computo|prescripcion|caducidad|retroactividad)\b/.test(normStem)) {
    dimensionsFound.push('Magnitud o Plazo Temporal');
  }

  // 2. Institutional / Competence dimension
  if (/\b(tgss|inss|mutua|empresario|organo|competente|competencia|entidad gestora|tesoreria|instituto|inspeccion|juzgado)\b/.test(normStem)) {
    dimensionsFound.push('Atribución Orgánica / Competencial');
  }

  // 3. Exception / Conditional condition dimension
  if (/\b(salvo|excepto|excepcion|excepciones|a condicion de|siempre que|requisito|incompatibilidad|condicion|sin perjuicio|supuesto especial|concurso)\b/.test(normStem)) {
    dimensionsFound.push('Régimen de Excepciones o Condiciones');
  }

  // 4. Procedural effect / Legal consequence dimension
  if (/\b(prescribira|caducara|suspension|extincion|responsabilidad|responsabilidad directa|subsidiaria|solidaria|automaticidad|embargo|intangibilidad)\b/.test(normStem)) {
    dimensionsFound.push('Efecto Jurídico o Régimen de Responsabilidad');
  }

  // 5. Subject / Subject matter classification dimension
  if (/\b(fijo discontinuo|tiempo parcial|contingencia comun|profesional|accidente de trabajo|enfermedad profesional|contributiva|no contributiva)\b/.test(normStem)) {
    dimensionsFound.push('Clasificación Subjetiva o de Contingencia');
  }

  // Count question interrogatives or multi-tier questions
  const questionMarks = (stem.match(/\?/g) || []).length;
  const multiQuestionWords = (normStem.match(/\b(y cual|y que|y quien|asi como|al mismo tiempo)\b/g) || []).length;

  const wordCount = stem.split(/\s+/).length;
  const isTooLong = wordCount > 45;

  let conceptCount = dimensionsFound.length;
  if (questionMarks > 1 || multiQuestionWords > 0) {
    conceptCount += 1;
  }

  const detected = conceptCount >= 3 || (conceptCount >= 2 && isTooLong);

  let details: string | undefined;
  if (detected) {
    details = `El reactivo evalúa simultáneamente ${dimensionsFound.length} dimensiones normativas distintas (${dimensionsFound.join(', ')}). En psicometría de oposiciones, los ítems multifocales aumentan la carga cognitiva extraña e impiden diagnosticar con precisión qué regla específica desconoce el alumno.`;
  }

  return { detected, conceptCount, dimensionsFound, details };
}

/**
 * 3. Checks for longest option bias (correct answer is substantially longer than distractors)
 */
export function detectLongestOptionBias(item: Partial<Item>): {
  detected: boolean;
  ratio: number;
  details?: string;
} {
  if (!item.options || item.options.length < 3) {
    return { detected: false, ratio: 1.0 };
  }

  const correctOpt = item.options.find((o) => o.is_correct || o.id === item.correct_answer);
  const distractors = item.options.filter((o) => !o.is_correct && o.id !== item.correct_answer);

  if (!correctOpt || distractors.length === 0) {
    return { detected: false, ratio: 1.0 };
  }

  const correctLen = correctOpt.text.trim().length;
  const avgDistractorLen =
    distractors.reduce((sum, d) => sum + d.text.trim().length, 0) / distractors.length;

  const ratio = avgDistractorLen > 0 ? +(correctLen / avgDistractorLen).toFixed(2) : 1.0;
  const diffChars = correctLen - avgDistractorLen;

  const detected = ratio >= 1.65 && diffChars >= 25;
  let details: string | undefined;
  if (detected) {
    details = `La opción correcta es un ${Math.round((ratio - 1) * 100)}% más larga que el promedio de los distractores (${correctLen} caracteres vs ${Math.round(avgDistractorLen)}). Los opositores tienden a marcar la opción más extensa y detallada sin necesidad de conocer la regla.`;
  }

  return { detected, ratio, details };
}

/**
 * 4. Checks for absolute wording clichés
 */
export function detectAbsoluteWording(item: Partial<Item>): {
  detected: boolean;
  wordsFound: string[];
} {
  const allTexts = [
    item.stem || '',
    ...(item.options || []).map((o) => o.text || ''),
  ].join(' ');

  const norm = normalizeText(allTexts);
  const absolutePatterns = [
    'siempre',
    'nunca',
    'en ningun caso',
    'jamas',
    'todas las anteriores',
    'ninguna de las anteriores',
    'todos los supuestos',
    'bajo cualquier circunstancia',
  ];

  const wordsFound: string[] = [];
  for (const pat of absolutePatterns) {
    if (new RegExp(`\\b${pat}\\b`).test(norm)) {
      wordsFound.push(pat);
    }
  }

  return {
    detected: wordsFound.length > 0,
    wordsFound,
  };
}

/**
 * 5. Checks for unhighlighted negative stems
 */
export function detectNegativeStem(item: Partial<Item>): {
  detected: boolean;
  details?: string;
} {
  const stem = item.stem || '';
  // Check if stem asks for incorrect/negative option
  const hasNegativeKeyword = /\b(no|incorrecta|falsa|excepto|salvo|incompatible|excluido)\b/i.test(stem);
  if (!hasNegativeKeyword) return { detected: false };

  // Check if capitalized or marked clearly (e.g., "NO", "INCORRECTA", "**NO**", etc.)
  const hasEmphasizedNegative = /\b(NO|INCORRECTA|FALSA|EXCEPTO|SALVO)\b/.test(stem) || /<b>(no|incorrecta)<\/b>/i.test(stem);

  if (hasNegativeKeyword && !hasEmphasizedNegative) {
    return {
      detected: true,
      details: 'El enunciado contiene una formulación negativa ("no", "incorrecta", "excepto") en minúsculas. Debe resaltarse en MAYÚSCULAS o negrita para evitar errores de lectura mecánica.',
    };
  }

  return { detected: false };
}

/**
 * Master pedagogical validation audit
 */
export function auditItemPedagogicalQuality(item: Partial<Item>): PedagogicalDiagnostic {
  const warnings: QualityWarning[] = [];
  const recommendations: string[] = [];
  let deduction = 0;

  const itemId = item.id || 'draft-item';

  // 1. Legal basis check
  if (!item.legal_basis || item.legal_basis.trim() === '') {
    warnings.push({
      item_id: itemId,
      severity: 'critical',
      rule: 'legal_basis_required',
      message: 'Falta la base legal o artículo específico del TRLGSS / CE 1978.',
      pedagogical_rationale: 'Un ítem sin base legal precisa genera inseguridad y no permite al opositor cotejar con el texto normativo oficial.',
      remediation: 'Indica el artículo exacto (ej. "Art. 53.1 TRLGSS" o "Art. 167.3 CE").',
    });
    deduction += 25;
    recommendations.push('Añadir la cita legal exacta del TRLGSS o normativa aplicable.');
  }

  // 2. Answer in stem check
  const answerLeakage = detectAnswerInStem(item);
  if (answerLeakage.detected) {
    warnings.push({
      item_id: itemId,
      severity: 'critical',
      rule: 'answer_in_stem',
      message: 'Pista en el enunciado: la respuesta o término clave está revelado en la pregunta.',
      pedagogical_rationale: answerLeakage.details,
      remediation: `Reformula el enunciado eliminando las referencias directas a "${answerLeakage.leakedPhrases.join(', ')}" o conviértelo en una pregunta de recuperación inversa.`,
    });
    deduction += 35;
    recommendations.push(`Eliminar la pista en el enunciado ("${answerLeakage.leakedPhrases[0]}").`);
  }

  // 3. Overloaded concepts check
  const overload = detectOverloadedConcepts(item);
  if (overload.detected) {
    warnings.push({
      item_id: itemId,
      severity: 'warning',
      rule: 'overloaded_concepts',
      message: 'Sobrecarga conceptual: el ítem evalúa demasiadas dimensiones normativas a la vez.',
      pedagogical_rationale: overload.details,
      remediation: `Desglosa el ítem en 2 micro-preguntas atómicas o enfoca el reactivo exclusivamente en una dimensión (ej. solo el plazo, o solo el órgano competente).`,
    });
    deduction += 20;
    recommendations.push('Descomponer el ítem en proposiciones atómicas de una sola decisión normativa.');
  }

  // 4. Options count & Distractor analysis check (Official C1 format requires exactly 4 options: A, B, C, D)
  if (item.item_type === 'cover_and_generate_mcq' || (!item.item_type && item.options)) {
    if (!item.options || item.options.length !== 4) {
      warnings.push({
        item_id: itemId,
        severity: item.options && item.options.length < 3 ? 'critical' : 'warning',
        rule: 'options_count',
        message: `Contiene ${item.options ? item.options.length : 0} opciones. El formato oficial C1 Seguridad Social exige estrictamente 4 opciones (A, B, C, D).`,
        remediation: 'Añade o ajusta distractores plausibles hasta completar exactamente 4 opciones.',
      });
      deduction += 15;
    }

    if (item.options) {
      const missingExpl = item.options.filter((o) => !o.is_correct && !o.explanation);
      if (missingExpl.length > 0) {
        warnings.push({
          item_id: itemId,
          severity: 'warning',
          rule: 'distractor_explanation_missing',
          message: `${missingExpl.length} distractor(es) carecen de autopsia/explicación de error.`,
          pedagogical_rationale: 'Aprender de los distractores es el núcleo de la discriminación fina. Si no se explica por qué es falso, el opositor memoriza sin comprender la trampa.',
          remediation: 'Redacta por qué cada opción incorrecta no es aplicable.',
        });
        deduction += 10;
      }

      const missingTrap = item.options.filter((o) => !o.is_correct && !o.trap_type);
      if (missingTrap.length > 0) {
        warnings.push({
          item_id: itemId,
          severity: 'info',
          rule: 'distractor_trap_type_missing',
          message: `${missingTrap.length} distractor(es) no tienen tipología de trampa asignada.`,
          remediation: 'Asigna una trampa cognitiva (ej. sustitución numérica, confusión temporal, órgano incompetente).',
        });
        deduction += 5;
      }
    }
  }

  // 5. Longest option bias check
  const lengthBias = detectLongestOptionBias(item);
  if (lengthBias.detected) {
    warnings.push({
      item_id: itemId,
      severity: 'warning',
      rule: 'longest_option_bias',
      message: 'Sesgo de longitud: la opción correcta es desproporcionadamente más larga que los distractores.',
      pedagogical_rationale: lengthBias.details,
      remediation: 'Sintetiza la opción correcta o añade contexto paralelo a los distractores para equilibrar su extensión.',
    });
    deduction += 15;
    recommendations.push('Equilibrar la longitud sintáctica entre la opción correcta y los distractores.');
  }

  // 6. Absolute wording check
  const absoluteCheck = detectAbsoluteWording(item);
  if (absoluteCheck.detected) {
    warnings.push({
      item_id: itemId,
      severity: 'info',
      rule: 'absolute_wording',
      message: `Presencia de términos absolutistas ("${absoluteCheck.wordsFound.join('", "')}").`,
      pedagogical_rationale: 'En exámenes jurídicos, las opciones con "siempre" o "nunca" son casi siempre falsas por descartes evidentes, o "todas las anteriores" reduce la discriminación.',
      remediation: 'Utiliza formulaciones normativas matizadas o sustituye por casos concretos.',
    });
    deduction += 10;
  }

  // 7. Negative stem formatting check
  const negativeCheck = detectNegativeStem(item);
  if (negativeCheck.detected) {
    warnings.push({
      item_id: itemId,
      severity: 'info',
      rule: 'negative_stem_unhighlighted',
      message: 'Enunciado negativo sin destacar.',
      pedagogical_rationale: negativeCheck.details,
      remediation: 'Resalta el "NO" o "INCORRECTA" en mayúsculas sostenidas en el enunciado.',
    });
    deduction += 5;
  }

  const score = Math.max(0, Math.min(100, 100 - deduction));
  let rating: PedagogicalDiagnostic['rating'] = 'excelente';
  if (score < 50) rating = 'critico';
  else if (score < 75) rating = 'necesita_revision';
  else if (score < 90) rating = 'bueno';

  return {
    score,
    rating,
    answerInStem: answerLeakage,
    overloadedConcepts: overload,
    longestOptionBias: lengthBias,
    absoluteWording: absoluteCheck,
    negativeStemIssue: negativeCheck,
    warnings,
    recommendations,
  };
}
