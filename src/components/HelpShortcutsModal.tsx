import React, { useRef } from 'react';
import { HelpCircle, X, Keyboard, Sparkles } from 'lucide-react';
import { useFocusTrap } from '../utils/useFocusTrap.ts';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpShortcutsModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(isOpen, onClose, modalRef);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Espacio', desc: 'Revelar opciones en MCQ / Siguiente ítem en feedback' },
    { key: 'H', desc: 'Pedir una pista (reduce el intervalo de repaso)' },
    { key: '1, 2, 3, 4', desc: 'Seleccionar alternativa A, B, C o D' },
    { key: '0 / B', desc: 'Dejar la pregunta en blanco (0 pts; evita el −0,25 por fallo)' },
    { key: '0, 1, 2, 3 (tras responder)', desc: 'Calificar nivel de certeza o confianza metacognitiva' },
    { key: 'Esc', desc: 'Cerrar ventanas modales o salir al panel' },
    { key: '?', desc: 'Abrir esta guía de atajos' },
    { key: 'Alt+1/2/3', desc: 'Ir a Panel / Test / Reparación' },
  ];

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="bg-[#121722] border border-[#20293a] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#20293a] pb-3">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h3 id="help-modal-title" className="text-base font-bold text-white">Atajos de Teclado Rápidos</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white" aria-label="Cerrar guía de atajos">
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
