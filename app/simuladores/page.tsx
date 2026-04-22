"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { subjects } from "@/lib/academic-content";
import SimulatorCard from "@/components/simulators/SimulatorCard";
import { categories } from "@/utils/categories";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function getSimulatorsByCategory() {
  const all = subjects.flatMap((s) =>
    s.simulators.map((sim) => ({
      ...sim,
      subject: s.title,
    })),
  );

  return categories.map((cat) => ({
    ...cat,
    simulators: all.filter((sim) =>
      sim.category.toLowerCase().includes(cat.match.toLowerCase()),
    ),
  }));
}

export default function SimulatorsPage() {
  const grouped = getSimulatorsByCategory();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative px-6 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold md:text-5xl">
            Simuladores interactivos de física
          </h1>

          <p className="mt-5 text-muted-foreground">
            Explora fenómenos en tiempo real.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="#simuladores"
              className="rounded-full bg-primary px-6 py-3 text-primary-foreground"
            >
              Explorar simuladores
            </Link>

            <Link
              href="/simuladores/fisica-2"
              className="rounded-full border border-border px-6 py-3"
            >
              Ver por asignatura
            </Link>
          </div>
        </div>
      </section>

      <section id="simuladores" className="mx-auto max-w-6xl px-6 pb-20">
        {grouped.map((group) => {
          const Icon = group.icon;
          if (!group.simulators.length) return null;

          return (
            <div key={group.title} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">{group.title}</h2>
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {group.simulators.map((sim, index) => (
                  <SimulatorCard key={`${sim.id}-${index}`} sim={sim} />
                ))}
              </motion.div>
            </div>
          );
        })}
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl font-semibold">Empieza a explorar la física</h2>

        <Link
          href="/simuladores/fisica-2"
          className="mt-8 inline-block rounded-full bg-primary px-8 py-4 text-primary-foreground"
        >
          Ver asignaturas
        </Link>
      </section>
    </main>
  );
}
