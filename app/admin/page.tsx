import ResourceForm from "@/components/admin/ResourceForm";
import ResourceTable from "@/components/admin/ResourceTable";
import { getAdminResourceDashboard } from "@/lib/admin-resource-service";
import Navbar from "@/components/Navbar";
import { BookOpen, FileStack, FolderKanban, Video } from "lucide-react";

export default async function AdminPage() {
  const { courses, topics, resources, source } = await getAdminResourceDashboard();

  const publishedResources = resources.filter((resource) => resource.status === "PUBLISHED");
  const draftResources = resources.filter((resource) => resource.status === "DRAFT");
  const videoCount = resources.filter((resource) => resource.type === "VIDEO").length;
  const pdfCount = resources.filter((resource) => resource.type === "PDF").length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <section className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_320px]">
            <div>
              <p className="eyebrow">Panel De Gestion</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Administracion academica para la profesora
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                Esta vista ya se siente como un centro de control real: cursos, temas, recursos publicados,
                borradores y un formulario base para mantener el contenido del campus sin salir del sistema.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {[
                  "Gestion centralizada de videos, PDFs y contenidos por tema.",
                  "PostgreSQL y Prisma ya conectados para crecimiento real del producto.",
                  "La profesora podra publicar y revisar estado del material desde un solo lugar.",
                  "La estructura queda lista para enlazar autores, cartillas y simuladores despues.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.4rem] border border-border/70 bg-background/65 px-4 py-4 text-sm leading-6 text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border/70 bg-slate-950 p-5 text-slate-100">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/80">
                Estado Administrativo
              </p>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                  Persistencia: PostgreSQL + Prisma
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                  Fuente actual: {source === "database" ? "Base real" : "Fallback seed"}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                  Proximo paso: escritura real y subida de archivos
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            {
              icon: FolderKanban,
              label: "Cursos",
              value: courses.length,
            },
            {
              icon: BookOpen,
              label: "Temas",
              value: topics.length,
            },
            {
              icon: Video,
              label: "Videos",
              value: videoCount,
            },
            {
              icon: FileStack,
              label: "PDFs",
              value: pdfCount,
            },
          ].map(({ icon: Icon, label, value }) => (
            <article key={label} className="glass-panel rounded-[1.6rem] p-5">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-3xl font-semibold">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <ResourceTable resources={resources} />

          <div className="space-y-6">
            <ResourceForm courses={courses} topics={topics} />

            <section id="arquitectura-datos" className="glass-panel rounded-[2rem] p-6">
              <p className="eyebrow">Publicacion</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Publicados</p>
                  <p className="mt-2 text-3xl font-semibold">{publishedResources.length}</p>
                </div>
                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Borradores</p>
                  <p className="mt-2 text-3xl font-semibold">{draftResources.length}</p>
                </div>
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-primary/20 bg-primary/8 p-4 text-sm leading-6 text-muted-foreground">
                Fuente actual: {source === "database" ? "PostgreSQL con Prisma" : "datos seed/fallback"}.
                El siguiente paso es conectar carga de archivos a S3 o Cloudinary y convertir el formulario en escritura real.
              </div>
              <div className="mt-4 rounded-[1.5rem] border border-border/70 bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
                Vista pensada para la profesora: menos texto tecnico expuesto, mas foco en estado de materiales,
                organizacion por tema y flujo editorial del contenido.
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
