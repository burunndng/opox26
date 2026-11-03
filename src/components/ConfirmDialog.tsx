import React, { useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useFocusTrap } from '../utils/useFocusTrap.ts';

/**
 * Shared styled confirmation dialog, consistent with the app's real-dialog
 * contract (role="dialog", aria-modal, focus trap, Esc close). Replaces
 * native window.confirm so destructive actions keep brand continuity and
 * accessible focus management.
 *
 * @param variant - 'danger' (rose) for destructive actions, 'primary' (indigo) otherwise.
 */
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(isOpen, onClose, modalRef);

  const isDanger = variant === 'danger';

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm outline-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-[#121722] border border-[#20293a] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl ${isDanger ? 'bg-rose-950/30 border border-rose-500/40 text-rose-400' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="confirm-dialog-title" className="text-base font-bold text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-400">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-medium transition bg-[#121722] hover:bg-[#182030] text-slate-400 border border-[#20293a]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-md text-xs font-medium transition text-white ${isDanger ? 'bg-rose-600 hover:bg-rose-500 shadow-xs' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xs'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
