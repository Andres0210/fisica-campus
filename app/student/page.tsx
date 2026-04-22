import Navbar from "@/components/Navbar";
import CourseCard from "@/components/student/CourseCard";
import ResourceList from "@/components/student/ResourceList";
import TopicTimeline from "@/components/student/TopicTimeline";
import { getStudentDashboardData } from "@/lib/student-dashboard-service";
import { Atom, BookOpen, PlayCircle, Sparkles, Waves } from "lucide-react";

export default async function StudentPage() {
  const { courses, topics, resources, simulations, source } = await getStudentDashboardData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="glass-panel h-fit rounded-[2rem] p-5 xl:sticky xl:top-28">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Atom className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">Campus del estudiante</p>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Vista academica
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                `Cursos activos: ${courses.length}`,
                `Temas visibles: ${topics.length}`,
                `Recursos publicados: ${resources.length}`,
                `Simulaciones: ${simulations.length}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-primary/20 bg-primary/8 p-4 text-sm leading-6 text-muted-foreground">
              Fuente actual de datos: {source === "database" ? "PostgreSQL real" : "seed de respaldo"}.
            </div>
          </aside>

          <div className="space-y-6">
            <section className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_320px]">
                <div>
                  <p className="eyebrow">Experiencia Del Estudiante</p>
                  <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                    Todo el curso organizado por temas, recursos y simulaciones.
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                    Esta vista ya representa el consumo real del contenido: el estudiante entra al
                    curso, revisa los temas, consulta videos y PDFs publicados y encuentra sus laboratorios
                    virtuales en una sola ruta.
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {[
                      "La informacion importante aparece agrupada por curso, tema y tipo de recurso.",
                      "La experiencia esta pensada para estudiar desde laptop sin instalar nada extra.",
                      "Las simulaciones y los materiales quedan en una misma ruta academica.",
                      "El estudiante puede entrar por asignatura y no por listado desordenado de archivos.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.35rem] border border-border/70 bg-background/65 px-4 py-4 text-sm leading-6 text-muted-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-3xl font-semibold">{courses.length}</p>
                      <p className="mt-2 text-sm text-muted-foreground">Cursos disponibles</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-3xl font-semibold">
                        {resources.filter((resource) => resource.type === "VIDEO").length}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">Videos publicados</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
                      <Waves className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-3xl font-semibold">{simulations.length}</p>
                      <p className="mt-2 text-sm text-muted-foreground">Simulaciones disponibles</p>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-[1.75rem] border border-border/70 bg-slate-950 p-5 text-slate-100">
                  <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/80">
                      Mapa Del Curso
                    </p>
                    <Sparkles className="h-4 w-4 text-cyan-200" />
                  </div>

                  <div className="mt-5 space-y-4">
                    {topics.slice(0, 4).map((topic, index) => (
                      <div key={topic.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Unidad {index + 1}</p>
                        <p className="mt-2 font-medium">{topic.title}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          {topic.videoCount} videos · {topic.pdfCount} PDFs
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </section>

            <TopicTimeline topics={topics} />
            <ResourceList resources={resources} />
          </div>
        </div>
      </section>
    </main>
  );
}
