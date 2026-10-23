import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[var(--c-surface)] rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 border border-[var(--c-line)]">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            danger ? 'bg-red-100' : 'bg-amber-100'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-600' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[var(--c-ink)]">{title}</h3>
            <p className="text-xs text-[var(--c-ink-soft)] mt-1 leading-relaxed">{message}</p>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-[var(--c-ink)]/5 rounded-lg transition-colors">
            <X className="w-4 h-4 text-[var(--c-ink-soft)]/40" />
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--c-ink-soft)] hover:bg-[var(--c-ink)]/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-[#D35400] to-[#F4A300] hover:from-[#F4A300] hover:to-[#D35400]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
