import {
  Item,
  ReviewSchedule,
  ErrorLog,
  ItemType,
  ItemFsrsInfo,
  isPracticeEligible,
} from '../src/types.ts';
import { db } from './db.ts';

export interface InterleavedBlockParams {
  blockSize: number;
  topicId?: string;
  includeNew?: boolean;
  includeMaintenance?: boolean;
  focusConfusionPairs?: boolean;
  activityTypes?: ItemType[];
}

export interface DueStats {
  dueToday: number;
  learning: number;
  newItems: number;
  graduated: number;
  maintenance: number;
  openErrors: number;
  confidentWrong: number;
}

export class SchedulingEngine {
  /**
   * Calculates FSRS Retrievability probability (0 - 100%)
   * R(t, S) = (1 + 0.2335 * (t / S))^(-0.5)
   */
  public static calculateRetrievability(stabilityDays: number, daysElapsed: number): number {
    const s = Math.max(0.1, stabilityDays);
    const t = Math.max(0, daysElapsed);
    const r = Math.pow(1 + 0.2335 * (t / s), -0.5);
    return Math.max(1, Math.min(100, Math.round(r * 100)));
  }

  /**
   * Computes comprehensive FSRS metadata and an interpretable selection reason badge and explanation.
   */
  public static computeFsrsMetadata(
    item: Item,
    schedule?: ReviewSchedule,
    context?: { isInterleaved?: boolean; openError?: ErrorLog; isDueQueue?: boolean }
  ): ItemFsrsInfo {
    const now = new Date();
    const sched = schedule || db.getReviewSchedule(item.id);
    const openErrors = db.getErrorLogs({ status: 'open', item_id: item.id });
    const openError = context?.openError || openErrors[0];

    const stability = sched?.stability ?? 1.0;
    const difficulty = sched?.difficulty ?? (item.difficulty ? item.difficulty * 2 : 5);
    const lapses = sched?.lapses ?? 0;
    const state = sched?.state ?? 'new';

    let daysOverdue = 0;
    let daysSinceSched = 0;
    if (sched?.due_date) {
      const dueDate = new Date(sched.due_date);
      daysSinceSched = Math.max(0, (now.getTime() - dueDate.getTime()) / (24 * 3600 * 1000));
      if (dueDate <= now) {
        daysOverdue = Math.round(daysSinceSched * 10) / 10;
      }
    }

    const retrievability = this.calculateRetrievability(stability, Math.max(0.2, (sched?.interval_days || 1) + daysOverdue));

    let selection_reason_badge = '🗓️ Repaso Espaciado FSRS';
    let selection_reason_detail = `Ítem programado por retrievability estimada (${retrievability}%). Estabilidad: ${stability.toFixed(1)} días.`;

    if (openError && (openError.error_type_code === 'E8' || openError.confidence === 3)) {
      selection_reason_badge = '🚨 Cuarentena Confident-Wrong (E8)';
      selection_reason_detail =
        'Fallo previo con alta convicción (E8). FSRS asigna prioridad máxima y dificultad elevada para erradicar el error antes de que se fosilice.';
    } else if (openError) {
      selection_reason_badge = '⚠️ Reparación de Fallo Reciente';
      selection_reason_detail = `En cola de reaprendizaje sucesivo tras error ${openError.error_type_code || 'previo'}. Lapso nº ${lapses}.`;
    } else if (context?.isInterleaved) {
      selection_reason_badge = '🔀 Intercalación FSRS';
      selection_reason_detail =
        'Seleccionado para entrenar discriminación cruzada, alternando formatos y respetando la restricción de clusters consecutivos.';
    } else if (state === 'new') {
      selection_reason_badge = '✨ Ítem Nuevo';
      selection_reason_detail =
        'Primera presentación dentro del límite diario. Se calibrará la estabilidad inicial en función de tu primer intento.';
    } else if (state === 'learning') {
      selection_reason_badge = '🌱 Consolidación Temprana';
      selection_reason_detail = `Fase de adquisición activa (${sched?.consecutive_correct_sessions || 0}/3 aciertos consecutivos para graduación).`;
    } else if (daysOverdue > 0) {
      selection_reason_badge = `🗓️ Vencido por FSRS (Retención ${retrievability}%)`;
      selection_reason_detail = `La probabilidad de recuerdo ha descendido al ${retrievability}% (umbral 90%). Vencido hace ${daysOverdue} días. Estabilidad: ${stability.toFixed(1)} d.`;
    } else if (state === 'graduated' || state === 'maintenance') {
      selection_reason_badge = '🛡️ Mantenimiento a Largo Plazo';
      selection_reason_detail = `Ítem graduado con ${sched?.formats_completed?.length || 2} formatos superados. Revisión preventiva a largo intervalo (${sched?.interval_days || 30} días).`;
    }

    return {
      stability: Math.round(stability * 10) / 10,
      difficulty: Math.round(difficulty * 10) / 10,
      retrievability,
      days_overdue: daysOverdue,
      lapses,
      state,
      selection_reason_badge,
      selection_reason_detail,
    };
  }

  public static getDueStats(topicId?: string): DueStats {
    const schedules = db.getReviewSchedules();
    const items = db.getItems(topicId ? { topic_id: topicId } : undefined).filter(isPracticeEligible);
    const itemMap = new Map(items.map((i) => [i.id, i]));
    const errorLogs = db.getErrorLogs({ status: 'open' });

    const now = new Date();
    let dueToday = 0;
    let learning = 0;
    let newItems = 0;
    let graduated = 0;
    let maintenance = 0;

    for (const s of schedules) {
      if (!itemMap.has(s.item_id)) continue;
      if (s.state === 'new') {
        newItems++;
      } else if (s.state === 'learning') {
        learning++;
      } else if (s.state === 'graduated') {
        graduated++;
      } else if (s.state === 'maintenance') {
        maintenance++;
      }

      if (s.due_date && new Date(s.due_date) <= now) {
        dueToday++;
      }
    }

    const confidentWrong = errorLogs.filter((e) => e.error_type_code === 'E8' || e.confidence === 3).length;

    return {
      dueToday,
      learning,
      newItems,
      graduated,
      maintenance,
      openErrors: errorLogs.length,
      confidentWrong,
    };
  }

  public static getDueQueue(limit = 20, topicId?: string): Item[] {
    const schedules = db.getReviewSchedules();
    const allItems = db.getItems(topicId ? { topic_id: topicId } : undefined).filter(isPracticeEligible);
    const itemMap = new Map(allItems.map((i) => [i.id, i]));
    const openErrors = db.getErrorLogs({ status: 'open' });
    const errorMap = new Map(openErrors.map((e) => [e.item_id, e]));
    const confidentWrongIds = new Set(
      openErrors.filter((e) => e.error_type_code === 'E8' || e.confidence === 3).map((e) => e.item_id)
    );

    const now = new Date();

    // Score items for due queue:
    // 1. Confident-wrong errors highest priority
    // 2. Open errors / lapses
    // 3. Overdue review items
    // 4. Learning queue
    // 5. New items
    const scoredSchedules = schedules
      .filter((s) => itemMap.has(s.item_id))
      .map((s) => {
        let score = s.priority_score || 0;

        if (confidentWrongIds.has(s.item_id)) score += 1000;
        else if (errorMap.has(s.item_id)) score += 500;

        const isOverdue = new Date(s.due_date) <= now;
        if (isOverdue) {
          const daysOverdue = Math.max(0, (now.getTime() - new Date(s.due_date).getTime()) / (24 * 3600 * 1000));
          score += 100 + daysOverdue * 10;
        }

        if (s.state === 'learning') score += 50;
        if (s.state === 'new') score += 20;

        return { schedule: s, score };
      });

    scoredSchedules.sort((a, b) => b.score - a.score);

    const resultItems: Item[] = [];
    for (const entry of scoredSchedules.slice(0, limit)) {
      const baseItem = itemMap.get(entry.schedule.item_id);
      if (baseItem) {
        const fsrs_info = this.computeFsrsMetadata(baseItem, entry.schedule, {
          openError: errorMap.get(baseItem.id),
          isDueQueue: true,
        });
        resultItems.push({
          ...baseItem,
          fsrs_info,
        });
      }
    }
    return resultItems;
  }
}

export class InterleavingEngine {
  /**
   * Builds an interleaved practice block respecting:
   * 1. No more than 2 consecutive items from the same cluster
   * 2. Mixing confusion pair partners when possible
   * 3. Diversity of activity types (MCQ, Cloze, Contrast, Number Sort, Spot Error, Two-Tier)
   * 4. Mixing current topic, weak areas, and maintenance items
   */
  public static generateBlock(params: InterleavedBlockParams): Item[] {
    const {
      blockSize = 15,
      topicId,
      includeNew = true,
      includeMaintenance = true,
      focusConfusionPairs = true,
      activityTypes,
    } = params;

    let allItems = db.getItems(topicId ? { topic_id: topicId } : undefined).filter(isPracticeEligible);

    if (activityTypes && activityTypes.length > 0) {
      allItems = allItems.filter((i) => activityTypes.includes(i.item_type));
    }

    if (allItems.length === 0) return [];

    const schedules = db.getReviewSchedules();
    const schedMap = new Map(schedules.map((s) => [s.item_id, s]));
    const openErrors = db.getErrorLogs({ status: 'open' });
    const errorMap = new Map(openErrors.map((e) => [e.item_id, e]));
    const weakItemIds = new Set(openErrors.map((e) => e.item_id));

    // Candidate scoring
    const scoredCandidates = allItems.map((item) => {
      const sched = schedMap.get(item.id);
      let weight = 10;

      // Weak or errored item
      if (weakItemIds.has(item.id)) weight += 40;

      // Confusion pair focus
      if (focusConfusionPairs && item.confusion_pair_id) weight += 25;

      // Status weights
      if (sched?.state === 'learning') weight += 30;
      else if (sched?.state === 'review' && new Date(sched.due_date) <= new Date()) weight += 35;
      else if (sched?.state === 'new' && includeNew) weight += 15;
      else if (sched?.state === 'graduated' && includeMaintenance) weight += 10;

      // Difficulty weight
      weight += (item.difficulty || 2) * 5;

      return { item, weight };
    });

    // Shuffle with weighted randomness
    scoredCandidates.sort((a, b) => b.weight * (0.8 + Math.random() * 0.4) - a.weight * (0.8 + Math.random() * 0.4));

    const foundationalTypes = ['cover_and_generate_mcq', 'cloze', 'retrieval_prompt', 'number_sort', 'pretest_item'];
    const challengingTypes = ['two_tier', 'spot_error', 'contrast_card', 'exception_tree', 'fact_variant'];

    const selected: Item[] = [];
    const pool = [...scoredCandidates];

    while (selected.length < blockSize && pool.length > 0) {
      const lastItem = selected[selected.length - 1];
      const secondLastItem = selected[selected.length - 2];
      const isBeginningOfSet = selected.length < 3;

      // Find an item that doesn't violate cluster constraint and adheres to difficulty progression
      let chosenIdx = -1;
      
      // Pass 1: if at the beginning of set, try to find a foundational item that fits cluster constraints
      if (isBeginningOfSet) {
        for (let i = 0; i < pool.length; i++) {
          const candidate = pool[i].item;
          if (challengingTypes.includes(candidate.item_type)) continue;
          if (
            lastItem &&
            secondLastItem &&
            lastItem.cluster_id &&
            secondLastItem.cluster_id === lastItem.cluster_id &&
            candidate.cluster_id === lastItem.cluster_id
          ) {
            continue;
          }
          chosenIdx = i;
          break;
        }
      }

      // Pass 2: standard cluster-constrained pick if pass 1 didn't find one or not at beginning
      if (chosenIdx === -1) {
        for (let i = 0; i < pool.length; i++) {
          const candidate = pool[i].item;
          if (
            lastItem &&
            secondLastItem &&
            lastItem.cluster_id &&
            secondLastItem.cluster_id === lastItem.cluster_id &&
            candidate.cluster_id === lastItem.cluster_id
          ) {
            // Avoid 3rd consecutive from same cluster
            continue;
          }
          chosenIdx = i;
          break;
        }
      }

      if (chosenIdx === -1) {
        // Fallback to first available
        chosenIdx = 0;
      }

      const rawItem = pool[chosenIdx].item;
      const sched = schedMap.get(rawItem.id);
      const fsrs_info = SchedulingEngine.computeFsrsMetadata(rawItem, sched, {
        isInterleaved: true,
        openError: errorMap.get(rawItem.id),
      });

      selected.push({
        ...rawItem,
        fsrs_info,
      });
      pool.splice(chosenIdx, 1);
    }

    return selected;
  }
}
