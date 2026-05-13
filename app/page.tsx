import HomeHeroCarousel from "@/components/HomeHeroCarousel";
import { getAuthorsCatalog } from "@/lib/education-service";
import {
  ArrowRight,
  Atom,
  BookOpen,
  FileText,
  LibraryBig,
  PlayCircle,
  Waves,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const studyPoints = [
  "Consulta contenidos por asignatura",
  "Refuerza los temas vistos en clase",
  "Encuentra videos, documentos y simulaciones en un solo lugar",
];

const interactiveAccesses = [
  {
    title: "Simuladores",
    description:
      "Explora fenomenos fisicos con experiencias visuales pensadas para observar cambios y relaciones entre variables.",
    href: "/simuladores",
    icon: Atom,
    accent: "text-[#d7f4b4]",
  },
  {
    title: "Reels Fisica",
    description:
      "Repasa conceptos clave con videos breves que acompanan los temas vistos en clase.",
    href: "/videos",
    icon: PlayCircle,
    accent: "text-[#ffd39d]",
  },
  {
    title: "Videos por asignatura",
    description:
      "Encuentra explicaciones organizadas por curso para volver a estudiar cuando lo necesites.",
    href: "/videos",
    icon: Waves,
    accent: "text-[#ffb7dd]",
  },
];

const libraryAccesses = [
  {
    title: "Documentos",
    href: "/documentos",
    icon: FileText,
  },
  {
    title: "Libros",
    href: "/libros",
    icon: LibraryBig,
  },
  {
    title: "Cartillas",
    href: "/cartillas",
    icon: BookOpen,
  },
];

export default async function Home() {
  const { authors } = await getAuthorsCatalog();

  return (
    <main className="bg-[#f7f8f1] text-foreground">
      <HomeHeroCarousel />

      <section className="bg-[#fbfbf7]">
        <div className="section-shell py-20 md:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <p className="eyebrow">Aprendizaje Por Asignatura</p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Estudia cada tema con una ruta mas clara
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                Ingresa a tu asignatura, revisa los temas disponibles y encuentra
                los recursos que acompanan cada explicacion de clase.
              </p>

              <div className="mt-10 space-y-5">
                {studyPoints.map((point) => (
                  <div key={point} className="flex items-start gap-4 border-b border-[#183909]/12 pb-5">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="text-base leading-7 text-[#334226]">{point}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/student"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#183909]/14 bg-white px-6 py-3 text-sm font-medium text-[#182313] transition hover:bg-[#edf2e4]"
              >
                Ver asignaturas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] border border-[#183909]/10 bg-[#e8eed9] shadow-[0_28px_90px_rgba(47,62,18,0.12)]">
              <Image
                src="/home/physics-desk-equations.png"
                alt="Mesa de estudio con ecuaciones y diagramas de fisica"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#10170d] text-white">
        <Image
          src="/home/physics-lab-collaboration.png"
          alt="Laboratorio universitario de fisica con estudiantes y profesor"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.34]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,23,13,0.98)_0%,rgba(16,23,13,0.86)_48%,rgba(16,23,13,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(127,181,54,0.22),transparent_24%),radial-gradient(circle_at_84%_82%,rgba(230,0,126,0.14),transparent_24%)]" />

        <div className="section-shell relative py-20 md:py-24">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-[#d7f4b4]">
            Simuladores Y Videos
          </p>
          <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Observa los fenomenos antes de resolverlos
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            Los simuladores y videos te ayudan a visualizar como cambian las
            variables, como se comportan los sistemas fisicos y que relacion
            tienen con las formulas del curso.
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#d7f4b4]">
            Aprender Fisica es mas facil cuando puedes ver lo que esta ocurriendo.
          </p>

          <div className="mt-14 grid border-y border-white/12 lg:grid-cols-3">
            {interactiveAccesses.map(({ title, description, href, icon: Icon, accent }, index) => (
              <div
                key={title}
                className={`px-0 py-8 ${index < interactiveAccesses.length - 1 ? "border-b border-white/12 lg:border-b-0 lg:border-r" : ""} lg:border-white/12 lg:px-8`}
              >
                <Icon className={`h-7 w-7 ${accent}`} />
                <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {description}
                </p>
                <Link
                  href={href}
                  className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${accent}`}
                >
                  Abrir seccion
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eef2e5]">
        <div className="section-shell py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div>
              <p className="eyebrow">Biblioteca Academica</p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Materiales para estudiar dentro y fuera del aula
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
                Accede a documentos, libros y cartillas que complementan las
                clases, los talleres, las practicas y la preparacion para evaluaciones.
              </p>
              <p className="mt-6 text-sm leading-7 text-[#435334]">
                Todo el material esta organizado para que puedas volver a consultarlo
                cuando lo necesites.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {libraryAccesses.map(({ title, href, icon: Icon }, index) => (
                <Link
                  key={title}
                  href={href}
                  className="group border-t border-[#183909]/14 pt-6 transition hover:border-primary"
                >
                  <div
                    className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full ${
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : index === 1
                          ? "bg-[#f5982f] text-[#241809]"
                          : "bg-[#e6007e] text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-semibold">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    Consultar recursos de apoyo organizados para acompanar tu estudio.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Entrar
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f9faf5]">
        <div className="section-shell py-20 md:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Autores Y Equipo Academico</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Contenido acompanado por criterio academico
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Conoce los perfiles de quienes participan en la construccion de
                los recursos y materiales que apoyan tu proceso de aprendizaje.
              </p>
            </div>

            <Link
              href="/autores"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#e6007e]"
            >
              Ver autores
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {authors.map((author) => (
              <article key={author.id}>
                <div className="overflow-hidden rounded-[1.75rem] bg-[#e8eed9]">
                  <img
                    src={author.avatarUrl || "/authors/default.png"}
                    alt={author.name}
                    className="h-[320px] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5">
                  <p className="text-xl font-semibold">{author.name}</p>
                  <p className="mt-1 text-sm font-medium text-primary">{author.profession}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{author.bio}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 border-t border-[#183909]/12 pt-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow">Continua Tu Recorrido</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                  Empieza a explorar la Fisica de otra manera
                </h2>
                <p className="mt-5 text-base leading-8 text-muted-foreground">
                  Elige una seccion y continua tu recorrido con simulaciones,
                  videos o materiales de apoyo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/simuladores"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-[0_18px_42px_rgba(127,181,54,0.22)]"
                >
                  Ir a simuladores
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/documentos"
                  className="inline-flex items-center gap-2 rounded-full border border-[#f5982f]/25 bg-[#fff3e2] px-7 py-4 text-sm font-medium text-[#5d3a0d]"
                >
                  Ver biblioteca
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
