"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { getResourcesByType, getSubject } from "@/lib/academic-content";
import { notFound, useParams } from "next/navigation";
import { FileText } from "lucide-react";

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

export default function SubjectDocumentsPage() {
  const params = useParams();
  const subject = params.subject as string;

  const current = getSubject(subject);
  if (!current) return notFound();

  const items = getResourcesByType("documentos", current.slug);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="px-6 pt-24 pb-14 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Documentos de {current.title}
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
          Material de estudio organizado para esta asignatura.
        </p>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
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
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-border/60 p-5 hover:shadow-xl transition"
            >
              <FileText className="h-6 w-6 text-primary" />

              <h3 className="mt-4 text-lg font-semibold">
                {doc.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {doc.description}
              </p>

              <button className="mt-4 text-primary text-sm">
                Abrir documento →
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}