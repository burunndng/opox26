import React from 'react';
import { HelpCircle, X, Keyboard, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpShortcutsModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Espacio', desc: 'Revelar opciones en MCQ / Siguiente ítem en feedback' },
    { key: 'H', desc: 'Pedir una pista (reduce el intervalo de repaso)' },
    { key: '1, 2, 3, 4', desc: 'Seleccionar alternativa A, B, C o D' },
    { key: '0, 1, 2, 3', desc: 'Calificar nivel de certeza o confianza metacognitiva' },
    { key: 'Esc', desc: 'Cerrar ventanas modales o salir al panel' },
    { key: '?', desc: 'Abrir esta guía de atajos' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Atajos de Teclado Rápidos</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          OposiLab está diseñado para un entrenamiento fluido y sin distracciones de ratón durante
          los micro-drills:
        </p>

        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-850 text-xs"
            >
              <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-indigo-300 font-mono font-bold">
                {s.key}
              </kbd>
              <span className="text-slate-300">{s.desc}</span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-[11px] text-slate-400">
          <span className="font-semibold text-indigo-300">Tip de estudio: </span>
          Mantén los dedos en la fila numérica para valorar la confianza con objetividad tras cada
          elección.
        </div>
      </div>
    </div>
  );
};
