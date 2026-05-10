import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  CalendarDays,
  CircuitBoard,
  Clock,
  FlaskConical,
  Lightbulb,
  MapPin,
  PlayCircle,
  Sparkles,
  UsersRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Feria de Ciencias Basicas e Ingenieria | Areandina",
  description:
    "Landing promocional de la Feria de Ciencias Basicas e Ingenieria de Areandina.",
};

const eventFacts = [
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

const steamItems = [
  "Ciencia",
  "Tecnologia",
  "Ingenieria",
  "Arte",
  "Matematicas",
];

const experiences = [
  {
    title: "Proyectos que se pueden tocar",
    description:
      "Modelos, prototipos y demostraciones creadas para explicar ideas con evidencia, pruebas y creatividad.",
    icon: CircuitBoard,
  },
  {
    title: "Experimentos en movimiento",
    description:
      "Fenomenos de fisica, medicion, energia y materiales vistos de cerca, con explicaciones claras para estudiantes.",
    icon: FlaskConical,
  },
  {
    title: "Conversaciones con futuro",
    description:
      "Un espacio para preguntar, observar y conectar lo aprendido en clase con soluciones reales de ingenieria.",
    icon: UsersRound,
  },
];

const routeMoments = [
  "Recorre los stands y descubre como nacen las ideas.",
  "Observa prototipos, montajes y experiencias de laboratorio.",
  "Conversa con estudiantes que convierten teoria en practica.",
  "Vive una tarde academica pensada para inspirar nuevos proyectos.",
];

export default function FeriaPage() {
  return (
    <main className="bg-[#f7f8f1] text-[#14200f]">
      <section className="relative min-h-screen overflow-hidden bg-[#10170d] text-white">
        <Image
          src="/fair/feria-hero.png"
          alt="Feria universitaria de ciencias basicas e ingenieria con prototipos y demostraciones"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,12,6,0.96)_0%,rgba(13,22,10,0.82)_42%,rgba(13,22,10,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(127,181,54,0.34),transparent_24%),radial-gradient(circle_at_72%_76%,rgba(230,0,126,0.18),transparent_26%),radial-gradient(circle_at_48%_92%,rgba(245,152,47,0.22),transparent_30%)]" />

        <div className="section-shell relative flex min-h-screen items-end pb-14 pt-24 md:pb-20">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-[#d7f4b4] backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              Feria de Ciencias Basicas e Ingenieria
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-tight md:text-7xl lg:text-8xl">
              Donde las ideas se vuelven realidad
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-200 md:text-xl">
              Ven y descubre el futuro en una experiencia universitaria con
              proyectos, prototipos, ciencia aplicada e ingenieria hecha por la
              comunidad Areandina.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {eventFacts.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-[1.35rem] border border-white/14 bg-white/10 px-5 py-4 backdrop-blur-xl"
                >
                  <Icon className="h-5 w-5 text-[#f5982f]" />
                  <p className="mt-4 text-xs uppercase tracking-[0.26em] text-slate-300">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#detalles"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_22px_48px_rgba(127,181,54,0.28)] transition hover:-translate-y-0.5"
              >
                Ver detalles
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#video"
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/18"
              >
                Ver video
                <PlayCircle className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="detalles" className="bg-[#fbfbf7]">
        <div className="section-shell py-20 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <p className="eyebrow">14 de mayo | 2:00 p. m. a 5:00 p. m.</p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Una tarde para mirar la ciencia desde cerca
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                La feria abre un espacio para recorrer ideas, experimentos y
                propuestas de ingenieria en la Universidad Areandina, pasillos
                1, 2 y 3. Es una
                invitacion a observar, preguntar y descubrir como el conocimiento
                se transforma en experiencias reales.
              </p>

              <div className="mt-9 border-l-4 border-[#f5982f] pl-6">
                <p className="text-2xl font-semibold leading-snug text-[#213018] md:text-3xl">
                  "Aqui es donde las ideas se vuelven realidad."
                </p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Una invitacion para estudiantes, docentes y visitantes que
                  quieren vivir la ciencia con curiosidad y energia.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#183909]/10 bg-[#e8eed9] shadow-[0_30px_90px_rgba(47,62,18,0.13)]">
              <Image
                src="/fair/feria-prototype-showcase.png"
                alt="Estudiantes universitarios presentando un prototipo de ciencias e ingenieria"
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="aspect-[5/4] w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(0deg,rgba(16,23,13,0.92),transparent)] p-6 text-white">
                <p className="max-w-md text-sm leading-7 text-slate-200">
                  Prototipos, demostraciones y conversaciones para conectar lo
                  aprendido con nuevas posibilidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#10170d] text-white">
        <div className="section-shell py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-[#d7f4b4]">
                Enfoque STEAM
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl">
                Ciencia, creatividad e ingenieria en el mismo recorrido
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              La feria une conocimiento, pensamiento tecnico y expresion visual
              para que cada proyecto pueda entenderse, explicarse y compartirse
              con claridad.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 border-y border-white/12 sm:grid-cols-3 lg:grid-cols-5">
            {steamItems.map((item, index) => (
              <div
                key={item}
                className={`px-0 py-7 ${
                  index < steamItems.length - 1
                    ? "border-b border-white/12 sm:border-r lg:border-b-0"
                    : ""
                } sm:px-6`}
              >
                <p className="text-4xl font-semibold text-[#7fb536] md:text-5xl">
                  {item.charAt(0)}
                </p>
                <p className="mt-3 text-sm font-medium uppercase tracking-[0.22em] text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="video" className="bg-[#eef2e5]">
        <div className="section-shell py-20 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[420px_minmax(0,1fr)]">
            <div className="mx-auto w-full max-w-[360px] rounded-[2rem] border border-[#183909]/12 bg-[#10170d] p-3 shadow-[0_30px_90px_rgba(47,62,18,0.18)]">
              <video
                className="aspect-[9/16] w-full rounded-[1.45rem] object-cover"
                src="/fair/feria-andina.mp4"
                poster="/fair/feria-campus-atmosphere.png"
                controls
                playsInline
                preload="metadata"
              />
            </div>

            <div>
              <p className="eyebrow">Invitacion Oficial</p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                "Ven y descubre el futuro"
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                El video invita a vivir una feria donde las ideas toman forma:
                proyectos, ciencia, ingenieria y una comunidad reunida para
                mostrar lo que sabe crear.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {eventFacts.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="border-t border-[#183909]/14 pt-5">
                    <Icon className="h-5 w-5 text-[#e6007e]" />
                    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#213018]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#11180d] text-white">
        <Image
          src="/fair/feria-campus-atmosphere.png"
          alt="Pasillo universitario con stands de feria cientifica e ingenieria"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.32]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,23,13,0.98)_0%,rgba(16,23,13,0.88)_52%,rgba(16,23,13,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(127,181,54,0.22),transparent_24%),radial-gradient(circle_at_88%_78%,rgba(245,152,47,0.18),transparent_25%)]" />

        <div className="section-shell relative py-20 md:py-24">
          <div className="max-w-4xl">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-[#ffd39d]">
              Que encontraras
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Un recorrido para mirar, preguntar y sorprenderse
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Cada stand es una oportunidad para descubrir procesos, resolver
              dudas y ver como la ciencia se conecta con la vida universitaria.
            </p>
          </div>

          <div className="mt-14 grid gap-7 lg:grid-cols-3">
            {experiences.map(({ title, description, icon: Icon }) => (
              <article key={title} className="border-t border-white/14 pt-7">
                <Icon className="h-7 w-7 text-[#d7f4b4]" />
                <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-4 border-y border-white/12 py-8 md:grid-cols-2">
            {routeMoments.map((moment) => (
              <div key={moment} className="flex items-start gap-4">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#f5982f]" />
                <p className="text-base leading-7 text-slate-200">{moment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfbf7]">
        <div className="section-shell py-16 md:py-20">
          <div className="grid gap-10 rounded-[2rem] border border-[#183909]/10 bg-[#10170d] p-7 text-white shadow-[0_30px_90px_rgba(47,62,18,0.12)] md:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e6007e] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                <Atom className="h-4 w-4" />
                No te lo pierdas
              </div>
              <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Feria de Ciencias Basicas e Ingenieria Areandina
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Este 14 de mayo, de 2:00 p. m. a 5:00 p. m., la Universidad
                Areandina, pasillos 1, 2 y 3, se convierte en un espacio para
                descubrir proyectos, aprender con otros y celebrar el talento
                academico.
              </p>
            </div>

            <Link
              href="#detalles"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5982f] px-7 py-4 text-sm font-semibold text-[#211606] transition hover:-translate-y-0.5"
            >
              Revisar datos del evento
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
