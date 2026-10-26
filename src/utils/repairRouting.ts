import type { ErrorLog, Item } from '../types.ts';

/**
 * Repair routing lookup (P5 WP6).
 * Maps an error type code + confidence context to the prescribed repair
 * activity, item field / format that needs review, and a brief pedagogical
 * rationale. Pure — no DB or UI dependency — so both server (graduation block)
 * and UI (ErrorRepairStudio) can import consistently.
 */

export type RepairRouting = {
  errorTypeCode: string | string[];
  requiredRepairActivity: string;
  repairFormatHint: string; // the format the repair session should use (e.g. 'contrast_card', 'spot_error', 'number_sort')
  targetField?: string; // item field to inspect (e.g. 'stem', 'options', 'cloze_data.blanks')
  r: string; // brief rationale
};

export const REPAIR_ROUTES: RepairRouting[] = [
  { errorTypeCode: 'E1', requiredRepairActivity: 'review_legal_basis', repairFormatHint: 'contrast_card', targetField: 'legal_basis', r: 'Error básico / reconocimiento fallido → repasar regla de base' },
  { errorTypeCode: 'E2', requiredRepairActivity: 'rebuild_stem', repairFormatHint: 'cover_and_generate_mcq', targetField: 'stem', r: 'Doble clave / interpretación ambigua → reconstruir stem y opciones' },
  { errorTypeCode: 'E3', requiredRepairActivity: 'review_contrast', repairFormatHint: 'contrast_card', targetField: 'contrast_data.concept_a', r: 'Fallo de reconocimiento / misreading → comparar conceptos discriminantes (E3)' },
  { errorTypeCode: 'E4', requiredRepairActivity: 'spot_error_correction', repairFormatHint: 'spot_error', targetField: 'spot_error_data', r: 'Error de corrección / reparo directo (E4)' },
  { errorTypeCode: 'E5', requiredRepairActivity: 'compare_concepts', repairFormatHint: 'contrast_card', targetField: 'contrast_data', r: 'Fusión conceptual / error de fusión (E5)' },
  { errorTypeCode: 'E6', requiredRepairActivity: 'numeric_sort', repairFormatHint: 'number_sort', targetField: 'number_sort_data', r: 'Confusión numérica / de fechas o cuantías (E6)' },
  { errorTypeCode: 'E7', requiredRepairActivity: 'tier2_justification', repairFormatHint: 'two_tier', targetField: 'two_tier_data.tier2', r: 'Reconocimiento afortunado sin fundamento causal → forzar Tier-2 (E7)' },
  { errorTypeCode: 'E8', requiredRepairActivity: 'rebuild_and_compare', repairFormatHint: 'contrast_card', targetField: 'options', r: 'Error confiado / concepto asimilado → reconstruir y comparar (E8)' },
  { errorTypeCode: 'E9', requiredRepairActivity: 'regeneration_cover', repairFormatHint: 'cover_and_generate_mcq', targetField: 'generated_answer_before_options', r: 'Abstención / generación vacía → regenerar y comparar' },
];

/** Given an open confident-wrong error, returns whether this item is blocked from graduation. */
export function isBlockedFromGraduation(error: ErrorLog): boolean {
  // Block graduation when any open error is confident-wrong (confidence 3,
  // high-severity error type) and has not been repaired / mastered.
  const isHighSeverity = ['E8', 'E3', 'E4', 'E5'].includes(String(error.error_type_code));
  const isCriticalConfidentWrong =
    error.confidence === 3 && isHighSeverity && (error.status === 'open' || error.status === 'repairing');
  return isCriticalConfidentWrong;
}

/** Routing recommendation for an error log + item. */
export function routeForError(error: ErrorLog, item?: Item): RepairRouting {
  const codes = Array.isArray(error.error_type_code)
    ? error.error_type_code
    : [error.error_type_code || 'E1'];
  for (const route of REPAIR_ROUTES) {
    if (codes.some((c) => (route.errorTypeCode as string[] | string).includes?.(c) ?? route.errorTypeCode === c)) {
      return route;
    }
  }
  return REPAIR_ROUTES[0]; // default: review legal basis
}
