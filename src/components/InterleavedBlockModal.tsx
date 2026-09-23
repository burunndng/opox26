import React, { useState, useEffect } from 'react';
import { Shuffle, CheckCircle, Sliders, X, Sparkles, Layers, BookOpen } from 'lucide-react';
import { api } from '../api.ts';
import { Item, Topic } from '../types.ts';

interface InterleavedBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchBlock: (items: Item[]) => void;
  topics?: Topic[];
  defaultTopicId?: string;
}

export const InterleavedBlockModal: React.FC<InterleavedBlockModalProps> = ({
  isOpen,
  onClose,
  onLaunchBlock,
  topics = [],
  defaultTopicId,
}) => {
  const [targetTopicId, setTargetTopicId] = useState<string>(defaultTopicId || 'all');
  const [blockSize, setBlockSize] = useState(15);
  const [includeNew, setIncludeNew] = useState(true);
  const [includeMaintenance, setIncludeMaintenance] = useState(true);
  const [focusConfusionPairs, setFocusConfusionPairs] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (defaultTopicId) {
      setTargetTopicId(defaultTopicId);
    }
  }, [defaultTopicId, isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const blockItems = await api.generateInterleavedBlock({
        blockSize,
        topicId: targetTopicId !== 'all' ? targetTopicId : undefined,
        includeNew,
        includeMaintenance,
        focusConfusionPairs,
      });
      onLaunchBlock(blockItems);
      onClose();
    } catch (err) {
      console.error('Failed to generate interleaved block:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Shuffle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Generador de Bloque Intercalado</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          El estudio en bloques masivos crea familiaridad fácil pero poco duradera.
          El bloque intercalado mezcla clusters y exige recuperar la regla adecuada bajo incertidumbre.
        </p>

        {/* Topic Selector for Interleaved */}
        {topics.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Alcance del Bloque (Tema / Set de Estudio)</span>
            </label>
            <select
              value={targetTopicId}
              onChange={(e) => setTargetTopicId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">🌐 Todos los Temas (Entrenamiento Global Cruzado)</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  📚 {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Constraint Notice */}
        <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl space-y-1">
          <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Restricciones Algorítmicas del Motor OposiLab:</span>
          </span>
          <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-0.5">
            <li>Máximo 2 ítems consecutivos del mismo cluster</li>
            <li>Inclusión balanceada de ambos miembros de pares confusos</li>
            <li>Mezcla de formatos (MCQ, Cloze, Contraste, Clasificación de Plazos)</li>
            <li>Inclusión de ítems de mantenimiento y zonas de error reciente</li>
          </ul>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Tamaño del Bloque</span>
              <span className="font-mono text-emerald-400">{blockSize} ítems</span>
            </div>
            <input
              type="range"
              min={8}
              max={30}
              step={1}
              value={blockSize}
              onChange={(e) => setBlockSize(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={focusConfusionPairs}
                onChange={(e) => setFocusConfusionPairs(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0"
              />
              <span>Priorizar pares de alta confusión (prescripción/caducidad, 1,4/1,5)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={includeNew}
                onChange={(e) => setIncludeNew(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0"
              />
              <span>Incluir ítems nuevos aún no evaluados</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={includeMaintenance}
                onChange={(e) => setIncludeMaintenance(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0"
              />
              <span>Incluir ítems graduados para mantenimiento a largo plazo</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition disabled:opacity-50"
          >
            {isGenerating ? 'Generando Bloque...' : 'Comenzar Bloque Intercalado'}
          </button>
        </div>
      </div>
    </div>
  );
};
