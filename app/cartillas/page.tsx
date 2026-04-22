"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { getResourcesByType, subjects } from "@/lib/academic-content";
import { BookOpen, Layers, GraduationCap } from "lucide-react";
import SubjectLinks from "@/components/site/SubjectLinks";
import BookletCard from "@/components/cartillas/BookletCard";



export default function BookletsPage() {
  const items = getResourcesByType("cartillas");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent)",
              "radial-gradient(circle at 80% 80%, rgba(168,85,247,0.25), transparent)",
              "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold md:text-5xl">
            Biblioteca de Física
          </h1>

          <p className="mt-5 text-muted-foreground">
            Cartillas diseñadas para acompañar todo el proceso de aprendizaje,
            desde la comprensión conceptual hasta la práctica.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="#cartillas"
              className="rounded-full bg-primary px-6 py-3 text-primary-foreground"
            >
              Explorar cartillas
            </Link>

            <Link
              href="/simuladores"
              className="rounded-full border border-border px-6 py-3"
            >
              Ir a simuladores
            </Link>
          </div>
        </div>
      </section>

      {/* VALOR */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Contenido estructurado",
              desc: "No son PDFs sueltos, son guías completas con progresión.",
            },
            {
              icon: Layers,
              title: "Integración total",
              desc: "Se conectan con simuladores y videos.",
            },
            {
              icon: GraduationCap,
              title: "Pensado para aprobar",
              desc: "Material enfocado en evaluaciones reales.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 p-6 hover:shadow-lg transition"
            >
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 GRID PRO CON BOOKLETS */}
      <section id="cartillas" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <BookletCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ASIGNATURAS */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <SubjectLinks
          subjects={subjects}
          basePath="/cartillas"
          title="Explorar por asignatura"
        />
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-semibold">
          Refuerza tu aprendizaje con material completo
        </h2>

        <Link
          href="/simuladores"
          className="mt-8 inline-block rounded-full bg-primary px-8 py-4 text-primary-foreground"
        >
          Empezar con simuladores
        </Link>
      </section>
    </main>
  );
}