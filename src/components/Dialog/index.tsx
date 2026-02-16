'use client';

import { Button } from '../Button';

interface DialogProps {
  isVisible?: boolean;
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  disabled: boolean;
}

export default function Dialog({
  isVisible = false,
  title,
  content,
  onConfirm,
  onCancel,
  disabled = false,
}: DialogProps) {
  if (!isVisible) return null;

  function handleCancel() {
    if (disabled) return;

    onCancel();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div
        className="dark: mx-4 w-full max-w-md rounded-lg bg-slate-200 p-4 text-center shadow-lg sm:min-w-75 sm:p-6 dark:bg-[#0d1117]"
        role="dialog"
        aria-modal={true}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="dialog-title"
          className="text-lg font-semibold dark:text-slate-100"
        >
          {title}
        </h2>
        <div
          id="dialog-description"
          className="mb-4 text-sm dark:text-slate-300"
        >
          {content}
        </div>
        <div className="mt-4 flex justify-around">
          <Button
            variant="ghost"
            autoFocus
            onClick={handleCancel}
            disabled={disabled}
          >
            Cancelar
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={disabled}>
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
}
