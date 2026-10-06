import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Gauge,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import { ActivityAttempt, Cluster, ConfusionPair, ErrorLog, Item } from '../types.ts';
import { buildAnalyticsSnapshot } from '../utils/analytics.ts';

/**
 * Embedded analytics strip (spec §10–§11).
 *
 * Deliberately NOT a page: this component renders inside the Dashboard so the
 * numbers inform the next study decision instead of becoming a place to browse.
 * Compact by default (alerts + calibration curve + weakest clusters), with the
 * full matrix/effectiveness detail behind a disclosure.
 */
interface AnalyticsStripProps {
  items: Item[];
  clusters: Cluster[];
  confusionPairs: ConfusionPair[];
  attempts: ActivityAttempt[];
  errors: ErrorLog[];
  onOpenRepair?: () => void;
  onOpenItemBank?: () => void;
  className?: string;
}

const SEVERITY_STYLE: Record<string, { border: string; bg: string; text: string; icon: React.ReactNode }> = {
  critical: { border: 'border-rose-800/50', bg: 'bg-rose-950/30', text: 'text-rose-200', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> },
  warning: { border: 'border-amber-800/50', bg: 'bg-amber-950/30', text: 'text-amber-200', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> },
  info: { border: 'border-sky-800/50', bg: 'bg-sky-950/30', text: 'text-sky-200', icon: <BrainCircuit className="w-3.5 h-3.5 text-sky-400" /> },
};

export const AnalyticsStrip: React.FC<AnalyticsStripProps> = ({
  items, clusters, confusionPairs, attempts, errors, onOpenRepair, onOpenItemBank, className = '',
}) => {
  const [expanded, setExpanded] = useState(false);

  const snap = useMemo(
    () => buildAnalyticsSnapshot({ items, clusters, confusionPairs, attempts, errors }),
    [items, clusters, confusionPairs, attempts, errors]
  );

  const { alerts, levels, indices } = snap.calibration;
  const weakClusters = snap.heatmaps.byCluster.filter((c) => c.attempted >= 1).slice(0, 3);
  const riskyPairs = snap.heatmaps.byPair.filter((p) => p.attempted >= 1).slice(0, 2);
  const hasData = attempts.length > 0;

  return (
    <section className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Tu progreso y puntos débiles
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {onOpenRepair && indices.confidentWrong > 0 && (
            <button
              onClick={onOpenRepair}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold transition flex items-center space-x-1.5"
            >
              <Wrench className="w-3 h-3" />
              <span>Reparar ({indices.confidentWrong} confident-wrong)</span>
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-slate-400 hover:text-white transition"
            title={expanded ? 'Contraer' : 'Ver analítica completa'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!hasData ? (
        <p className="mt-3 text-xs text-slate-500">
          Aún no hay intentos registrados. Completa un test para ver tu progreso.
        </p>
      ) : (
        <>
          {/* Confidence curve */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {levels.map((l) => (
              <div key={l.level} className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-center">
                <div className="text-[9px] uppercase tracking-wider text-slate-500">
                  {['AzAR', 'Duda', 'Probable', 'Seguro'][l.level]}
                </div>
                <div
                  className={`text-base font-bold font-mono ${
                    l.total === 0
                      ? 'text-slate-600'
                      : l.accuracy >= 80
                        ? 'text-emerald-300'
                        : l.accuracy >= 50
                          ? 'text-amber-300'
                          : 'text-rose-300'
                  }`}
                >
                  {l.total === 0 ? '—' : `${l.accuracy}%`}
                </div>
                <div className="text-[9px] text-slate-600 font-mono">{l.correct}/{l.total}</div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {alerts.slice(0, expanded ? 12 : 3).map((a, i) => {
                const s = SEVERITY_STYLE[a.severity] ?? SEVERITY_STYLE.info;
                return (
                  <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border ${s.border} ${s.bg} text-xs ${s.text}`}>
                    <span className="mt-0.5 shrink-0">{s.icon}</span>
                    <span>
                      {a.scope ? <strong className="mr-1">[{a.scope}]</strong> : null}
                      {a.message}
                    </span>
                  </div>
                );
              })}
              {!expanded && alerts.length > 3 && (
                <p className="text-[11px] text-slate-500 pl-1">+{alerts.length - 3} alertas más (despliega para verlas)</p>
              )}
            </div>
          )}

          {/* Weakest clusters + risky pairs */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Clústeres más débiles</p>
              {weakClusters.length === 0 ? (
                <p className="text-[11px] text-slate-600">Sin datos suficientes.</p>
              ) : (
                <div className="space-y-1">
                  {weakClusters.map((c) => (
                    <div key={c.key} className="flex items-center justify-between text-[11px] bg-slate-950/60 rounded px-2 py-1">
                      <span className="text-slate-300 truncate">{c.label}</span>
                      <span className={`font-mono ${c.accuracy < 50 ? 'text-rose-300' : c.accuracy < 80 ? 'text-amber-300' : 'text-emerald-300'}`}>
                        {c.accuracy}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Pares a vigilar</p>
              {riskyPairs.length === 0 ? (
                <p className="text-[11px] text-slate-600">Sin datos suficientes.</p>
              ) : (
                <div className="space-y-1">
                  {riskyPairs.map((p) => (
                    <div key={p.key} className="flex items-center justify-between text-[11px] bg-slate-950/60 rounded px-2 py-1">
                      <span className="text-slate-300 truncate">{p.label}</span>
                      <span className="font-mono text-amber-300">{p.accuracy}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full detail (disclosure) */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 text-[11px]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Stat label="Índice frágil" value={`${indices.fragileKnowledgeIndex}%`} hint="Aciertos con duda" />
                <Stat label="Índice de error" value={`${indices.misconceptionIndex}%`} hint="Fallos con certeza" />
                <Stat label="Exceso de confianza" value={`${indices.calibrationDelta > 0 ? '+' : ''}${indices.calibrationDelta}`} hint="certeza − acierto" />
                <Stat label="Lapse rate" value={`${snap.srs.lapseRate}%`} hint="intentos fallidos" />
              </div>

              {/* Confusion matrices */}
              {(['numeric', 'institutional', 'temporal'] as const).map((kind) => {
                const rows = snap.matrices[kind];
                if (rows.length === 0) return null;
                const label = kind === 'numeric' ? 'Matriz numérica' : kind === 'institutional' ? 'Matriz institucional' : 'Matriz temporal';
                return (
                  <div key={kind}>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</p>
                    <div className="space-y-1">
                      {rows.slice(0, 4).map((r) => (
                        <div key={r.key} className="flex items-center justify-between bg-slate-950/60 rounded px-2 py-1">
                          <span className="text-slate-400 truncate">{r.label}</span>
                          <span className="font-mono text-slate-300">{r.errors} err · {r.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Activity effectiveness */}
              {snap.effectiveness.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Efectividad por formato</p>
                  <div className="space-y-1">
                    {snap.effectiveness.map((r) => (
                      <div key={r.activityType} className="flex items-center justify-between bg-slate-950/60 rounded px-2 py-1">
                        <span className="text-slate-400">{r.activityType.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-slate-300">
                          {r.accuracy}% · int {r.interleavedAccuracy ?? '—'} / bloq {r.blockedAccuracy ?? '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content quality */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Calidad del banco</p>
                <div className="flex flex-wrap gap-2 text-slate-400">
                  <span>draft {snap.quality.draft}</span>
                  <span>· validados {snap.quality.validated}</span>
                  <span>· sin base legal {snap.quality.missingLegalBasis}</span>
                  <span>· sin explicación {snap.quality.missingDistractorExplanation}</span>
                  <span>· sin trampa {snap.quality.missingTrapType}</span>
                  <span>· duplicados {snap.quality.duplicateStems}</span>
                  {onOpenItemBank && (
                    <button onClick={onOpenItemBank} className="text-indigo-300 hover:text-indigo-200 transition">
                      · abrir Item Bank
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

const Stat: React.FC<{ label: string; value: string; hint: string }> = ({ label, value, hint }) => (
  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-center">
    <div className="text-lg font-bold text-white font-mono">{value}</div>
    <div className="text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
    <div className="text-[9px] text-slate-600">{hint}</div>
  </div>
);
