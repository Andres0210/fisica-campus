"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { getResourcesByType } from "@/lib/academic-content";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

function getRelatedSimulator(video: any) {
  return "/simuladores"; // luego puedes conectar real
}

export default function VideoPage() {
  const params = useParams();
  const id = params.id as string;

  const videos = getResourcesByType("videos");
  const video = videos.find((v: any) => v.id === id);

  if (!video) return notFound();

  const relatedVideos = videos
    .filter((v: any) => v.id !== id)
    .slice(0, 4);

  const simulatorLink = getRelatedSimulator(video);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-20 grid gap-10 lg:grid-cols-3">

        {/* VIDEO */}
        <div className="lg:col-span-2">
          <div className="aspect-video w-full rounded-2xl bg-black flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-white opacity-80" />
          </div>

          <div className="mt-6">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {video.title}
            </h1>

            <p className="mt-4 text-muted-foreground">
              {video.description}
            </p>

            <Link
              href={simulatorLink}
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-lg shadow-primary/30"
            >
              Practicar con simulador →
            </Link>
          </div>

          {/* TAGS fallback */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold">
              Conceptos clave
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Física", "Concepto"].map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Más videos
          </h3>

          <div className="space-y-4">
            {relatedVideos.map((v: any, index: number) => (
              <motion.div
                key={`${v.id}-${index}`}
                whileHover={{ x: 5 }}
                className="flex gap-3"
              >
                <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>

                <Link href={`/videos/watch/${v.id}`} className="text-sm">
                  <p className="font-medium line-clamp-2">
                    {v.title}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}