import React, { useMemo } from 'react';
import { Activity, AlertTriangle, BrainCircuit, CheckCircle2, Crosshair, ShieldAlert, Wrench } from 'lucide-react';
import { Cluster, ConfusionPair, Item } from '../types.ts';
import { SessionAttemptLog } from './ActivityRunner.tsx';

/**
 * Pretest diagnostic map (spec §9.1): end-of-pretest screen showing strong and
 * weak clusters, likely confusion pairs, recommended focus areas, and a CTA
 * that routes weak items straight into the existing Repair Studio session.
 *
 * Wrong answers are already auto-queued by the SRS engine (recordAttempt);
 * this map adds the human-readable "where do I stand" layer.
 */
interface PretestDiagnosticMapProps {
  items: Item[];
  attemptLogs: SessionAttemptLog[];
  clusters?: Cluster[];
  confusionPairs?: ConfusionPair[];
  onLaunchRepair?: (itemIds: string[]) => void;
}

interface GroupStat {
  key: string;
  label: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

function groupBy(items: Item[], logs: SessionAttemptLog[], keyOf: (i: Item) => string | undefined, nameOf: (key: string) => string): GroupStat[] {
  const acc = new Map<string, { attempted: number; correct: number }>();
  for (const log of logs) {
    const item = items.find((i) => i.id === log.itemId);
    if (!item) continue;
    const key = keyOf(item);
    if (!key) continue;
    const entry = acc.get(key) ?? { attempted: 0, correct: 0 };
    entry.attempted += 1;
    if (log.correct) entry.correct += 1;
    acc.set(key, entry);
  }
  return Array.from(acc.entries()).map(([key, v]) => ({
    key,
    label: nameOf(key),
    attempted: v.attempted,
    correct: v.correct,
    accuracy: v.attempted > 0 ? Math.round((v.correct / v.attempted) * 100) : 0,
  }));
}

export function PretestDiagnosticMap({ items, attemptLogs, clusters, confusionPairs, onLaunchRepair }: PretestDiagnosticMapProps) {
  const diagnostics = useMemo(() => {
    const clusterName = (id: string) => clusters?.find((c) => c.id === id)?.name ?? id;
    const pairName = (id: string) => {
      const p = confusionPairs?.find((cp) => cp.id === id);
      return p ? `${p.concept_a} vs ${p.concept_b}` : id;
    };

    const clusterStats = groupBy(items, attemptLogs, (i) => i.cluster_id, clusterName);
    const pairStats = groupBy(items, attemptLogs, (i) => i.confusion_pair_id, pairName);

    const strong = clusterStats.filter((c) => c.accuracy >= 80 && c.attempted >= 1);
    const weak = clusterStats.filter((c) => c.accuracy < 60).sort((a, b) => a.accuracy - b.accuracy);
    const mid = clusterStats.filter((c) => c.accuracy >= 60 && c.accuracy < 80);

    const riskyPairs = pairStats.filter((p) => p.accuracy < 100).sort((a, b) => a.accuracy - b.accuracy);

    // Recommended focus: weak clusters by severity, then risky pairs
    const focus: string[] = [];
    for (const w of weak.slice(0, 3)) focus.push(`Refuerzo prioritario: ${w.label} (${w.correct}/${w.attempted})`);
    for (const p of riskyPairs.slice(0, 2)) focus.push(`Discriminación: ${p.label} (${p.correct}/${p.attempted})`);

    const wrongIds = logsWhere(attemptLogs, (l) => !l.correct && !l.blank);
    const luckyIds = logsWhere(attemptLogs, (l) => l.correct && l.confidence <= 1);
    const confidentWrong = attemptLogs.filter((l) => !l.correct && !l.blank && l.confidence === 3);

    return { strong, weak, mid, riskyPairs, focus, wrongIds, luckyIds, confidentWrong };
  }, [items, attemptLogs, clusters, confusionPairs]);

  const repairIds = Array.from(new Set([...diagnostics.wrongIds, ...diagnostics.luckyIds]));

  return (
    <div className="mt-6 p-5 rounded-xl bg-slate-950 border border-indigo-800/50 text-left space-y-5">
      <div className="flex items-center space-x-2">
        <Crosshair className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Mapa Diagnóstico del Pretest</h3>
      </div>

      {diagnostics.focus.length === 0 && diagnostics.strong.length === 0 ? (
        <p className="text-xs text-slate-400">
          Datos insuficientes para trazar el mapa. Completa el pretest para obtener el diagnóstico.
        </p>
      ) : (
        <>
          {/* Strong clusters */}
          {diagnostics.strong.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Zonas fuertes
              </div>
              <div className="flex flex-wrap gap-2">
                {diagnostics.strong.map((s) => (
                  <span key={s.key} className="px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs">
                    {s.label} · {s.accuracy}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weak clusters */}
          {diagnostics.weak.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Clústeres débiles
              </div>
              <div className="space-y-1.5">
                {diagnostics.weak.map((w) => (
                  <div key={w.key} className="flex items-center justify-between text-xs bg-rose-950/30 border border-rose-800/40 rounded-lg px-3 py-2">
                    <span className="text-rose-200">{w.label}</span>
                    <span className="font-mono text-rose-400">{w.correct}/{w.attempted} · {w.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Likely confusion pairs */}
          {diagnostics.riskyPairs.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300 mb-2">
                <Activity className="w-3.5 h-3.5" /> Pares de confusión probables
              </div>
              <div className="space-y-1.5">
                {diagnostics.riskyPairs.map((p) => (
                  <div key={p.key} className="flex items-center justify-between text-xs bg-amber-950/30 border border-amber-800/40 rounded-lg px-3 py-2">
                    <span className="text-amber-200">{p.label}</span>
                    <span className="font-mono text-amber-400">{p.correct}/{p.attempted}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confident-wrong alert */}
          {diagnostics.confidentWrong.length > 0 && (
            <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>{diagnostics.confidentWrong.length} confident-wrong</strong>: concepciones erróneas con alta
                confianza detectadas. El Repair Studio los ha marcado con prioridad crítica.
              </span>
            </div>
          )}

          {/* Recommended focus */}
          {diagnostics.focus.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200 mb-2">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" /> Enfoque recomendado
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {diagnostics.focus.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA: repair weak items now */}
          {repairIds.length > 0 && onLaunchRepair && (
            <button
              onClick={() => onLaunchRepair(repairIds)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition"
              title="Abre un Taller de Reparación con los ítems fallados y los aciertos por reconocimiento afortunado"
            >
              <Wrench className="w-4 h-4" />
              <span>Reparar ahora: {diagnostics.wrongIds.length} fallos + {diagnostics.luckyIds.length} afortunados</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

function logsWhere(logs: SessionAttemptLog[], pred: (l: SessionAttemptLog) => boolean): string[] {
  return logs.filter(pred).map((l) => l.itemId);
}
