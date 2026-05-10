"use client";

import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: "campus-fisica",
    image: "/home/physics-professor-hologram.png",
    alt: "Profesor universitario explicando formulas de fisica en una interfaz digital",
    eyebrow: "Campus De Fisica Areandina",
    title: "Explora la Fisica desde la observacion y la practica",
    description:
      "Encuentra simulaciones, videos y materiales de apoyo organizados para comprender mejor los temas vistos en clase.",
    note: "Ondas, oscilaciones, electricidad, magnetismo y otros fenomenos explicados con recursos visuales y academicos.",
    primaryLabel: "Explorar simuladores",
    primaryHref: "/simuladores",
    secondaryLabel: "Ver materiales",
    secondaryHref: "/documentos",
    tone: "light",
  },
  {
    id: "feria-steam",
    image: "/fair/feria-hero.png",
    alt: "Feria universitaria de ciencias basicas e ingenieria con prototipos y demostraciones",
    eyebrow: "Feria STEAM Areandina",
    title: "Donde las ideas se vuelven realidad",
    description:
      "Ven y descubre el futuro en la Feria de Ciencias Basicas e Ingenieria: proyectos, prototipos, ciencia aplicada y creatividad universitaria.",
    note: "14 de mayo | 2:00 p. m. a 5:00 p. m. | Universidad Areandina, pasillos 1, 2 y 3.",
    primaryLabel: "Entrar a la feria",
    primaryHref: "/feria",
    secondaryLabel: "Ver video",
    secondaryHref: "/feria#video",
    tone: "dark",
  },
] as const;

const fairFacts = [
  {
    label: "Fecha",
    value: "14 de mayo",
    icon: CalendarDays,
  },
  {
    label: "Hora",
    value: "2:00 p. m. - 5:00 p. m.",
    icon: Clock,
  },
  {
    label: "Lugar",
    value: "Universidad Areandina, pasillos 1, 2 y 3",
    icon: MapPin,
  },
];

export default function HomeHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const isFairSlide = activeSlide.id === "feria-steam";
  const isDark = activeSlide.tone === "dark";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      className={`relative min-h-screen overflow-hidden ${
        isDark ? "bg-[#10170d] text-white" : "bg-[#e9f0dd] text-foreground"
      }`}
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? "bg-[linear-gradient(90deg,rgba(7,12,6,0.96)_0%,rgba(13,22,10,0.84)_42%,rgba(13,22,10,0.34)_100%)]"
            : "bg-[linear-gradient(90deg,rgba(247,249,241,0.94)_0%,rgba(247,249,241,0.72)_42%,rgba(247,249,241,0.26)_100%)]"
        }`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? "bg-[radial-gradient(circle_at_18%_20%,rgba(127,181,54,0.34),transparent_24%),radial-gradient(circle_at_72%_76%,rgba(230,0,126,0.18),transparent_26%),radial-gradient(circle_at_48%_92%,rgba(245,152,47,0.22),transparent_30%)]"
            : "bg-[radial-gradient(circle_at_16%_20%,rgba(127,181,54,0.18),transparent_20%),radial-gradient(circle_at_82%_80%,rgba(245,152,47,0.13),transparent_22%)]"
        }`}
      />

      <Navbar />

      <div className="section-shell relative flex min-h-[calc(100vh-88px)] items-end pb-16 pt-28 md:pb-20">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-4xl">
            <p
              className={`font-mono text-[0.72rem] uppercase tracking-[0.28em] ${
                isDark ? "text-[#d7f4b4]" : "text-primary"
              }`}
            >
              {activeSlide.eyebrow}
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.97] tracking-tight md:text-7xl">
              {activeSlide.title}
            </h1>
            <p
              className={`mt-6 max-w-2xl text-base leading-8 md:text-lg ${
                isDark ? "text-slate-200" : "text-[#344529]"
              }`}
            >
              {activeSlide.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={activeSlide.primaryHref}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_20px_44px_rgba(127,181,54,0.26)] transition hover:-translate-y-0.5"
              >
                {activeSlide.primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={activeSlide.secondaryHref}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-[0_18px_38px_rgba(245,152,47,0.22)] transition hover:-translate-y-0.5 ${
                  isDark
                    ? "border border-white/18 bg-white/12 text-white backdrop-blur-xl"
                    : "bg-[#f5982f] text-[#241809]"
                }`}
              >
                {activeSlide.secondaryLabel}
                {isFairSlide && <PlayCircle className="h-4 w-4" />}
              </Link>
            </div>

            <p
              className={`mt-10 max-w-2xl text-sm leading-7 ${
                isDark ? "text-[#d7f4b4]" : "text-[#435334]"
              }`}
            >
              {activeSlide.note}
            </p>
          </div>

          {isFairSlide && (
            <div className="hidden rounded-[1.75rem] border border-white/14 bg-white/10 p-5 backdrop-blur-xl shadow-[0_28px_80px_rgba(0,0,0,0.18)] lg:block">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.26em] text-[#ffd39d]">
                Datos del evento
              </p>
              <div className="mt-5 space-y-4">
                {fairFacts.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex gap-4 border-t border-white/12 pt-4">
                    <Icon className="mt-1 h-5 w-5 shrink-0 text-[#f5982f]" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-white">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 backdrop-blur-xl">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Ver diapositiva ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-[#1b260f]/28"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
