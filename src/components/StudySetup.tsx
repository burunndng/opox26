import React from 'react';
import {
  Play,
  AlertOctagon,
  Crosshair,
  Shuffle,
  Target,
  BookOpen,
  ChevronRight,
  Brain,
  Clock,
} from 'lucide-react';
import type { Topic } from '../types.ts';

interface StudySetupProps {
  topics: Topic[];
  selectedTopicId: string | 'all';
  onSelectTopic: (topicId: string | 'all') => void;
  dueCount: number;
  openErrorsCount: number;
  onStartDue: () => void;
  onGoToErrors: () => void;
  onStartSimulacro: () => void;
  onOpenInterleaved: () => void;
  onStartPretest: () => void;
  onStartGuided: (topicId: string) => void;
}

/**
 * Estudiar entry screen: one smart default ("Empezar test") plus the
 * secondary ways to practise, each with a plain name and one-line
 * explanation. Replaces choosing between opaque session modes.
 */
export const StudySetup: React.FC<StudySetupProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  dueCount,
  openErrorsCount,
  onStartDue,
  onGoToErrors,
  onStartSimulacro,
  onOpenInterleaved,
  onStartPretest,
  onStartGuided,
}) => {
  const scopeName =
    selectedTopicId === 'all'
      ? 'todo el temario'
      : topics.find((t) => t.id === selectedTopicId)?.name ?? 'el tema elegido';
  const guidedTopicId =
    selectedTopicId !== 'all' ? selectedTopicId : topics[0]?.id;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <div className="pt-2">
        <div className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-1">
          OposiLab · Estudiar
        </div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-legal-serif">
          ¿Qué practicamos hoy?
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Un test al día mantiene el temario vivo. Si no sabes por dónde empezar,
          pulsa Empezar test: la app elige el repaso pendiente y preguntas nuevas.
        </p>
      </div>

      {/* Scope: which syllabus slice */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label htmlFor="study-scope" className="text-xs text-slate-400 font-medium shrink-0">
          Ámbito del test:
        </label>
        <select
          id="study-scope"
          value={selectedTopicId}
          onChange={(e) => onSelectTopic(e.target.value)}
          className="bg-[#121722] border border-[#20293a] rounded-md px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer w-full sm:max-w-md min-h-[44px]"
        >
          <option value="all">Todo el temario</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Smart default */}
      <div className="bg-[#121722] border border-[#20293a] rounded-lg p-5">
        {dueCount > 0 ? (
          <p className="text-sm text-slate-300 mb-3">
            Tienes <strong className="text-blue-400 font-mono tabular-nums">{dueCount}</strong>{' '}
            preguntas pendientes de repaso{dueCount === 1 ? '' : ''} en {scopeName}.
          </p>
        ) : (
          <p className="text-sm text-slate-300 mb-3">
            No hay repaso pendiente en {scopeName}. Seguimos con preguntas nuevas.
          </p>
        )}
        <button
          onClick={onStartDue}
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-xs transition min-h-[52px]"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Empezar test</span>
        </button>
        <p className="text-[11px] text-slate-500 mt-2 text-center">
          Repaso pendiente + preguntas nuevas, con −0,25 por fallo como en el examen.
        </p>
      </div>

      {/* Study-loop explainer: generative cover toggle + adaptive pacing */}
      <div className="flex items-start gap-2.5 rounded-lg border border-[#20293a] bg-[#121722]/60 px-4 py-3">
        <Brain className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Dentro del test puedes activar{' '}
          <strong className="text-slate-200">Generativo</strong> para escribir la regla antes de
          ver las opciones (recuperación activa antes del reconocimiento). El{' '}
          <Clock className="inline w-3 h-3 -mt-0.5 text-slate-400" />{' '}
          <strong className="text-slate-200">cronómetro de ritmo</strong> se adapta al tipo y la
          dificultad de cada pregunta.
        </p>
      </div>

      {/* Secondary ways to practise */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-3">
          Otras formas de practicar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onGoToErrors}
            className="text-left bg-[#121722] border border-[#20293a] hover:border-rose-700/60 rounded-lg p-4 transition min-h-[88px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-sm font-semibold text-slate-100">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Repasar fallos</span>
              </span>
              {openErrorsCount > 0 && (
                <span className="text-[11px] font-mono font-semibold text-rose-400 tabular-nums">
                  {openErrorsCount} abiertos
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Vuelve sobre las preguntas que fallaste hasta dominar la regla.
            </p>
          </button>

          <button
            onClick={onStartSimulacro}
            className="text-left bg-[#121722] border border-[#20293a] hover:border-slate-600 rounded-lg p-4 transition min-h-[88px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-sm font-semibold text-slate-100">
                <Crosshair className="w-4 h-4 text-blue-400" />
                <span>Simulacro con penalización</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              15 preguntas difíciles con −0,25 por fallo, como en el examen.
            </p>
          </button>

          <button
            onClick={onOpenInterleaved}
            className="text-left bg-[#121722] border border-[#20293a] hover:border-slate-600 rounded-lg p-4 transition min-h-[88px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-sm font-semibold text-slate-100">
                <Shuffle className="w-4 h-4 text-slate-400" />
                <span>Mezclar temas</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Preguntas de varios temas sin avisar: entrena no confundirlos.
            </p>
          </button>

          <button
            onClick={onStartPretest}
            className="text-left bg-[#121722] border border-[#20293a] hover:border-slate-600 rounded-lg p-4 transition min-h-[88px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-sm font-semibold text-slate-100">
                <Target className="w-4 h-4 text-slate-400" />
                <span>Test de nivel</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              10 preguntas a ciegas para saber de dónde partes en un tema.
            </p>
          </button>
        </div>

        <button
          onClick={() => guidedTopicId && onStartGuided(guidedTopicId)}
          disabled={!guidedTopicId}
          className="mt-3 w-full text-left bg-[#121722] border border-[#20293a] hover:border-slate-600 rounded-lg p-4 transition min-h-[76px] disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2 text-sm font-semibold text-slate-100">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Estudio guiado</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            Lee la regla, intenta recordarla y comprueba: para asentar un tema desde cero.
          </p>
        </button>
      </div>
    </div>
  );
};