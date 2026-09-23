import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ReviewSchedule, ActivityAttempt, ErrorLog } from '../types';

/**
 * Saves a review schedule to Firestore for cross-session & cross-device persistence.
 */
export async function syncReviewScheduleToCloud(
  userId: string,
  schedule: ReviewSchedule
): Promise<void> {
  if (!userId || !schedule.item_id) return;
  const path = `users/${userId}/reviewSchedules/${schedule.item_id}`;

  try {
    const docRef = doc(db, 'users', userId, 'reviewSchedules', schedule.item_id);
    await setDoc(
      docRef,
      {
        userId,
        itemId: schedule.item_id,
        state: schedule.state,
        dueDate: schedule.due_date,
        intervalDays: schedule.interval_days,
        easeFactor: schedule.ease_factor,
        stability: schedule.stability,
        difficulty: schedule.difficulty,
        lapses: schedule.lapses,
        consecutiveCorrectSessions: schedule.consecutive_correct_sessions,
        formatsCompleted: JSON.stringify(schedule.formats_completed || []),
        lastConfidence: schedule.last_confidence ?? 0,
        lastErrorType: schedule.last_error_type || null,
        priorityScore: schedule.priority_score || 0,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Loads all review schedules from Firestore for the given user.
 */
export async function fetchUserReviewSchedulesFromCloud(
  userId: string
): Promise<Record<string, ReviewSchedule>> {
  if (!userId) return {};
  const path = `users/${userId}/reviewSchedules`;

  try {
    const colRef = collection(db, 'users', userId, 'reviewSchedules');
    const snapshot = await getDocs(colRef);
    const schedules: Record<string, ReviewSchedule> = {};

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      let formats: string[] = [];
      try {
        formats = JSON.parse(data.formatsCompleted || '[]');
      } catch {
        formats = [];
      }

      schedules[data.itemId] = {
        id: docSnap.id,
        item_id: data.itemId,
        state: data.state || 'new',
        due_date: data.dueDate,
        interval_days: data.intervalDays ?? 0,
        ease_factor: data.easeFactor ?? 2.5,
        stability: data.stability ?? 1.0,
        difficulty: data.difficulty ?? 5.0,
        lapses: data.lapses ?? 0,
        consecutive_correct_sessions: data.consecutiveCorrectSessions ?? 0,
        formats_completed: formats as any,
        last_confidence: data.lastConfidence,
        last_error_type: data.lastErrorType,
        priority_score: data.priorityScore ?? 0,
      };
    });

    return schedules;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Saves an error log entry to Firestore.
 */
export async function syncErrorLogToCloud(
  userId: string,
  errorLog: ErrorLog
): Promise<void> {
  if (!userId || !errorLog.id) return;
  const path = `users/${userId}/errorLogs/${errorLog.id}`;

  try {
    const docRef = doc(db, 'users', userId, 'errorLogs', errorLog.id);
    await setDoc(
      docRef,
      {
        userId,
        itemId: errorLog.item_id,
        topicId: errorLog.topic_id || '',
        clusterId: errorLog.cluster_id || null,
        confusionPairId: errorLog.confusion_pair_id || null,
        errorTypeCode: errorLog.error_type_code,
        confidence: errorLog.confidence,
        userExplanation: errorLog.user_explanation || '',
        correctiveRule: errorLog.corrective_rule || '',
        status: errorLog.status,
        nextReviewDate: errorLog.next_review_date || '',
        createdAt: errorLog.created_at || new Date().toISOString(),
        updatedAt: errorLog.updated_at || new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Loads all error logs from Firestore for the given user.
 */
export async function fetchUserErrorLogsFromCloud(
  userId: string
): Promise<ErrorLog[]> {
  if (!userId) return [];
  const path = `users/${userId}/errorLogs`;

  try {
    const colRef = collection(db, 'users', userId, 'errorLogs');
    const snapshot = await getDocs(colRef);
    const logs: ErrorLog[] = [];

    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      logs.push({
        id: docSnap.id,
        attempt_id: d.attemptId || '',
        item_id: d.itemId,
        topic_id: d.topicId,
        cluster_id: d.clusterId,
        confusion_pair_id: d.confusionPairId,
        error_type_code: d.errorTypeCode as any,
        confidence: d.confidence as any,
        user_explanation: d.userExplanation,
        corrective_rule: d.correctiveRule || '',
        legal_basis: d.legalBasis || d.legal_basis || 'TRLGSS',
        trap_type: d.trapType || d.trap_type,
        status: d.status as any,
        next_review_date: d.nextReviewDate,
        created_at: d.createdAt,
        updated_at: d.updatedAt,
      });
    });

    return logs;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Saves active session state to Firestore for cross-session resumption.
 */
export async function syncActiveSessionToCloud(
  userId: string,
  sessionState: {
    sessionId: string;
    sessionType: string;
    itemIds: string[];
    currentIndex: number;
    attempts: any[];
    isCompleted: boolean;
  }
): Promise<void> {
  if (!userId || !sessionState.sessionId) return;
  const path = `users/${userId}/activeSessions/${sessionState.sessionId}`;

  try {
    const docRef = doc(db, 'users', userId, 'activeSessions', sessionState.sessionId);
    await setDoc(
      docRef,
      {
        userId,
        sessionType: sessionState.sessionType,
        itemIds: JSON.stringify(sessionState.itemIds),
        currentIndex: sessionState.currentIndex,
        attemptsJson: JSON.stringify(sessionState.attempts),
        isCompleted: sessionState.isCompleted,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Clears active session state on completion.
 */
export async function clearActiveSessionFromCloud(
  userId: string,
  sessionId: string
): Promise<void> {
  if (!userId || !sessionId) return;
  const path = `users/${userId}/activeSessions/${sessionId}`;

  try {
    const docRef = doc(db, 'users', userId, 'activeSessions', sessionId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
