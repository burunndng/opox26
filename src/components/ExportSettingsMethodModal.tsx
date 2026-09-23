import React, { useState } from 'react';
import {
  Download,
  Upload,
  Settings2,
  BookOpen,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Brain,
  Sliders,
  Check,
  Cpu,
  Zap,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api.ts';
import { AppSettings } from '../types.ts';

interface ExportSettingsProps {
  settings: AppSettings;
  onRefresh: () => void;
}

export const ExportSettingsMethodModal: React.FC<ExportSettingsProps> = ({
  settings,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'export' | 'method' | 'srs' | 'ai'>('export');
  const [ankiData, setAnkiData] = useState<{
    mcqTsv: string;
    clozeTsv: string;
    contrastTsv: string;
    numberSortTsv: string;
    spotErrorTsv: string;
  } | null>(null);

  const [srsSettings, setSrsSettings] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [openCodeTesting, setOpenCodeTesting] = useState(false);
  const [openCodeTestResult, setOpenCodeTestResult] = useState<any>(null);

  const handleDownloadBackup = () => {
    window.location.href = '/api/export/backup';
  };

  const handleDownloadItemsCsv = () => {
    window.location.href = '/api/export/csv-items';
  };

  const handleDownloadErrorsCsv = () => {
    window.location.href = '/api/export/csv-errors';
  };

  const handleDownloadReportMd = () => {
    window.location.href = '/api/export/analytics-md';
  };

  const handleDownloadQuizlet = () => {
    window.location.href = '/api/export/quizlet';
  };

  const handleFetchAnki = async () => {
    const data = await api.getAnkiExport();
    setAnkiData(data);
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSrsSettings = async () => {
    await api.updateSettings(srsSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefresh();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <Settings2 className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Exportar, Ajustes del Motor & Método Pedagógico
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Arquitectura 100% local-first. Exporta tus datos a Anki, realiza copias de seguridad en
          JSON/CSV y revisa los principios de la ciencia del aprendizaje que sustentan OposiLab.
        </p>

        {/* Tab switch */}
        <div className="flex items-center space-x-2 mt-5 border-t border-slate-800 pt-4">
          <button
            onClick={() => setActiveSubTab('export')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'export'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Exportar / Importar
          </button>
          <button
            onClick={() => setActiveSubTab('method')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'method'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Método Pedagógico & Principios
          </button>
          <button
            onClick={() => setActiveSubTab('srs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'srs'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Parámetros SRS & Graduación
          </button>
          <button
            onClick={() => setActiveSubTab('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              activeSubTab === 'ai'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>IA & OpenCode Zen</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. EXPORT / IMPORT SUBTAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Anki Export Hub */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Exportación a Anki (TSV Tab-Separated)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exporta los 5 tipos de notas optimizadas para Anki con campos de base legal, análisis de
              distractores y reglas mnemotécnicas:
            </p>

            <button
              onClick={handleFetchAnki}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              Generar Archivos TSV para Anki
            </button>

            {ankiData && (
              <div className="space-y-2 pt-2 border-t border-slate-850">
                <button
                  onClick={() =>
                    downloadFile(
                      ankiData.mcqTsv,
                      'oposilab-anki-cover-generate-mcq.tsv',
                      'text/tab-separated-values'
                    )
                  }
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>1. Note Type: Cover-and-Generate MCQ</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() =>
                    downloadFile(
                      ankiData.clozeTsv,
                      'oposilab-anki-cloze.tsv',
                      'text/tab-separated-values'
                    )
                  }
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>2. Note Type: Cloze / Mutilado</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() =>
                    downloadFile(
                      ankiData.contrastTsv,
                      'oposilab-anki-contrast-cards.tsv',
                      'text/tab-separated-values'
                    )
                  }
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>3. Note Type: Contrast Card Matrix</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() =>
                    downloadFile(
                      ankiData.numberSortTsv,
                      'oposilab-anki-number-sort.tsv',
                      'text/tab-separated-values'
                    )
                  }
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>4. Note Type: Number / Deadline Sort</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() =>
                    downloadFile(
                      ankiData.spotErrorTsv,
                      'oposilab-anki-spot-error.tsv',
                      'text/tab-separated-values'
                    )
                  }
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>5. Note Type: Spot-the-Error</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          {/* Local Backups & CSV Hub */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Copias de Seguridad y Tablas CSV</h3>
            </div>
            <p className="text-xs text-slate-400">
              Descarga tus ítems, intentos e historial de errores para análisis en hojas de cálculo o
              migración completa:
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleDownloadBackup}
                className="w-full text-left p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-lg text-xs text-indigo-300 font-semibold flex items-center justify-between"
              >
                <span>Backup Completo de Base de Datos (JSON)</span>
                <Download className="w-4 h-4 text-indigo-400" />
              </button>

              <button
                onClick={handleDownloadItemsCsv}
                className="w-full text-left p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-lg text-xs text-slate-200 flex items-center justify-between"
              >
                <span>Exportar Banco de Ítems (CSV)</span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={handleDownloadErrorsCsv}
                className="w-full text-left p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-lg text-xs text-slate-200 flex items-center justify-between"
              >
                <span>Exportar Registro de Errores E1-E20 (CSV)</span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={handleDownloadReportMd}
                className="w-full text-left p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-lg text-xs text-slate-200 flex items-center justify-between"
              >
                <span>Informe Ejecutivo de Rendimiento (Markdown)</span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={handleDownloadQuizlet}
                className="w-full text-left p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-lg text-xs text-slate-200 flex items-center justify-between"
              >
                <span>Exportar para Quizlet (Texto Plano)</span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. PEDAGOGICAL METHOD SUBTAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'method' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Fundamentos de la Ciencia del Aprendizaje en OposiLab
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-indigo-300">
                1. ¿Por qué Cover-and-Generate MCQ antes de ver opciones?
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                El formato tipo test convencional favorece el reconocimiento pasivo y la "ilusión de
                fluidez". Al tapar las 4 opciones y forzar la recuperación activa generativa del
                plazo o de la regla jurídica, el cerebro consolida huellas mnésicas robustas y
                elimina el efecto de adivinación afortunada.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-indigo-300">
                2. ¿Por qué se analizan los distractores y sus trampas?
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                En una oposición real (Seguridad Social), los distractores no se eligen al azar: se
                construyen mediante sustitución numérica (1,4 por 1,5), fusión conceptual
                (prescripción por caducidad), alteración del inicio del cómputo (hecho causante por
                notificación) o silenciamiento de excepciones. Conocer la patología del distractor
                inmuniza al opositor frente a la trampa del tribunal.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-indigo-300">
                3. ¿Por qué se evalúa la confianza (0 a 3)?
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Los exámenes de oposición castigan las respuestas erróneas con un tercio de penalización.
                El fallo más destructivo no es la duda, sino la convicción falsa ("Confident-Wrong" o
                E8). OposiLab bloquea la graduación de un ítem si el usuario yerra con convicción alta.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-indigo-300">
                4. ¿Por qué los simulacros de examen completos NO están incluidos?
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Los simulacros masivos de 100 preguntas son herramientas de medición sumativa tardía,
                no de aprendizaje formativo. Generan fatiga, ocultan la micro-discriminación y
                diluyen el esfuerzo correctivo. OposiLab se centra exclusivamente en el micro-drilling
                deliberado y el reaprendizaje sucesivo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. SRS SETTINGS SUBTAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'srs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Parámetros del Motor de Reaprendizaje Sucesivo (SRS)
              </h3>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Configuración Guardada</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Intervalo de Graduación (días)
              </label>
              <input
                type="number"
                value={srsSettings.graduating_interval}
                onChange={(e) =>
                  setSrsSettings({
                    ...srsSettings,
                    graduating_interval: parseInt(e.target.value) || 4,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Máximo de Ítems Nuevos por Día
              </label>
              <input
                type="number"
                value={srsSettings.max_new_items_per_day}
                onChange={(e) =>
                  setSrsSettings({
                    ...srsSettings,
                    max_new_items_per_day: parseInt(e.target.value) || 20,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={srsSettings.require_two_formats_for_graduation}
                onChange={(e) =>
                  setSrsSettings({
                    ...srsSettings,
                    require_two_formats_for_graduation: e.target.checked,
                  })
                }
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
              />
              <span>
                Exigir acierto en al menos 2 formatos diferentes para graduar un ítem (ej. MCQ + Cloze)
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={srsSettings.require_interleaved_success_for_graduation}
                onChange={(e) =>
                  setSrsSettings({
                    ...srsSettings,
                    require_interleaved_success_for_graduation: e.target.checked,
                  })
                }
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
              />
              <span>Exigir al menos 1 acierto en bloque intercalado para graduación</span>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveSrsSettings}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
            >
              Guardar Parámetros
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. AI & JEV DECISION ENGINE SETTINGS SUBTAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'ai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Inteligencia Artificial & Motor de Decisiones Jev (Opcional)
              </h3>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Configuración Guardada</span>
              </span>
            )}
          </div>

          {/* Generative AI Provider Settings */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              1. Asistente Generativo (Chat & Generación de Borradores)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Proveedor de IA</label>
                <select
                  value={srsSettings.ai_provider}
                  onChange={(e) =>
                    setSrsSettings({
                      ...srsSettings,
                      ai_provider: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="gemini">Google Gemini (Recomendado)</option>
                  <option value="openrouter">OpenRouter / Modelos Externos</option>
                  <option value="none">Desactivado (100% Manual / Offline)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Modelo Activo</label>
                <input
                  type="text"
                  value={srsSettings.ai_model || 'gemini-2.5-flash'}
                  onChange={(e) =>
                    setSrsSettings({
                      ...srsSettings,
                      ai_model: e.target.value,
                    })
                  }
                  placeholder="gemini-2.5-flash"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Jev Decision Engine (Completely Optional) */}
          <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  J
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                    <span>2. Motor de Decisiones Jev (TypeSafe / OpenRouter)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Totalmente Opcional
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Modelo de decisión tipo Sistema Uno estructurado (Choice, Noul, Score) para auditoría psicométrica de reactivos y triaje de errores.
                  </p>
                </div>
              </div>

              {/* Master Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={srsSettings.jev_enabled !== false}
                  onChange={(e) =>
                    setSrsSettings({
                      ...srsSettings,
                      jev_enabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="text-xs text-slate-400 space-y-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>Uso sin coste o sin API Key:</strong> Si no dispones de una clave de OpenRouter o si se agotan los créditos, OposiLab utiliza automáticamente el <strong>motor heurístico cognitivo local</strong>, evaluando ambigüedad, distractores y calibración sin realizar peticiones a la red.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>Independencia del sistema principal:</strong> Todas las funciones críticas de estudio (MCQ con cobertura y generación, Repaso Espaciado FSRS, Bloques Intercalados, Taller de Reparación y Exportación a Anki) funcionan al 100% de manera nativa sin Jev.
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSrsSettings}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
            >
              Guardar Ajustes de IA & Jev
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
