import type { TrapType } from '../types';

export const TRAP_LABELS_ES: Record<TrapType, string> = {
  numeric_substitution: 'Sustitución numérica',
  partial_rule_accuracy: 'Regla parcialmente correcta',
  conceptual_merger: 'Mezcla de conceptos',
  temporal_confusion: 'Confusión temporal',
  wrong_competent_body: 'Órgano incompetente',
  exception_ignored: 'Excepción ignorada',
  overbroad_statement: 'Afirmación excesiva',
  hyper_narrow_statement: 'Regla demasiado estrecha',
  factual_misapplication: 'Aplicación fáctica errónea',
  true_but_irrelevant: 'Cierto pero irrelevante',
  familiar_wording_trap: 'Trampa de redacción',
  absolute_relative_confusion: 'Absoluto frente a relativo',
  rule_exception_swap: 'Regla y excepción invertidas',
  wrong_start_date: 'Fecha de inicio errónea',
  wrong_legal_object: 'Objeto jurídico erróneo',
  numeric_precision: 'Precisión numérica',
};

export function trapLabelEs(trap?: string | null): string {
  if (!trap) return '';
  return TRAP_LABELS_ES[trap as TrapType] ?? trap;
}
