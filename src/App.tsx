import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ActivityRunner } from './components/ActivityRunner.tsx';
import { ErrorRepairStudio } from './components/ErrorRepairStudio.tsx';
import { ContentStudio } from './components/ContentStudio.tsx';
import { ItemBank } from './components/ItemBank.tsx';
import { CalibrationAnalytics } from './components/CalibrationAnalytics.tsx';
import { ExportSettingsMethodModal } from './components/ExportSettingsMethodModal.tsx';
import { InterleavedBlockModal } from './components/InterleavedBlockModal.tsx';
import { HelpShortcutsModal } from './components/HelpShortcutsModal.tsx';
import { JevLabModal } from './components/JevLabModal.tsx';
import { StudySetup } from './components/StudySetup.tsx';
import { AiChatbot } from './components/AiChatbot.tsx';
import { CreateTopicModal } from './components/CreateTopicModal.tsx';
import { MicroLessonRunner } from './components/MicroLessonRunner.tsx';
import { api } from './api.ts';
import { selectSniperItems } from './utils/sniperFilter.ts';
import { eligibleForPractice, buildPretestPool } from './utils/practicePools.ts';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import {
  Topic,
  Atom,
  Cluster,
  ConfusionPair,
  Item,
  ErrorLog,
  ActivityAttempt,
  QualityWarning,
  AppSettings,
  SavedSessionState,
} from './types.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>('all');

  // Core domain data
  const [topics, setTopics] = useState<Topic[]>([]);
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [microLessonTopic, setMicroLessonTopic] = useState<Topic | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [confusionPairs, setConfusionPairs] = useState<ConfusionPair[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [openErrors, setOpenErrors] = useState<ErrorLog[]>([]);
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [warnings, setWarnings] = useState<QualityWarning[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    ai_provider: 'gemini',
    ai_model: 'gemini-3.8-flash',
    default_language: 'es',
    srs_algorithm: 'fsrs',
    graduating_interval: 4,
    max_new_items_per_day: 15,
    confidence_required_for_graduation: 2,
    require_two_formats_for_graduation: true,
    require_interleaved_success_for_graduation: true,
  });

  const highContrast = !!settings.high_contrast;

  // Apply / remove the high-contrast theme on the document root
  useEffect(() => {
    if (highContrast) document.documentElement.setAttribute('data-contrast', 'high');
    else document.documentElement.removeAttribute('data-contrast');
  }, [highContrast]);

  const handleToggleHighContrast = async () => {
    const next = !highContrast;
    if (next) document.documentElement.setAttribute('data-contrast', 'high');
    else document.documentElement.removeAttribute('data-contrast');
    try {
      await api.updateSettings({ high_contrast: next });
      await loadData();
    } catch (e) {
      console.warn('No se pudo guardar la preferencia de contraste:', e);
    }
  };

  const [dueStats, setDueStats] = useState({
    dueToday: 0,
    learning: 0,
    newItems: 0,
    graduated: 0,
    maintenance: 0,
    openErrors: 0,
    confidentWrong: 0,
  });

  // Runner state
  const [runnerItems, setRunnerItems] = useState<Item[]>([]);
  const [runnerTitle, setRunnerTitle] = useState('Test');
  const [runnerMode, setRunnerMode] = useState<
    'srs' | 'interleaved' | 'activity_specific' | 'pretest' | 'repair' | 'sniper'
  >('srs');
  const [runnerBaremoPenalty, setRunnerBaremoPenalty] = useState<number>(0.25);
  const [runnerInitialIndex, setRunnerInitialIndex] = useState(0);
  const [runnerInitialResults, setRunnerInitialResults] = useState<{
    correct: number;
    total: number;
    confidences: number[];
  } | undefined>(undefined);
  const [runnerSessionId, setRunnerSessionId] = useState<string | undefined>(undefined);

  // Resume a saved session from localStorage or uploaded JSON
  const handleResumeSession = (saved: SavedSessionState) => {
    if (!saved || !saved.items || saved.items.length === 0) return;
    setRunnerItems(saved.items);
    setRunnerTitle(saved.title || 'Sesión Reanudada');
    setRunnerMode(saved.mode || 'srs');
    if (saved.baremoPenalty !== undefined) {
      setRunnerBaremoPenalty(saved.baremoPenalty);
    }
    setRunnerInitialIndex(saved.currentIndex || 0);
    setRunnerInitialResults(saved.sessionResults);
    setRunnerSessionId(saved.id);
    setActiveTab('runner');
  };

  // Modals
  const [isInterleavedModalOpen, setIsInterleavedModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isJevLabModalOpen, setIsJevLabModalOpen] = useState(false);
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Non-blocking in-app toast (replaces native alert()).
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadData = async (topicId?: string | 'all', isRetry = false) => {
    try {
      const currentTopicId = topicId !== undefined ? topicId : selectedTopicId;
      const filterTopic = currentTopicId && currentTopicId !== 'all' ? currentTopicId : undefined;
      const [
        top,
        atm,
        clu,
        con,
        itm,
        err,
        att,
        warn,
        stat,
        sett,
      ] = await Promise.all([
        api.getTopics(),
        api.getAtoms(filterTopic ? { topic_id: filterTopic } : undefined),
        api.getClusters(filterTopic),
        api.getConfusionPairs(filterTopic),
        api.getItems(filterTopic ? { topic_id: filterTopic } : undefined),
        api.getErrors(),
        api.getAttempts(),
        api.getValidationWarnings(),
        api.getScheduleStats(filterTopic),
        api.getSettings(),
      ]);

      setTopics(top);
      setAtoms(atm);
      setClusters(clu);
      setConfusionPairs(con);
      setItems(itm);
      setOpenErrors(err);
      setAttempts(att);
      setWarnings(warn);
      setDueStats(stat);
      setSettings(sett);
      setLoadError(null);
    } catch (e: any) {
      console.warn('Initial data load attempt failed:', e);
      if (!isRetry) {
        // Automatically attempt a retry after a short delay for startup timing
        setTimeout(() => {
          loadData(topicId, true);
        }, 1000);
        return;
      }
      setLoadError(e?.message || 'No se pudo conectar con el servidor local');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedTopicId);
  }, [selectedTopicId]);

  // Keyboard shortcut listener for '?'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setIsHelpModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Launch SRS Due Queue
  const handleStartDueSession = async (explicitTopicId?: string) => {
    try {
      const topicScope = explicitTopicId || (selectedTopicId !== 'all' ? selectedTopicId : undefined);
      let queue = await api.getDueQueue(15, topicScope);
      if (queue.length === 0) {
        queue = eligibleForPractice(
          topicScope ? items.filter(i => i.topic_id === topicScope) : items
        ).slice(0, 10);
      }
      setRunnerItems(queue);
      const matchedTopic = topicScope ? topics.find(t => t.id === topicScope) : null;
      setRunnerTitle(
        matchedTopic ? `Test: ${matchedTopic.name}` : 'Test de repaso'
      );
      setRunnerMode('srs');
      setActiveTab('runner');
    } catch (err) {
      console.error('Failed to get due queue:', err);
    }
  };

  // Launch Interleaved Block
  const handleLaunchInterleavedBlock = (blockItems: Item[]) => {
    setRunnerItems(blockItems);
    setRunnerTitle(`Test mezclado (${blockItems.length} preguntas)`);
    setRunnerMode('interleaved');
    setActiveTab('runner');
  };

  // Launch blind level-check test
  const handleStartPretest = (explicitTopicId?: string) => {
    const topicScope = explicitTopicId || (selectedTopicId !== 'all' ? selectedTopicId : undefined);
    const pool = topicScope ? items.filter(i => i.topic_id === topicScope) : items;
    const shuffled = buildPretestPool(pool, 10);
    setRunnerItems(shuffled);
    const matchedTopic = topicScope ? topics.find(t => t.id === topicScope) : null;
    setRunnerTitle(
      matchedTopic ? `Test de nivel: ${matchedTopic.name}` : 'Test de nivel'
    );
    setRunnerMode('pretest');
    setActiveTab('runner');
  };

  // Launch Retrieval-First Micro-Lesson (spec §9.2)
  const handleStartMicroLesson = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) {
      setToast({ message: 'Tema no encontrado para la micro-lección.', kind: 'error' });
      return;
    }
    setRunnerItems([]);
    setMicroLessonTopic(topic);
    setActiveTab('runner');
  };

  // Launch Targeted Repair
  const handleLaunchRepairSession = (itemIds: string[]) => {
    const repairItems = eligibleForPractice(items).filter((i) => itemIds.includes(i.id));
    if (repairItems.length === 0) return;
    setRunnerItems(repairItems);
    setRunnerTitle(`Repaso de fallos (${repairItems.length})`);
    setRunnerMode('repair');
    setActiveTab('runner');
  };

  // Launch exam-like simulacro (hard questions, official penalty)
  const handleStartSniper = (options?: {
    subType?: 'numeric' | 'confident_wrong' | 'mixed';
    count?: number;
    baremoPenalty?: number;
  }) => {
    const subType = options?.subType || 'mixed';
    const count = options?.count || 10;
    const penalty = options?.baremoPenalty !== undefined ? options?.baremoPenalty : 0.25;
    const selected = selectSniperItems(eligibleForPractice(items), openErrors, { subType, count, confusionPairs });

    if (selected.length === 0) {
      setToast({
        message: 'No hay suficientes preguntas en la base de datos para este simulacro.',
        kind: 'error',
      });
      return;
    }

    const titles: Record<string, string> = {
      numeric: `Simulacro: trampas numéricas (${selected.length} preguntas)`,
      confident_wrong: `Simulacro: tus fallos con confianza (${selected.length} preguntas)`,
      mixed: `Simulacro con penalización (${selected.length} preguntas)`,
    };

    setRunnerItems(selected);
    setRunnerTitle(titles[subType] || `Simulacro con penalización (${selected.length} preguntas)`);
    setRunnerMode('sniper');
    setRunnerBaremoPenalty(penalty);
    setRunnerInitialIndex(0);
    setRunnerInitialResults(undefined);
    setRunnerSessionId(`sniper-${Date.now()}`);
    setActiveTab('runner');
  };

  // Launch exam-like simulacro: hard questions with official -0.25 penalty
  const handleStartSimulacro = () => {
    handleStartSniper({ subType: 'mixed', count: 15, baremoPenalty: 0.25 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0f17] text-slate-100">
        <div className="h-16 border-b border-[#20293a] bg-[#121722]" />
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="h-8 w-64 max-w-full rounded-md bg-slate-800/70 animate-pulse" />
          <div className="h-36 rounded-lg bg-[#121722] border border-[#20293a] animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-32 rounded-lg bg-[#121722] border border-[#20293a] animate-pulse"
              />
            ))}
          </div>
          <span className="sr-only">Iniciando OposiLab MCQ Trainer…</span>
        </div>
      </div>
    );
  }

  if (loadError && items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6 space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="text-center max-w-md space-y-1">
          <h2 className="text-lg font-bold text-white">Error de conexión local</h2>
          <p className="text-xs text-slate-400">
            {loadError}
          </p>
        </div>
        <button
          onClick={() => {
            setLoadError(null);
            setIsLoading(true);
            loadData(selectedTopicId);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar conexión</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dueCount={dueStats.dueToday}
        openErrorsCount={dueStats.openErrors}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenJevLab={() => setIsJevLabModalOpen(true)}
        jevEnabled={settings.jev_enabled !== false}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleHighContrast}
        topics={topics}
        selectedTopicId={selectedTopicId}
        setSelectedTopicId={setSelectedTopicId}
        onOpenCreateTopic={() => setIsCreateTopicModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            dueStats={dueStats}
            clusters={clusters}
            confusionPairs={confusionPairs}
            openErrors={openErrors}
            items={items}
            attempts={attempts}
            topics={topics}
            onOpenCreateTopic={() => setIsCreateTopicModalOpen(true)}
            onStartTopicDue={(topicId) => handleStartDueSession(topicId)}
            onResumeSession={handleResumeSession}
            onGoToErrors={() => setActiveTab('errors')}
            onGoToStudy={() => setActiveTab('runner')}
          />
        )}

        {activeTab === 'runner' && (
          !microLessonTopic && runnerItems.length === 0 ? (
            <StudySetup
              topics={topics}
              selectedTopicId={selectedTopicId}
              onSelectTopic={(topicId) => setSelectedTopicId(topicId)}
              dueCount={dueStats.dueToday}
              openErrorsCount={dueStats.openErrors}
              onStartDue={() => handleStartDueSession()}
              onGoToErrors={() => setActiveTab('errors')}
              onStartSimulacro={handleStartSimulacro}
              onOpenInterleaved={() => setIsInterleavedModalOpen(true)}
              onStartPretest={() => handleStartPretest()}
              onStartGuided={(topicId) => handleStartMicroLesson(topicId)}
            />
          ) : microLessonTopic ? (
            <MicroLessonRunner
              topic={microLessonTopic}
              atoms={atoms.filter((a) => a.topic_id === microLessonTopic.id)}
              onExit={() => {
                setMicroLessonTopic(null);
                setActiveTab('dashboard');
                loadData();
              }}
              onItemCreated={loadData}
            />
          ) : (
          <ActivityRunner
            items={runnerItems}
            title={runnerTitle}
            mode={runnerMode}
            initialBaremoPenalty={runnerBaremoPenalty}
            initialIndex={runnerInitialIndex}
            initialResults={runnerInitialResults}
            initialSessionId={runnerSessionId}
            clusters={clusters}
            confusionPairs={confusionPairs}
            onLaunchRepair={handleLaunchRepairSession}
            onExit={() => {
              setRunnerItems([]);
              setRunnerTitle('Test');
              setRunnerMode('srs');
              setRunnerInitialIndex(0);
              setRunnerInitialResults(undefined);
              setRunnerSessionId(undefined);
              setActiveTab('dashboard');
              loadData();
            }}
            onFinished={() => {
              setRunnerItems([]);
              setRunnerTitle('Test');
              setRunnerMode('srs');
              setRunnerInitialIndex(0);
              setRunnerInitialResults(undefined);
              setRunnerSessionId(undefined);
              loadData();
            }}
          />
          )
        )}

        {activeTab === 'errors' && (
          <ErrorRepairStudio
            errors={openErrors}
            items={items}
            onRefresh={loadData}
            onLaunchRepairSession={handleLaunchRepairSession}
          />
        )}

        {activeTab === 'content' && (
          <ContentStudio
            atoms={atoms}
            clusters={clusters}
            confusionPairs={confusionPairs}
            topics={topics}
            items={items}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'items' && (
          <ItemBank
            items={items}
            clusters={clusters}
            confusionPairs={confusionPairs}
            warnings={warnings}
            onRefresh={loadData}
            onPreviewItem={(item) => {
              setRunnerItems([item]);
              setRunnerTitle('Previsualización de Ítem');
              setRunnerMode('activity_specific');
              setActiveTab('runner');
            }}
          />
        )}

        {activeTab === 'chat' && (
          <AiChatbot
            topics={topics}
            clusters={clusters}
            confusionPairs={confusionPairs}
            onItemCreated={loadData}
            onAtomCreated={loadData}
            onPracticeItem={(item) => {
              setRunnerItems([item]);
              setRunnerTitle('Práctica Inmediata de Ítem Generado');
              setRunnerMode('activity_specific');
              setActiveTab('runner');
            }}
          />
        )}

        {activeTab === 'export' && (
          <ExportSettingsMethodModal settings={settings} onRefresh={loadData} />
        )}
      </main>

      {/* Modals */}
      <InterleavedBlockModal
        isOpen={isInterleavedModalOpen}
        onClose={() => setIsInterleavedModalOpen(false)}
        onLaunchBlock={handleLaunchInterleavedBlock}
        topics={topics}
        defaultTopicId={selectedTopicId !== 'all' ? selectedTopicId : undefined}
      />

      <CreateTopicModal
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        onTopicCreated={(newTopic) => {
          setSelectedTopicId(newTopic.id);
          loadData(newTopic.id);
        }}
      />

      <HelpShortcutsModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <JevLabModal
        isOpen={isJevLabModalOpen}
        onClose={() => setIsJevLabModalOpen(false)}
        items={items}
        atoms={atoms}
        topics={topics}
        clusters={clusters}
        confusionPairs={confusionPairs}
      />

      {/* Non-blocking toast (replaces native alert()) */}
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex items-start gap-3 max-w-[calc(100vw-2rem)] sm:max-w-md px-4 py-3 rounded-xl border shadow-2xl text-sm ${
            toast.kind === 'error'
              ? 'bg-rose-950/95 border-rose-500/60 text-rose-100'
              : 'bg-slate-900/95 border-slate-600 text-slate-100'
          }`}
        >
          <AlertTriangle
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              toast.kind === 'error' ? 'text-rose-400' : 'text-indigo-400'
            }`}
          />
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Cerrar aviso"
            className="shrink-0 -mr-1 -mt-1 p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <span aria-hidden="true" className="text-base leading-none">×</span>
          </button>
        </div>
      )}
    </div>
  );
}
