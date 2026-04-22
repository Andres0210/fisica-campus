import Navbar from "@/components/Navbar";
import { getStudentCourseDetail } from "@/lib/student-dashboard-service";
import { notFound } from "next/navigation";
import { FileText, PlayCircle, Sparkles, Waves } from "lucide-react";

type CourseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const data = await getStudentCourseDetail(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <section className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_320px]">
            <div>
              <p className="eyebrow">Detalle Del Curso</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                {data.course.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                {data.course.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground">
                  Nivel: {data.course.level}
                </span>
                <span className="rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground">
                  Fuente: {data.source === "database" ? "PostgreSQL" : "seed"}
                </span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border/70 bg-slate-950 p-5 text-slate-100">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/80">
                  Progreso De Navegacion
                </p>
                <Sparkles className="h-4 w-4 text-cyan-200" />
              </div>
              <div className="mt-6 space-y-4">
                {data.topics.map((topic, index) => (
                  <div key={topic.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Tema {index + 1}</p>
                    <p className="mt-2 font-medium">{topic.title}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {topic.resources.length} recursos · {topic.simulations.length} simulaciones
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6">
          {data.topics.map((topic) => (
            <article key={topic.id} className="glass-panel rounded-[2rem] p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="eyebrow">Tema {topic.position}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{topic.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{topic.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    {topic.resources.filter((resource) => resource.type === "VIDEO").length} videos
                  </span>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    {topic.resources.filter((resource) => resource.type === "PDF").length} PDFs
                  </span>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    {topic.simulations.length} simulaciones
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
                <div className="space-y-4">
                  {topic.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                          {resource.type === "VIDEO" ? (
                            <PlayCircle className="h-5 w-5" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{resource.title}</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {resource.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                              {resource.type}
                            </span>
                            <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                              {resource.type === "VIDEO"
                                ? `${resource.durationMinutes ?? "-"} min`
                                : `${resource.fileSizeMb ?? "-"} MB`}
                            </span>
                            {resource.publishedAt && (
                              <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                                {resource.publishedAt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {topic.simulations.length > 0 ? (
                    topic.simulations.map((simulation) => (
                      <div
                        key={simulation.id}
                        className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
                            <Waves className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{simulation.title}</p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {simulation.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
                      Este tema todavia no tiene simulaciones publicadas, pero la estructura ya esta lista
                      para agregarlas despues.
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
