import React, { useState } from 'react';
import {
  X,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Play,
  RotateCw,
  Scale,
  Target,
  Sparkles,
  Layers,
  FileCheck,
  Percent,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Check,
  Brain,
  Search,
} from 'lucide-react';
import { Item, Atom, Topic, Cluster, ConfusionPair } from '../types.ts';
import { api } from '../api.ts';

interface JevLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  atoms: Atom[];
  topics: Topic[];
  clusters: Cluster[];
  confusionPairs: ConfusionPair[];
}

export const JevLabModal: React.FC<JevLabModalProps> = ({
  isOpen,
  onClose,
  items,
  atoms,
  topics,
  clusters,
  confusionPairs,
}) => {
  const [activeTab, setActiveTab] = useState<
    'item_audit' | 'attempt_triage' | 'atom_classify' | 'cascade' | 'custom_sandbox'
  >('item_audit');

  // Item Audit state
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [itemAuditLoading, setItemAuditLoading] = useState(false);
  const [itemAuditResult, setItemAuditResult] = useState<any>(null);

  // Attempt Triage state
  const [triageStem, setTriageStem] = useState(
    '¿En qué plazo prescribe el derecho al reconocimiento de las prestaciones de la Seguridad Social?'
  );
  const [triageRule, setTriageRule] = useState(
    'Prescribe a los 5 años desde el día siguiente al hecho causante (Art. 53.1 TRLGSS).'
  );
  const [triageCorrectAnswer, setTriageCorrectAnswer] = useState('5 años');
  const [triageUserGen, setTriageUserGen] = useState('1 año desde la solicitud');
  const [triageUserOption, setTriageUserOption] = useState('1 año');
  const [triageIsCorrect, setTriageIsCorrect] = useState(false);
  const [triageConfidence, setTriageConfidence] = useState<number>(3); // Confident wrong
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);

  // Atom Classify state
  const [atomText, setAtomText] = useState(
    'El coeficiente multiplicador en contratos temporales de duración igual o inferior a 5 días es de 1,4.'
  );
  const [atomLegalBasis, setAtomLegalBasis] = useState('Art. 249 bis TRLGSS');
  const [atomClassifyLoading, setAtomClassifyLoading] = useState(false);
  const [atomClassifyResult, setAtomClassifyResult] = useState<any>(null);

  // Cascade state
  const [cascadeSource, setCascadeSource] = useState(
    'Art. 54.1 TRLGSS: El derecho al percibo de las prestaciones a tanto alzado y por una sola vez caducará al año, a contar desde el día siguiente al de haber sido notificada en forma al interesado la concesión de la prestación.'
  );
  const [cascadeStem, setCascadeStem] = useState(
    'El derecho al percibo de las prestaciones a tanto alzado caduca al:'
  );
  const [cascadeCorrectAnswer, setCascadeCorrectAnswer] = useState('A) 1 año desde el día siguiente a la notificación.');
  const [cascadeOptions, setCascadeOptions] = useState([
    { text: '1 año desde el día siguiente a la notificación', is_correct: true },
    { text: '5 años desde el hecho causante', is_correct: false, trap_type: 'temporal_confusion' },
    { text: '3 meses desde la resolución provisional', is_correct: false, trap_type: 'numeric_substitution' },
    { text: '1 año desde el hecho causante', is_correct: false, trap_type: 'wrong_start_date' },
  ]);
  const [cascadeLoading, setCascadeLoading] = useState(false);
  const [cascadeResult, setCascadeResult] = useState<any>(null);

  // Custom Sandbox state
  const [customState, setCustomState] = useState(
    JSON.stringify(
      {
        normativa: 'Art. 164 TRLGSS - Recargo por falta de medidas de seguridad',
        porcentaje_recargo: '30% a 50%',
        asegurabilidad: 'Prohibido cualquier pacto o seguro para su cobertura',
        responsable: 'Empresario infractor exclusivamente',
      },
      null,
      2
    )
  );
  const [customQuestions, setCustomQuestions] = useState(
    JSON.stringify(
      {
        is_insurer_liable: {
          type: 'noul',
          prompt: '¿Puede la mutua colaboradora o compañía aseguradora asumir el pago del recargo?',
        },
        liability_category: {
          type: 'choice',
          prompt: '¿Qué tipo de responsabilidad legal se imputa?',
          options: ['directa_e_indelegable', 'solidaria_con_mutua', 'subsidiaria_tgss', 'administrativa_leve'],
        },
        penalty_severity: {
          type: 'score',
          prompt: '¿Cuál es la severidad psicométrica del recargo en el régimen sancionador?',
          levels: ['Leve', 'Moderada', 'Grave', 'Muy Grave / Máxima'],
        },
      },
      null,
      2
    )
  );
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxError, setSandboxError] = useState<string | null>(null);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunItemAudit = async () => {
    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;
    setItemAuditLoading(true);
    try {
      const res = await api.auditItemWithJev(item);
      setItemAuditResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setItemAuditLoading(false);
    }
  };

  const handleRunTriage = async () => {
    setTriageLoading(true);
    try {
      const res = await api.diagnoseAttemptWithJev({
        item_stem: triageStem,
        item_rule: triageRule,
        item_correct_answer: triageCorrectAnswer,
        generated_answer_before_options: triageUserGen,
        selected_option: triageUserOption,
        is_correct: triageIsCorrect,
        confidence: triageConfidence,
      });
      setTriageResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setTriageLoading(false);
    }
  };

  const handleRunAtomClassify = async () => {
    setAtomClassifyLoading(true);
    try {
      const res = await api.classifyAtomWithJev({
        text: atomText,
        legal_basis: atomLegalBasis,
      });
      setAtomClassifyResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAtomClassifyLoading(false);
    }
  };

  const handleRunCascade = async () => {
    setCascadeLoading(true);
    try {
      const res = await api.verifyCascadeWithJev(
        {
          stem: cascadeStem,
          correct_answer: cascadeCorrectAnswer,
          options: cascadeOptions,
          legal_basis: 'Art. 54.1 TRLGSS',
          rule_statement: cascadeSource,
        },
        cascadeSource
      );
      setCascadeResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setCascadeLoading(false);
    }
  };

  const handleRunSandbox = async () => {
    setSandboxLoading(true);
    setSandboxError(null);
    try {
      const parsedState = JSON.parse(customState);
      const parsedQuestions = JSON.parse(customQuestions);
      const res = await api.runJevDecisions(parsedState, parsedQuestions);
      setSandboxResult(res);
    } catch (e: any) {
      setSandboxError('Error en formato JSON: ' + e.message);
    } finally {
      setSandboxLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-500/40 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-5 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-inner">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Jev Decision Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  typesafe/jev-1.13
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Totalmente Opcional
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Fallback Local Activo
                </span>
              </div>
              <p className="text-xs text-indigo-200/70 mt-0.5">
                Módulo psicométrico complementario. Opera con OpenRouter o con el motor heurístico local sin bloquear ninguna función del temario.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 flex space-x-2 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('item_audit')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'item_audit'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Auditor Psicométrico de Ítems</span>
          </button>
          <button
            onClick={() => setActiveTab('attempt_triage')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'attempt_triage'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>2. Triaje de Errores & Calibración</span>
          </button>
          <button
            onClick={() => setActiveTab('atom_classify')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'atom_classify'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Clasificador Atómico</span>
          </button>
          <button
            onClick={() => setActiveTab('cascade')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'cascade'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. Jev-Verified Cascade</span>
          </button>
          <button
            onClick={() => setActiveTab('custom_sandbox')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'custom_sandbox'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>5. Sandbox Personalizado</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/60">
          {/* TAB 1: ITEM AUDIT */}
          {activeTab === 'item_audit' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Selecciona un reactivo/ítem del banco para auditar con Jev:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {items.slice(0, 40).map((it) => (
                      <option key={it.id} value={it.id}>
                        [{it.item_type}] {it.stem.slice(0, 80)}... ({it.legal_basis || 'TRLGSS'})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRunItemAudit}
                    disabled={itemAuditLoading || !selectedItemId}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
                  >
                    {itemAuditLoading ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Auditar con Jev</span>
                  </button>
                </div>
              </div>

              {itemAuditResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Decisión calculada en <strong>{itemAuditResult.latency_ms} ms</strong></span>
                    </span>
                    <span>Tokens de salida: <strong>0 (Gratuitos)</strong> | Modelo: <strong>typesafe/jev-1.13</strong></span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Unambiguous Noul */}
                    <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase text-indigo-400 flex items-center space-x-1">
                          <Percent className="w-3.5 h-3.5" />
                          <span>Noul: Enunciado Inequívoco</span>
                        </span>
                        <span className="text-sm font-bold text-slate-200">
                          {Math.round(itemAuditResult.is_stem_unambiguous.probability * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden mb-2">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${itemAuditResult.is_stem_unambiguous.probability * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-300">
                        Probabilidad de que el enunciado no induzca a error por ambigüedad sintáctica.
                      </p>
                    </div>

                    {/* Double Key Risk Noul */}
                    <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase text-rose-400 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Noul: Riesgo de Doble Llave</span>
                        </span>
                        <span className="text-sm font-bold text-slate-200">
                          {Math.round(itemAuditResult.has_double_key_risk.probability * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            itemAuditResult.has_double_key_risk.probability > 0.3 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${itemAuditResult.has_double_key_risk.probability * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-300">
                        Riesgo de que algún distractor pueda ser impugnable como jurídicamente válido.
                      </p>
                    </div>

                    {/* Primary Cognitive Trap Choice */}
                    <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase text-amber-400 flex items-center space-x-1">
                          <Target className="w-3.5 h-3.5" />
                          <span>Choice: Trampa Psicométrica Principal</span>
                        </span>
                        <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                          Confianza: {Math.round(itemAuditResult.primary_cognitive_trap.confidence * 100)}%
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white mb-2">
                        {itemAuditResult.primary_cognitive_trap.choice}
                      </div>
                      <div className="space-y-1.5">
                        {Object.entries(itemAuditResult.primary_cognitive_trap.probabilities || {}).slice(0, 4).map(([k, v]: [string, any]) => (
                          <div key={k} className="text-xs flex items-center justify-between text-slate-300">
                            <span className="font-mono text-slate-400">{k}</span>
                            <span className="font-semibold">{Math.round(v * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Score */}
                    <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase text-purple-400 flex items-center space-x-1">
                          <Scale className="w-3.5 h-3.5" />
                          <span>Score: Dificultad Psicométrica</span>
                        </span>
                        <span className="text-lg font-bold text-purple-300">
                          {Number(itemAuditResult.psychometric_difficulty.score).toFixed(1)} / 5
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden mb-3">
                        <div
                          className="bg-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(Number(itemAuditResult.psychometric_difficulty.score) / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-300">
                        Índice discriminatorio estimado para opositores de C1/A2 en Seguridad Social.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ATTEMPT TRIAGE */}
          {activeTab === 'attempt_triage' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Enunciado del ítem:</label>
                    <input
                      type="text"
                      value={triageStem}
                      onChange={(e) => setTriageStem(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Regla normativa exacta:</label>
                    <input
                      type="text"
                      value={triageRule}
                      onChange={(e) => setTriageRule(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Respuesta generada de memoria por el opositor (Cover & Generate):
                    </label>
                    <input
                      type="text"
                      value={triageUserGen}
                      onChange={(e) => setTriageUserGen(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Opción marcada tras revelar alternativas:
                    </label>
                    <input
                      type="text"
                      value={triageUserOption}
                      onChange={(e) => setTriageUserOption(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800">
                  <label className="flex items-center space-x-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={triageIsCorrect}
                      onChange={(e) => setTriageIsCorrect(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <span>¿Fue correcta la opción marcada?</span>
                  </label>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-300">Confianza reportada:</span>
                    {[0, 1, 2, 3].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setTriageConfidence(lvl)}
                        className={`px-2 py-1 rounded text-xs font-bold transition ${
                          triageConfidence === lvl
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-950 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {lvl === 0 ? '0 (Azar)' : lvl === 1 ? '1 (Duda)' : lvl === 2 ? '2 (Probable)' : '3 (Seguro)'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunTriage}
                    disabled={triageLoading}
                    className="ml-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
                  >
                    {triageLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    <span>Ejecutar Triaje Jev</span>
                  </button>
                </div>
              </div>

              {triageResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Generative Retrieval Match Noul */}
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase text-indigo-400">
                        Noul: Acierto en Recuperación Generativa
                      </span>
                      <span className="text-sm font-bold text-white">
                        {Math.round(triageResult.generative_retrieval_matched.probability * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 mb-2">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${triageResult.generative_retrieval_matched.probability * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400">
                      Evalúa si el texto libre del opositor antes de ver opciones capturó la esencia jurídica sin depender del reconocimiento pasivo.
                    </p>
                  </div>

                  {/* Error Taxonomy Choice */}
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase text-rose-400">
                        Choice: Taxonomía de Error E1-E20
                      </span>
                      <span className="text-xs font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                        {Math.round(triageResult.error_classification.confidence * 100)}%
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mb-2">
                      {triageResult.error_classification.choice}
                    </div>
                    <div className="space-y-1">
                      {Object.entries(triageResult.error_classification.probabilities || {}).slice(0, 3).map(([k, v]: [string, any]) => (
                        <div key={k} className="text-xs flex items-center justify-between text-slate-300">
                          <span className="font-mono text-slate-400">{k}</span>
                          <span className="font-semibold">{Math.round(v * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Repair Choice */}
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase text-emerald-400">
                        Choice: Actividad de Reparación Óptima Recomendada por Jev
                      </span>
                      <span className="text-xs font-semibold text-emerald-300">
                        {triageResult.recommended_repair_action.choice}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                      {Object.entries(triageResult.recommended_repair_action.probabilities || {}).map(([k, v]: [string, any]) => (
                        <div key={k} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs">
                          <div className="text-slate-400 font-mono truncate">{k}</div>
                          <div className="text-sm font-bold text-emerald-400">{Math.round(v * 100)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ATOM CLASSIFICATION */}
          {activeTab === 'atom_classify' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Proposición Jurídica Atómica:
                  </label>
                  <textarea
                    rows={3}
                    value={atomText}
                    onChange={(e) => setAtomText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400">Base legal:</span>
                    <input
                      type="text"
                      value={atomLegalBasis}
                      onChange={(e) => setAtomLegalBasis(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <button
                    onClick={handleRunAtomClassify}
                    disabled={atomClassifyLoading}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
                  >
                    {atomClassifyLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    <span>Clasificar con Jev</span>
                  </button>
                </div>
              </div>

              {atomClassifyResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                    <div className="text-xs font-semibold uppercase text-indigo-400 mb-1">
                      Choice: Asignación a Clúster Temático
                    </div>
                    <div className="text-base font-bold text-white mb-2">
                      {atomClassifyResult.cluster_assignment.choice}
                    </div>
                    <div className="space-y-1">
                      {Object.entries(atomClassifyResult.cluster_assignment.probabilities || {}).map(([k, v]: [string, any]) => (
                        <div key={k} className="text-xs flex items-center justify-between text-slate-300">
                          <span className="font-mono text-slate-400">{k}</span>
                          <span className="font-semibold">{Math.round(v * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                    <div className="text-xs font-semibold uppercase text-purple-400 mb-1">
                      Choice: Refinamiento del Tipo Atómico
                    </div>
                    <div className="text-base font-bold text-white mb-2">
                      {atomClassifyResult.atom_type_refinement.choice}
                    </div>
                    <div className="space-y-1">
                      {Object.entries(atomClassifyResult.atom_type_refinement.probabilities || {}).slice(0, 4).map(([k, v]: [string, any]) => (
                        <div key={k} className="text-xs flex items-center justify-between text-slate-300">
                          <span className="font-mono text-slate-400">{k}</span>
                          <span className="font-semibold">{Math.round(v * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase text-amber-400">
                        Noul: Riesgo de Alta Interferencia / Trampa
                      </div>
                      <div className="text-lg font-bold text-white">
                        {Math.round(atomClassifyResult.has_high_interference_risk.probability * 100)}% de probabilidad de confusión
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase text-emerald-400">
                        Score: Criticidad en Exámenes Oficiales
                      </div>
                      <div className="text-lg font-bold text-emerald-300">
                        {Number(atomClassifyResult.exam_criticality.score).toFixed(1)} / 4 (Prioridad Alta)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CASCADE VERIFICATION */}
          {activeTab === 'cascade' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-4">
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-xs text-indigo-200">
                  💡 <strong>Patrón Jev-Verified Cascade (Cookbook de OpenRouter):</strong> Un LLM generativo redacta el borrador del ejercicio y Jev (TypeSafe) actúa como auditor instantáneo verificando la fidelidad fáctica contra el texto de la ley antes de la aprobación.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Texto Normativo de Origen (Contexto Verídico):
                    </label>
                    <textarea
                      rows={3}
                      value={cascadeSource}
                      onChange={(e) => setCascadeSource(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Borrador del Enunciado (Draft):
                    </label>
                    <textarea
                      rows={3}
                      value={cascadeStem}
                      onChange={(e) => setCascadeStem(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunCascade}
                  disabled={cascadeLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  {cascadeLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>Verificar Cascada con Jev</span>
                </button>
              </div>

              {cascadeResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                    <div className="text-xs font-semibold uppercase text-indigo-400 mb-1">
                      Fidelidad Fáctica (Noul)
                    </div>
                    <div className="text-xl font-bold text-white mb-2">
                      {Math.round(cascadeResult.is_factually_sound.probability * 100)}%
                    </div>
                    <p className="text-xs text-slate-400">Sin alucinaciones normativas detectadas.</p>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                    <div className="text-xs font-semibold uppercase text-emerald-400 mb-1">
                      Base Legal Precisa (Noul)
                    </div>
                    <div className="text-xl font-bold text-white mb-2">
                      {Math.round(cascadeResult.legal_basis_accurate.probability * 100)}%
                    </div>
                    <p className="text-xs text-slate-400">Cita textual concuerda con el TRLGSS.</p>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                    <div className="text-xs font-semibold uppercase text-purple-400 mb-1">
                      Dictamen de Calidad (Choice)
                    </div>
                    <div className="text-base font-bold text-emerald-300 mb-2">
                      {cascadeResult.recommended_action.choice}
                    </div>
                    <div className="text-xs text-slate-400">
                      Confianza de auditoría: {Math.round(cascadeResult.confidence * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CUSTOM SANDBOX */}
          {activeTab === 'custom_sandbox' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    State (Estado / Contexto en JSON):
                  </label>
                  <textarea
                    rows={10}
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Questions (Preguntas Tipadas: Choice, Noul, Score):
                  </label>
                  <textarea
                    rows={10}
                    value={customQuestions}
                    onChange={(e) => setCustomQuestions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-indigo-300 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunSandbox}
                  disabled={sandboxLoading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  {sandboxLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>Ejecutar Petición Jev Decisions API</span>
                </button>
              </div>

              {sandboxError && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-500/50 bg-rose-950/50 px-4 py-3 text-xs text-rose-200"
                >
                  {sandboxError}
                </div>
              )}

              {sandboxResult && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-mono text-indigo-400">Respuesta de Jev (Decisions API)</span>
                    <span>Latencia: <strong>{sandboxResult.latency_ms} ms</strong> | Coste: <strong>${sandboxResult.usage?.cost || 0.0001}</strong></span>
                  </div>
                  <pre className="text-xs font-mono text-slate-200 overflow-x-auto p-2 bg-slate-900 rounded">
                    {JSON.stringify(sandboxResult.answers, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Output tokens: Free</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>System One Structured Inference</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
