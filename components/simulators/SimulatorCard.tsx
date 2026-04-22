"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ========================= */
/* TYPES */
/* ========================= */

type Simulator = {
  id: string;
  title: string;
  summary?: string;
  subject?: string;
  status?: "validado" | "recomendado";
};

type Props = {
  sim: Simulator; // 👈 IMPORTANTE
};

/* ========================= */

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

/* ========================= */

export default function SimulatorCard({ sim }: Props) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group overflow-hidden rounded-2xl border border-border/60 bg-background hover:shadow-xl transition"
    >
      {/* IMAGE */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src="/simulators/physics.png"
          alt={sim.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {sim.status && (
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                sim.status === "validado"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {sim.status === "validado" ? "Validado" : "Recomendado"}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {sim.subject && (
          <p className="text-xs text-muted-foreground">{sim.subject}</p>
        )}

        <h3 className="mt-2 text-lg font-semibold">{sim.title}</h3>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {sim.summary || "Explora este fenómeno físico en tiempo real."}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Simulación</span>

          <Link
            href={`/simuladores/watch/${sim.id}`}
            className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
          >
            Abrir
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
