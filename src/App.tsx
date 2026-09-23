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
import { AiChatbot } from './components/AiChatbot.tsx';
import { CreateTopicModal } from './components/CreateTopicModal.tsx';
import { MicroLessonRunner } from './components/MicroLessonRunner.tsx';
import { api } from './api.ts';
import { selectSniperItems } from './utils/sniperFilter.ts';
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
    max_new_items_per_day: 20,
    confidence_required_for_graduation: 2,
    require_two_formats_for_graduation: true,
    require_interleaved_success_for_graduation: true,
  });

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
  const [runnerTitle, setRunnerTitle] = useState('Entrenamiento Cognitivo');
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
        queue = (topicScope ? items.filter(i => i.topic_id === topicScope) : items).slice(0, 10);
      }
      setRunnerItems(queue);
      const matchedTopic = topicScope ? topics.find(t => t.id === topicScope) : null;
      setRunnerTitle(
        matchedTopic
          ? `Repaso Espaciado: ${matchedTopic.name}`
          : 'Repaso Espaciado Diario (Due Queue)'
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
    setRunnerTitle(`Bloque Intercalado (${blockItems.length} ítems)`);
    setRunnerMode('interleaved');
    setActiveTab('runner');
  };

  // Launch Diagnostic Pretest
  const handleStartPretest = (explicitTopicId?: string) => {    const topicScope = explicitTopicId || (selectedTopicId !== 'all' ? selectedTopicId : undefined);
    const pool = topicScope ? items.filter(i => i.topic_id === topicScope) : items;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    setRunnerItems(shuffled);
    const matchedTopic = topicScope ? topics.find(t => t.id === topicScope) : null;
    setRunnerTitle(
      matchedTopic
        ? `Pretest Diagnóstico: ${matchedTopic.name}`
        : 'Pretest Diagnóstico (Sin Etiquetas)'
    );
    setRunnerMode('pretest');
    setActiveTab('runner');
  };

  // Launch Retrieval-First Micro-Lesson (spec §9.2)
  const handleStartMicroLesson = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) {
      alert('Tema no encontrado para la micro-lección.');
      return;
    }
    setRunnerItems([]);
    setMicroLessonTopic(topic);
    setActiveTab('runner');
  };

  // Launch Activity Specific drill
  const handleStartActivityType = (activityType: string) => {
    const matched = items.filter((i) => i.item_type === activityType);
    if (matched.length === 0) {
      alert(`No hay ítems registrados para el formato ${activityType}.`);
      return;
    }
    const shuffled = [...matched].sort(() => 0.5 - Math.random()).slice(0, 15);
    setRunnerItems(shuffled);
    setRunnerTitle(`Entrenamiento Específico: ${activityType.replace(/_/g, ' ')}`);
    setRunnerMode('activity_specific');
    setActiveTab('runner');
  };

  // Launch Targeted Repair
  const handleLaunchRepairSession = (itemIds: string[]) => {
    const repairItems = items.filter((i) => itemIds.includes(i.id));
    if (repairItems.length === 0) return;
    setRunnerItems(repairItems);
    setRunnerTitle(`Taller de Reparación (${repairItems.length} fallos)`);
    setRunnerMode('repair');
    setActiveTab('runner');
  };

  // Launch Drill Sniper (High Interference / Confident-Wrong / Numeric Traps)
  const handleStartSniper = (options?: {
    subType?: 'numeric' | 'confident_wrong' | 'mixed';
    count?: number;
    baremoPenalty?: number;
  }) => {
    const subType = options?.subType || 'mixed';
    const count = options?.count || 10;
    const penalty = options?.baremoPenalty !== undefined ? options?.baremoPenalty : 0.25;
    const selected = selectSniperItems(items, openErrors, { subType, count, confusionPairs });

    if (selected.length === 0) {
      alert(
        'No se encontraron suficientes reactivos en la base de datos para los criterios seleccionados del Drill Sniper.'
      );
      return;
    }

    const titles: Record<string, string> = {
      numeric: `🎯 Drill Sniper: Anti-Trampa Numérica (${selected.length} reactivos)`,
      confident_wrong: `🎯 Drill Sniper: Reparación Confident-Wrong (${selected.length} reactivos)`,
      mixed: `🎯 Drill Sniper de Alta Interferencia (${selected.length} reactivos)`,
    };

    setRunnerItems(selected);
    setRunnerTitle(titles[subType] || `🎯 Drill Sniper (${selected.length} reactivos)`);
    setRunnerMode('sniper');
    setRunnerBaremoPenalty(penalty);
    setRunnerInitialIndex(0);
    setRunnerInitialResults(undefined);
    setRunnerSessionId(`sniper-${Date.now()}`);
    setActiveTab('runner');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono">Iniciando OposiLab MCQ Trainer...</p>
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
            atoms={atoms}
            selectedTopicId={selectedTopicId}
            onSelectTopic={(topicId) => setSelectedTopicId(topicId)}
            onOpenCreateTopic={() => setIsCreateTopicModalOpen(true)}
            onStartTopicDue={(topicId) => handleStartDueSession(topicId)}
            onStartTopicPretest={(topicId) => handleStartPretest(topicId)}
            onStartTopicMicroLesson={handleStartMicroLesson}
            onStartTopicInterleaved={(topicId) => {
              setSelectedTopicId(topicId);
              setIsInterleavedModalOpen(true);
            }}
            onResumeSession={handleResumeSession}
            onStartDueSession={() => handleStartDueSession()}
            onStartInterleaved={() => setIsInterleavedModalOpen(true)}
            onStartPretest={() => handleStartPretest()}
            onStartSniper={handleStartSniper}
            onStartActivityType={handleStartActivityType}
            onGoToErrors={() => setActiveTab('errors')}
            onGoToContent={() => setActiveTab('content')}
            onGoToChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'runner' && (
          microLessonTopic ? (
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
            items={runnerItems.length > 0 ? runnerItems : items.slice(0, 10)}
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
              setRunnerInitialIndex(0);
              setRunnerInitialResults(undefined);
              setRunnerSessionId(undefined);
              setActiveTab('dashboard');
              loadData();
            }}
            onFinished={() => {
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

        {activeTab === 'analytics' && (
          <CalibrationAnalytics
            attempts={attempts}
            errors={openErrors}
            clusters={clusters}
            items={items}
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
    </div>
  );
}
