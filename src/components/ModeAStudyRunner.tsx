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
 * Helper to select exactly 3 options for Mode A gentle check,
 * guaranteeing the correct answer is always present and never dropped.
 */
export function getModeAOptions(item: Item): MCQOption[] {
  if (item.options && item.options.length > 0) {
    const correctOpt = item.options.find(
      (o) => o.is_correct || (Boolean(item.correct_answer) && o.id === item.correct_answer)
    );
    const distractors = item.options.filter(
      (o) => !o.is_correct && (!item.correct_answer || o.id !== item.correct_answer)
    );

    if (correctOpt) {
      // Pick up to 2 distractors to create a gentle 3-option MCQ
      const chosenDistractors = distractors.slice(0, 2);
      const combined = [correctOpt, ...chosenDistractors];
      // Keep original order by id (e.g. A, B, C)
      combined.sort((a, b) => a.id.localeCompare(b.id));
      return combined.map((opt) => ({
        ...opt,
        is_correct:
          opt.is_correct || (Boolean(item.correct_answer) && opt.id === item.correct_answer),
      }));
    }
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
  // Mode A has two stages: 'read' (Rule + Worked Example + Hint) and 'check' (Gentle verification)
  const [stage, setStage] = useState<'read' | 'check'>('read');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checkedResult, setCheckedResult] = useState<boolean | null>(null);
  const [hasFailedPrevious, setHasFailedPrevious] = useState(false);

  // Reset state whenever a new item is presented in the batch queue
  React.useEffect(() => {
    setStage('read');
    setSelectedOption(null);
    setCheckedResult(null);
    setHasFailedPrevious(false);
  }, [item.id]);

  const effectiveIndex = queueIndex ?? currentIndex ?? 0;
  const effectiveTotal = queueTotal ?? totalItems ?? 1;

  // Fallbacks for rule statement
  const ruleText = item.rule_statement || item.why_correct || item.stem;

  // Rich fallback chain for worked example:
  // 1. First entry of distractor_analysis
  // 2. item.why_correct (if distinct from ruleText)
  // 3. item.corrective_rule
  // 4. Contextual legal application based on stem & legal basis
  const workedExample = useMemo(() => {
    if (item.distractor_analysis && Object.keys(item.distractor_analysis).length > 0) {
      const firstAnalysis = Object.values(item.distractor_analysis)[0];
      if (firstAnalysis && firstAnalysis.trim().length > 0) return firstAnalysis;
    }
    if (item.why_correct && item.why_correct !== ruleText) {
      return `Aplicación de la regla: ${item.why_correct}`;
    }
    if (item.corrective_rule) {
      return `Criterio de resolución práctica: ${item.corrective_rule}`;
    }
    const truncatedStem =
      item.stem.length > 120 ? `${item.stem.slice(0, 117)}...` : item.stem;
    return `Ejemplo práctico de aplicación para ${item.legal_basis || 'la norma regulada'}: Ante el supuesto de hecho regulado ("${truncatedStem}"), la subsunción jurídica exige verificar minuciosamente los requisitos y plazos tasados en el precepto sin alterar el régimen general aplicable.`;
  }, [item, ruleText]);

  // Rich fallback chain for hint (átomo discriminador):
  // 1. condition_if_distractor_correct first entry
  // 2. corrective_rule
  // 3. First option with explanation
  // 4. Contextual discriminative hint
  const hintText = useMemo(() => {
    if (
      item.condition_if_distractor_correct &&
      Object.keys(item.condition_if_distractor_correct).length > 0
    ) {
      const firstCondition = Object.values(item.condition_if_distractor_correct)[0];
      if (firstCondition && firstCondition.trim().length > 0) return firstCondition;
    }
    if (item.corrective_rule) {
      return `Pista discriminadora clave: ${item.corrective_rule}`;
    }
    const optWithExpl = item.options?.find((o) => !o.is_correct && o.explanation);
    if (optWithExpl?.explanation) {
      return `Atención a la trampa conceptual: ${optWithExpl.explanation}`;
    }
    return `Átomo discriminador / Pista clave (${item.legal_basis || 'Base legal'}): Presta especial atención al sujeto legalmente obligado, la naturaleza imperativa del plazo y la literalidad exacta exigida en la norma.`;
  }, [item]);

  // Gentle check options: guarantee correct option is always present and picked with 2 distractors
  const options = useMemo(() => getModeAOptions(item), [item]);

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    setSelectedOption(optId);
    setCheckedResult(isCorrect);
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
            {stage === 'read' ? 'Paso 1/2: Codificación' : 'Paso 2/2: Chequeo'}
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

        {stage === 'read' ? (
          <>
            {/* Reinforcement Notice if user looped back after failing gentle check */}
            {hasFailedPrevious && (
              <div className="p-4 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-200 text-xs sm:text-sm flex items-start space-x-3 animate-fadeIn">
                <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-300">Bucle de Refuerzo Activo</p>
                  <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                    Has fallado el chequeo suave previo. Relee minuciosamente la norma y el átomo discriminador para
                    identificar con precisión el elemento clave antes de reintentar.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Never open cold — Present rule first, then worked example, then hint */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sky-400">
                <Shield className="w-4 h-4" />
                <span>Norma y Principio Jurídico ({item.legal_basis || 'Base Legal'})</span>
              </div>
              <div className="p-4 sm:p-5 bg-sky-950/20 border border-sky-800/30 rounded-xl text-slate-100 text-base font-legal-serif leading-relaxed">
                {ruleText}
              </div>
            </div>

            {/* Worked Example */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ejemplo Práctico Guiado (Worked Example)</span>
              </div>
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-xl text-slate-300 text-sm leading-relaxed">
                {workedExample}
              </div>
            </div>

            {/* Scaffold Hard: Hint / Átomo Discriminador inline and visible by default */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>Átomo Discriminador / Pista Clave</span>
              </div>
              <div className="p-4 bg-amber-950/20 border border-amber-800/30 rounded-xl text-amber-200/90 text-xs sm:text-sm leading-relaxed">
                {hintText}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStage('check')}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition flex items-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Comprender y pasar al chequeo suave</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Gentle Check (Lowest cognitive load: 3-Option MCQ with single-element distractor violation) */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400">
                Chequeo Suave de Codificación (Modo A)
              </span>
              <h2 className="text-lg font-bold text-white font-legal-serif">{item.stem}</h2>
              <p className="text-xs text-slate-400">
                Selecciona la opción correcta tras haber leído la norma y el ejemplo guiado. (Cada distractor
                viola un solo elemento de la regla).
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {options.map((opt: MCQOption) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOpt =
                  opt.is_correct || (Boolean(item.correct_answer) && opt.id === item.correct_answer);

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-sky-700';
                if (selectedOption !== null) {
                  if (isCorrectOpt) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !isCorrectOpt) {
                    btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(opt.id, Boolean(isCorrectOpt))}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start space-x-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 shrink-0">
                      {opt.id}
                    </span>
                    <div className="flex-1 text-sm">
                      <p>{opt.text}</p>
                      {selectedOption !== null && opt.explanation && (
                        <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="pt-4 space-y-4 border-t border-sky-900/30">
                <div className="p-4 rounded-xl border text-xs sm:text-sm leading-relaxed space-y-2.5 bg-slate-900/60 border-slate-800">
                  {checkedResult ? (
                    <div className="text-emerald-400 font-semibold flex items-center space-x-2">
                      <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>¡Correcto! Átomo codificado con éxito en la memoria.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-rose-400 font-semibold flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>Respuesta incorrecta: el modelo mental aún no está fijado.</span>
                      </div>
                      {(() => {
                        const correctOpt = options.find(
                          (o) => o.is_correct || o.id === item.correct_answer
                        );
                        const selectedOptObj = options.find((o) => o.id === selectedOption);
                        return (
                          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg text-slate-300 text-xs space-y-1.5">
                            {correctOpt && (
                              <p>
                                <strong className="text-emerald-400 font-mono">
                                  Opción correcta ({correctOpt.id}):
                                </strong>{' '}
                                {correctOpt.text}
                              </p>
                            )}
                            {selectedOptObj?.explanation && (
                              <p className="text-slate-400">
                                <strong className="text-amber-400">Fallo detectado:</strong>{' '}
                                {selectedOptObj.explanation}
                              </p>
                            )}
                            <p className="text-sky-300 pt-1 border-t border-slate-800">
                              <strong>Regla jurídica:</strong> {ruleText}
                            </p>
                            <p className="text-amber-300/90 text-[11px] pt-1 font-mono">
                              🔁 Reactivo reencolado al lote de Modo A: volverás a responderlo antes de pasar al examen.
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-mono">
                    {checkedResult
                      ? '✓ Marcado como apto para entrenamiento (Modo B).'
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
                          onClick={() => {
                            setHasFailedPrevious(true);
                            setStage('read');
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition flex items-center space-x-1.5 cursor-pointer border border-slate-700"
                          title="Volver a leer la norma y el ejemplo guiado antes de continuar"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Revisar Norma</span>
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
