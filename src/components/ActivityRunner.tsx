import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Lightbulb,
  Save,
  Download,
  Upload,
  Info,
  Layers,
  Zap,
  Check,
  TrendingUp,
  Shield,
  Target,
  Scale,
  Brain,
  Flame,
  Sparkles,
  Shuffle,
  Trophy,
} from 'lucide-react';
import {
  Item,
  ActivityAttempt,
  ConfidenceLevel,
  TrapType,
  ErrorTypeCode,
  ItemFsrsInfo,
  SavedSessionState,
  BAREMOS,
  BaremoConfig,
  ItemStudyLifecycleState,
  Cluster,
  ConfusionPair,
} from '../types.ts';
import { api } from '../api.ts';
import { evaluateItem, EvaluationResult } from '../scoring/evaluateItem.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  syncActiveSessionToCloud,
  clearActiveSessionFromCloud,
} from '../services/firebaseSync.ts';
import { ModeAStudyRunner } from './ModeAStudyRunner.tsx';
import { PretestDiagnosticMap } from './PretestDiagnosticMap.tsx';
import { SessionHeatMap } from './SessionHeatMap.tsx';
import { optionIdAtPosition, optionOrderSeed, orderOptions } from '../utils/optionOrder.ts';
import { trapLabelEs } from '../utils/trapLabels.ts';

const EMPTY_OPTION_CHOICES: Array<{
  id: string;
  text: string;
  is_correct: boolean;
  explanation?: string;
}> = [];

function buildFactVariantChoices(item?: Item): Array<{ id: string; text: string }> {
  if (item?.options?.length) return item.options;

  const variantData = item?.fact_variant_data;
  const firstVariant = variantData?.variants?.[0];
  if (firstVariant) {
    return [
      {
        id: 'A',
        text:
          firstVariant.expected_outcome ||
          firstVariant.correct_outcome ||
          'El cambio de circunstancia modifica el resultado jurídico',
      },
      {
        id: 'B',
        text:
          variantData?.base_case?.correct_outcome ||
          'Se mantiene el resultado de la regla general sin alteración',
      },
      {
        id: 'C',
        text: 'La consecuencia jurídica es indeterminada salvo resolución expresa',
      },
    ];
  }

  return [
    { id: 'A', text: 'El cambio de hecho modifica la consecuencia jurídica' },
    { id: 'B', text: 'La consecuencia jurídica no varía' },
  ];
}

function optionLabelAtPosition(position: number): string {
  return String.fromCharCode(65 + position);
}

function normalizeClozeValue(value?: string): string {
  return (value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function labelForOptionId(options: Array<{ id: string }>, optionId?: string | null): string {
  if (!optionId) return '';
  const position = options.findIndex((option) => option.id === optionId);
  return position >= 0 ? optionLabelAtPosition(position) : optionId;
}

/**
 * Helper to determine if an item must enter Mode A encoding first.
 * Pretest mode bypasses Mode A by definition (diagnostic baseline).
 * In all other modes, new items or items with recurring lapses (>= 2) require Mode A.
 */
export function doesItemRequireModeA(
  mode: string,
  fsrsInfo?: { state?: string; lapses?: number }
): boolean {
  if (mode === 'pretest') return false;
  const isNew = !fsrsInfo || fsrsInfo.state === 'new';
  const hasLapses = (fsrsInfo?.lapses || 0) >= 2;
  return isNew || hasLapses;
}

export function renderLifecycleBadge(state?: ItemStudyLifecycleState) {
  switch (state) {
    case 'new_unseen':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[11px] font-mono border border-slate-700">
          Nuevo / Sin Ver
        </span>
      );
    case 'modo_a_in_progress':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[11px] font-mono border border-sky-500/30">
          Calentamiento en curso (Modo A)
        </span>
      );
    case 'modo_a_passed':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[11px] font-mono border border-emerald-500/30">
          ✓ Lista para el simulacro (Modo B)
        </span>
      );
    case 'modo_b_active':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[11px] font-mono border border-amber-500/30">
          🎯 Examen Activo
        </span>
      );
    case 'failed_in_modo_b':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 text-[11px] font-mono border border-rose-500/30">
          ⚠️ Reintento Examen
        </span>
      );
    case 'needs_remediation':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 text-[11px] font-mono border border-purple-500/30">
          🔁 Remediación
        </span>
      );
    default:
      return null;
  }
}


export interface SessionAttemptLog {
  itemId: string;
  stem: string;
  confidence: number;
  correct: boolean;
  blank: boolean;
  selectedOption?: string | null;
  penaltyApplied: number;
  pointsEarned: number;
}

interface ActivityRunnerProps {
  items: Item[];
  title?: string;
  mode: 'srs' | 'interleaved' | 'activity_specific' | 'pretest' | 'repair' | 'sniper';
  initialIndex?: number;
  initialResults?: {
    correct: number;
    errors?: number;
    blanks?: number;
    total: number;
    confidences: number[];
  };
  initialBaremoPenalty?: number;
  initialSessionId?: string;
  /** Lookups for the pretest diagnostic map (spec §9.1) */
  clusters?: Cluster[];
  confusionPairs?: ConfusionPair[];
  /** Routes weak pretest items into a Repair Studio session */
  onLaunchRepair?: (itemIds: string[]) => void;
  onExit: () => void;
  onFinished: (stats: { total: number; correct: number; avgConfidence: number }) => void;
}

export const ActivityRunner: React.FC<ActivityRunnerProps> = ({
  items,
  title = 'Entrenamiento Cognitivo',
  mode,
  initialIndex = 0,
  initialResults,
  initialBaremoPenalty,
  initialSessionId,
  clusters,
  confusionPairs,
  onLaunchRepair,
  onExit,
  onFinished,
}) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentItem = items[currentIndex];
  const [currentEncounter, setCurrentEncounter] = useState(0);

  // Official exam scoring baremo penalty configuration
  const [baremoPenalty, setBaremoPenalty] = useState<number>(() => {
    if (initialBaremoPenalty !== undefined) return initialBaremoPenalty;
    return 0.25; // Default: Oficial Seguridad Social C1 (+1.00 / -0.25)
  });
  const baremoPenaltyRef = useRef(baremoPenalty);
  useEffect(() => {
    baremoPenaltyRef.current = baremoPenalty;
  }, [baremoPenalty]);

  // Metacognitive & tactical risk attempt history
  const [attemptLogs, setAttemptLogs] = useState<SessionAttemptLog[]>([]);

  // Consecutive correct streak derived from attemptLogs tail (Mode B)
  // ANTI-GAMBLE CALIBRATION: only counts answers with confidence >= 2 to prevent
  // rewarding blind guessing in an exam with -0.25 penalty per error.
  const currentStreak = React.useMemo(() => {
    let streak = 0;
    for (let i = attemptLogs.length - 1; i >= 0; i--) {
      const log = attemptLogs[i];
      if (log.correct && !log.blank && log.confidence >= 2) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [attemptLogs]);

  const bestStreak = React.useMemo(() => {
    let maxStreak = 0;
    let current = 0;
    for (const log of attemptLogs) {
      if (log.correct && !log.blank && log.confidence >= 2) {
        current++;
        if (current > maxStreak) maxStreak = current;
      } else {
        current = 0;
      }
    }
    return maxStreak;
  }, [attemptLogs]);

  // Stage in current item lifecycle:
  // 'cover' -> user typing retrieval before options
  // 'answering' -> options revealed, user selecting answer
  // 'confidence' -> answer selected, rating confidence (0-3)
  // 'feedback' -> showing explanatory feedback & distractor analysis
  const [stage, setStage] = useState<'cover' | 'answering' | 'confidence' | 'feedback'>('cover');

  // Hint state
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hintLevel, setHintLevel] = useState<number>(0); // 0=none, 1=level1, 2=level2
  const [usedHintThisItem, setUsedHintThisItem] = useState(false);

  // FSRS indicator expansion
  const [showFsrsDetails, setShowFsrsDetails] = useState(false);

  // Session saving modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);

  // User input states
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [userReasoning, setUserReasoning] = useState<string | null>(null); // For two-tier
  const [twoTierStage, setTwoTierStage] = useState<'tier1' | 'tier2'>('tier1');
  const [selectedTrapType, setSelectedTrapType] = useState<TrapType | null>(null);
  const [selectedErrorCode, setSelectedErrorCode] = useState<ErrorTypeCode | null>(null);

  // Cloze state
  const [clozeInput, setClozeInput] = useState('');
  const [clozeInputs, setClozeInputs] = useState<Record<string, string>>({});

  // Spot error state
  const [spotSelectedSpan, setSpotSelectedSpan] = useState<string | null>(null);
  const [spotCorrectionInput, setSpotCorrectionInput] = useState('');

  // Number sort state
  const [numberSortMatches, setNumberSortMatches] = useState<Record<string, string>>({});

  // Fact variant lab state
  const [factVariantIdx, setFactVariantIdx] = useState(0);
  const [factVariantPredictions, setFactVariantPredictions] = useState<Record<number, boolean>>({});

  // Attempt timing
  const startTimeRef = useRef<number>(Date.now());
  const generateTimeRef = useRef<number>(0);

  // Aggregated session results
  const [sessionResults, setSessionResults] = useState<{
    correct: number;
    errors?: number;
    blanks?: number;
    total: number;
    confidences: number[];
  }>(
    initialResults || {
      correct: 0,
      errors: 0,
      blanks: 0,
      total: 0,
      confidences: [],
    }
  );

  const [sessionComplete, setSessionComplete] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const isRecordingRef = useRef(false);

  // Pacing Sprint Timer (e.g., 45 seconds per item for E10 time pressure training)
  const [isPacingActive, setIsPacingActive] = useState(false);
  const [pacingTimeLeft, setPacingTimeLeft] = useState(45);

  // Optional generative cover mode (default false so exam-like MCQ options show immediately without forced typing)
  const [enableGenerativeCover, setEnableGenerativeCover] = useState(false);

  // Synchronized state references to guarantee zero-latency serialization during navigation/unload events
  const runnerItems = items;
  const runnerIndex = currentIndex;
  const sessionIdRef = useRef<string>(initialSessionId || `sess-${Date.now()}`);
  const runnerItemsRef = useRef(runnerItems);
  const runnerIndexRef = useRef(runnerIndex);
  const sessionResultsRef = useRef(sessionResults);
  const modeRef = useRef(mode);
  const titleRef = useRef(title);
  const sessionCompleteRef = useRef(sessionComplete);
  const encounterCountsRef = useRef(new Map<string, number>());
  const lastEncounterRef = useRef<{ index: number; itemId: string } | null>(null);
  const encounterSessionIdRef = useRef(initialSessionId || sessionIdRef.current);

  useLayoutEffect(() => {
    const activeSessionId = initialSessionId || sessionIdRef.current;
    if (encounterSessionIdRef.current !== activeSessionId) {
      encounterSessionIdRef.current = activeSessionId;
      encounterCountsRef.current.clear();
      lastEncounterRef.current = null;
    }

    if (!currentItem) return;
    const lastEncounter = lastEncounterRef.current;
    if (lastEncounter?.index === currentIndex && lastEncounter.itemId === currentItem.id) return;

    const encounter = encounterCountsRef.current.get(currentItem.id) ?? 0;
    encounterCountsRef.current.set(currentItem.id, encounter + 1);
    lastEncounterRef.current = { index: currentIndex, itemId: currentItem.id };
    setCurrentEncounter(encounter);
  }, [initialSessionId, currentIndex, currentItem?.id]);

  const itemOptions = currentItem?.options ?? EMPTY_OPTION_CHOICES;
  const tier1SourceOptions =
    currentItem?.two_tier_data?.tier1?.options ??
    currentItem?.two_tier_data?.tier1_options ??
    itemOptions;
  const tier2SourceOptions =
    currentItem?.two_tier_data?.tier2?.options ??
    currentItem?.two_tier_data?.tier2_options ??
    EMPTY_OPTION_CHOICES;
  const factVariantSourceOptions = useMemo(
    () => buildFactVariantChoices(currentItem),
    [currentItem?.id, currentItem?.options, currentItem?.fact_variant_data],
  );
  const hasPositionalOptionShortcuts =
    currentItem?.item_type === 'cover_and_generate_mcq' ||
    currentItem?.item_type === 'pretest_item' ||
    currentItem?.item_type === 'cloze' ||
    currentItem?.item_type === 'two_tier' ||
    currentItem?.item_type === 'fact_variant';

  const orderedItemOptions = useMemo(
    () =>
      hasPositionalOptionShortcuts
        ? orderOptions(itemOptions, optionOrderSeed(currentItem?.id ?? '', currentEncounter))
        : [...itemOptions],
    [hasPositionalOptionShortcuts, itemOptions, currentItem?.id, currentEncounter],
  );
  const orderedTier1Options = useMemo(
    () =>
      orderOptions(
        tier1SourceOptions,
        optionOrderSeed(`${currentItem?.id ?? ''}:tier1`, currentEncounter),
      ),
    [tier1SourceOptions, currentItem?.id, currentEncounter],
  );
  const orderedTier2Options = useMemo(
    () =>
      orderOptions(
        tier2SourceOptions,
        optionOrderSeed(`${currentItem?.id ?? ''}:tier2`, currentEncounter),
      ),
    [tier2SourceOptions, currentItem?.id, currentEncounter],
  );
  const orderedFactVariantOptions = useMemo(
    () =>
      orderOptions(
        factVariantSourceOptions,
        optionOrderSeed(`${currentItem?.id ?? ''}:fact-variant`, currentEncounter),
      ),
    [factVariantSourceOptions, currentItem?.id, currentEncounter],
  );

  const displayedOptions =
    currentItem?.item_type === 'two_tier'
      ? orderedTier1Options
      : currentItem?.item_type === 'fact_variant'
        ? orderedFactVariantOptions
        : orderedItemOptions;
  const keyboardOptions =
    currentItem?.item_type === 'two_tier'
      ? twoTierStage === 'tier1'
        ? orderedTier1Options
        : orderedTier2Options
      : currentItem?.item_type === 'fact_variant'
        ? orderedFactVariantOptions
        : orderedItemOptions;

  const displayedStem = useMemo(() => {
    if (!currentItem) return '';
    if (currentItem.item_type !== 'cloze') return currentItem.stem;
    const template =
      currentItem.cloze_data?.template_text || currentItem.cloze_data?.text_with_clozes || '';
    let stem = currentItem.stem || '';
    if (template && stem.includes(template)) {
      stem = stem.replace(template, '');
    }
    stem = stem.replace(/\{\{c\d+::.*?\}\}/g, '[ … ]');
    return stem.trim().replace(/[:：]\s*$/, '').trim();
  }, [currentItem]);

  const expectedAnswerSummary = useMemo(() => {
    if (!currentItem) return '';

    if (currentItem.item_type === 'cloze') {
      const blanks = currentItem.cloze_data?.blanks ?? [];
      const blankAnswers = blanks
        .map((blank) => blank.correct_answer || blank.answer || blank.target)
        .filter((value): value is string => Boolean(value));
      if (blankAnswers.length > 0) return blankAnswers.join(' · ');
      const raw =
        currentItem.cloze_data?.template_text ||
        currentItem.cloze_data?.text_with_clozes ||
        currentItem.stem;
      const markerAnswers = [...raw.matchAll(/\{\{c\d+::(.*?)\}\}/g)].map((match) => match[1]);
      return markerAnswers.join(' · ') || evaluation?.expectedDisplay || '';
    }

    if (currentItem.item_type === 'contrast_card') {
      const data = currentItem.contrast_data;
      const answer = (currentItem.correct_answer || data?.mini_case_answer || 'A').toUpperCase();
      const concept = answer === 'B' ? data?.concept_b : data?.concept_a;
      return concept ? `Se aplica ${concept}` : evaluation?.expectedDisplay || '';
    }

    if (currentItem.item_type === 'number_sort') {
      return 'la asociación correcta de todos los conceptos';
    }

    if (currentItem.item_type === 'spot_error') {
      const data = currentItem.spot_error_data;
      if (data?.erroneous_span && data?.corrected_text) {
        return `«${data.erroneous_span}» → «${data.corrected_text}»`;
      }
      return currentItem.correct_answer || evaluation?.expectedDisplay || '';
    }

    if (currentItem.item_type === 'two_tier') {
      const tier1Correct = tier1SourceOptions.find((option) => option.is_correct);
      const tier2Correct = tier2SourceOptions.find((option) => option.is_correct);
      const parts = [tier1Correct?.text, tier2Correct?.text].filter(Boolean);
      return parts.join(' — Justificación: ') || evaluation?.expectedDisplay || '';
    }

    if (currentItem.item_type === 'exception_tree') {
      const data = currentItem.exception_tree_data;
      const testCase = data?.test_cases?.[0];
      const walk = (node: any): Array<{ id: string; label: string }> => {
        if (!node) return [];
        const children = node.children || [];
        if (children.length === 0) return [{ id: node.id, label: node.label }];
        return children.flatMap(walk);
      };
      const leaf = walk(data?.root_rule || data?.root_node).find(
        (candidate) => candidate.id === testCase?.correct_leaf_id
      );
      return leaf?.label || evaluation?.expectedDisplay || '';
    }

    if (currentItem.item_type === 'fact_variant') {
      const variant = currentItem.fact_variant_data?.variants?.[0];
      return (
        variant?.correct_outcome || variant?.expected_outcome || evaluation?.expectedDisplay || ''
      );
    }

    const correctOption =
      currentItem.options?.find((option) => option.is_correct) ??
      currentItem.options?.find((option) => option.id === currentItem.correct_answer);
    if (!correctOption?.text) return evaluation?.expectedDisplay || '';
    return `${labelForOptionId(displayedOptions, correctOption.id)}. ${correctOption.text}`;
  }, [
    currentItem,
    displayedOptions,
    tier1SourceOptions,
    tier2SourceOptions,
    evaluation,
  ]);

  useEffect(() => {
    runnerItemsRef.current = runnerItems;
  }, [runnerItems]);

  useEffect(() => {
    runnerIndexRef.current = runnerIndex;
  }, [runnerIndex]);

  useEffect(() => {
    sessionResultsRef.current = sessionResults;
  }, [sessionResults]);

  useEffect(() => {
    modeRef.current = mode;
    titleRef.current = title;
    sessionCompleteRef.current = sessionComplete;
  }, [mode, title, sessionComplete]);

  /**
   * Serializes the current runnerItems, runnerIndex, and sessionResults to localStorage
   * whenever the user navigates away, refreshes, or changes question state, ensuring they
   * can pick up exactly where they left off.
   */
  const saveSession = () => {
    const currentRunnerItems = runnerItemsRef.current;
    const currentRunnerIndex = runnerIndexRef.current;
    const currentResults = sessionResultsRef.current;

    if (!currentRunnerItems || currentRunnerItems.length === 0 || sessionCompleteRef.current) {
      return;
    }

    const stateToSave: SavedSessionState = {
      version: 1,
      id: sessionIdRef.current,
      saved_at: new Date().toISOString(),
      mode: modeRef.current,
      title: titleRef.current,
      currentIndex: currentRunnerIndex,
      items: currentRunnerItems,
      baremoPenalty: baremoPenaltyRef.current,
      sessionResults: currentResults,
    };

    try {
      localStorage.setItem('oposilab_saved_session', JSON.stringify(stateToSave));

      // Multi-session memory manager
      const existingStr = localStorage.getItem('oposilab_recent_sessions');
      let list: SavedSessionState[] = [];
      if (existingStr) {
        try {
          const parsed = JSON.parse(existingStr);
          if (Array.isArray(parsed)) list = parsed;
        } catch (_) {}
      }
      const existingIdx = list.findIndex((s) => s.id === stateToSave.id);
      if (existingIdx >= 0) {
        list[existingIdx] = stateToSave;
      } else {
        list.unshift(stateToSave);
      }
      list = list.slice(0, 10);
      localStorage.setItem('oposilab_recent_sessions', JSON.stringify(list));

      // Cloud persistence if user is signed in
      if (user?.uid) {
        syncActiveSessionToCloud(user.uid, {
          sessionId: stateToSave.id,
          sessionType: stateToSave.mode,
          itemIds: stateToSave.items.map((i) => i.id),
          currentIndex: stateToSave.currentIndex,
          attempts: attemptLogs,
          isCompleted: false,
        }).catch((err) => console.warn('Cloud sync error for active session:', err));
      }
    } catch (e) {
      console.warn('LocalStorage saveSession failed:', e);
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isPacingActive && stage !== 'feedback' && !sessionComplete) {
      timer = setInterval(() => {
        setPacingTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPacingActive, stage, sessionComplete]);

  // Reset pacing timer on next item
  useEffect(() => {
    setPacingTimeLeft(45);
  }, [currentIndex]);

  // Autosave current session state to localStorage on step / progress changes
  useEffect(() => {
    saveSession();
  }, [currentIndex, sessionResults, sessionComplete, items, mode, title]);

  // Save session when navigating away, closing tab, refreshing, or unmounting
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveSession();
    };

    const handlePageHide = () => {
      saveSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Execute saveSession when component unmounts (e.g. navigating to another view in-app)
      saveSession();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Reset per item
  useEffect(() => {
    if (!currentItem) return;
    setGeneratedAnswer('');
    setSelectedOption(null);
    setConfidence(null);
    setUserReasoning(null);
    setTwoTierStage('tier1');
    setSelectedTrapType(null);
    setSelectedErrorCode(null);
    setClozeInput('');
    setClozeInputs({});
    setSpotSelectedSpan(null);
    setSpotCorrectionInput('');
    setNumberSortMatches({});
    setFactVariantIdx(0);
    setFactVariantPredictions({});
    setEvaluation(null);
    isRecordingRef.current = false;

    // Reset hint for new item
    setIsHintOpen(false);
    setHintLevel(0);
    setUsedHintThisItem(false);

    startTimeRef.current = Date.now();
    generateTimeRef.current = 0;

    // Direct stage routing based on item type and generative cover preference
    if (currentItem.item_type === 'cover_and_generate_mcq' && enableGenerativeCover) {
      setStage('cover');
    } else {
      setStage('answering');
    }
  }, [currentIndex, currentItem]);

  // Compute or fallback FSRS metadata
  const isItemBrandNew = !currentItem?.fsrs_info || currentItem.fsrs_info.state === 'new';
  const fsrsInfo: ItemFsrsInfo = currentItem?.fsrs_info || {
    stability: 1.5,
    difficulty: currentItem?.difficulty ? currentItem.difficulty * 2 : 4.0,
    retrievability: 85,
    days_overdue: 0,
    lapses: 0,
    state: 'new', // Default to 'new' so fresh items lacking FSRS data correctly enter Mode A in SRS
    selection_reason_badge:
      mode === 'interleaved'
        ? '🔀 Mezcla de temas'
        : mode === 'pretest'
        ? '🧭 Test de nivel'
        : '🗓️ Repaso en el momento justo',
    selection_reason_detail:
      'Pregunta programada para repasar antes de que la olvides.',
  };

  const [showModeA, setShowModeA] = useState(false);

  useEffect(() => {
    if (!currentItem) return;
    const isNew = isItemBrandNew || fsrsInfo.state === 'new';
    const hasLapses = (fsrsInfo.lapses || 0) >= 2;
    // Mode A gates ALL modes — first encounter must never open cold regardless of runner mode.
    // Exception: pretest is a diagnostic scan with no prior encoding step by design.
    const shouldEncode = (isNew || hasLapses) && mode !== 'pretest';
    setShowModeA(shouldEncode);
  }, [currentIndex, currentItem, mode, isItemBrandNew, fsrsInfo.state, fsrsInfo.lapses]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
        e.key !== 'Enter'
      ) {
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        if (stage !== 'feedback') {
          handleTriggerHint();
        }
      } else if (e.key === ' ' && stage === 'cover') {
        e.preventDefault();
        handleRevealOptions();
      } else if (stage === 'answering') {
        if (e.key === '0' || e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          handleBlankSubmit();
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          const position = parseInt(e.key, 10) - 1;
          if (hasPositionalOptionShortcuts) {
            const optionId = optionIdAtPosition(keyboardOptions, position);
            if (!optionId) return;

            if (currentItem.item_type === 'two_tier' && twoTierStage === 'tier2') {
              setUserReasoning(optionId);
              setStage('confidence');
            } else {
              handleSubmitOption(optionId);
            }
          } else if (currentItem.item_type === 'contrast_card' && position <= 1) {
            // Concept buttons are letter-labeled (A/B); map the digit to its label.
            // Other non-positional formats (spot_error, number_sort, cloze without
            // options, exception_tree) must not fabricate a selection from a digit.
            handleSubmitOption(String.fromCharCode(64 + position + 1));
          }
        }
      } else if (stage === 'confidence') {
        if (['0', '1', '2', '3'].includes(e.key)) {
          handleSelectConfidence(parseInt(e.key) as ConfidenceLevel);
        }
      } else if (e.key === ' ' && stage === 'feedback') {
        e.preventDefault();
        handleNextItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    stage,
    selectedOption,
    generatedAnswer,
    hintLevel,
    isHintOpen,
    currentItem,
    twoTierStage,
    hasPositionalOptionShortcuts,
    keyboardOptions,
  ]);

  // Handle Hint trigger
  const handleTriggerHint = () => {
    setUsedHintThisItem(true);
    setIsHintOpen(true);
    setHintLevel((prev) => Math.min(2, prev + 1));
  };

  // Cover and generate reveal
  const handleRevealOptions = () => {
    generateTimeRef.current = Date.now() - startTimeRef.current;
    setStage('answering');
  };

  // Submit answer for standard MCQ / Two-tier
  const handleSubmitOption = (optionId: string) => {
    setSelectedOption(optionId);
    if (currentItem.item_type === 'two_tier' && twoTierStage === 'tier1') {
      setTwoTierStage('tier2');
    } else {
      setStage('confidence');
    }
  };

  // Handle blank submission (Dejar en blanco / 0 points)
  const handleBlankSubmit = async () => {
    if (isRecordingRef.current) return;
    isRecordingRef.current = true;

    const result = evaluateItem(currentItem, { blank: true }, 0);
    setEvaluation(result);
    setConfidence(0);

    const attempt: Partial<ActivityAttempt> = {
      item_id: currentItem.id,
      activity_type: currentItem.item_type,
      user_response: 'BLANK',
      confidence: 0,
      correct: false,
      error_type_code: result.errorCode || 'E9',
      time_to_generate_ms: generateTimeRef.current,
      time_to_answer_ms: Date.now() - startTimeRef.current,
      was_interleaved: mode === 'interleaved',
    };

    try {
      await api.recordAttempt(attempt);
    } catch (e) {
      console.error('Failed to record blank attempt:', e);
    }

    const log: SessionAttemptLog = {
      itemId: currentItem.id,
      stem: currentItem.stem,
      confidence: 0,
      correct: false,
      blank: true,
      selectedOption: 'BLANK',
      penaltyApplied: 0,
      pointsEarned: 0,
    };
    setAttemptLogs((prev) => [...prev, log]);

    setSessionResults((prev) => ({
      correct: prev.correct,
      errors: prev.errors || 0,
      blanks: (prev.blanks || 0) + 1,
      total: prev.total + 1,
      confidences: [...prev.confidences, 0],
    }));

    setStage('feedback');
    isRecordingRef.current = false;
  };

  // Handle confidence selection
  const handleSelectConfidence = async (level: ConfidenceLevel) => {
    if (isRecordingRef.current) return;
    isRecordingRef.current = true;
    setConfidence(level);

    const result = evaluateItem(
      currentItem,
      {
        selectedOption,
        clozeInput,
        clozeInputs,
        numberSortMatches,
        spotSelectedSpanId: spotSelectedSpan,
        userReasoning,
      },
      level
    );
    setEvaluation(result);

    const attempt: Partial<ActivityAttempt> = {
      item_id: currentItem.id,
      activity_type: currentItem.item_type,
      user_response:
        currentItem.item_type === 'cloze' && Object.keys(clozeInputs).length > 0
          ? JSON.stringify(clozeInputs)
          : clozeInput || selectedOption || spotSelectedSpan || JSON.stringify(numberSortMatches),
      generated_answer_before_options: generatedAnswer,
      selected_option: selectedOption || undefined,
      reasoning_response: userReasoning || undefined,
      confidence: level,
      correct: result.correct,
      used_hint: usedHintThisItem,
      hints_revealed: hintLevel,
      error_type_code: result.errorCode,
      time_to_generate_ms: generateTimeRef.current,
      time_to_answer_ms: Date.now() - startTimeRef.current,
      was_interleaved: mode === 'interleaved',
    };

    try {
      await api.recordAttempt(attempt);
    } catch (e) {
      console.error('Failed to record attempt:', e);
    }

    const isAnsCorrect = result.correct;
    const penaltyForAttempt = isAnsCorrect ? 0 : baremoPenalty;
    const pointsForAttempt = isAnsCorrect ? 1.0 : -baremoPenalty;

    const log: SessionAttemptLog = {
      itemId: currentItem.id,
      stem: currentItem.stem,
      confidence: level,
      correct: isAnsCorrect,
      blank: false,
      selectedOption: selectedOption || undefined,
      penaltyApplied: penaltyForAttempt,
      pointsEarned: pointsForAttempt,
    };
    setAttemptLogs((prev) => [...prev, log]);

    setSessionResults((prev) => ({
      correct: prev.correct + (isAnsCorrect ? 1 : 0),
      errors: (prev.errors || 0) + (isAnsCorrect ? 0 : 1),
      blanks: prev.blanks || 0,
      total: prev.total + 1,
      confidences: [...prev.confidences, level],
    }));

    setStage('feedback');
    isRecordingRef.current = false;
  };

  const handleNextItem = () => {
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionComplete(true);
      try {
        localStorage.removeItem('oposilab_saved_session');
        const existingStr = localStorage.getItem('oposilab_recent_sessions');
        if (existingStr) {
          const list: SavedSessionState[] = JSON.parse(existingStr);
          const filtered = list.filter((s) => s.id !== sessionIdRef.current);
          localStorage.setItem('oposilab_recent_sessions', JSON.stringify(filtered));
        }
        if (user?.uid && sessionIdRef.current) {
          clearActiveSessionFromCloud(user.uid, sessionIdRef.current).catch(console.warn);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  // Save session to JSON file download
  const handleDownloadSessionJson = () => {
    saveSession();
    const currentRunnerItems =
      runnerItemsRef.current && runnerItemsRef.current.length > 0 ? runnerItemsRef.current : items;
    const currentRunnerIndex = runnerIndexRef.current ?? currentIndex;
    const currentResults = sessionResultsRef.current ?? sessionResults;

    const sessionData: SavedSessionState = {
      version: 1,
      id: `session-${Date.now()}`,
      saved_at: new Date().toISOString(),
      mode: modeRef.current || mode,
      title: titleRef.current || title,
      currentIndex: currentRunnerIndex,
      items: currentRunnerItems,
      sessionResults: currentResults,
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanTitle = (titleRef.current || title || mode)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 25);
    a.download = `oposilab-sesion-${cleanTitle}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSaveStatusMessage(
      `Sesión exportada como archivo JSON (${currentRunnerItems.length} ítems, ítem actual ${currentRunnerIndex + 1}). Puedes restaurarla en cualquier navegador.`
    );
    setTimeout(() => setSaveStatusMessage(null), 4000);
  };

  // Restore session from file upload
  const handleUploadSessionJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed: SavedSessionState = JSON.parse(evt.target?.result as string);
        if (parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setCurrentIndex(Math.min(parsed.currentIndex || 0, parsed.items.length - 1));
          setSessionResults(parsed.sessionResults || { correct: 0, total: 0, confidences: [] });
          setSaveStatusMessage('¡Sesión restaurada con éxito!');
          setIsSaveModalOpen(false);
        } else {
          alert('El archivo JSON no contiene una estructura de sesión válida de OposiLab.');
        }
      } catch (err) {
        alert('Error al leer el archivo de sesión JSON.');
      }
    };
    reader.readAsText(file);
  };

  if (!currentItem || sessionComplete) {
    // Session summary screen with official baremo scoring calculation
    const correctCount = sessionResults.correct;
    const errorCount =
      sessionResults.errors ??
      Math.max(0, sessionResults.total - sessionResults.correct - (sessionResults.blanks || 0));
    const blankCount = sessionResults.blanks ?? 0;
    const netScore = correctCount * 1.0 - errorCount * baremoPenalty;
    const netScoreFormatted = netScore.toFixed(2);
    const maxScore = sessionResults.total * 1.0;
    const netPercentage =
      maxScore > 0 ? Math.max(0, Math.round((netScore / maxScore) * 100)) : 0;
    const accuracy =
      sessionResults.total > 0
        ? Math.round((sessionResults.correct / sessionResults.total) * 100)
        : 0;
    const avgConf =
      sessionResults.confidences.length > 0
        ? (
            sessionResults.confidences.reduce((a, b) => a + b, 0) /
            sessionResults.confidences.length
          ).toFixed(1)
        : '0';

    // Metacognitive & tactical risk audit from attemptLogs
    const lowConfGambles = attemptLogs.filter((a) => !a.blank && a.confidence <= 1 && !a.correct);
    const lowConfGambleLostPoints = lowConfGambles.length * baremoPenalty;
    const potentialScoreIfAbstained = netScore + lowConfGambleLostPoints;
    const luckyGuesses = attemptLogs.filter((a) => !a.blank && a.confidence <= 1 && a.correct);
    const confidentWrongAttempts = attemptLogs.filter(
      (a) => !a.blank && a.confidence === 3 && !a.correct
    );

    const isPass = netPercentage >= 50;

    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {mode === 'pretest'
              ? 'Test de nivel completado'
              : mode === 'sniper'
              ? 'Simulacro completado'
              : 'Test finalizado'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Con penalización de −0,25 por fallo, como en el examen.
          </p>

          {/* Baremo Selector Banner */}
          <div className="mt-6 p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-left">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-200">Baremo de Penalización Aplicado:</span>
                <p className="text-[11px] text-slate-400">
                  {baremoPenalty === 0
                    ? 'Sin penalización formativa (1 acierto = 1 pt, fallos = 0 pts)'
                    : `Fórmula: Aciertos - (Fallos × ${baremoPenalty.toFixed(2)})`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {BAREMOS.map((b) => {
                const isSelected = Math.abs(baremoPenalty - b.penaltyPerError) < 0.01;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBaremoPenalty(b.penaltyPerError)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {b.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Net Score Hero Card */}
          <div className="mt-6 p-6 rounded-lg bg-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                  Puntuación Neta Oficial de Oposición
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span
                    className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight tabular-nums ${
                      netScore > 0
                        ? 'text-emerald-400'
                        : netScore === 0
                        ? 'text-slate-300'
                        : 'text-rose-400'
                    }`}
                  >
                    {netScore >= 0 ? `+${netScoreFormatted}` : netScoreFormatted}
                  </span>
                  <span className="text-lg font-mono text-slate-400 tabular-nums">
                    / {sessionResults.total}.00 pts
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Rendimiento Neto: <strong className="text-white tabular-nums">{netPercentage}%</strong> del máximo
                </div>
              </div>

              {/* Cut-off pass/fail badge */}
              <div
                className={`px-4 py-3 rounded-lg border flex flex-col items-center justify-center text-center ${
                  isPass
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Corte Est. (50%)
                </span>
                <span className="text-sm font-bold mt-0.5">
                  {isPass ? 'APROBADO VIRTUAL' : 'NO SUPERA EL CORTE'}
                </span>
              </div>
            </div>

            {/* Score Component Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-left">
              <div className="p-3 bg-slate-900 rounded-xl border border-emerald-900/40">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Aciertos (+1 pt)</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-2xl font-bold text-white mt-1 font-mono">+{correctCount}</p>
                <span className="text-[11px] text-emerald-400/80 font-mono">
                  +{(correctCount * 1).toFixed(2)} pts
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-rose-900/40">
                <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
                  <span>Fallos (-{baremoPenalty.toFixed(2)})</span>
                  <XCircle className="w-3.5 h-3.5" />
                </div>
                <p className="text-2xl font-bold text-white mt-1 font-mono">-{errorCount}</p>
                <span className="text-[11px] text-rose-400/80 font-mono">
                  -{(errorCount * baremoPenalty).toFixed(2)} pts
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-amber-900/40">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>En Blanco (0 pts)</span>
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <p className="text-2xl font-bold text-white mt-1 font-mono">{blankCount}</p>
                <span className="text-[11px] text-slate-400 font-mono">0.00 pts penaliz.</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Confianza Media</span>
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-2xl font-bold text-indigo-400 mt-1 font-mono">{avgConf} / 3</p>
                <span className="text-[11px] text-slate-400 font-mono">{accuracy}% acierto bruto</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-amber-900/30 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>Mejor Racha</span>
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-300 mt-1 font-mono">
                  {bestStreak} {bestStreak >= 3 ? '🔥' : ''}
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  {bestStreak >= 3 ? 'alta consistencia' : 'aciertos seguidos'}
                </span>
              </div>
            </div>
          </div>

          {/* Tactical & Metacognitive Diagnostic Box */}
          {(lowConfGambles.length > 0 ||
            confidentWrongAttempts.length > 0 ||
            luckyGuesses.length > 0) && (
            <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Auditoría de Riesgo Táctico y Metacognición</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                {lowConfGambles.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40 flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-300">
                        {lowConfGambles.length} {lowConfGambles.length === 1 ? 'pregunta fallada' : 'preguntas falladas'} arriesgando con duda (confianza 0-1):
                      </strong>{' '}
                      Te costaron{' '}
                      <span className="font-mono font-bold text-rose-400">
                        -{lowConfGambleLostPoints.toFixed(2)} pts netos
                      </span>. Si hubieras dejado esas preguntas en blanco, tu nota neta habría sido{' '}
                      <strong className="text-emerald-300 font-mono">
                        +{potentialScoreIfAbstained.toFixed(2)} pts
                      </strong>.
                    </div>
                  </div>
                )}

                {confidentWrongAttempts.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">
                        {confidentWrongAttempts.length} {confidentWrongAttempts.length === 1 ? 'error crítico' : 'errores críticos'} Confident-Wrong (confianza 3):
                      </strong>{' '}
                      Reactivos en los que estabas convencido pero caíste en la trampa legal. Han sido encolados en el Repair Studio para desmantelar la concepción errónea.
                    </div>
                  </div>
                )}

                {luckyGuesses.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300">
                        {luckyGuesses.length} {luckyGuesses.length === 1 ? 'acierto' : 'aciertos'} por reconocimiento afortunado (confianza 0-1):
                      </strong>{' '}
                      Acertaste sin certeza de la regla. FSRS mantendrá estos reactivos en rotación cercana para consolidar el fundamento normativo.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Session heat map: where this block went wrong (spec §9.11/§11) */}
          {mode !== 'pretest' && <SessionHeatMap items={items} attemptLogs={attemptLogs} />}

          {/* Pretest Diagnostic Map (spec §9.1): strong/weak clusters, confusion pairs, focus */}
          {mode === 'pretest' && (
            <PretestDiagnosticMap
              items={items}
              attemptLogs={attemptLogs}
              clusters={clusters}
              confusionPairs={confusionPairs}
              onLaunchRepair={onLaunchRepair}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => {
                onFinished({
                  total: sessionResults.total,
                  correct: sessionResults.correct,
                  avgConfidence: parseFloat(avgConf),
                });
                onExit();
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-md flex items-center space-x-2"
            >
              <span>Volver al Panel Principal</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadSessionJson}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center space-x-2"
              title="Descargar archivo JSON con el progreso y los resultados de esta sesión"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Exportar Sesión (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Evaluate current attempt correctness for UI feedback
  const isCorrect = evaluation?.correct ?? (selectedOption === currentItem.correct_answer);
  const isConfidentWrong = confidence === 3 && !isCorrect;

  if (showModeA && currentItem) {
    const isRemediation = (fsrsInfo.lapses || 0) >= 2;
    return (
      <ModeAStudyRunner
        item={currentItem}
        currentIndex={currentIndex}
        totalItems={items.length}
        isRemediation={isRemediation}
        lapseCount={fsrsInfo.lapses || 0}
        onCompleted={async (result: boolean | { success: boolean; item: Item }) => {
          const success = typeof result === 'boolean' ? result : result.success;
          if (success) {
            try {
              await api.recordAttempt({
                item_id: currentItem.id,
                activity_type: currentItem.item_type,
                user_response: isRemediation ? 'REMEDIATED_MODE_A' : 'ENCODED_MODE_A',
                confidence: 2,
                correct: true,
                time_to_answer_ms: 1000,
              });
            } catch (e) {
              console.warn('Failed to record Mode A encoding attempt:', e);
            }
          }
          setShowModeA(false);
        }}
        onExit={() => {
          saveSession();
          onExit();
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 px-4">
      {/* Mode B Badge */}
      <div className="flex items-center space-x-2 pb-2">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Examen / Simulacro (Modo B)</span>
        </span>
      </div>

      {/* Top Session Progress Bar & Controls */}
      <div className="flex items-center justify-between py-4 border-b border-slate-800 mb-6 gap-2">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              saveSession();
              onExit();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Salir al panel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">
              {title}
            </span>
            <div className="text-xs text-slate-400">
              Ítem {currentIndex + 1} de {items.length}
            </div>
          </div>
        </div>

        {/* Action Controls & Progress Meter */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Generative Cover Toggle */}
          <button
            onClick={() => setEnableGenerativeCover(!enableGenerativeCover)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition ${
              enableGenerativeCover
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Activar/desactivar redacción generativa previa a ver opciones (Cover & Generate)"
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Generativo: {enableGenerativeCover ? 'ON' : 'OFF'}</span>
          </button>

          {/* Pacing Sprint Timer Toggle */}
          <button
            onClick={() => setIsPacingActive(!isPacingActive)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isPacingActive
                ? pacingTimeLeft <= 10
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/60'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Activar cronómetro de ritmo (45s por ítem para entrenar velocidad)"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isPacingActive ? `${pacingTimeLeft}s` : 'Ritmo (45s)'}</span>
          </button>

          {/* Direct JSON Session Export Button */}
          <button
            onClick={handleDownloadSessionJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-white border border-indigo-700/60 hover:border-indigo-500 rounded-lg text-xs font-semibold transition shadow-xs"
            title="Exportar sesión actual (progreso y resultados) como archivo JSON para continuar en otro navegador"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Exportar JSON</span>
          </button>

          {/* Save / Pause Session Button */}
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition shadow-xs"
            title="Guardar o pausar el progreso de la sesión"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Guardar / Pausar</span>
          </button>

          {/* Progress bar */}
          <div className="flex items-center space-x-2">
            <div className="w-24 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-medium text-slate-300">
              {Math.round(((currentIndex + 1) / items.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Sub-header: Official Scoring Baremo Selector & Live Net Score */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-6 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Baremo Oficial:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {BAREMOS.map((b) => {
              const isSelected = Math.abs(baremoPenalty - b.penaltyPerError) < 0.01;
              return (
                <button
                  key={b.id}
                  onClick={() => setBaremoPenalty(b.penaltyPerError)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                  title={`${b.label} — ${b.formulaDescription}`}
                >
                  {b.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {mode === 'sniper' && (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold animate-pulse">
              <Target className="w-3.5 h-3.5 text-rose-400" />
              <span>Drill Sniper Activo</span>
            </div>
          )}

          {/* Mode B Streak Counter Pill */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition ${
              currentStreak >= 3
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/70 shadow-xs'
                : currentStreak > 0
                ? 'bg-slate-950 text-amber-400 border-slate-800'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
            title={`Racha actual: ${currentStreak} aciertos consecutivos${
              bestStreak > 0 ? ` (Mejor racha de la sesión: ${bestStreak})` : ''
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                currentStreak >= 3
                  ? 'text-amber-400 fill-amber-400 animate-pulse'
                  : currentStreak > 0
                  ? 'text-amber-400'
                  : 'text-slate-600'
              }`}
            />
            <span className="font-sans font-medium text-slate-400">Racha:</span>
            <span>{currentStreak}</span>
            {currentStreak >= 5 && (
              <span className="text-[11px]" title="¡En racha de fuego!">
                🔥
              </span>
            )}
          </div>

          {/* Live Net Score Pill */}
          {(() => {
            const correctCount = sessionResults.correct;
            const errorCount =
              sessionResults.errors ??
              Math.max(0, sessionResults.total - sessionResults.correct - (sessionResults.blanks || 0));
            const blankCount = sessionResults.blanks ?? 0;
            const netScore = correctCount * 1.0 - errorCount * baremoPenalty;
            const netScoreFormatted = netScore.toFixed(2);

            return (
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg border text-xs font-mono font-bold transition ${
                  netScore > 0
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                    : netScore === 0
                    ? 'bg-slate-950 text-slate-300 border-slate-800'
                    : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                }`}
                title={`Puntuación Neta Oficial: +${correctCount} aciertos (${(correctCount * 1).toFixed(2)} pts), -${errorCount} fallos (-${(errorCount * baremoPenalty).toFixed(2)} pts), ${blankCount} omisiones (0 pts)`}
              >
                <span className="font-sans font-medium text-slate-400">Nota Neta:</span>
                <span>{netScore >= 0 ? `+${netScoreFormatted}` : netScoreFormatted} pts</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal">
                  ({correctCount}A / -{errorCount}F / {blankCount}B)
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Item Stem & Question Card */}
      <div className="bg-[#121722] border border-[#20293a] rounded-lg p-6 sm:p-8 shadow-md relative">
        {/* Top Badges: Type, Legal Basis, Difficulty & FSRS Reason Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#20293a] text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-blue-400 font-semibold uppercase text-[11px]">
              {currentItem.item_type.replace(/_/g, ' ')}
            </span>
            {currentItem.legal_basis && (
              <>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="font-mono text-slate-300 font-medium">
                  {currentItem.legal_basis}
                </span>
              </>
            )}

            {/* FSRS Reason Indicator */}
            <span className="text-slate-600" aria-hidden="true">·</span>
            <button
              onClick={() => setShowFsrsDetails(!showFsrsDetails)}
              className="inline-flex items-center space-x-1 text-slate-300 hover:text-blue-300 transition cursor-pointer font-medium"
              title="Haz clic para ver por qué el algoritmo FSRS seleccionó este ítem"
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>{fsrsInfo.selection_reason_badge}</span>
              <Info className="w-3 h-3 text-slate-500 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <span>Dificultad: {'★'.repeat(currentItem.difficulty || 2)}</span>
          </div>
        </div>

        {/* FSRS Learning Progress & Cognitive Selection Details (Accordion) */}
        {showFsrsDetails && (
          <div className="mb-6 p-4 bg-[#0c0f17] border border-[#20293a] rounded-lg space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-[#20293a] pb-2">
              <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Diagnóstico del Motor de Memoria FSRS</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                Estado: <strong className="text-white uppercase">{fsrsInfo.state}</strong>
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed">{fsrsInfo.selection_reason_detail}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-[#121722] p-2.5 rounded border border-[#20293a]">
                <span className="text-[10px] text-slate-400 uppercase">Probabilidad de Recuerdo (R)</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (fsrsInfo.retrievability || 80) >= 80
                          ? 'bg-emerald-500'
                          : (fsrsInfo.retrievability || 80) >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${fsrsInfo.retrievability || 80}%` }}
                    />
                  </div>
                  <span className="font-bold text-white font-mono">{fsrsInfo.retrievability}%</span>
                </div>
              </div>

              <div className="bg-[#121722] p-2.5 rounded border border-[#20293a]">
                <span className="text-[10px] text-slate-400 uppercase">Estabilidad (S)</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">
                  {fsrsInfo.stability?.toFixed(1) || '1.5'} días
                </p>
              </div>

              <div className="bg-[#121722] p-2.5 rounded border border-[#20293a]">
                <span className="text-[10px] text-slate-400 uppercase">Dificultad Intrínseca (D)</span>
                <p className="text-sm font-bold text-amber-400 mt-0.5">
                  {fsrsInfo.difficulty?.toFixed(1) || '4.0'} / 10
                </p>
              </div>

              <div className="bg-[#121722] p-2.5 rounded border border-[#20293a]">
                <span className="text-[10px] text-slate-400 uppercase">Lapsos Previos</span>
                <p className="text-sm font-bold text-rose-400 mt-0.5">
                  {fsrsInfo.lapses || 0} {fsrsInfo.lapses === 1 ? 'fallo' : 'fallos'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question Stem */}
        {displayedStem && (
          <h2 className="text-lg sm:text-xl font-semibold text-slate-100 font-legal-serif leading-relaxed tracking-normal mb-6">
            {displayedStem}
          </h2>
        )}

        {/* Hint System Action Button (Visible during cover / answering stages) */}
        {stage !== 'feedback' && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 p-3 bg-[#182030]/60 border border-[#263248] rounded-md">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {usedHintThisItem
                  ? `Pista activada (Nivel ${hintLevel}) — Intento asistido`
                  : '¿Dudas con la norma? Puedes solicitar un átomo discriminador o base legal.'}
              </span>
            </div>

            <button
              onClick={handleTriggerHint}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center space-x-1.5 ${
                usedHintThisItem
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                  : 'bg-[#121722] hover:bg-[#1f283d] text-amber-300 border border-amber-500/30'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>
                {hintLevel === 0 ? 'Revelar Pista (H)' : hintLevel === 1 ? 'Pista Más Específica (H)' : 'Pista Revelada'}
              </span>
            </button>
          </div>
        )}

        {/* Hint Revelation Content Drawer */}
        {isHintOpen && stage !== 'feedback' && (
          <div className="mb-6 p-4 bg-[#0c0f17] border border-amber-800/60 rounded-md space-y-2 animate-fadeIn text-xs">
            <div className="flex items-center justify-between text-amber-300 font-bold border-b border-[#20293a] pb-1.5">
              <span className="flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Pista Legal Asistida · Nivel {hintLevel} de 2</span>
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">
                Aviso: El intento se marcará como asistido por pista
              </span>
            </div>

            {/* Level 1 Hint: legal basis + the retrieval cue, or the opening of the rule */}
            {hintLevel >= 1 && (
              <div className="space-y-1">
                <span className="font-semibold text-slate-300">1. Criterio discriminador & Base Legal:</span>
                <p className="text-slate-400 pl-3 border-l-2 border-amber-600 leading-relaxed">
                  {currentItem.legal_basis ? `Regulado en: ${currentItem.legal_basis}. ` : ''}
                  {currentItem.corrective_rule ||
                    (currentItem.rule_statement && currentItem.rule_statement.length > 160
                      ? `${currentItem.rule_statement.slice(0, 160).trimEnd()}…`
                      : currentItem.rule_statement || '')}
                </p>
              </div>
            )}

            {/* Level 2 Hint: the norm verbatim, for retrieval before answering */}
            {hintLevel >= 2 && (currentItem.why_correct || currentItem.rule_statement) && (
              <div className="space-y-1 pt-2 border-t border-[#20293a]">
                <span className="font-semibold text-slate-300">2. Fragmento Atómico Clave:</span>
                <p className="text-slate-400 pl-3 border-l-2 border-blue-500 leading-relaxed italic">
                  {currentItem.why_correct || currentItem.rule_statement}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 1. COVER AND GENERATE MCQ VIEW */}
        {/* ---------------------------------------------------- */}
        {currentItem.item_type === 'cover_and_generate_mcq' && (
          <div className="space-y-6">
            {stage === 'cover' && (
              <div className="bg-[#0c0f17] border border-[#20293a] rounded-md p-5 space-y-4">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      Recuperación Generativa Previa
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {currentItem.prompt_before_options ||
                        'Antes de ver las 4 opciones, redacta de memoria la regla, plazo u órgano.'}
                    </p>
                  </div>
                </div>

                <textarea
                  value={generatedAnswer}
                  onChange={(e) => setGeneratedAnswer(e.target.value)}
                  placeholder="Escribe aquí tu respuesta o regla antes de ver las alternativas..."
                  rows={3}
                  className="w-full bg-[#121722] border border-[#20293a] rounded-md p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  autoFocus
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Pulsa <kbd>Espacio</kbd> o el botón para destapar
                  </span>
                  <button
                    onClick={handleRevealOptions}
                    className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition"
                  >
                    Revelar Opciones (Espacio)
                  </button>
                </div>
              </div>
            )}

            {/* Answer Options */}
            {stage !== 'cover' && (
              <div className="space-y-3">
                {generatedAnswer && (
                  <div className="p-3 bg-[#0c0f17] border border-[#20293a] rounded text-xs text-slate-300 mb-2">
                    <span className="text-blue-400 font-semibold">Tu respuesta previa a las opciones: </span>
                    <span className="italic">"{generatedAnswer}"</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2.5">
                  {orderedItemOptions.map((opt, index) => {
                    const isSelected = selectedOption === opt.id;
                    const letter = optionLabelAtPosition(index);

                    let optionStyle =
                      'bg-[#0c0f17] border-[#20293a] hover:border-blue-500/60 hover:bg-[#141a27] text-slate-200';

                    if (stage === 'feedback') {
                      if (opt.is_correct) {
                        optionStyle =
                          'bg-emerald-950/40 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500';
                      } else if (isSelected && !opt.is_correct) {
                        optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-100 ring-1 ring-rose-500';
                      } else {
                        optionStyle = 'bg-[#0c0f17]/50 border-[#20293a]/40 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-[#182030] border-blue-500 text-white ring-1 ring-blue-500';
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={stage !== 'answering'}
                        onClick={() => handleSubmitOption(opt.id)}
                        className={`w-full text-left p-3.5 rounded-md border transition flex items-start space-x-3 ${optionStyle}`}
                      >
                        <span className="w-6 h-6 rounded bg-[#182030] border border-[#2b374c] flex items-center justify-center text-xs font-bold shrink-0 text-slate-300 font-mono">
                          {letter}
                        </span>
                        <div className="flex-1 text-sm leading-relaxed">{opt.text}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Tactical Decision Row: Shortcuts & Blank Abstention */}
                {stage === 'answering' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                    <span className="text-[11px] text-slate-400">
                      Usa las teclas <kbd>1</kbd>–<kbd>4</kbd> para responder
                    </span>
                    <button
                      onClick={handleBlankSubmit}
                      className="flex items-center space-x-2 px-3.5 py-2 rounded-md bg-[#121722] hover:bg-[#182030] text-slate-400 hover:text-slate-200 border border-[#20293a] hover:border-slate-600 text-xs font-medium transition"
                      title={`Abstenerse ante duda táctica. En examen oficial con penalización (-${baremoPenalty.toFixed(2)} pts), dejar en blanco evita perder puntos netos.`}
                    >
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dejar en Blanco (0 pts) · [<kbd>0</kbd> o <kbd>B</kbd>]</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 2. CLOZE / TEXTO MUTILADO VIEW */}
        {/* ---------------------------------------------------- */}
        {currentItem.item_type === 'cloze' && (() => {
          const raw =
            currentItem.cloze_data?.text_with_clozes ||
            currentItem.cloze_data?.template_text ||
            currentItem.stem ||
            '';
          const markerSpecs = [...raw.matchAll(/\{\{(c\d+)::(.*?)\}\}/g)].map((match) => ({
            id: match[1],
            answer: match[2],
          }));
          const blanksMeta = currentItem.cloze_data?.blanks ?? [];
          const metaFor = (id: string, index: number) =>
            blanksMeta.find(
              (blank, blankIndex) =>
                (blank.id ?? `c${(blank.index ?? blankIndex) + 1}`) === id
            ) ?? blanksMeta[index];
          const hasMarkers = markerSpecs.length > 0;
          const hasOptions = (currentItem.options?.length ?? 0) > 0;
          const allFilled =
            hasMarkers &&
            markerSpecs.every((spec) => (clozeInputs[spec.id] ?? '').trim().length > 0);
          const parts = raw.split(/(\{\{c\d+::.*?\}\})/g);

          return (
            <div className="space-y-6">
              {/* Statement with inline blanks */}
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-base leading-relaxed text-slate-200">
                {parts.map((part, i) => {
                  const match = part.match(/\{\{(c\d+)::(.*?)\}\}/);
                  if (match) {
                    const [, blankId, blankAnswer] = match;
                    if (stage === 'feedback' || hasOptions) {
                      return (
                        <span
                          key={i}
                          className="inline-block px-2 py-0.5 bg-indigo-900/50 border border-indigo-600/60 rounded text-indigo-300 font-mono text-sm mx-1"
                        >
                          {stage === 'feedback' ? blankAnswer : '[ … ]'}
                        </span>
                      );
                    }
                    return (
                      <input
                        key={i}
                        type="text"
                        value={clozeInputs[blankId] ?? ''}
                        disabled={stage !== 'answering'}
                        onChange={(event) =>
                          setClozeInputs((previous) => ({
                            ...previous,
                            [blankId]: event.target.value,
                          }))
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && allFilled) setStage('confidence');
                        }}
                        placeholder="…"
                        aria-label={`Hueco ${blankId}`}
                        className="inline-block w-28 mx-1 px-2 py-0.5 bg-slate-900 border border-indigo-700/70 rounded text-indigo-200 font-mono text-sm focus:outline-none focus:border-indigo-400 disabled:opacity-70"
                      />
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>

              {/* Exact Phrasing Discrimination (chips) when options exist */}
              {stage === 'answering' && hasOptions && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-300">
                    Selecciona la redacción jurídica exacta del término o plazo que falta:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {orderedItemOptions.map((opt, index) => {
                      const isSelected = selectedOption === opt.id;
                      return (
                        <button
                          key={opt.id}
                          disabled={stage !== 'answering'}
                          onClick={() => handleSubmitOption(opt.id)}
                          className={`w-full text-left p-3.5 rounded-md border transition flex items-start space-x-3 ${
                            isSelected
                              ? 'bg-[#182030] border-indigo-500 text-white ring-1 ring-indigo-500'
                              : 'bg-[#0c0f17] border-[#20293a] hover:border-indigo-500/60 text-slate-200'
                          }`}
                        >
                          <span className="w-6 h-6 rounded bg-[#182030] border border-[#2b374c] flex items-center justify-center text-xs font-bold shrink-0 text-slate-300 font-mono">
                            {optionLabelAtPosition(index)}
                          </span>
                          <span className="flex-1 text-sm leading-relaxed font-mono">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleBlankSubmit}
                    className="flex items-center space-x-2 px-3.5 py-2 rounded-md bg-[#121722] hover:bg-[#182030] text-slate-400 hover:text-slate-200 border border-[#20293a] text-xs font-medium transition"
                  >
                    <span>Dejar en Blanco (0 pts) · [<kbd>B</kbd>]</span>
                  </button>
                </div>
              )}

              {/* Inline blanks: confirm when every gap is filled */}
              {stage === 'answering' && hasMarkers && !hasOptions && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[11px] text-slate-400">
                    Completa todos los huecos. Pulsa <kbd>Enter</kbd> para comprobar.
                  </span>
                  <button
                    onClick={() => setStage('confidence')}
                    disabled={!allFilled}
                    className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    Comprobar Respuesta
                  </button>
                </div>
              )}

              {/* Fallback: plain text input when the item has no cloze markers */}
              {stage === 'answering' && !hasMarkers && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300">
                    Escribe el término o plazo jurídico exacto que falta:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      disabled={stage !== 'answering'}
                      value={clozeInput}
                      onChange={(event) => setClozeInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && clozeInput.trim()) setStage('confidence');
                      }}
                      placeholder="ej: 5 años, 3 meses, 1 año..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                      autoFocus
                    />
                    <button
                      onClick={() => setStage('confidence')}
                      disabled={stage !== 'answering' || !clozeInput.trim()}
                      className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}

              {/* Per-gap remediation */}
              {stage === 'feedback' && hasMarkers && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Corrección de huecos
                  </h4>
                  <div className="space-y-2.5">
                    {markerSpecs.map((spec, index) => {
                      const meta = metaFor(spec.id, index);
                      const expected = meta?.correct_answer || meta?.answer || meta?.target || spec.answer;
                      const expectedTargets = [expected, ...(meta?.synonyms ?? [])]
                        .filter((value): value is string => Boolean(value))
                        .map(normalizeClozeValue);
                      const userValue = clozeInputs[spec.id] ?? '';
                      const normalizedUser = normalizeClozeValue(userValue);
                      const blankCorrect =
                        normalizedUser.length > 0 &&
                        expectedTargets.some(
                          (target) =>
                            target === normalizedUser ||
                            (normalizedUser.length >= 3 && target.includes(normalizedUser))
                        );
                      return (
                        <div
                          key={spec.id}
                          className="rounded border border-[#20293a] bg-[#0c0f17] p-3 text-xs space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-slate-500">{spec.id}</span>
                            <span className="font-semibold text-emerald-300">{expected}</span>
                            {userValue && (
                              <span className={blankCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                                Tu respuesta: «{userValue}»
                              </span>
                            )}
                            {blankCorrect ? (
                              <span className="rounded border border-emerald-800/70 bg-emerald-950/40 px-1.5 py-0.5 text-[10px] font-mono uppercase text-emerald-300">
                                Correcto
                              </span>
                            ) : (
                              <span className="rounded border border-rose-900/60 bg-rose-950/30 px-1.5 py-0.5 text-[10px] font-mono uppercase text-rose-300">
                                Revisar
                              </span>
                            )}
                            {meta?.trap_type_if_missed && (
                              <span className="rounded border border-rose-900/60 bg-rose-950/30 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide text-rose-300">
                                {trapLabelEs(meta.trap_type_if_missed)}
                              </span>
                            )}
                          </div>
                          {meta?.explanation && (
                            <p className="text-slate-400 leading-relaxed">{meta.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ---------------------------------------------------- */}
        {/* 3. CONTRAST CARD VIEW */}
        {/* ---------------------------------------------------- */}
        {currentItem.item_type === 'contrast_card' && (() => {
          const data = currentItem.contrast_data;
          const rows = (
            data?.comparison_fields ??
            data?.rows ??
            data?.matrix_rows ??
            []
          ).map((row: any) => ({
            label: row.label ?? row.criterion ?? '',
            valueA: row.value_a ?? row.concept_a_val ?? '',
            valueB: row.value_b ?? row.concept_b_val ?? '',
            trapNote: row.trap_note ?? '',
          }));
          const expectedAnswer = (
            currentItem.correct_answer ||
            data?.mini_case_answer ||
            'A'
          ).toUpperCase();
          const correctConcept = expectedAnswer === 'B' ? data?.concept_b : data?.concept_a;
          const casePrompt = data?.mini_case || data?.prompt_cue;

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-xl">
                  <h4 className="font-bold text-indigo-300 text-sm">{data?.concept_a}</h4>
                  <p className="text-xs text-slate-400 mt-1">Concepto A</p>
                </div>
                <div className="p-4 bg-amber-950/30 border border-amber-900/50 rounded-xl">
                  <h4 className="font-bold text-amber-300 text-sm">{data?.concept_b}</h4>
                  <p className="text-xs text-slate-400 mt-1">Concepto B</p>
                </div>
              </div>

              {stage === 'answering' && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-300">
                    {casePrompt ? `Caso práctico: ${casePrompt}` : '¿Qué concepto se aplica?'}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={stage !== 'answering'}
                      onClick={() => {
                        setSelectedOption('A');
                        setStage('confidence');
                      }}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-lg text-xs font-semibold text-slate-200 disabled:opacity-50"
                    >
                      Se aplica {data?.concept_a}
                    </button>
                    <button
                      disabled={stage !== 'answering'}
                      onClick={() => {
                        setSelectedOption('B');
                        setStage('confidence');
                      }}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-lg text-xs font-semibold text-slate-200 disabled:opacity-50"
                    >
                      Se aplica {data?.concept_b}
                    </button>
                  </div>
                </div>
              )}

              {stage === 'feedback' && data && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white uppercase">Matriz de Discriminación</h4>
                    {correctConcept && (
                      <span className="rounded border border-emerald-800/70 bg-emerald-950/40 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                        Caso resuelto: se aplica {correctConcept}
                      </span>
                    )}
                  </div>

                  {rows.length > 0 ? (
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-3 gap-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        <span>Criterio</span>
                        <span>A · {data.concept_a}</span>
                        <span>B · {data.concept_b}</span>
                      </div>
                      {rows.map((row, index) => (
                        <div key={index} className="border-b border-slate-850 pb-2 last:border-b-0">
                          <div className="grid grid-cols-3 gap-2 py-1">
                            <span className="font-medium text-slate-400">{row.label}</span>
                            <span className="text-indigo-300">{row.valueA}</span>
                            <span className="text-amber-300">{row.valueB}</span>
                          </div>
                          {row.trapNote && (
                            <p className="text-[11px] italic text-amber-400/80">
                              Trampa típica: {row.trapNote}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Repasa los rasgos diferenciales de cada concepto antes de continuar.
                    </p>
                  )}

                  {data.distinguishing_criteria && (
                    <p className="border-t border-slate-800 pt-2 text-xs leading-relaxed text-slate-300">
                      {data.distinguishing_criteria}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ---------------------------------------------------- */}
        {/* 4. NUMBER / DEADLINE SORTING DRILL */}
        {/* ---------------------------------------------------- */}
        {currentItem.item_type === 'number_sort' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-400">
              Asigna a cada supuesto su plazo, porcentaje o cuantía exacta de la lista:
            </p>

            {/* Draggable value chips (mouse path). The <select> on each row is
                the full keyboard/screen-reader alternative (spec §14). */}
            <div className="flex flex-wrap gap-2 p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              {(currentItem.number_sort_data?.items || []).map((o) => (
                <span
                  key={o.id}
                  draggable={stage === 'answering'}
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', o.correct_value)}
                  title="Arrastra este valor sobre el supuesto correcto"
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border cursor-grab select-none ${
                    stage === 'answering'
                      ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-indigo-500'
                      : 'bg-slate-950 border-slate-850 text-slate-600 opacity-60'
                  }`}
                >
                  {o.correct_value}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              {(currentItem.number_sort_data?.items || []).map((pair) => (
                <div
                  key={pair.id}
                  onDragOver={(e) => {
                    if (stage === 'answering') e.preventDefault();
                  }}
                  onDrop={(e) => {
                    if (stage !== 'answering') return;
                    e.preventDefault();
                    const value = e.dataTransfer.getData('text/plain');
                    if (!value) return;
                    setNumberSortMatches((prev) => ({ ...prev, [pair.id]: value }));
                  }}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs text-slate-200 font-medium flex-1">{pair.concept}</span>
                    <select
                      disabled={stage !== 'answering'}
                      value={numberSortMatches[pair.id] || ''}
                      onChange={(e) =>
                        setNumberSortMatches((prev) => ({
                          ...prev,
                          [pair.id]: e.target.value,
                        }))
                      }
                      className="bg-slate-900 border border-slate-700 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none disabled:opacity-50"
                    >
                      <option value="">-- Seleccionar valor --</option>
                      {(currentItem.number_sort_data?.items || []).map((o) => (
                        <option key={o.id} value={o.correct_value}>
                          {o.correct_value}
                        </option>
                      ))}
                    </select>
                  </div>
                  {stage === 'feedback' && (() => {
                    const chosen = numberSortMatches[pair.id];
                    const isRight = chosen === pair.correct_value;
                    return (
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span
                          className={`rounded border px-1.5 py-0.5 font-mono uppercase tracking-wide ${
                            isRight
                              ? 'border-emerald-800/70 bg-emerald-950/40 text-emerald-300'
                              : 'border-rose-900/60 bg-rose-950/30 text-rose-300'
                          }`}
                        >
                          {isRight ? 'Correcto' : `Correcta: ${pair.correct_value}`}
                        </span>
                        {!isRight && chosen && (
                          <span className="text-rose-400">Tu respuesta: {chosen}</span>
                        )}
                        {pair.category && <span className="text-slate-500">{pair.category}</span>}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>

            {stage === 'answering' && (
              <button
                onClick={() => setStage('confidence')}
                disabled={
                  stage !== 'answering' ||
                  Object.keys(numberSortMatches).length <
                    (currentItem.number_sort_data?.items.length || 1)
                }
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                Comprobar Clasificación
              </button>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 5. SPOT THE ERROR VIEW */}
        {/* ---------------------------------------------------- */}
        {currentItem.item_type === 'spot_error' && (() => {
          const spotData = currentItem.spot_error_data;
          // Determine the statement to render
          const fullStatement = spotData?.full_statement || spotData?.statement || currentItem.stem;
          const errSpan = spotData?.erroneous_span;
          const corrected = spotData?.corrected_text;
          const explanation = spotData?.explanation;

          // Build clickable segments: highlight the erroneous span in the statement (hidden pre-answer)
          // In 'answering' stage, the user must identify the erroneous portion without highlights
          // In 'feedback' stage, the correction is revealed.
          const segments: Array<{ text: string; isError: boolean }> = [];
          if (errSpan && fullStatement.includes(errSpan)) {
            const idx = fullStatement.indexOf(errSpan);
            if (idx > 0) segments.push({ text: fullStatement.slice(0, idx), isError: false });
            segments.push({ text: errSpan, isError: true });
            segments.push({ text: fullStatement.slice(idx + errSpan.length), isError: false });
          } else {
            segments.push({ text: fullStatement, isError: false });
          }

          // Build candidate fragments to click: erroneous span + some surrounding phrases
          const fragmentChoices: string[] = errSpan ? [errSpan] : [];
          // Add distractors: split sentence into ~3-word chunks
          if (errSpan && fullStatement) {
            const words = fullStatement.split(' ');
            for (let i = 0; i <= words.length - 3; i += 3) {
              const chunk = words.slice(i, i + 3).join(' ');
              if (chunk !== errSpan && !fragmentChoices.includes(chunk)) {
                fragmentChoices.push(chunk);
              }
              if (fragmentChoices.length >= 4) break;
            }
          } else if ((spotData?.error_spans || []).length > 0) {
            (spotData!.error_spans || []).forEach((s: any) => {
              if (!fragmentChoices.includes(s.text)) fragmentChoices.push(s.text);
            });
          }

          return (
            <div className="space-y-5">
              <p className="text-xs text-slate-400">
                La proposición siguiente contiene <strong className="text-rose-400">un único elemento jurídico falso o manipulado</strong>. Identifica y selecciona el fragmento erróneo:
              </p>

              {/* Full statement display */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm leading-relaxed text-slate-200">
                {stage === 'feedback' && errSpan ? (
                  segments.map((seg, i) =>
                    seg.isError ? (
                      <span key={i} className="line-through text-rose-400 font-semibold"> {seg.text} </span>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    )
                  )
                ) : (
                  fullStatement
                )}
              </div>

              {/* Correction in feedback */}
              {stage === 'feedback' && corrected && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-700/40 rounded-lg text-xs text-emerald-300 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">Corrección jurídica: </span>
                    <span>"{corrected}"</span>
                    {spotData?.trap_type && (
                      <span className="rounded border border-rose-900/60 bg-rose-950/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-rose-300">
                        {trapLabelEs(spotData.trap_type)}
                      </span>
                    )}
                  </div>
                  {explanation && <p className="text-slate-400">{explanation}</p>}
                </div>
              )}

              {/* Clickable fragment options */}
              {stage === 'answering' && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    Selecciona el fragmento que contiene el error legal:
                  </div>
                  <div className="space-y-2">
                    {fragmentChoices.slice(0, 4).map((fragment, i) => (
                      <button
                        key={i}
                        disabled={stage !== 'answering'}
                        onClick={() => {
                          setSpotSelectedSpan(fragment);
                          setStage('confidence');
                        }}
                        className="w-full text-left p-3 bg-slate-950 border border-slate-800 hover:border-rose-500 rounded-lg text-xs text-slate-200 disabled:opacity-50 font-mono"
                      >
                        "{fragment}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ---------------------------------------------------- */}
        {/* 6. TWO-TIER DIAGNOSTIC ITEM */}
        {/* ---------------------------------------------------- */}
        {currentItem.item_type === 'two_tier' && (() => {
          // Support both nested schema (tier1.options / tier2.options) and flat schema
          const t1Options = orderedTier1Options;
          const t1Prompt =
            currentItem.two_tier_data?.tier1?.prompt ||
            currentItem.two_tier_data?.tier1_question ||
            currentItem.stem;
          const t2Options = orderedTier2Options;
          const t2Prompt =
            currentItem.two_tier_data?.tier2?.prompt ||
            currentItem.two_tier_data?.tier2_prompt ||
            currentItem.two_tier_data?.tier2_question ||
            '¿Cuál es el fundamento jurídico de tu respuesta?';

          return (
            <div className="space-y-6">
              {twoTierStage === 'tier1' ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-400 font-mono">Nivel 1 · Decisión Jurídica</div>
                  {t1Prompt && t1Prompt !== currentItem.stem && (
                    <p className="text-sm text-slate-200 leading-relaxed">{t1Prompt}</p>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    {t1Options.map((opt, index) => (
                      <button
                        key={opt.id}
                        disabled={stage !== 'answering'}
                        onClick={() => handleSubmitOption(opt.id)}
                        className="w-full text-left p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs text-slate-200 flex items-center space-x-3 disabled:opacity-50"
                      >
                        <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-bold shrink-0">
                          {optionLabelAtPosition(index)}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : stage === 'answering' ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-purple-400 font-mono">Nivel 2 · Justificación Causal</div>
                  <p className="text-xs text-slate-300 italic">"{t2Prompt}"</p>
                  <div className="grid grid-cols-1 gap-3">
                    {t2Options.map((opt, index) => (
                      <button
                        key={opt.id}
                        disabled={stage !== 'answering'}
                        onClick={() => {
                          setUserReasoning(opt.id);
                          setStage('confidence');
                        }}
                        className="w-full text-left p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-xs text-slate-200 flex items-center space-x-3 disabled:opacity-50"
                      >
                        <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-bold shrink-0">
                          {optionLabelAtPosition(index)}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {stage === 'feedback' && (() => {
                const tier1Correct = t1Options.find((option) => option.is_correct);
                const tier2Correct = t2Options.find((option) => option.is_correct);
                const chosenTier2 = t2Options.find((option) => option.id === userReasoning);
                return (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Corrección del diagnóstico
                    </h4>
                    {tier1Correct && (
                      <p className="text-slate-200">
                        <span className="font-semibold text-indigo-300">Nivel 1 · Decisión correcta: </span>
                        {tier1Correct.text}
                      </p>
                    )}
                    {chosenTier2 && (
                      <p className={chosenTier2.is_correct ? 'text-emerald-300' : 'text-rose-300'}>
                        <span className="font-semibold">Tu justificación (Nivel 2): </span>
                        {chosenTier2.text}
                      </p>
                    )}
                    {tier2Correct && (
                      <p className="text-slate-200">
                        <span className="font-semibold text-purple-300">Justificación correcta: </span>
                        {tier2Correct.text}
                      </p>
                    )}
                    {tier2Correct?.explanation && (
                      <p className="text-slate-400 leading-relaxed">{tier2Correct.explanation}</p>
                    )}
                    {chosenTier2 && !chosenTier2.is_correct && chosenTier2.explanation && (
                      <p className="border-t border-slate-800 pt-2 text-slate-400 leading-relaxed">
                        <span className="font-semibold text-rose-300">Por qué tu opción no encaja: </span>
                        {chosenTier2.explanation}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* ---------------------------------------------------- */}
        {/* 7. EXCEPTION TREE & FACT VARIANT */}
        {/* ---------------------------------------------------- */}
        {(currentItem.item_type === 'exception_tree' ||
          currentItem.item_type === 'fact_variant') && (() => {
          const isFactVariant = currentItem.item_type === 'fact_variant';
          const treeData = currentItem.exception_tree_data;
          const testCase = treeData?.test_cases?.[0];
          const walkTree = (node: any): Array<{ id: string; label: string; rule_text?: string; legal_basis?: string }> => {
            if (!node) return [];
            const children = node.children || [];
            if (children.length === 0) {
              return [
                {
                  id: node.id,
                  label: node.label,
                  rule_text: node.rule_text,
                  legal_basis: node.legal_basis,
                },
              ];
            }
            return children.flatMap(walkTree);
          };
          const factData = currentItem.fact_variant_data;
          const variant = factData?.variants?.[0];
          const baseCase = factData?.base_case;

          // Synthesize answer options from polymorphic data when top-level options is empty
          let opts: Array<{ id: string; text: string }> =
            isFactVariant ? orderedFactVariantOptions : currentItem.options || [];

          if (opts.length === 0 && !isFactVariant) {
            const cases = treeData?.test_cases || [];
            const leaves = walkTree(treeData?.root_rule || treeData?.root_node);
            opts = leaves.map((leaf) => ({ id: leaf.id, text: leaf.label }));
            if (opts.length === 0 && cases.length > 0) {
              opts = [
                { id: 'A', text: 'Sí, se aplica la regla general' },
                { id: 'B', text: 'No, opera la excepción legal' },
                { id: 'C', text: 'Depende de la condición prevista en la norma' },
              ];
            }
          }

          const correctLeaf = testCase
            ? walkTree(treeData?.root_rule || treeData?.root_node).find(
                (leaf) => leaf.id === testCase.correct_leaf_id
              )
            : undefined;

          return (
            <div className="space-y-4">
              {isFactVariant && (baseCase || variant) && stage !== 'feedback' && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-indigo-300 font-mono">
                      Supuesto base
                    </span>
                    <p className="mt-1 text-slate-200 leading-relaxed">{baseCase?.scenario}</p>
                    {baseCase?.question && (
                      <p className="mt-1 text-slate-400 italic">{baseCase.question}</p>
                    )}
                  </div>
                  {variant && (
                    <div className="border-t border-slate-800 pt-2">
                      <span className="font-bold uppercase tracking-wider text-amber-300 font-mono">
                        Variante · hecho que cambia
                      </span>
                      <p className="mt-1 text-slate-200 leading-relaxed">{variant.changed_fact}</p>
                      {variant.new_scenario && variant.new_scenario !== variant.changed_fact && (
                        <p className="mt-1 text-slate-400 leading-relaxed">{variant.new_scenario}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isFactVariant && testCase?.scenario && stage !== 'feedback' && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  <span className="font-bold uppercase tracking-wider text-indigo-300 font-mono">
                    Caso a resolver
                  </span>
                  <p className="mt-1 text-slate-200 leading-relaxed">{testCase.scenario}</p>
                </div>
              )}

              {stage === 'answering' && (
                <div className="grid grid-cols-1 gap-3">
                  {opts.map((opt, index) => (
                    <button
                      key={opt.id}
                      disabled={stage !== 'answering'}
                      onClick={() => handleSubmitOption(opt.id)}
                      className="w-full text-left p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs text-slate-200 flex items-center space-x-3 disabled:opacity-50"
                    >
                      <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-bold shrink-0">
                        {isFactVariant ? optionLabelAtPosition(index) : index + 1}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {!isFactVariant && stage === 'feedback' && testCase && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Resolución del árbol
                  </h4>
                  <p className="text-slate-200">
                    <span className="font-semibold text-indigo-300">Caso: </span>
                    {testCase.scenario}
                  </p>
                  {correctLeaf && (
                    <p className="text-emerald-300">
                      <span className="font-semibold">Rama correcta: </span>
                      {correctLeaf.label}
                    </p>
                  )}
                  {correctLeaf?.rule_text && (
                    <p className="text-slate-300 leading-relaxed">{correctLeaf.rule_text}</p>
                  )}
                  {testCase.explanation && (
                    <p className="text-slate-400 leading-relaxed">{testCase.explanation}</p>
                  )}
                  {correctLeaf?.legal_basis && (
                    <p className="font-mono text-[11px] text-slate-500">{correctLeaf.legal_basis}</p>
                  )}
                </div>
              )}

              {isFactVariant && stage === 'feedback' && variant && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Efecto del cambio fáctico
                  </h4>
                  <p className="text-slate-200">
                    <span className="font-semibold text-amber-300">Hecho que cambia: </span>
                    {variant.changed_fact}
                  </p>
                  <p className="text-emerald-300">
                    <span className="font-semibold">Consecuencia correcta: </span>
                    {variant.correct_outcome || variant.expected_outcome}
                  </p>
                  {variant.explanation && (
                    <p className="text-slate-400 leading-relaxed">{variant.explanation}</p>
                  )}
                  {baseCase?.correct_outcome && (
                    <p className="border-t border-slate-800 pt-2 text-slate-300">
                      <span className="font-semibold text-indigo-300">Supuesto base: </span>
                      {baseCase.correct_outcome}
                    </p>
                  )}
                  {(variant.legal_basis || baseCase?.legal_rule) && (
                    <p className="font-mono text-[11px] text-slate-500">
                      {variant.legal_basis || baseCase?.legal_rule}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ---------------------------------------------------- */}
        {/* CONFIDENCE RATING STAGE (0-3) */}
        {/* ---------------------------------------------------- */}
        {stage === 'confidence' && (
          <div className="mt-8 pt-6 border-t border-slate-800 animate-fadeIn">
            <h4 className="text-sm font-bold text-slate-200 mb-2">
              ¿Con qué grado de seguridad has respondido? (Calibración metacognitiva)
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              En el examen real con penalización por fallo, responder con duda o error de alta
              confianza resta puntos críticos.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleSelectConfidence(0)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition group"
              >
                <div className="text-xs font-mono font-bold text-slate-400 group-hover:text-white">
                  0 · Puro Azar
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Sin base ni convicción</div>
              </button>

              <button
                onClick={() => handleSelectConfidence(1)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-left transition group"
              >
                <div className="text-xs font-mono font-bold text-blue-400">
                  1 · Corazonada Débil
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Me suena vagamente</div>
              </button>

              <button
                onClick={() => handleSelectConfidence(2)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition group"
              >
                <div className="text-xs font-mono font-bold text-amber-400">
                  2 · Probablemente
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Recuerdo la regla básica</div>
              </button>

              <button
                onClick={() => handleSelectConfidence(3)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition group"
              >
                <div className="text-xs font-mono font-bold text-emerald-400">
                  3 · Absolutamente Seguro
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Certeza legal completa</div>
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* COMPREHENSIVE EXPLANATORY FEEDBACK STAGE */}
        {/* ---------------------------------------------------- */}
        {stage === 'feedback' && (
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-6 animate-fadeIn">
            {/* Outcome Banner */}
            {(() => {
              const lastLog = attemptLogs[attemptLogs.length - 1];
              const isBlankAttempt = lastLog?.blank || evaluation?.blank;

              if (isBlankAttempt) {
                return (
                  <div className="p-4 rounded-xl border flex items-center space-x-3 bg-amber-950/30 border-amber-800 text-amber-300">
                    <Shield className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">
                        Pregunta Omitida en Blanco · Puntuación Neta: 0,00 pts
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        Decisión táctica de examen: Has evitado una penalización de{' '}
                        <strong className="text-amber-400">-{baremoPenalty.toFixed(2)} pts</strong> al no
                        arriesgar a ciegas. La respuesta correcta era:{' '}
                        <strong>{expectedAnswerSummary}</strong>.
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  className={`p-4 rounded-xl border flex items-center space-x-3 ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-800 text-rose-300'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-sm flex items-center space-x-2">
                      <span>
                        {isCorrect
                          ? '¡Respuesta Correcta!'
                          : `Incorrecto · Respuesta correcta: ${expectedAnswerSummary}`}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-900 border border-slate-750">
                        {isCorrect ? '+1.00 pt' : `-${baremoPenalty.toFixed(2)} pts`}
                      </span>
                    </div>
                    {isConfidentWrong && (
                      <div className="text-xs text-rose-400 mt-0.5 font-semibold">
                        ⚠️ Alerta "Confident-Wrong": Has fallado con seguridad máxima (3). Este ítem ha
                        sido puesto en cuarentena con prioridad crítica para erradicar el sesgo.
                      </div>
                    )}
                    {usedHintThisItem && (
                      <div className="text-xs text-amber-300 mt-0.5">
                        💡 Intento asistido por pista: El algoritmo FSRS ha ajustado la estabilidad de
                        forma conservadora para programar una revisión sin ayuda próximamente.
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {currentItem.figure_status === 'ESTIMATED_LPGE' && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-lg border border-amber-700/70 bg-amber-950/40 px-3 py-2 text-xs font-semibold text-amber-200"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Cuantía estimada — verificar actualización vigente</span>
              </div>
            )}

            {/* Legal Basis & Rule Statement */}
            <div className="bg-[#0c0f17] p-4 rounded-md border border-[#20293a] space-y-2">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-blue-400 font-mono">
                  Base Legal & Regla Positiva
                </span>
                <span className="font-mono text-slate-400 text-right">{currentItem.legal_basis}</span>
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {currentItem.rule_statement || currentItem.why_correct}
              </p>
              {currentItem.why_correct &&
                currentItem.why_correct !== currentItem.rule_statement && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {currentItem.why_correct}
                  </p>
                )}
            </div>

            {/* Retrieval cue: shown only when the item carries a real one */}
            {currentItem.corrective_rule && (
              <div className="p-3 bg-[#121722] border border-[#20293a] rounded-md text-xs">
                <span className="font-bold text-blue-400">Pista clave: </span>
                <span className="text-slate-300">{currentItem.corrective_rule}</span>
              </div>
            )}

            {/* Distractor feedback: only rendered when the item actually explains why each option fails */}
            {(() => {
              const distractors = (currentItem.options ?? []).filter(
                (opt) => !opt.is_correct && (opt.explanation?.trim() || opt.trap_type),
              );
              if (distractors.length === 0) return null;
              return (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Por qué fallan las demás opciones
                  </h4>
                  <div className="space-y-2">
                    {distractors.map((opt) => (
                      <div
                        key={opt.id}
                        className="p-3 bg-[#0c0f17] border border-[#20293a] rounded-md text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-slate-200 font-medium leading-snug">
                            <span className="font-bold text-slate-300">
                              {labelForOptionId(displayedOptions, opt.id)}.
                            </span>{' '}
                            {opt.text}
                          </p>
                          {opt.trap_type && (
                            <span className="shrink-0 rounded border border-rose-900/60 bg-rose-950/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-rose-300">
                              {trapLabelEs(opt.trap_type)}
                            </span>
                          )}
                        </div>
                        {opt.explanation && (
                          <p className="text-slate-400 leading-relaxed">{opt.explanation}</p>
                        )}
                        {opt.condition_if_correct && (
                          <p className="text-slate-500 text-[11px] italic">
                            Sería correcto si: {opt.condition_if_correct}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}


            {/* Next Item CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Pulsa <kbd>Espacio</kbd> para continuar
              </span>
              <button
                onClick={handleNextItem}
                className="px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-xs"
              >
                <span>Siguiente Ítem</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SESSION SAVE & RESTORE MODAL */}
      {/* ---------------------------------------------------- */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Save className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Guardar / Restaurar Progreso</h3>
              </div>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Tu sesión actual está en el ítem <strong>{currentIndex + 1} de {items.length}</strong>.
              Puedes descargar un archivo de progreso JSON para restaurarlo en cualquier momento o en otro equipo.
            </p>

            {saveStatusMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveStatusMessage}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownloadSessionJson}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow transition"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Sesión como Archivo JSON</span>
              </button>

              <label className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Cargar / Restaurar Sesión desde Archivo</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleUploadSessionJson}
                />
              </label>

              <button
                onClick={() => {
                  saveSession();
                  setIsSaveModalOpen(false);
                  onExit();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 text-xs font-medium transition"
              >
                Pausar y Salir al Panel Principal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating status toast notification */}
      {saveStatusMessage && !isSaveModalOpen && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/60 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 animate-fadeIn max-w-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{saveStatusMessage}</span>
        </div>
      )}
    </div>
  );
};
