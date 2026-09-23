import React, { useState } from 'react';
import { BookPlus, X, Sparkles, FolderPlus, FileText } from 'lucide-react';
import { api } from '../api.ts';
import { Topic } from '../types.ts';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopicCreated: (createdTopic: Topic) => void;
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  isOpen,
  onClose,
  onTopicCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sourceFile, setSourceFile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor indica un título descriptivo para el tema o set de estudio.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create clean slug ID
      const cleanSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      const uniqueId = `${cleanSlug}_${Date.now().toString(36).substring(2, 6)}`;

      const newTopic = await api.createTopic({
        id: uniqueId,
        name: name.trim(),
        description: description.trim() || 'Set de estudio independiente para oposición.',
        source_file: sourceFile.trim() || undefined,
        status: 'active',
      });

      onTopicCreated(newTopic);
      setName('');
      setDescription('');
      setSourceFile('');
      onClose();
    } catch (err: any) {
      console.error('Failed to create topic:', err);
      setError('Error al crear el nuevo tema de estudio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Crear Nuevo Tema / Set de Estudio</h2>
              <p className="text-xs text-slate-400">
                Organiza y estudia módulos independientes (estilo Sets de Quizlet)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Título del Tema / Set de Oposición <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tema 8: Pensiones de Jubilación e Incapacidad Permanente"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Descripción y Alcance Normativo
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Artículos 193 a 215 TRLGSS. Requisitos de cotización, base reguladora, porcentajes de incapacidad y excepciones."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Referencia del Documento o PDF Fuente (Opcional)
            </label>
            <input
              type="text"
              value={sourceFile}
              onChange={(e) => setSourceFile(e.target.value)}
              placeholder="Ej: Diapositivas Tema 8 SS.pdf / BOE-A-2015-11724"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-xl flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Al crearlo, el nuevo Tema se convertirá automáticamente en tu set activo. Podrás
              importar textos normativos, atomizar reglas legales y generar reactivos tipo test de
              forma completamente aislada.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <BookPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Creando Set...' : 'Crear Set de Estudio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
