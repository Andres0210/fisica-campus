"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AdminFeedback() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const message = success ?? error;
  const type = success ? "success" : error ? "error" : null;
  const [visible, setVisible] = useState(Boolean(message));

  const cleanUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("success");
    params.delete("error");
    const nextQuery = params.toString();

    return nextQuery ? `${pathname}?${nextQuery}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    setVisible(Boolean(message));

    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
      router.replace(cleanUrl, { scroll: false });
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [cleanUrl, message, router]);

  function close() {
    setVisible(false);
    router.replace(cleanUrl, { scroll: false });
  }

  return (
    <AnimatePresence>
      {visible && message && type ? (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.98 }}
          className="fixed right-6 top-6 z-[80] w-[min(92vw,420px)]"
        >
          <div
            className={`rounded-[1.35rem] border p-4 shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl ${
              type === "success"
                ? "border-emerald-400/25 bg-emerald-950/90 text-emerald-50"
                : "border-rose-400/25 bg-rose-950/90 text-rose-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 rounded-full p-2 ${
                  type === "success" ? "bg-emerald-400/15" : "bg-rose-400/15"
                }`}
              >
                {type === "success" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {type === "success" ? "Operacion completada" : "Necesitamos revisar esto"}
                </p>
                <p className="mt-1 text-sm leading-6 opacity-85">{message}</p>
              </div>

              <button
                type="button"
                onClick={close}
                className="rounded-full p-1.5 opacity-70 transition hover:bg-white/10 hover:opacity-100"
                aria-label="Cerrar notificacion"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
