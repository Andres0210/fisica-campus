"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { getResourcesByType, subjects } from "@/lib/academic-content";
import { PlayCircle } from "lucide-react";

export default function VideosPage() {
  const items = getResourcesByType("videos");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="px-6 pt-20 pb-14 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Videos de física
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
          Refuerza conceptos clave en minutos antes de practicar.
        </p>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((video: any, index: number) => (
            <motion.div
              key={`${video.id}-${index}`}
              whileHover={{ y: -5 }}
              className="group rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-40 bg-muted flex items-center justify-center">
                <PlayCircle className="h-10 w-10 text-primary group-hover:scale-110 transition" />
              </div>

              <div className="p-4">
                <p className="text-xs text-muted-foreground">
                  {video.subject}
                </p>

                <h3 className="mt-2 font-semibold">
                  {video.title}
                </h3>

                <Link
                  href={`/videos/watch/${video.id}`}
                  className="mt-3 inline-block text-sm text-primary"
                >
                  Ver video →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ASIGNATURAS */}
      <section className="pb-20 text-center">
        <h2 className="text-2xl font-semibold">
          Ver por asignatura
        </h2>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              href={`/videos/${s.slug}`}
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