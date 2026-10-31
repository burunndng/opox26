import {
  ActivityAttempt,
  Atom,
  Cluster,
  ConfusionPair,
  ErrorLog,
  Item,
  ReviewSchedule,
} from '../types.ts';

/**
 * Analytics engine (spec §10–§11) — PURE functions, framework-free.
 *
 * Design note: the App already holds every dataset in memory, so this module
 * is consumed directly by the components (no HTTP hop). The dashboards are
 * deliberately NOT a navigation destination: the results are rendered inside
 * the learning surfaces (Dashboard strip, session summary, Item Bank) so the
 * metrics inform the next study decision instead of becoming a place to browse.
 *
 * The module is also imported by tests and may be reused server-side.
 */

export interface AnalyticsInput {
  items: Item[];
  atoms?: Atom[];
  clusters: Cluster[];
  confusionPairs: ConfusionPair[];
  attempts: ActivityAttempt[];
  errors: ErrorLog[];
  schedules?: ReviewSchedule[];
  /** Limit to attempts from this date (ISO) for trend deltas. */
  since?: string;
}

export interface HeatEntry {
  key: string;
  label: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface CalibrationLevel {
  level: 0 | 1 | 2 | 3;
  total: number;
  correct: number;
  accuracy: number;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface CalibrationAlert {
  code: string;
  severity: AlertSeverity;
  message: string;
  scope?: string;
}

export interface FragileIndices {
  fragileKnowledgeIndex: number; // 0..100 — lucky-correct share
  misconceptionIndex: number; // 0..100 — confident-wrong share
  luckyCorrect: number;
  confidentWrong: number;
  /** avg(confidence) - avg(correct) → >0 means overconfident */
  calibrationDelta: number;
}

export interface ConfusionMatrixRow {
  key: string;
  label: string;
  errors: number;
  attempts: number;
  accuracy: number;
}

export interface SrsStats {
  newItems: number;
  dueToday: number;
  overdue: number;
  graduated: number;
  maintenance: number;
  avgIntervalDays: number;
  lapseRate: number; // %
  graduationRate: number; // %
  predictedForgettingRisk: number; // items overdue > 7 days
}

export interface ActivityEffectivenessRow {
  activityType: string;
  attempts: number;
  accuracy: number;
  avgConfidence: number;
  interleavedAccuracy: number | null;
  blockedAccuracy: number | null;
}

export interface QualitySummary {
  total: number;
  draft: number;
  validated: number;
  active: number;
  retired: number;
  missingLegalBasis: number;
  missingDistractorExplanation: number;
  missingTrapType: number;
  duplicateStems: number;
  negativeStems: number;
  negativeOptions: number;
  optionLengthBias: number;
}

export interface AnalyticsSnapshot {
  heatmaps: {
    byTopic: HeatEntry[];
    byCluster: HeatEntry[];
    byPair: HeatEntry[];
    byLegalBasis: HeatEntry[];
    byAtomType: HeatEntry[];
  };
  calibration: {
    levels: CalibrationLevel[];
    alerts: CalibrationAlert[];
    indices: FragileIndices;
  };
  matrices: {
    numeric: ConfusionMatrixRow[];
    institutional: ConfusionMatrixRow[];
    temporal: ConfusionMatrixRow[];
  };
  srs: SrsStats;
  effectiveness: ActivityEffectivenessRow[];
  quality: QualitySummary;
}

// ---------------------------------------------------------------------------
// Heat maps
// ---------------------------------------------------------------------------

export function buildHeatmap(
  items: Item[],
  attempts: ActivityAttempt[],
  keyOf: (item: Item) => string | undefined,
  labelOf: (key: string) => string
): HeatEntry[] {
  const byId = new Map(items.map((i) => [i.id, i]));
  const acc = new Map<string, { attempted: number; correct: number }>();
  for (const attempt of attempts) {
    const item = byId.get(attempt.item_id);
    if (!item) continue;
    const key = keyOf(item);
    if (!key) continue;
    const entry = acc.get(key) ?? { attempted: 0, correct: 0 };
    entry.attempted += 1;
    if (attempt.correct) entry.correct += 1;
    acc.set(key, entry);
  }
  return Array.from(acc.entries())
    .map(([key, v]) => ({
      key,
      label: labelOf(key),
      attempted: v.attempted,
      correct: v.correct,
      accuracy: v.attempted > 0 ? Math.round((v.correct / v.attempted) * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function buildAllHeatmaps(input: AnalyticsInput): AnalyticsSnapshot['heatmaps'] {
  const { items, atoms = [], clusters, confusionPairs, attempts } = input;
  const atomTypes = new Map(atoms.map((a) => [a.id, a.atom_type]));
  return {
    byTopic: buildHeatmap(items, attempts, (i) => i.topic_id, (k) => k),
    byCluster: buildHeatmap(
      items,
      attempts,
      (i) => i.cluster_id,
      (k) => clusters.find((c) => c.id === k)?.name ?? k
    ),
    byPair: buildHeatmap(
      items,
      attempts,
      (i) => i.confusion_pair_id,
      (k) => {
        const p = confusionPairs.find((cp) => cp.id === k);
        return p ? `${p.concept_a} vs ${p.concept_b}` : k;
      }
    ),
    byLegalBasis: buildHeatmap(items, attempts, (i) => i.legal_basis, (k) => k),
    byAtomType: buildHeatmap(
      items,
      attempts,
      (i) => (i.cluster_id ? atomTypes.get(items.find((x) => x.id === i.id)?.id ?? '') : undefined),
      (k) => k
    ),
  };
}

// ---------------------------------------------------------------------------
// Calibration
// ---------------------------------------------------------------------------

export function calibrationLevels(attempts: ActivityAttempt[]): CalibrationLevel[] {
  const levels: CalibrationLevel[] = [0, 1, 2, 3].map((level) => ({
    level: level as 0 | 1 | 2 | 3,
    total: 0,
    correct: 0,
    accuracy: 0,
  }));
  for (const a of attempts) {
    const bucket = levels[a.confidence];
    if (!bucket) continue;
    bucket.total += 1;
    if (a.correct) bucket.correct += 1;
  }
  for (const l of levels) l.accuracy = l.total > 0 ? Math.round((l.correct / l.total) * 100) : 0;
  return levels;
}

export function fragileIndices(attempts: ActivityAttempt[]): FragileIndices {
  const graded = attempts.filter((a) => a.confidence !== undefined);
  const luckyCorrect = graded.filter((a) => a.correct && a.confidence <= 1).length;
  const confidentWrong = graded.filter((a) => !a.correct && a.confidence === 3).length;
  const n = graded.length || 1;
  const avgConf = graded.reduce((s, a) => s + a.confidence, 0) / n;
  const acc = graded.filter((a) => a.correct).length / n;
  return {
    fragileKnowledgeIndex: Math.round((luckyCorrect / n) * 100),
    misconceptionIndex: Math.round((confidentWrong / n) * 100),
    luckyCorrect,
    confidentWrong,
    calibrationDelta: Number((avgConf - acc).toFixed(2)),
  };
}

/**
 * Textual calibration alerts (spec §10): concrete, actionable, in Spanish.
 * Thresholds are deliberately conservative: at least 3 attempts per level and
 * 2+ items in a cluster before claiming miscalibration.
 */
export function calibrationAlerts(
  levels: CalibrationLevel[],
  indices: FragileIndices,
  heatmaps: AnalyticsSnapshot['heatmaps'],
  errors: ErrorLog[]
): CalibrationAlert[] {
  const alerts: CalibrationAlert[] = [];
  const [l0, l1, l2, l3] = levels;

  if (l3.total >= 3 && l3.accuracy < 75) {
    alerts.push({
      code: 'overconfident_global',
      severity: 'critical',
      message: `Estás sobrecalibrado: cuando dices "seguro" aciertas solo el ${l3.accuracy}% de las veces (${l3.correct}/${l3.total}).`,
    });
  }
  if ((l0.total + l1.total) >= 5 && indices.luckyCorrect / (l0.total + l1.total) > 0.5) {
    alerts.push({
      code: 'lucky_guessing',
      severity: 'warning',
      message: `Muchos aciertos con confianza baja (${indices.luckyCorrect}): reconocimiento afortunado, no dominio. Repara con cover-and-generate.`,
    });
  }
  if (indices.calibrationDelta > 0.6) {
    alerts.push({
      code: 'overcalibration_delta',
      severity: 'warning',
      message: `Sesgo de confianza +${indices.calibrationDelta}: tu certeza-media excede tu tasa de acierto real.`,
    });
  }
  if (indices.calibrationDelta < -0.3) {
    alerts.push({
      code: 'undercalibration_delta',
      severity: 'info',
      message: `Sesgo de confianza ${indices.calibrationDelta}: subestimas lo que sabes. No descuentes aciertos por miedo.`,
    });
  }

  // Cluster-specific overcalibration: confident-wrong concentrated somewhere
  for (const cluster of heatmaps.byCluster.filter((c) => c.attempted >= 2 && c.accuracy < 50).slice(0, 3)) {
    alerts.push({
      code: 'weak_cluster',
      severity: 'warning',
      scope: cluster.label,
      message: `Clúster débil: ${cluster.label} (${cluster.correct}/${cluster.attempted}). Prioriza su reparación.`,
    });
  }

  // Danger pairs: low accuracy confusion pairs
  for (const pair of heatmaps.byPair.filter((p) => p.attempted >= 2 && p.accuracy < 50).slice(0, 2)) {
    alerts.push({
      code: 'danger_pair',
      severity: 'critical',
      scope: pair.label,
      message: `Confusión persistente: ${pair.label} (${pair.accuracy}% de acierto). Necesita contraste A/B explícito.`,
    });
  }

  // Error-type hotspots
  const byCode = errors.reduce<Record<string, number>>((acc, e) => {
    const code = e.error_type_code ?? 'E1';
    acc[code] = (acc[code] ?? 0) + 1;
    return acc;
  }, {});
  if ((byCode.E8 ?? 0) > 0) {
    alerts.push({
      code: 'confident_wrong',
      severity: 'critical',
      message: `${byCode.E8} errores confident-wrong (E8): concepciones erróneas con máxima confianza. Reparación obligatoria antes de graduarse.`,
    });
  }
  if ((byCode.E6 ?? 0) >= 2) {
    alerts.push({
      code: 'numeric_errors',
      severity: 'warning',
      message: `${byCode.E6} errores numéricos (E6): cifras y plazos siguen siendo el punto débil. Drill de números.`,
    });
  }

  return alerts;
}

// ---------------------------------------------------------------------------
// Confusion matrices (numeric / institutional / temporal)
// ---------------------------------------------------------------------------

const MATRIX_RULES: Record<
  'numeric' | 'institutional' | 'temporal',
  { codes: string[]; traps: string[]; label: string }
> = {
  numeric: { codes: ['E6'], traps: ['numeric_substitution', 'numeric_precision'], label: 'Numérica' },
  institutional: {
    codes: ['E17'],
    traps: ['wrong_competent_body'],
    label: 'Órgano competente',
  },
  temporal: {
    codes: ['E16', 'E4'],
    traps: ['temporal_confusion', 'wrong_start_date', 'rule_exception_swap'],
    label: 'Temporal / inicio del cómputo',
  },
};

export function buildConfusionMatrices(
  errors: ErrorLog[],
  items: Item[],
  attempts: ActivityAttempt[]
): AnalyticsSnapshot['matrices'] {
  const byId = new Map(items.map((i) => [i.id, i]));
  const attemptsByItem = attempts.reduce<Record<string, { total: number; correct: number }>>((acc, a) => {
    const e = (acc[a.item_id] ??= { total: 0, correct: 0 });
    e.total += 1;
    if (a.correct) e.correct += 1;
    return acc;
  }, {});

  const out = {} as AnalyticsSnapshot['matrices'];
  (Object.keys(MATRIX_RULES) as Array<'numeric' | 'institutional' | 'temporal'>).forEach((kind) => {
    const rule = MATRIX_RULES[kind];
    const rows = new Map<string, { errors: number; total: number; correct: number }>();
    for (const e of errors) {
      const matchesCode = rule.codes.includes(e.error_type_code ?? '');
      const matchesTrap = !!e.trap_type && rule.traps.includes(e.trap_type);
      if (!matchesCode && !matchesTrap) continue;
      const item = byId.get(e.item_id);
      const key = item?.cluster_id ?? e.cluster_id ?? 'sin_cluster';
      const row = rows.get(key) ?? { errors: 0, total: 0, correct: 0 };
      row.errors += 1;
      const stat = attemptsByItem[e.item_id];
      if (stat) {
        row.total += stat.total;
        row.correct += stat.correct;
      }
      rows.set(key, row);
    }
    out[kind] = Array.from(rows.entries()).map(([key, v]) => ({
      key,
      label: key,
      errors: v.errors,
      attempts: v.total,
      accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    }));
  });
  return out;
}

// ---------------------------------------------------------------------------
// SRS + effectiveness + quality
// ---------------------------------------------------------------------------

export function srsStats(items: Item[], attempts: ActivityAttempt[], schedules: ReviewSchedule[] = []): SrsStats {
  const now = Date.now();
  const byItem = new Map(items.map((i) => [i.id, i]));
  let newItems = 0, dueToday = 0, overdue = 0, graduated = 0, maintenance = 0, intervalSum = 0, lapses = 0, risk = 0;

  if (schedules.length > 0) {
    for (const s of schedules) {
      if (!byItem.has(s.item_id)) continue;
      const due = new Date(s.due_date).getTime();
      const daysOverdue = Math.floor((now - due) / 86400000);
      if (s.state === 'new') newItems += 1;
      if (s.state === 'graduated') graduated += 1;
      if (s.state === 'maintenance') maintenance += 1;
      intervalSum += s.interval_days ?? 0;
      lapses += s.lapses ?? 0;
      if (daysOverdue >= 0) dueToday += 1;
      if (daysOverdue > 0) overdue += 1;
      if (daysOverdue > 7) risk += 1;
    }
  } else {
    // Derive from attempts when schedules are not loaded
    const seen = new Set<string>();
    for (const a of attempts) {
      if (seen.has(a.item_id)) continue;
      seen.add(a.item_id);
      newItems += 1;
    }
  }

  const nSched = schedules.filter((s) => byItem.has(s.item_id)).length || 1;
  const failed = attempts.filter((a) => !a.correct).length;

  return {
    newItems,
    dueToday,
    overdue,
    graduated,
    maintenance,
    avgIntervalDays: Math.round((intervalSum / nSched) * 10) / 10,
    lapseRate: attempts.length > 0 ? Math.round((failed / attempts.length) * 100) : 0,
    graduationRate: items.length > 0 ? Math.round((graduated / items.length) * 100) : 0,
    predictedForgettingRisk: risk,
  };
}

export function activityEffectiveness(attempts: ActivityAttempt[]): ActivityEffectivenessRow[] {
  const byType = new Map<string, { total: number; correct: number; conf: number; intl: { t: number; c: number }; blk: { t: number; c: number } }>();
  for (const a of attempts) {
    const e = byType.get(a.activity_type) ?? {
      total: 0, correct: 0, conf: 0, intl: { t: 0, c: 0 }, blk: { t: 0, c: 0 },
    };
    e.total += 1;
    e.conf += a.confidence ?? 0;
    if (a.correct) e.correct += 1;
    const bucket = a.was_interleaved ? e.intl : e.blk;
    bucket.t += 1;
    if (a.correct) bucket.c += 1;
    byType.set(a.activity_type, e);
  }
  return Array.from(byType.entries())
    .map(([activityType, e]) => ({
      activityType,
      attempts: e.total,
      accuracy: e.total > 0 ? Math.round((e.correct / e.total) * 100) : 0,
      avgConfidence: e.total > 0 ? Number((e.conf / e.total).toFixed(2)) : 0,
      interleavedAccuracy: e.intl.t > 0 ? Math.round((e.intl.c / e.intl.t) * 100) : null,
      blockedAccuracy: e.blk.t > 0 ? Math.round((e.blk.c / e.blk.t) * 100) : null,
    }))
    .sort((a, b) => b.attempts - a.attempts);
}

const NEGATIVE_WORDS = /\b(todas?|ninguna?|siempre|nunca)\b/i;
const ALL_PREVIOUS = /\b(todas|ninguna)\s+de\s+las\s+anteriores\b/i;

export function contentQuality(items: Item[]): QualitySummary {
  const summary: QualitySummary = {
    total: items.length,
    draft: 0, validated: 0, active: 0, retired: 0,
    missingLegalBasis: 0, missingDistractorExplanation: 0, missingTrapType: 0,
    duplicateStems: 0, negativeStems: 0, negativeOptions: 0, optionLengthBias: 0,
  };
  const stems = new Set<string>();
  const dupes = new Set<string>();

  for (const item of items) {
    if (item.status === 'draft') summary.draft += 1;
    if (item.status === 'validated') summary.validated += 1;
    if (item.status === 'active') summary.active += 1;
    if (item.status === 'retired') summary.retired += 1;

    if (!item.legal_basis || !item.legal_basis.trim()) summary.missingLegalBasis += 1;

    for (const opt of item.options ?? []) {
      if (opt.is_correct) continue;
      if (!opt.explanation || !opt.explanation.trim()) summary.missingDistractorExplanation += 1;
      if (!opt.trap_type) summary.missingTrapType += 1;
      if (NEGATIVE_WORDS.test(opt.text ?? '') || ALL_PREVIOUS.test(opt.text ?? '')) {
        summary.negativeOptions += 1;
      }
    }

    const normStem = (item.stem ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (normStem) {
      if (stems.has(normStem)) dupes.add(normStem);
      stems.add(normStem);
    }
    if (NEGATIVE_WORDS.test(item.stem ?? '') || ALL_PREVIOUS.test(item.stem ?? '')) summary.negativeStems += 1;

    const correct = (item.options ?? []).find((o) => o.is_correct);
    const others = (item.options ?? []).filter((o) => !o.is_correct);
    if (correct && others.length > 0) {
      const correctLen = (correct.text ?? '').length;
      const meanOther =
        others.reduce((sum, o) => sum + (o.text ?? '').length, 0) / others.length;
      // Aligned with the bank gate F3: correct option ≤ 1.25 × mean distractor length.
      if (correctLen > meanOther * 1.25) summary.optionLengthBias += 1;
    }
  }
  summary.duplicateStems = dupes.size;
  return summary;
}

// ---------------------------------------------------------------------------
// Snapshot
// ---------------------------------------------------------------------------

export function buildAnalyticsSnapshot(input: AnalyticsInput): AnalyticsSnapshot {
  const heatmaps = buildAllHeatmaps(input);
  const levels = calibrationLevels(input.attempts);
  const indices = fragileIndices(input.attempts);
  const alerts = calibrationAlerts(levels, indices, heatmaps, input.errors);
  return {
    heatmaps,
    calibration: { levels, alerts, indices },
    matrices: buildConfusionMatrices(input.errors, input.items, input.attempts),
    srs: srsStats(input.items, input.attempts, input.schedules),
    effectiveness: activityEffectiveness(input.attempts),
    quality: contentQuality(input.items),
  };
}
