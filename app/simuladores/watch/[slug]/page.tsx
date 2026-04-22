"use client";

import { useParams, notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getSimulatorById } from "@/utils/getSimulatorById";
import { simulatorRegistry } from "@/utils/simulatorRegistry";

export default function SimulatorWatchPage() {
  const params = useParams();
  const slug = params.slug as string;

  const simulator = getSimulatorById(slug);
  const Scene = simulatorRegistry[slug];

  if (!simulator || !Scene) return notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">{simulator.title}</h1>

          <p className="mt-2 text-muted-foreground">{simulator.summary}</p>
        </div>

        {/* SIMULADOR */}
        <div className="rounded-2xl border p-6">
          <Scene />
        </div>

        {/* INFO */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Enfoque</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {simulator.note}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Detalles</h3>
            <p className="text-sm mt-2">Categoría: {simulator.category}</p>
            <p className="text-sm">Estado: {simulator.status}</p>
          </div>
        </div>

        {/* BACK */}
        <Link href="/simuladores" className="text-sm text-primary">
          ← Volver
        </Link>
      </section>
    </main>
  );
}
