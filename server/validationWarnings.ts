import { auditItemPedagogicalQuality } from '../src/utils/learningDesignValidator.ts';
import type { Item, QualityWarning } from '../src/types.ts';

/** Item types whose `options` array is the user-facing choice set (one correct answer expected). */
const mcqLikeTypes = new Set<Item['item_type']>(['cover_and_generate_mcq', 'pretest_item']);

function inlineWarningsForItem(item: Item): QualityWarning[] {
  const warnings: QualityWarning[] = [];

  if (!item.legal_basis?.trim()) {
    warnings.push({
      item_id: item.id,
      severity: 'critical',
      rule: 'missing_legal_basis',
      message: `El ítem "${item.stem.slice(0, 40)}..." carece de cita de base legal explícita.`,
    });
  }

  if (mcqLikeTypes.has(item.item_type)) {
    const options = item.options ?? [];
    // Choice-based structural checks only apply when a choice set is expected:
    // cover/generate MCQs always carry options, while pretest items default to
    // the generative free-text mode (correct_answer, no options array).
    const choicesExpected = item.item_type === 'cover_and_generate_mcq' || options.length > 0;
    if (choicesExpected && options.length < 3) {
      warnings.push({
        item_id: item.id,
        severity: 'critical',
        rule: 'insufficient_options',
        message: `El ítem tiene menos de 3 opciones de respuesta (${options.length}).`,
      });
    }

    if (choicesExpected && options.length > 0) {
      const seenIds = new Set<string>();
      const duplicateIds = new Set<string>();
      for (const option of options) {
        if (seenIds.has(option.id)) duplicateIds.add(option.id);
        seenIds.add(option.id);
      }
      if (duplicateIds.size > 0) {
        warnings.push({
          item_id: item.id,
          severity: 'critical',
          rule: 'duplicate_option_ids',
          message: `Los identificadores de opción ${[...duplicateIds].map((id) => `"${id}"`).join(', ')} están duplicados.`,
        });
      }

      const correctCount = options.filter((option) => option.is_correct).length;
      if (correctCount === 0) {
        warnings.push({
          item_id: item.id,
          severity: 'critical',
          rule: 'missing_correct_answer',
          message: 'Ninguna opción está marcada como correcta.',
        });
      } else if (correctCount > 1) {
        warnings.push({
          item_id: item.id,
          severity: 'critical',
          rule: 'multiple_correct_options',
          message: `Hay ${correctCount} opciones marcadas como correctas; se exige exactamente una.`,
        });
      }
    }

    const missingExplanations = options.filter(
      (option) => !option.is_correct && !option.explanation?.trim(),
    );
    if (missingExplanations.length > 0) {
      warnings.push({
        item_id: item.id,
        severity: 'warning',
        rule: 'missing_distractor_explanation',
        message: `Los distractores ${missingExplanations.map((option) => `"${option.id}"`).join(', ')} no tienen explicación de falsedad.`,
      });
    }

    const missingTrapTypes = options.filter((option) => !option.is_correct && !option.trap_type);
    if (missingTrapTypes.length > 0) {
      warnings.push({
        item_id: item.id,
        severity: 'warning',
        rule: 'missing_trap_type',
        message: `Los distractores ${missingTrapTypes.map((option) => `"${option.id}"`).join(', ')} no tienen tipología de trampa asignada.`,
      });
    }
  }

  return warnings;
}

function canonicalRule(rule: string): string {
  switch (rule) {
    case 'missing_legal_basis':
    case 'legal_basis_required':
      return 'legal_basis_required';
    case 'insufficient_options':
    case 'options_count':
      return 'options_count';
    case 'missing_distractor_explanation':
    case 'distractor_explanation_missing':
      return 'distractor_explanation_missing';
    case 'missing_trap_type':
    case 'distractor_trap_type_missing':
      return 'distractor_trap_type_missing';
    default:
      return rule;
  }
}

function pedagogicalWarningsForItem(item: Item): QualityWarning[] {
  const answerOverlapIsExpected =
    item.item_type === 'cloze' ||
    item.item_type === 'contrast_card' ||
    item.item_type === 'retrieval_prompt' ||
    item.item_type === 'spot_error';

  return auditItemPedagogicalQuality(item).warnings.map((warning) => {
    if (warning.rule !== 'answer_in_stem' || !answerOverlapIsExpected) return warning;

    return {
      ...warning,
      severity: 'warning',
      pedagogical_rationale: `${warning.pedagogical_rationale ?? ''} En este formato, la coincidencia léxica forma parte del ejercicio (texto mutilado, recuperación, comparación o corrección de errores) y no se considera una pista crítica.`,
    };
  });
}

/** Combine the existing inline checks with pedagogical and figure-status diagnostics. */
export function buildValidationWarnings(items: Item[]): QualityWarning[] {
  const warningsByIdentity = new Map<string, QualityWarning>();

  for (const item of items) {
    const itemWarnings = [
      ...inlineWarningsForItem(item),
      ...pedagogicalWarningsForItem(item),
    ];

    for (const warning of itemWarnings) {
      const identity = JSON.stringify([warning.item_id, canonicalRule(warning.rule)]);
      if (!warningsByIdentity.has(identity)) warningsByIdentity.set(identity, warning);
    }

    if (item.figure_status === 'ESTIMATED_LPGE') {
      const warning: QualityWarning = {
        item_id: item.id,
        severity: 'warning',
        rule: 'estimated_figure',
        message: 'Cuantía estimada: verificar la actualización vigente antes de su uso.',
        remediation: 'Contrasta la cifra con la norma y publicación oficial aplicables.',
      };
      warningsByIdentity.set(JSON.stringify([warning.item_id, warning.rule]), warning);
    }
  }

  return [...warningsByIdentity.values()];
}

/**
 * Critical blocking errors for a single item: the subset of validation
 * warnings that must never accompany a `validated`/`active` promotion.
 * Used by the POST/PUT /api/items quality gate and by the ItemBank UI.
 */
export function getCriticalItemErrors(item: Item): QualityWarning[] {
  return buildValidationWarnings([item]).filter((warning) => warning.severity === 'critical');
}

/**
 * Promotion quality gate: an item being promoted to `validated`/`active`
 * must have zero critical validation warnings (P3-c). Draft/dead statuses
 * pass freely so work-in-progress can never be lost. Returns a 422 payload
 * when the gate blocks, or null when the promotion may proceed.
 */
export function promotionGatePayload(candidate: Partial<Item> & { status?: string }): {
  error: string;
  warnings: QualityWarning[];
} | null {
  if (candidate.status !== 'validated' && candidate.status !== 'active') return null;
  const warnings = getCriticalItemErrors(candidate as Item);
  if (warnings.length === 0) return null;
  return {
    error: 'El ítem no supera la validación crítica previa: corrige estos avisos antes de validar o activar',
    warnings,
  };
}
