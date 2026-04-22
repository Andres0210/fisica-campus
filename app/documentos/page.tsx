"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { getResourcesByType, subjects } from "@/lib/academic-content";

/* ========================= */

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* ========================= */

export default function DocumentsPage() {
  const items = getResourcesByType("documentos");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO tipo biblioteca */}
      <section className="relative px-6 pt-24 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 blur-3xl" />

        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">
            Biblioteca de Física
          </h1>

          <p className="mt-5 text-muted-foreground">
            Accede a guías, talleres y materiales organizados para estudiar mejor y más rápido.
          </p>
        </div>
      </section>

      {/* GRID DOCUMENTOS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((doc) => (
            <motion.div
              key={doc.id}
              variants={item}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group rounded-2xl border border-border/60 p-5 bg-background hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {doc.format}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {doc.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {doc.description}
              </p>

              <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                <span>{doc.subject}</span>

                <button className="text-primary">
                  Abrir →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ASIGNATURAS */}
      <section className="mx-auto max-w-5xl px-6 pb-20 text-center">
        <h2 className="text-2xl font-semibold">
          Explorar por asignatura
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              href={`/documentos/${s.slug}`}
              className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted transition"
            >
              {s.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}