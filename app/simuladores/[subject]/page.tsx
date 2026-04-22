"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { getSubject } from "@/lib/academic-content";
import { notFound, useParams } from "next/navigation";
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

function groupSimulators(simulators: any[]) {
  return categories.map((cat) => ({
    ...cat,
    simulators: simulators.filter(
      (sim) => sim.category === cat.match
    ),
  }));
}

export default function SubjectSimulatorPage() {
  const params = useParams();
  const subject = params.subject as string;

  const current = getSubject(subject);
  if (!current) return notFound();

  const grouped = groupSimulators(current.simulators);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="px-6 pt-20 pb-14 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          {current.title}
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
          Explora simulaciones de esta materia.
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          {current.simulators.length} simuladores disponibles
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        {grouped.map((group) => {
          const Icon = group.icon;
          if (!group.simulators.length) return null;

          return (
            <div key={group.title} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">
                  {group.title}
                </h2>
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {group.simulators.map((sim: any) => (
                  <SimulatorCard
                    key={sim.id}
                    sim={{
                      ...sim,
                      subject: current.title,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          );
        })}
      </section>
    </main>
  );
}