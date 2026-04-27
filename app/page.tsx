"use client";
import AuthorCard from "@/components/authors/AuthorCard";
import Navbar from "@/components/Navbar";
import { authors, subjects } from "@/lib/academic-content";
import Link from "next/link";
import { Atom, PlayCircle, BookOpen, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Particle = {
  x: number;
  y: number;
  yMove: number;
  duration: number;
  delay: number;
};

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 800,
      y: Math.random() * 400,
      yMove: Math.random() * -200,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20">
        {/* GRID (tipo laboratorio) */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* GRADIENTE DINÁMICO */}
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(127,181,54,0.28), transparent)",
              "radial-gradient(circle at 80% 80%, rgba(245,152,47,0.22), transparent)",
              "radial-gradient(circle at 50% 30%, rgba(230,0,126,0.16), transparent)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0 blur-3xl"
        />

        {/* PARTÍCULAS */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              initial={{
                x: p.x,
                y: p.y,
                opacity: 0,
              }}
              animate={{
                y: [null, p.yMove],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>

        {/* CONTENIDO */}
        <div className="relative mx-auto max-w-6xl text-center">
          {/* ICONO */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-md"
          >
            <Atom className="h-8 w-8 text-primary" />
          </motion.div>

          {/* TITULO */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold leading-tight md:text-6xl"
          >
            Aprende Física <br />
            <span className="text-primary">viendo cómo funciona</span>
          </motion.h1>

          {/* DESCRIPCION */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Simulaciones interactivas, videos y recursos organizados para que
            entiendas los fenómenos físicos, no solo los memorices.
          </motion.p>

          {/* BOTONES */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link
              href="/simuladores"
              className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105"
            >
              Explorar simuladores
            </Link>

            <Link
              href="#asignaturas"
              className="rounded-full border border-border px-6 py-3 font-medium backdrop-blur-md transition hover:bg-muted"
            >
              Ver asignaturas
            </Link>
          </motion.div>
        </div>
      </section>
      {/* EXPERIENCIA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold text-center">
          Aprende con una experiencia interactiva
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Waves,
              title: "Simulaciones",
              desc: "Explora fenómenos físicos en tiempo real directamente desde tu navegador.",
            },
            {
              icon: PlayCircle,
              title: "Videos cortos",
              desc: "Refuerza conceptos clave antes de clase o evaluaciones.",
            },
            {
              icon: BookOpen,
              title: "Recursos",
              desc: "Accede a PDFs, guías y cartillas organizadas por asignatura.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border/60 p-6 transition hover:shadow-xl hover:shadow-primary/10"
            >
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ASIGNATURAS */}
      <section id="asignaturas" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold text-center">
          Explora por asignatura
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {subjects.map((subject) => (
            <div
              key={subject.slug}
              className="flex items-center justify-between rounded-2xl border border-border/60 p-6 hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-2xl font-semibold">{subject.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {subject.description}
                </p>

                <div className="mt-4 flex gap-3 text-sm text-muted-foreground">
                  <span>{subject.simulators.length} simuladores</span>
                  <span>•</span>
                  <span>Contenido organizado</span>
                </div>
              </div>

              <Link
                href={`/simuladores/${subject.slug}`}
                className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                Entrar
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-semibold">Cómo funciona</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-4 text-left">
            {[
              "Elige una asignatura",
              "Explora simulaciones",
              "Refuerza con videos",
              "Consulta materiales",
            ].map((step, i) => (
              <div key={step}>
                <p className="text-sm text-muted-foreground">Paso {i + 1}</p>
                <p className="mt-2 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTORES EN HOME */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-primary">
              Equipo academico
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Profesores y autores que acompanan la experiencia
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              El contenido no aparece aislado: detras de cada explicacion,
              recurso o simulacion hay perfiles con enfoque docente, criterio
              conceptual y experiencia real en Fisica.
            </p>
          </div>

          <Link
            href="/autores"
            className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Ver todos los autores
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {authors.map((author) => (
            <AuthorCard key={author.id} item={author} />
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-semibold">
          Empieza a aprender física de forma interactiva
        </h2>

        <Link
          href="/simuladores"
          className="mt-8 inline-block rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg shadow-primary/30"
        >
          Ir a simuladores
        </Link>
      </section>
    </main>
  );
}
