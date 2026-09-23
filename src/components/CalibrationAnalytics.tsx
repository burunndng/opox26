import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Target,
  AlertOctagon,
  Brain,
  HelpCircle,
  Award,
  Layers,
  Zap,
} from 'lucide-react';
import { ActivityAttempt, ErrorLog, Cluster, Item } from '../types.ts';
import { api } from '../api.ts';

interface CalibrationAnalyticsProps {
  attempts: ActivityAttempt[];
  errors: ErrorLog[];
  clusters: Cluster[];
  items: Item[];
}

export const CalibrationAnalytics: React.FC<CalibrationAnalyticsProps> = ({
  attempts,
  errors,
  clusters,
  items,
}) => {
  // Compute calibration curve: confidence (0, 1, 2, 3) vs accuracy
  const calibrationByLevel: Record<
    number,
    { total: number; correct: number; accuracy: number }
  > = {
    0: { total: 0, correct: 0, accuracy: 0 },
    1: { total: 0, correct: 0, accuracy: 0 },
    2: { total: 0, correct: 0, accuracy: 0 },
    3: { total: 0, correct: 0, accuracy: 0 },
  };

  for (const a of attempts) {
    if (a.confidence !== undefined && calibrationByLevel[a.confidence]) {
      calibrationByLevel[a.confidence].total++;
      if (a.correct) {
        calibrationByLevel[a.confidence].correct++;
      }
    }
  }

  for (let c = 0; c <= 3; c++) {
    const data = calibrationByLevel[c];
    data.accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  }

  // Confident-wrong (rated 3 but failed)
  const confidentWrongAttempts = attempts.filter((a) => a.confidence === 3 && !a.correct);
  // Lucky-correct (rated 0 or 1 but correct)
  const luckyCorrectAttempts = attempts.filter(
    (a) => (a.confidence === 0 || a.confidence === 1) && a.correct
  );

  // Trap type counts
  const trapCounts: Record<string, number> = {};
  for (const e of errors) {
    if (e.trap_type) {
      trapCounts[e.trap_type] = (trapCounts[e.trap_type] || 0) + 1;
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Calibración Metacognitiva & Analítica de Rendimiento
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          El opositor que conoce sus límites aprueba antes. La calibración mide si tu certeza
          subjetiva coincide con la verdad objetiva de la norma.
        </p>
      </div>

      {/* Metacognitive Indices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-rose-900/40 rounded-lg p-5 shadow-sm bg-rose-950/10">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Confident-Wrong</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-300 tabular-nums">
            {confidentWrongAttempts.length}
          </div>
          <p className="text-xs text-rose-400/80 mt-1">
            Fallo con seguridad máxima (3). El mayor peligro de penalización en el examen.
          </p>
        </div>

        <div className="bg-slate-900 border border-amber-900/40 rounded-lg p-5 shadow-sm bg-amber-950/10">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Reconocimiento Afortunado</span>
            <Brain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300 tabular-nums">
            {luckyCorrectAttempts.length}
          </div>
          <p className="text-xs text-amber-400/80 mt-1">
            Aciertos con duda (0–1). Conocimiento frágil que requiere fijación activa.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Tasa de Acierto con Certeza (3)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {calibrationByLevel[3].accuracy}%
          </div>
          <p className="text-xs text-slate-400 mt-1 tabular-nums">
            {calibrationByLevel[3].total} intentos con confianza 3.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Intentos Totales</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300 tabular-nums">{attempts.length}</div>
          <p className="text-xs text-slate-400 mt-1">Eventos de discriminación registrados.</p>
        </div>
      </div>

      {/* Calibration Curve Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>Curva de Calibración: Confianza Declarada vs. Precisión Real</span>
            </h3>
            <p className="text-xs text-slate-400">
              En una calibración perfecta, el nivel 3 debe superar el 95% de acierto.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
          {[
            {
              level: 0,
              label: '0 · Puro Azar',
              target: '25%',
              data: calibrationByLevel[0],
              color: 'bg-slate-700',
            },
            {
              level: 1,
              label: '1 · Corazonada Débil',
              target: '50%',
              data: calibrationByLevel[1],
              color: 'bg-blue-600',
            },
            {
              level: 2,
              label: '2 · Probablemente lo sé',
              target: '75%',
              data: calibrationByLevel[2],
              color: 'bg-amber-600',
            },
            {
              level: 3,
              label: '3 · Totalmente Seguro',
              target: '95%+',
              data: calibrationByLevel[3],
              color: 'bg-emerald-600',
            },
          ].map((item) => (
            <div key={item.level} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">{item.label}</span>
                <span className="text-slate-500 font-mono">Esperado: {item.target}</span>
              </div>

              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-white tabular-nums">{item.data.accuracy}%</span>
                <span className="text-xs text-slate-500 pb-0.5 font-mono tabular-nums">
                  ({item.data.correct}/{item.data.total})
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-sm overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-sm transition-all duration-500`}
                  style={{ width: `${item.data.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traps Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Target className="w-4 h-4 text-rose-400" />
            <span>Distribución de Trampas en las que más caes</span>
          </h3>
          <p className="text-xs text-slate-400">
            Los distractores están clasificados por patología jurídica. Identifica tus puntos ciegos:
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.keys(trapCounts).length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4">
                No hay trampas registradas aún. Completa entrenamientos para poblar la matriz.
              </p>
            ) : (
              Object.entries(trapCounts).map(([trap, count]) => (
                <div
                  key={trap}
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-md border border-slate-800 text-xs"
                >
                  <span className="text-rose-300 font-mono font-medium">{trap}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold tabular-nums">
                    {count} caídas
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Clusters Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Clusters Temáticos en Estudio (TRLGSS Tema 7)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Estructuración del conocimiento en grupos densos para evitar la interferencia:
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {clusters.slice(0, 7).map((c) => {
              const clusterItems = items.filter((i) => i.cluster_id === c.id);
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-md border border-slate-800 text-xs"
                >
                  <div>
                    <span className="text-slate-200 font-semibold">{c.name}</span>
                    <span className="ml-2 text-[10px] text-slate-500 font-mono">({c.type})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] tabular-nums">
                    {clusterItems.length} ítems
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
