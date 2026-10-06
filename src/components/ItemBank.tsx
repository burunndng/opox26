import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Tag,
  HelpCircle,
  Layers,
  Cpu,
  Zap,
  Percent,
  RotateCw,
} from 'lucide-react';
import { Item, Cluster, ConfusionPair, ItemType, QualityWarning, JevItemAuditResult } from '../types.ts';
import { api } from '../api.ts';

interface ItemBankProps {
  items: Item[];
  clusters: Cluster[];
  confusionPairs: ConfusionPair[];
  warnings: QualityWarning[];
  onRefresh: () => void;
  onPreviewItem: (item: Item) => void;
}

export const ItemBank: React.FC<ItemBankProps> = ({
  items,
  clusters,
  confusionPairs,
  warnings,
  onRefresh,
  onPreviewItem,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWarningsOnly, setShowWarningsOnly] = useState(false);

  // Preview modal item
  const [activePreview, setActivePreview] = useState<Item | null>(null);
  const [jevAuditItem, setJevAuditItem] = useState<Item | null>(null);
  const [jevAuditResult, setJevAuditResult] = useState<JevItemAuditResult | null>(null);
  const [jevAuditLoading, setJevAuditLoading] = useState(false);

  const handleAuditWithJev = async (item: Item) => {
    setJevAuditItem(item);
    setJevAuditLoading(true);
    setJevAuditResult(null);
    try {
      const res = await api.auditItemWithJev(item);
      setJevAuditResult(res);
    } catch (err) {
      console.error('Jev audit error:', err);
    } finally {
      setJevAuditLoading(false);
    }
  };

  const warningItemIds = new Set(warnings.map((w) => w.item_id));

  const filteredItems = items.filter((item) => {
    if (showWarningsOnly && !warningItemIds.has(item.id)) return false;
    if (selectedType !== 'all' && item.item_type !== selectedType) return false;
    if (selectedCluster !== 'all' && item.cluster_id !== selectedCluster) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const stem = item.stem.toLowerCase();
      const basis = (item.legal_basis || '').toLowerCase();
      const rule = (item.rule_statement || '').toLowerCase();
      return stem.includes(term) || basis.includes(term) || rule.includes(term);
    }

    return true;
  });

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este ítem de entrenamiento?')) return;
    await api.deleteItem(id);
    onRefresh();
  };

  const handleValidateItem = async (item: Item) => {
    await api.updateItem(item.id, { status: 'validated' });
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Banco de preguntas
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {items.length} preguntas en total, con su regla legal y análisis de trampas.
          </p>
        </div>

        {warnings.length > 0 && (
          <button
            onClick={() => setShowWarningsOnly(!showWarningsOnly)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-2 transition border ${
              showWarningsOnly
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Alertas de Calidad ({warnings.length})</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por pregunta, artículo o regla..."
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">-- Todos los Formatos --</option>
            <option value="cover_and_generate_mcq">Cover & Generate MCQ</option>
            <option value="cloze">Cloze / Texto Mutilado</option>
            <option value="contrast_card">Tarjeta de Contraste</option>
            <option value="number_sort">Clasificación de Números</option>
            <option value="spot_error">Spot-the-Error</option>
            <option value="two_tier">Diagnóstico en Dos Niveles</option>
            <option value="exception_tree">Árbol de Excepciones</option>
            <option value="fact_variant">Laboratorio de Variantes</option>
          </select>

          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">-- Todos los Clusters --</option>
            {clusters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">-- Todos los Estados --</option>
            <option value="validated">Validados</option>
            <option value="draft">Borrador / Pendiente</option>
            <option value="active">Activo</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
            <p className="text-sm">No se han encontrado ítems con estos filtros.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const hasWarning = warningItemIds.has(item.id);
            const cluster = clusters.find((c) => c.id === item.cluster_id);

            return (
              <div
                key={item.id}
                className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase">
                      {item.item_type.replace(/_/g, ' ')}
                    </span>

                    {item.legal_basis && (
                      <>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-xs font-mono font-semibold text-slate-300">
                          {item.legal_basis}
                        </span>
                      </>
                    )}

                    {cluster && (
                      <>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {cluster.name}
                        </span>
                      </>
                    )}

                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                        item.status === 'validated'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>

                    {item.figure_status === 'ESTIMATED_LPGE' && (
                      <span
                        role="status"
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30"
                      >
                        Cuantía estimada — verificar actualización vigente
                      </span>
                    )}

                    {hasWarning && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Revisión Requerida</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-100 font-legal-serif leading-relaxed">{item.stem}</p>

                  {item.rule_statement && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-300">Regla: </span>
                      {item.rule_statement}
                    </p>
                  )}

                  {/* Options summary */}
                  {item.options && item.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.options.map((o) => (
                        <span
                          key={o.id}
                          className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                            o.is_correct
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                              : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {o.id}: {o.is_correct ? 'Correcta' : o.trap_type || 'Distractor'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleAuditWithJev(item)}
                    className="px-2.5 py-1.5 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 transition flex items-center space-x-1.5 text-xs"
                    title="Auditar psicométricamente con Jev"
                  >
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline font-mono text-[11px]">Jev Audit</span>
                  </button>

                  <button
                    onClick={() => setActivePreview(item)}
                    className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Previsualizar en formato examen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {item.status === 'draft' && (
                    <button
                      onClick={() => handleValidateItem(item)}
                      className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Validar</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Eliminar ítem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-amber-500 font-bold uppercase">
                Vista Previa de Ítem
              </span>
              <button
                onClick={() => setActivePreview(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cerrar (Esc)
              </button>
            </div>

            <h3 className="text-base font-semibold text-white font-legal-serif">{activePreview.stem}</h3>

            {activePreview.legal_basis && (
              <div className="text-xs font-mono text-slate-400">
                Base Legal: {activePreview.legal_basis}
              </div>
            )}

            {activePreview.options && (
              <div className="space-y-2">
                {activePreview.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-lg border text-xs leading-relaxed ${
                      opt.is_correct
                        ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-bold mb-0.5">
                      Opción {opt.id} {opt.is_correct && '✓ [CORRECTA]'}
                    </div>
                    <div>{opt.text}</div>
                    {!opt.is_correct && (
                      <div className="mt-1 text-[11px] text-slate-400">
                        <span className="text-rose-400 font-medium">Trampa: {opt.trap_type}. </span>
                        {opt.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activePreview.corrective_rule && (
              <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg text-xs text-amber-200">
                <span className="font-bold">Regla correctiva: </span>
                {activePreview.corrective_rule}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Jev Psychometric Audit Modal */}
      {jevAuditItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-bold text-white tracking-tight">
                  Auditoría Psicométrica Jev
                </span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  typesafe/jev-1.13
                </span>
              </div>
              <button
                onClick={() => setJevAuditItem(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cerrar
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-md border border-slate-800">
              <p className="text-xs font-semibold text-slate-200 font-legal-serif">{jevAuditItem.stem}</p>
              {jevAuditItem.legal_basis && (
                <p className="text-[11px] font-mono text-amber-500 mt-1">
                  Base Legal: {jevAuditItem.legal_basis}
                </p>
              )}
            </div>

            {jevAuditLoading && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <RotateCw className="w-6 h-6 text-amber-500 animate-spin" />
                <p className="text-xs text-slate-400">
                  Calculando inferencias psicométricas de decisión...
                </p>
              </div>
            )}

            {jevAuditResult && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded-md border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Noul: Enunciado Inequívoco
                    </span>
                    <div className="text-lg font-bold text-white mt-0.5 tabular-nums">
                      {Math.round(jevAuditResult.is_stem_unambiguous.probability * 100)}%
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-md border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-rose-400">
                      Noul: Riesgo Doble Llave
                    </span>
                    <div className="text-lg font-bold text-white mt-0.5 tabular-nums">
                      {Math.round(jevAuditResult.has_double_key_risk.probability * 100)}%
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-md border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-500">
                    Choice: Trampa Cognitiva Principal
                  </span>
                  <div className="text-xs font-bold text-slate-100">
                    {jevAuditResult.primary_cognitive_trap.choice}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                    Confianza del dictamen: {Math.round(jevAuditResult.primary_cognitive_trap.confidence * 100)}%
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-md border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Score: Dificultad Psicométrica
                    </span>
                    <div className="text-sm font-bold text-amber-400 tabular-nums">
                      {Number(jevAuditResult.psychometric_difficulty.score).toFixed(1)} / 5
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">
                      Apto para Graduación SRS
                    </span>
                    <div className="text-sm font-bold text-emerald-300 tabular-nums">
                      {Math.round(jevAuditResult.graduation_readiness.probability * 100)}%
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 tabular-nums">
                  <span>Latencia: {jevAuditResult.latency_ms} ms</span>
                  <span>Tokens de salida: 0 (Decisión determinista Jev)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
