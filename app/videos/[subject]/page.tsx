"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { getResourcesByType, getSubject } from "@/lib/academic-content";
import { useParams, notFound } from "next/navigation";
import { PlayCircle } from "lucide-react";

export default function SubjectVideosPage() {
  const params = useParams();
  const subject = params.subject as string;

  const current = getSubject(subject);
  if (!current) return notFound();

  const items = getResourcesByType("videos", current.slug);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="px-6 pt-20 pb-14 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Videos de {current.title}
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
          Refuerza conceptos clave antes de practicar.
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          {items.length} videos disponibles
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
                <h3 className="font-semibold">
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
    </main>
  );
}