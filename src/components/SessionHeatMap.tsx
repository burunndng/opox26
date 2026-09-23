import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import { Item } from '../types.ts';
import { SessionAttemptLog } from './ActivityRunner.tsx';

/**
 * Session heat map (spec §9.11 / §11): where THIS block went wrong, shown
 * immediately after practicing so the next action is obvious. Cluster/pair
 * names are resolved from the items the session actually used (no global
 * lookups needed — the runner has no clusters prop in every mode).
 */
interface SessionHeatMapProps {
  items: Item[];
  attemptLogs: SessionAttemptLog[];
  className?: string;
}

interface Row {
  key: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

export function SessionHeatMap({ items, attemptLogs, className = '' }: SessionHeatMapProps) {
  const { clusterRows, pairRows, calibrationDelta, total } = useMemo(() => {
    const byId = new Map(items.map((i) => [i.id, i]));
    const clusters = new Map<string, Row>();
    const pairs = new Map<string, Row>();
    let confSum = 0;
    let graded = 0;
    let correct = 0;

    for (const log of attemptLogs) {
      const item = byId.get(log.itemId);
      if (!item) continue;
      correct += log.correct ? 1 : 0;
      confSum += log.confidence;
      graded += 1;
      for (const [map, key] of [
        [clusters, item.cluster_id],
        [pairs, item.confusion_pair_id],
      ] as Array<[Map<string, Row>, string | undefined]>) {
        if (!key) continue;
        const row = map.get(key) ?? { key, attempted: 0, correct: 0, accuracy: 0 };
        row.attempted += 1;
        if (log.correct) row.correct += 1;
        row.accuracy = Math.round((row.correct / row.attempted) * 100);
        map.set(key, row);
      }
    }

    const sortRows = (m: Map<string, Row>) =>
      Array.from(m.values()).sort((a, b) => a.accuracy - b.accuracy).slice(0, 4);

    return {
      clusterRows: sortRows(clusters),
      pairRows: sortRows(pairs),
      calibrationDelta: graded > 0 ? Number((confSum / graded - correct / graded).toFixed(2)) : 0,
      total: attemptLogs.length,
    };
  }, [items, attemptLogs]);

  if (total === 0 || (clusterRows.length === 0 && pairRows.length === 0)) return null;

  const barColor = (acc: number) =>
    acc >= 80 ? 'bg-emerald-500' : acc >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className={`mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Mapa de calor de la sesión
          </h3>
        </div>
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
            calibrationDelta > 0.4 ? 'text-rose-300 bg-rose-950/40' : calibrationDelta < -0.3 ? 'text-sky-300 bg-sky-950/40' : 'text-slate-400 bg-slate-900'
          }`}
          title="Confianza media menos acierto real. Positivo = sobreconfianza en este bloque."
        >
          Δ conf {calibrationDelta > 0 ? '+' : ''}{calibrationDelta}
        </span>
      </div>

      {clusterRows.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Clústeres tocados</p>
          <div className="space-y-1.5">
            {clusterRows.map((r) => (
              <div key={r.key} className="space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 truncate max-w-[70%]" title={r.key}>{r.key}</span>
                  <span className="font-mono text-slate-400">{r.correct}/{r.attempted}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor(r.accuracy)} transition-all`} style={{ width: `${r.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pairRows.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Pares discriminados</p>
          <div className="flex flex-wrap gap-1.5">
            {pairRows.map((r) => (
              <span
                key={r.key}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  r.accuracy >= 80 ? 'bg-emerald-950/50 text-emerald-300' : r.accuracy >= 50 ? 'bg-amber-950/50 text-amber-300' : 'bg-rose-950/50 text-rose-300'
                }`}
                title={r.key}
              >
                {r.accuracy}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
