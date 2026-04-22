"use client";

import Navbar from "@/components/Navbar";
import { useParams, notFound } from "next/navigation";
import { getResourcesByType, getSubject } from "@/lib/academic-content";
import { motion } from "framer-motion";
import BookletCard from "@/components/cartillas/BookletCard";

export default function SubjectBookletsPage() {
  const params = useParams();
  const subject = params.subject as string;

  const current = getSubject(subject);
  if (!current) return notFound();

  const items = getResourcesByType("cartillas", current.slug);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative px-6 pt-24 pb-16 text-center overflow-hidden">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 10% 10%, rgba(99,102,241,0.2), transparent)",
              "radial-gradient(circle at 90% 90%, rgba(168,85,247,0.2), transparent)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 blur-3xl"
        />

        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold md:text-5xl">{current.title}</h1>

          <p className="mt-5 text-muted-foreground">
            Cartillas diseñadas para dominar los conceptos clave de esta
            asignatura.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            {items.length} materiales disponibles
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <BookletCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
