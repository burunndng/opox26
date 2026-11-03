import React, { useState, useRef } from 'react';
import { Play, SkipForward, ArrowRight } from 'lucide-react';
import { useFocusTrap } from '../utils/useFocusTrap.ts';

const STORAGE_KEY = 'oposilab_onboarding_completed';

type OnboardingStep = {
  title: string;
  body: string;
  icon: React.ElementType;
};

const STEPS: OnboardingStep[] = [
  {
    title: 'Bienvenido a OposiLab',
    body: 'Entrenamiento cognitivo para la oposición de Seguridad Social. Practicas preguntas tipo test con el baremo real del examen.',
    icon: Play,
  },
  {
    title: 'Baremo oficial: +1 / −0,25',
    body: 'Cada acierto suma 1 punto; cada fallo resta 0,25, como en el examen oficial de Seguridad Social. Cuando dudes, dejar en blanco evita perder puntos.',
    icon: SkipForward,
  },
  {
    title: 'Califica tu confianza (0–3)',
    body: 'Tras cada respuesta indica tu certeza: 0 = al azar, 3 = absolutamente seguro. Fallar con confianza máxima se marca como "error con confianza máxima" (confident-wrong) y va a "Mis fallos".',
    icon: ArrowRight,
  },
  {
    title: 'Listo para tu primer test',
    body: 'Empieza con el repaso pendiente o un test de nivel. La app te guiará con pistas y un ritmo adaptado a cada pregunta.',
    icon: Play,
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(0);
  const modalRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(isOpen, onClose, modalRef);

  if (!isOpen) return null;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onClose();
  };

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem(STORAGE_KEY, 'true');
      onComplete();
      onClose();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="bg-[#121722] border border-[#20293a] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-indigo-400" />
            <h3 id="onboarding-title" className="text-base font-bold text-white">
              {current.title}
            </h3>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Saltar bienvenida"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-300 leading-relaxed text-sm">{current.body}</p>

        {/* Progress */}
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
          <span>Paso {step + 1} de {STEPS.length}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleNext}
            className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              isLast
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isLast ? (
              <>
                <Play className="w-4 h-4" />
                <span>Empezar mi primer test</span>
              </>
            ) : (
              <>
                Siguiente <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
          <button
            onClick={handleSkip}
            className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Saltar
          </button>
        </div>
      </div>
    </div>
  );
};
