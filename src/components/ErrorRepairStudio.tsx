import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle,
  Wrench,
  Flame,
  Search,
  BookOpen,
  Filter,
  Play,
  RotateCcw,
  Printer,
  FileText,
  Copy,
  Check,
  X,
  Scale,
} from 'lucide-react';
import { ErrorLog, Item } from '../types.ts';
import { api } from '../api.ts';

interface ErrorRepairStudioProps {
  errors: ErrorLog[];
  items: Item[];
  onRefresh: () => void;
  onLaunchRepairSession: (itemIds: string[]) => void;
}

export const ErrorRepairStudio: React.FC<ErrorRepairStudioProps> = ({
  errors,
  items,
  onRefresh,
  onLaunchRepairSession,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'confident_wrong' | 'open' | 'repaired'>(
    'open'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);

  const itemMap = new Map(items.map((i) => [i.id, i]));

  const filteredErrors = errors.filter((e) => {
    if (filterTab === 'open' && e.status !== 'open') return false;
    if (filterTab === 'repaired' && e.status !== 'repaired') return false;
    if (filterTab === 'confident_wrong' && e.confidence !== 3) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const basis = (e.legal_basis || '').toLowerCase();
      const rule = (e.corrective_rule || '').toLowerCase();
      const item = itemMap.get(e.item_id);
      const stem = (item?.stem || '').toLowerCase();
      return basis.includes(term) || rule.includes(term) || stem.includes(term);
    }
    return true;
  });

  const handleMarkRepaired = async (errorId: string) => {
    try {
      await api.updateError(errorId, { status: 'repaired' });
      onRefresh();
    } catch (err) {
      console.error('Failed to mark error repaired:', err);
    }
  };

  const handleRepairItem = (itemId: string) => {
    onLaunchRepairSession([itemId]);
  };

  // Generate Markdown for Dossier
  const generateDossierMarkdown = () => {
    const confidentErrors = errors.filter((e) => e.confidence === 3);
    const openErrors = errors.filter((e) => e.status === 'open');

    let md = `# CUADERNO DE FALLOS Y TRAMPAS — OPOSILAB (SEGURIDAD SOCIAL)\n`;
    md += `Generado: ${new Date().toLocaleDateString('es-ES')} | Total Errores Abiertos: ${openErrors.length} | Confident-Wrong (Críticos): ${confidentErrors.length}\n\n`;
    md += `---\n\n`;

    md += `## 1. REGLAS CORRECTIVAS Y TRAMPAS FRECUENTES\n\n`;
    filteredErrors.forEach((err, idx) => {
      const item = itemMap.get(err.item_id);
      md += `### Fallo #${idx + 1}: ${item?.stem || 'Pregunta'}\n`;
      md += `- **Base Legal:** ${err.legal_basis || item?.legal_basis || 'TRLGSS'}\n`;
      md += `- **Taxonomía:** ${err.error_type_code || 'E5'} | Confianza al responder: ${err.confidence}/3 ${err.confidence === 3 ? '⚠️ [CONFIDENT-WRONG]' : ''}\n`;
      if (err.trap_type) md += `- **Trampa Psicométrica:** ${err.trap_type}\n`;
      md += `- **Regla Correctiva:** ${err.corrective_rule || item?.corrective_rule || item?.why_correct}\n`;
      md += `\n---\n\n`;
    });

    return md;
  };

  const handleCopyDossier = () => {
    const md = generateDossierMarkdown();
    navigator.clipboard.writeText(md);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Mis fallos
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Cada fallo es una oportunidad. Repasa tus errores por regla hasta que queden fijados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsDossierOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Cuaderno de Fallos</span>
          </button>

          {filteredErrors.length > 0 && (
            <button
              onClick={() => onLaunchRepairSession(filteredErrors.map((e) => e.item_id))}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition"
            >
              <Play className="w-4 h-4" />
              <span>Reparar Todos ({filteredErrors.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('open')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              filterTab === 'open'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Errores Abiertos ({errors.filter((e) => e.status === 'open').length})
          </button>
          <button
            onClick={() => setFilterTab('confident_wrong')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              filterTab === 'confident_wrong'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Confident-Wrong ({errors.filter((e) => e.confidence === 3).length})
          </button>
          <button
            onClick={() => setFilterTab('repaired')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              filterTab === 'repaired'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Reparados ({errors.filter((e) => e.status === 'repaired').length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              filterTab === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({errors.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por base legal o regla..."
            className="w-full bg-slate-900 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Errors List */}
      <div className="space-y-3">
        {filteredErrors.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">No hay errores en esta categoría.</p>
            <p className="text-xs text-slate-500 mt-1">
              ¡Excelente! Tus respuestas están calibradas o ya has reparado los fallos anteriores.
            </p>
          </div>
        ) : (
          filteredErrors.map((err) => {
            const item = itemMap.get(err.item_id);
            const isConfident = err.confidence === 3;

            return (
              <div
                key={err.id}
                className={`p-5 rounded-lg border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isConfident
                    ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-800'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        isConfident
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {err.error_type_code || 'E5'} · Confianza: {err.confidence}/3
                    </span>

                    {err.legal_basis && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {err.legal_basis}
                      </span>
                    )}

                    {err.trap_type && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        Trampa: {err.trap_type}
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(err.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-200 font-legal-serif">
                    {item?.stem || 'Pregunta no disponible'}
                  </p>

                  <div className="p-3 bg-slate-950 rounded-md text-xs space-y-1 border border-slate-800">
                    <p className="text-slate-300">
                      <span className="font-semibold text-amber-500">Regla Correctiva: </span>
                      {err.corrective_rule || item?.corrective_rule || item?.why_correct}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleRepairItem(err.item_id)}
                    className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-semibold shadow transition flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reparar Ahora</span>
                  </button>

                  {err.status === 'open' && (
                    <button
                      onClick={() => handleMarkRepaired(err.id)}
                      className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                      title="Marcar como reparado manualmente"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dossier Modal */}
      {isDossierOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-2.5">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Cuaderno de Fallos & Trampas — Formato Impresión / Estudio Offline
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dossier estructurado con reglas correctivas, taxonomía de errores y bases legales
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyDossier}
                  className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
                >
                  {copiedDossier ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDossier ? '¡Copiado!' : 'Copiar Markdown'}</span>
                </button>

                <button
                  onClick={handlePrintDossier}
                  className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-semibold shadow transition flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / PDF</span>
                </button>

                <button
                  onClick={() => setIsDossierOpen(false)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body / Printable View */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs leading-relaxed bg-slate-900">
              <div className="p-4 bg-slate-950 rounded-md border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Resumen Ejecutivo de Errores Activos</h4>
                  <p className="text-slate-400 mt-0.5">
                    Total mostrados: <strong className="text-white tabular-nums">{filteredErrors.length}</strong> · Confident-Wrong: <strong className="text-rose-400 tabular-nums">{filteredErrors.filter(e => e.confidence === 3).length}</strong>
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded border border-amber-500/30">
                  OposiLab SS Tema 7
                </span>
              </div>

              <div className="space-y-4">
                {filteredErrors.map((err, i) => {
                  const item = itemMap.get(err.item_id);
                  return (
                    <div
                      key={err.id}
                      className="p-4 rounded-md bg-slate-950/80 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-slate-300 font-mono text-[11px]">
                          Fallo #{i + 1}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-semibold text-[10px]">
                            {err.legal_basis || item?.legal_basis || 'TRLGSS'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${err.confidence === 3 ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                            Confianza: {err.confidence}/3
                          </span>
                          {err.trap_type && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px]">
                              {err.trap_type}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="font-semibold text-white text-xs font-legal-serif">{item?.stem}</p>

                      <div className="p-2.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                        <p className="font-semibold text-amber-400 mb-0.5">Regla Correctiva & Explicación:</p>
                        <p>{err.corrective_rule || item?.corrective_rule || item?.why_correct}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
