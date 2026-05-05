import Navbar from "@/components/Navbar";
import PublicResourceGrid from "@/components/site/PublicResourceGrid";
import SubjectLinks from "@/components/site/SubjectLinks";
import { subjects } from "@/lib/academic-content";
import { getTeacherSession } from "@/lib/auth";
import { getPublicResourceCatalog } from "@/lib/education-service";
import { PlayCircle } from "lucide-react";

export default async function VideosPage() {
  const [catalog, teacherSession] = await Promise.all([
    getPublicResourceCatalog("videos"),
    getTeacherSession(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <section className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_320px]">
            <div>
              <p className="eyebrow">Reels De Fisica</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Videos cortos y clases breves organizadas por asignatura y tema.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                Aqui los estudiantes encuentran los videos publicados por la profesora sin mezclar borradores ni
                archivos internos. Si la profesora inicia sesion, cada tarjeta tambien muestra acciones de edicion.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-border/70 bg-slate-950 p-5 text-slate-100">
              <PlayCircle className="h-5 w-5 text-cyan-200" />
              <p className="mt-4 text-2xl font-semibold">{catalog.items.length}</p>
              <p className="mt-2 text-sm text-slate-400">Videos visibles para estudiantes</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                Fuente: {catalog.source === "database" ? "PostgreSQL real" : "fallback seed"}
              </div>
              {teacherSession ? (
                <div className="mt-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary-foreground">
                  Sesion docente activa: ya puedes editar u ocultar desde esta misma vista.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-8">
          <PublicResourceGrid items={catalog.items} kind="videos" teacherMode={Boolean(teacherSession)} />
        </div>

        <section className="mt-10">
          <SubjectLinks subjects={subjects} basePath="/videos" title="Ver por asignatura" />
        </section>
      </section>
    </main>
  );
}
