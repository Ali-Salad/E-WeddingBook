"use client";

import { useEffect, useRef } from "react";
import { WEDDING, type Relationship } from "@/lib/guestbook";

type PreviewModalProps = {
  open: boolean;
  name: string;
  relationship: Relationship;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function PreviewModal({
  open,
  name,
  relationship,
  message,
  onClose,
  onConfirm,
}: PreviewModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl p-space-lg shadow-xl relative animate-in fade-in zoom-in-95 duration-200 border border-[rgba(197,160,89,0.3)]">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute top-space-md right-space-md text-outline hover:text-primary transition-colors"
          aria-label="Close preview"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="flex items-center gap-space-xs mb-space-sm text-secondary" id="preview-modal-title">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest font-semibold">
            Stationery Keepsake Preview
          </span>
        </div>

        <div className="p-space-lg bg-surface-container-low rounded-xl shadow-[inset_0_1px_2px_rgba(44,34,36,0.04)] mb-space-md border border-[rgba(229,216,190,0.5)]">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-[10px] tracking-wider uppercase font-semibold">
              {relationship}
            </span>
            <span className="font-signature italic text-secondary text-signature">
              {WEDDING.couple} 2025
            </span>
          </div>

          <p className="font-headline-sm text-headline-sm text-on-surface font-normal italic leading-relaxed mb-space-md">
            “{message || "Guurkiina ha noqdo mid barakeysan oo lagu nasto. Waxaan idiin rajeyneynaa nolol buuxda oo naxariis..."}”
          </p>

          <div className="text-right">
            <span className="font-headline-sm text-[18px] text-primary font-semibold block">
              {name || "Your Name / Guest"}
            </span>
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-outline">
              Honored Guest
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-space-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-space-md py-space-xs rounded-xl font-label-md text-label-md uppercase tracking-wider text-outline hover:text-primary transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-space-lg py-space-xs rounded-xl bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm hover:bg-primary transition-colors flex items-center gap-1.5"
          >
            <span>Confirm &amp; Post</span>
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
              auto_awesome
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
