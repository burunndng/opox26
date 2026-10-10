import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Shield,
  Check,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { Item, MCQOption } from '../types.ts';

export interface ModeAStudyRunnerProps {
  item: Item;
  currentIndex?: number;
  totalItems?: number;
  queueIndex?: number;
  queueTotal?: number;
  uniquePassedCount?: number;
  uniqueTotalCount?: number;
  isRemediation?: boolean;
  lapseCount?: number;
  onCompleted: (result: { success: boolean; item: Item } | boolean) => void;
  onExit: () => void;
}

/**
 * Mode A presents the item exactly as the exam does: the full four-option
 * MCQ, in the original order, with the keyed option marked for scoring only.
 * Earlier versions dropped one distractor to build a "gentle" three-option
 * question; that silently changed the item being tested, so all options are
 * now kept.
 */
export function getModeAOptions(item: Item): MCQOption[] {
  if (item.options && item.options.length > 0) {
    return item.options.map((opt) => ({
      ...opt,
      is_correct:
        opt.is_correct || (Boolean(item.correct_answer) && opt.id === item.correct_answer),
    }));
  }

  // Fallback options
  return [
    {
      id: 'A',
      text: item.correct_answer || 'Cumplimiento estricto de la norma según el supuesto regulado.',
      is_correct: true,
    },
    {
      id: 'B',
      text: 'Alteración del plazo por acuerdo entre las partes interesadas.',
      is_correct: false,
      explanation:
        'Violación de elemento: los plazos legales son imperativos y no disponibles por las partes.',
    },
    {
      id: 'C',
      text: 'Inaplicación del régimen de responsabilidad subsidiaria del empresario.',
      is_correct: false,
      explanation:
        'Violación de elemento: desconoce el régimen de responsabilidad legal previsto.',
    },
  ];
}

export interface ModeAFeedback {
  isCorrect: boolean;
  correctOption?: MCQOption;
  selectedOption?: MCQOption;
  legalBasis: string;
  rule: string;
  application: string;
  cue: string;
  /** Why the learner's chosen option fails, when the seed explains it. */
  selectedOptionExplanation?: string;
}

/**
 * Builds the post-answer explanation. Every block is distinct on purpose:
 * the rule states the norm, the application resolves the stem, and the cue is
 * the short retrieval key. A distractor explanation is never presented as a
 * worked example.
 */
export function buildModeAFeedback(item: Item, selectedOptionId: string | null): ModeAFeedback {
  const options = getModeAOptions(item);
  const correctOption = options.find((o) => o.is_correct);
  const selectedOption = options.find((o) => o.id === selectedOptionId);
  const rule = item.rule_statement || item.why_correct || '';
  const application = item.why_correct && item.why_correct !== rule ? item.why_correct : '';
  const cue = item.corrective_rule && item.corrective_rule !== rule ? item.corrective_rule : '';

  const selectedOptionExplanation =
    selectedOption && !selectedOption.is_correct
      ? item.distractor_analysis?.[selectedOption.id] ?? selectedOption.explanation
      : undefined;

  return {
    isCorrect: Boolean(selectedOption?.is_correct),
    correctOption,
    selectedOption,
    legalBasis: item.legal_basis || 'Base legal',
    rule,
    application,
    cue,
    selectedOptionExplanation,
  };
}

export const ModeAStudyRunner: React.FC<ModeAStudyRunnerProps> = ({
  item,
  currentIndex,
  totalItems,
  queueIndex,
  queueTotal,
  uniquePassedCount,
  uniqueTotalCount,
  isRemediation = false,
  lapseCount = 0,
  onCompleted,
  onExit,
}) => {
  // Mode A is a single attempt-first step: the question is answered before any
  // normative material is shown, so the response is genuine retrieval.
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showRulePanel, setShowRulePanel] = useState(false);

  // Reset state whenever a new item is presented in the batch queue
  React.useEffect(() => {
    setSelectedOption(null);
    setShowRulePanel(false);
  }, [item.id]);

  const effectiveIndex = queueIndex ?? currentIndex ?? 0;
  const effectiveTotal = queueTotal ?? totalItems ?? 1;

  const options = useMemo(() => getModeAOptions(item), [item]);
  const feedback = useMemo(
    () => buildModeAFeedback(item, selectedOption),
    [item, selectedOption]
  );
  const checkedResult = selectedOption !== null ? feedback.isCorrect : null;

  const handleSelectOption = (optId: string) => {
    setSelectedOption(optId);
  };

  const handleAdvanceModeA = (success: boolean) => {
    onCompleted({ success, item });
  };

  const isLastInQueue = queueIndex !== undefined && queueTotal !== undefined
    ? queueIndex + 1 >= queueTotal
    : false;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Visual & UI Differentiation for Mode A (Calm, low-stakes, no timer, no score) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-sky-900/30 text-xs gap-3">
        <div className="flex items-center flex-wrap gap-2">
          {isRemediation ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-xs">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>🔁 REMEDIACIÓN EN LOTE · Fallos: {lapseCount || 2}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 LOTE MODO A · Aprendizaje Previo</span>
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
            Chequeo previo sin penalización
          </span>
          {uniqueTotalCount !== undefined && uniquePassedCount !== undefined && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
              ✓ {uniquePassedCount}/{uniqueTotalCount} asimilados
            </span>
          )}
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-3 text-slate-400 font-mono text-[11px] sm:text-xs">
          <span>
            Cola: Reactivo {effectiveIndex + 1} de {effectiveTotal}
          </span>
          <button
            onClick={onExit}
            className="px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Guardar sesión y salir al panel"
          >
            Salir
          </button>
        </div>
      </div>

      <div
        className={`bg-[#141c2e] border ${
          isRemediation ? 'border-amber-500/40' : 'border-sky-900/40'
        } rounded-2xl p-6 sm:p-8 shadow-xl space-y-6`}
      >
        {/* Remediation Context Banner */}
        {isRemediation && (
          <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-200 text-xs sm:text-sm flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">
                Alerta de Olvido Recurrente FSRS ({lapseCount} fallos previos)
              </p>
              <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                Este átomo ha acumulado fallos en tus drills de examen. Has entrado automáticamente en el bucle
                asistido para re-codificar los fundamentos de la regla y erradicar la interferencia cognitiva antes
                de reanudar el entrenamiento de alta presión.
              </p>
            </div>
          </div>
        )}

        <>
            {/* Attempt first: no rule, no rationale and no example are shown before the choice */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400">
                Chequeo previo (Modo A)
              </span>
              <h2 className="text-lg font-bold text-white font-legal-serif">{item.stem}</h2>
              <p className="text-xs text-slate-400">
                Responde primero. Después te muestro la regla aplicable, su aplicación a este supuesto y por qué
                falla la alternativa que hayas elegido.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {options.map((opt: MCQOption) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOpt = opt.is_correct;

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-sky-700';
                if (selectedOption !== null) {
                  if (isCorrectOpt) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start space-x-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 shrink-0">
                      {opt.id}
                    </span>
                    <div className="flex-1 text-sm">
                      <p>{opt.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="pt-4 space-y-4 border-t border-sky-900/30 animate-fadeIn">
                {/* 1. Outcome */}
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    checkedResult
                      ? 'bg-emerald-950/25 border-emerald-800 text-emerald-200'
                      : 'bg-rose-950/25 border-rose-900/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-semibold">
                    {checkedResult ? (
                      <>
                        <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>Correcto.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>
                          Incorrecto. La opción correcta es la{' '}
                          <span className="font-mono">{feedback.correctOption?.id}</span>.
                        </span>
                      </>
                    )}
                  </div>
                  {feedback.correctOption && (
                    <p className="mt-2 text-slate-200">
                      <strong className="font-mono text-emerald-400">
                        {feedback.correctOption.id}:
                      </strong>{' '}
                      {feedback.correctOption.text}
                    </p>
                  )}
                </div>

                {/* 2. Application of the rule to this specific item */}
                {(feedback.rule || feedback.application) && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sky-400">
                      <Shield className="w-4 h-4" />
                      <span>Regla y aplicación al supuesto ({feedback.legalBasis})</span>
                    </div>
                    <div className="p-4 bg-sky-950/20 border border-sky-800/30 rounded-xl text-slate-200 text-sm leading-relaxed space-y-2">
                      {feedback.rule && (
                        <p className="font-legal-serif text-slate-100">{feedback.rule}</p>
                      )}
                      {feedback.application && (
                        <p className="text-slate-300">{feedback.application}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Why the chosen distractor fails */}
                {feedback.selectedOptionExplanation && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Por qué falla la opción {feedback.selectedOption?.id}</span>
                    </div>
                    <div className="p-4 bg-amber-950/20 border border-amber-800/30 rounded-xl text-amber-100/90 text-xs sm:text-sm leading-relaxed">
                      {feedback.selectedOptionExplanation}
                    </div>
                  </div>
                )}

                {/* 4. Discriminating cue, distinct from the explanation above */}
                {feedback.cue && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Átomo discriminador para el repaso</span>
                    </div>
                    <div className="p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-xl text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
                      {feedback.cue}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-mono">
                    {checkedResult
                      ? '✓ Lista para el simulacro (Modo B).'
                      : 'Cola activa: el ítem se ha añadido al final del lote.'}
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {checkedResult ? (
                      <button
                        onClick={() => handleAdvanceModeA(true)}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition flex items-center space-x-2 shadow-md cursor-pointer"
                      >
                        <span>
                          {isLastInQueue ? 'Finalizar Lote de Aprendizaje' : 'Siguiente reactivo del lote'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowRulePanel((prev) => !prev)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition flex items-center space-x-1.5 cursor-pointer border border-slate-700"
                          title="Mostrar u ocultar la cita de la norma y la pista de repaso"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{showRulePanel ? 'Ocultar norma' : 'Ver norma y pista'}</span>
                        </button>
                        <button
                          onClick={() => handleAdvanceModeA(false)}
                          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition flex items-center space-x-2 shadow-md cursor-pointer"
                          title="Avanzar al siguiente ítem de la tanda; este ítem aparecerá al final"
                        >
                          <span>Continuar con el lote</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {showRulePanel && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                      <Lightbulb className="w-4 h-4" />
                      <span>Referencia normativa</span>
                    </div>
                    <div className="p-4 bg-amber-950/20 border border-amber-800/30 rounded-xl text-amber-100/90 text-xs sm:text-sm leading-relaxed space-y-1">
                      <p>
                        <strong className="font-mono">{feedback.legalBasis}</strong>
                      </p>
                      {feedback.rule && <p>{feedback.rule}</p>}
                      {feedback.cue && (
                        <p>
                          <strong>Pista:</strong> {feedback.cue}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        </div>
    </div>
  );
};
