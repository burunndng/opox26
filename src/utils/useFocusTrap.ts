import { useEffect, useRef } from 'react';

/**
 * Focus trap for modal dialogs.
 *
 * - On open: saves the previously focused element, moves focus into the modal
 *   container (which must carry `tabIndex={-1}`), and traps Tab/Shift+Tab so
 *   focus cycles within the modal's focusable elements. Esc closes the modal.
 * - On close / unmount: restores focus to the previously focused element so
 *   keyboard / screen-reader users are not dumped back to the document body.
 *
 * @param isOpen - whether the modal is currently open
 * @param onClose - callback invoked when the user presses Esc
 * @param modalRef - ref to the modal overlay element (must be focusable via tabIndex={-1})
 */
export function useFocusTrap(
  isOpen: boolean,
  onClose: () => void,
  modalRef: React.RefObject<HTMLDivElement | null>
) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Remember where focus was so we can restore it on close.
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Move focus into the modal so screen readers announce the dialog.
    modal.focus({ preventScroll: true });

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || active === null) {
          e.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      // Restore focus to the element that had it before the modal opened.
      if (previousActiveElement.current) {
        previousActiveElement.current.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose, modalRef]);
}
