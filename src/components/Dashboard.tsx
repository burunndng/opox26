import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Scale,
  Play,
  RotateCcw,
  Shuffle,
  Target,
  AlertOctagon,
  Crosshair,
  Plus,
  Bookmark,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Cloud,
  CloudCheck,
  LogIn,
} from 'lucide-react';
import {
  Item,
  Cluster,
  ConfusionPair,
  ErrorLog,
  SavedSessionState,
  Topic,
  ActivityAttempt,
  Atom,
  BAREMOS,
} from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface DashboardProps {
  dueStats: {
    dueToday: number;
    learning: number;
    newItems: number;
    graduated: number;
    maintenance: number;
    openErrors: number;
    confidentWrong: number;
  };
  clusters: Cluster[];
  confusionPairs: ConfusionPair[];
  openErrors: ErrorLog[];
  items: Item[];
  atoms?: Atom[];
  attempts?: ActivityAttempt[];
  topics?: Topic[];
  selectedTopicId?: string | 'all';
  onSelectTopic?: (topicId: string | 'all') => void;
  onOpenCreateTopic?: () => void;
  onStartTopicDue?: (topicId: string) => void;
  onStartTopicPretest?: (topicId: string) => void;
  onStartTopicInterleaved?: (topicId: string) => void;
  onResumeSession?: (saved: SavedSessionState) => void;
  onStartDueSession: () => void;
  onStartInterleaved: () => void;
  onStartPretest: () => void;
  onStartSniper?: (options?: {
    subType?: 'numeric' | 'confident_wrong' | 'mixed';
    count?: number;
    baremoPenalty?: number;
  }) => void;
  onStartActivityType: (type: string) => void;
  onGoToErrors: () => void;
  onGoToContent: () => void;
  onGoToChat?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  dueStats,
  confusionPairs,
  openErrors,
  items,
  atoms = [],
  attempts = [],
  topics = [],
  onOpenCreateTopic,
  onStartTopicDue,
  onStartTopicPretest,
  onStartTopicInterleaved,
  onResumeSession,
  onStartInterleaved,
  onStartPretest,
  onStartSniper,
  onGoToErrors,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [recentSessions, setRecentSessions] = useState<SavedSessionState[]>([]);
  const [selectedBaremoPenalty, setSelectedBaremoPenalty] = useState<number>(0.25);
  const [sniperCount, setSniperCount] = useState<number>(10);
  const [activeSniperTab] = useState<'mixed' | 'numeric' | 'confident_wrong'>('mixed');

  // Load paused sessions from localStorage
  const refreshRecentSessions = () => {
    try {
      const raw = localStorage.getItem('oposilab_recent_sessions');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentSessions(parsed);
          return;
        }
      }
      const singleRaw = localStorage.getItem('oposilab_saved_session');
      if (singleRaw) {
        const parsed = JSON.parse(singleRaw);
        if (parsed?.id && Array.isArray(parsed?.items)) {
          setRecentSessions([parsed]);
          return;
        }
      }
      setRecentSessions([]);
    } catch {
      setRecentSessions([]);
    }
  };

  useEffect(() => {
    refreshRecentSessions();
  }, []);

  const handleDismissSession = (sessionId: string) => {
    const updated = recentSessions.filter((s) => s.id !== sessionId);
    setRecentSessions(updated);
    try {
      localStorage.setItem('oposilab_recent_sessions', JSON.stringify(updated));
      const singleRaw = localStorage.getItem('oposilab_saved_session');
      if (singleRaw) {
        const parsed = JSON.parse(singleRaw);
        if (parsed?.id === sessionId) {
          localStorage.removeItem('oposilab_saved_session');
        }
      }
    } catch {
      // ignore
    }
  };

  // Helper for per-topic statistics and progress
  const getTopicStats = (topicId: string) => {
    const tItems = items.filter((i) => i.topic_id === topicId);
    const tAtoms = atoms.filter((a) => a.topic_id === topicId);
    const tPairs = confusionPairs.filter((p) => p.topic_id === topicId);
    const tErrors = openErrors.filter(
      (e) => e.topic_id === topicId || tItems.some((i) => i.id === e.item_id)
    );

    const tItemIds = new Set(tItems.map((i) => i.id));
    const tAttempts = attempts.filter((a) => tItemIds.has(a.item_id));
    const attemptedIds = new Set(tAttempts.map((a) => a.item_id));

    // Mastered items: at least 2 correct attempts with high confidence
    const masteredIds = new Set<string>();
    for (const item of tItems) {
      const atts = tAttempts.filter((a) => a.item_id === item.id);
      const correctCount = atts.filter((a) => a.correct).length;
      if (correctCount >= 2 && atts.some((a) => a.confidence >= 2)) {
        masteredIds.add(item.id);
      }
    }

    const completed = attemptedIds.size;
    const graduated = masteredIds.size;
    const total = tItems.length;
    const progressPct = total > 0 ? Math.round((graduated / total) * 100) : 0;
    const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      atomsCount: tAtoms.length,
      pairsCount: tPairs.length,
      errorsCount: tErrors.length,
      completed,
      graduated,
      progressPct,
      completedPct,
    };
  };

  const activePausedSession = recentSessions[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* 1. Slim Paused Session Banner */}
      {activePausedSession && (
        <div className="bg-[#121722] border border-[#20293a] rounded-md px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <Bookmark className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="text-xs truncate">
              <span className="text-slate-400">Sesión en pausa: </span>
              <strong className="text-slate-100 font-medium">
                {activePausedSession.title || 'Entrenamiento cognitivo'}
              </strong>{' '}
              <span className="text-slate-400 font-mono text-[11px] ml-1 tabular-nums">
                · Reactivo {activePausedSession.currentIndex + 1} de {activePausedSession.items.length}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onResumeSession && onResumeSession(activePausedSession)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reanudar sesión</span>
            </button>
            <button
              onClick={() => handleDismissSession(activePausedSession.id)}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-[#182030] transition"
              title="Descartar sesión"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Cloud Persistence Notice (Unobtrusive) */}
      {!user ? (
        <div className="bg-[#121722]/80 border border-[#20293a] rounded-md p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <Cloud className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="text-slate-300">
              <span className="font-semibold text-slate-100">Almacenamiento Local-First</span>
              <span className="text-slate-400 ml-1.5">
                · Todos los datos se guardan en tu máquina. Opcionalmente conecta Google para sincronizar repasos entre dispositivos.
              </span>
            </div>
          </div>
          <button
            onClick={() => signInWithGoogle()}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#182030] hover:bg-[#202b40] text-slate-200 text-xs font-medium border border-[#20293a] shrink-0 transition"
          >
            <LogIn className="w-3.5 h-3.5 text-blue-400" />
            <span>Conectar Google</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#121722]/60 border border-[#20293a] rounded-md px-3 py-2 flex items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CloudCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sincronización en la nube activa para <strong className="text-slate-200">{user.email}</strong></span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 tabular-nums">Online</span>
        </div>
      )}

      {/* 2. Top Header & Focus Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 border-b border-[#20293a] pb-5">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-1">
            OposiLab · Laboratorio de Discriminación Legal
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-legal-serif">
            Módulos del Temario
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Práctica deliberada para dominar plazos, coeficientes, órganos competentes y trampas de examen sin memorización pasiva.
          </p>
        </div>

        {/* Global Summary Stats (Unboxed text with separators) */}
        <div className="flex items-center gap-4 shrink-0 text-xs text-slate-300">
          <div>
            <span className="text-slate-400">Pendientes hoy: </span>
            <strong className="text-blue-400 font-mono tabular-nums font-semibold">{dueStats.dueToday}</strong>
          </div>
          <span className="text-slate-700" aria-hidden="true">·</span>
          <div>
            <span className="text-slate-400">Total banco: </span>
            <strong className="text-slate-100 font-mono tabular-nums">{items.length}</strong>
          </div>
          {openErrors.length > 0 && (
            <>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <button
                onClick={onGoToErrors}
                className="hover:underline text-rose-400 font-medium flex items-center space-x-1"
              >
                <span>Errores abiertos:</span>
                <strong className="font-mono tabular-nums">{openErrors.length}</strong>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. Study Sets Grid (Temas) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Temario Registrado ({topics.length} materias)</span>
          </h2>
          {onOpenCreateTopic && (
            <button
              onClick={onOpenCreateTopic}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Tema</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topics.map((topic) => {
            const stats = getTopicStats(topic.id);

            return (
              <div
                key={topic.id}
                className="bg-[#121722] border border-[#20293a] hover:border-slate-700 rounded-lg p-5 flex flex-col justify-between transition-colors"
              >
                <div>
                  {/* Metadata line without candy pills */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono text-[11px] text-blue-400 font-medium uppercase tracking-wider">
                      {topic.id.includes('tema_7') ? 'Seguridad Social' : topic.id.includes('tema_1') ? 'Derecho Constitucional' : 'Temario General'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      {stats.total} reactivos
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-base font-bold text-slate-100 font-legal-serif line-clamp-2">
                    {topic.name}
                  </h3>

                  {/* Description / Scope */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {topic.description || 'Materia legislativa estructurada en proposiciones atómicas y pares de confusión.'}
                  </p>

                  {/* Progress & Metrics */}
                  <div className="mt-4 pt-3 border-t border-[#20293a] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Dominio de retención</span>
                      </span>
                      <span className="font-medium text-slate-200 font-mono tabular-nums">
                        {stats.graduated} / {stats.total} ({stats.progressPct}%)
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#0c0f17] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(2, stats.progressPct)}%` }}
                      />
                    </div>

                    {/* Unboxed Metadata metrics */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                      <span>{stats.atomsCount} átomos</span>
                      <span aria-hidden="true">·</span>
                      <span>{stats.pairsCount} pares confusión</span>
                      <span aria-hidden="true">·</span>
                      <span className={stats.errorsCount > 0 ? 'text-rose-400 font-medium' : 'text-slate-400'}>
                        {stats.errorsCount} fallos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-[#20293a] space-y-2">
                  <button
                    onClick={() => onStartTopicDue && onStartTopicDue(topic.id)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Iniciar Entrenamiento del Tema</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onStartTopicInterleaved && onStartTopicInterleaved(topic.id)}
                      className="inline-flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-md bg-[#182030] hover:bg-[#202b40] text-slate-300 text-xs font-medium border border-[#20293a] transition"
                      title="Práctica intercalada"
                    >
                      <Shuffle className="w-3 h-3 text-slate-400" />
                      <span>Intercalado</span>
                    </button>

                    <button
                      onClick={() => onStartTopicPretest && onStartTopicPretest(topic.id)}
                      className="inline-flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-md bg-[#182030] hover:bg-[#202b40] text-slate-300 text-xs font-medium border border-[#20293a] transition"
                      title="Pretest diagnóstico"
                    >
                      <Target className="w-3 h-3 text-slate-400" />
                      <span>Pretest</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {onOpenCreateTopic && (
            <div
              onClick={onOpenCreateTopic}
              className="border border-dashed border-[#20293a] hover:border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#121722]/30 hover:bg-[#121722]/60 min-h-[260px]"
            >
              <div className="p-2.5 rounded-md bg-[#182030] text-slate-400 mb-2">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold text-slate-200">
                Importar o Crear Nuevo Tema
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Carga texto legal o PDF para extraer proposiciones atómicas y generar reactivos de discriminación.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Secondary Drills (Interleaved, Error Studio, Sniper, Pretest) */}
      <div className="pt-6 border-t border-[#20293a] space-y-4">
        <div>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Modalidades Complementarias de Entrenamiento
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Intercalación entre bloques temáticos, calibración táctica bajo penalización y diagnóstico a ciegas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* A. Bloque Intercalado Global */}
          <div className="bg-[#121722] border border-[#20293a] rounded-md p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                <Shuffle className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-[11px]">Multitema</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Bloque Intercalado</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Mezcla reactivos de todos los temas sin etiquetas para entrenar discriminación pura.
              </p>
            </div>
            <button
              onClick={onStartInterleaved}
              className="mt-3 w-full flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded bg-[#182030] hover:bg-[#202b40] text-slate-200 text-xs font-medium border border-[#20293a] transition"
            >
              <span>Configurar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* B. Taller de Reparación */}
          <div className="bg-[#121722] border border-[#20293a] rounded-md p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span className="font-mono text-[11px] text-rose-400 tabular-nums font-semibold">
                  {openErrors.length} abiertos
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Taller de Errores</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Repara los conceptos confusos y las trampas en las que caíste con alta confianza.
              </p>
            </div>
            <button
              onClick={onGoToErrors}
              className="mt-3 w-full flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded bg-[#182030] hover:bg-[#202b40] text-rose-300 text-xs font-medium border border-[#20293a] transition"
            >
              <span>Reparar fallos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* C. Drill Sniper */}
          <div className="bg-[#121722] border border-[#20293a] rounded-md p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                <Crosshair className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-[11px]">Penalización</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Drill Sniper</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Trampas numéricas y abstención táctica bajo baremo oficial de penalización.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <select
                value={selectedBaremoPenalty}
                onChange={(e) => setSelectedBaremoPenalty(parseFloat(e.target.value))}
                className="bg-[#0c0f17] border border-[#20293a] text-slate-300 text-[10px] rounded px-1.5 py-1 focus:outline-none font-mono"
              >
                {BAREMOS.map((b) => (
                  <option key={b.id} value={b.penaltyPerError} className="bg-[#121722]">
                    {b.shortLabel}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  onStartSniper &&
                  onStartSniper({
                    subType: activeSniperTab,
                    count: sniperCount,
                    baremoPenalty: selectedBaremoPenalty,
                  })
                }
                className="flex-1 flex items-center justify-center space-x-1 py-1 px-2 rounded bg-[#182030] hover:bg-[#202b40] text-blue-400 text-xs font-medium border border-[#20293a] transition"
              >
                <span>Drill ({sniperCount})</span>
              </button>
            </div>
          </div>

          {/* D. Pretest Diagnóstico Global */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                <Target className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-[11px]">Diagnóstico</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Pretest Global</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Evaluación a ciegas para identificar lagunas antes del estudio pormenorizado.
              </p>
            </div>
            <button
              onClick={onStartPretest}
              className="mt-3 w-full flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <span>Iniciar test</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
