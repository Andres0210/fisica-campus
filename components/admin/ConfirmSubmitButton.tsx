"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useRef, useState } from "react";

type ConfirmSubmitButtonProps = {
  label: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
};

export default function ConfirmSubmitButton({
  label,
  title,
  message,
  confirmLabel = "Si, eliminar",
  cancelLabel = "Cancelar",
  className,
}: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function confirm() {
    setOpen(false);
    buttonRef.current?.closest("form")?.requestSubmit();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {label}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              className="w-full max-w-md rounded-[1.75rem] border border-border bg-background p-6 shadow-[0_28px_100px_rgba(15,23,42,0.28)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border/70 p-2 text-muted-foreground transition hover:text-foreground"
                  aria-label="Cerrar confirmacion"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h2 className="mt-5 text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border/70 px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-600"
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
