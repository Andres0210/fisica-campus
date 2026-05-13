import { requireTeacherSession } from "@/lib/auth";
import { getAdminEducationDashboard } from "@/lib/education-service";
import { getAdminUsers } from "@/lib/user-service";
import {
  BookOpen,
  FileStack,
  FolderKanban,
  Plus,
  UserCog,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await requireTeacherSession();

  const [{ courses, topics, resources, authors }, users] = await Promise.all([
    getAdminEducationDashboard(),
    getAdminUsers().catch(() => []),
  ]);

  const videoCount = resources.filter((resource) => resource.type === "VIDEO").length;
  const pdfCount = resources.filter((resource) => resource.type === "PDF").length;
  const publishedCount = resources.filter((resource) => resource.status === "PUBLISHED").length;
  const recentResources = resources.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#10170d] p-6 text-white shadow-[0_28px_90px_rgba(16,23,13,0.18)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(127,181,54,0.36),transparent_28%),radial-gradient(circle_at_88%_80%,rgba(230,0,126,0.16),transparent_26%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[#d7f4b4]">
              Centro de control
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
              Gestion academica lista para publicar contenido.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Administra materias, temas, recursos, autores y usuarios desde un panel pensado para personas no tecnicas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/resources"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Nuevo recurso
            </Link>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-xl"
            >
              Crear materia
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Stat label="Materias" value={courses.length} icon={FolderKanban} href="/admin/courses" />
        <Stat label="Temas" value={topics.length} icon={BookOpen} href="/admin/topics" />
        <Stat label="Videos" value={videoCount} icon={Video} href="/admin/resources" />
        <Stat label="PDFs" value={pdfCount} icon={FileStack} href="/admin/resources" />
        <Stat label="Autores" value={authors.length} icon={Users} href="/admin/authors" />
        <Stat label="Usuarios" value={users.length} icon={UserCog} href="/admin/users" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Actividad reciente</p>
              <h2 className="mt-2 text-2xl font-semibold">Ultimos recursos</h2>
            </div>
            <Link href="/admin/resources" className="rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground">
              Ver todos
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            {recentResources.map((resource) => (
              <article key={resource.id} className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{resource.courseTitle} · {resource.topicTitle}</p>
                  </div>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    {resource.status}
                  </span>
                </div>
              </article>
            ))}

            {!recentResources.length ? (
              <p className="rounded-[1.25rem] border border-dashed border-border/70 p-5 text-sm text-muted-foreground">
                Aun no hay recursos creados. Empieza creando una materia, un tema y luego un recurso.
              </p>
            ) : null}
          </div>
        </div>

        <aside className="glass-panel rounded-[2rem] p-6">
          <p className="eyebrow">Publicacion</p>
          <h2 className="mt-2 text-2xl font-semibold">{publishedCount} recursos visibles</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Los estudiantes solo ven recursos publicados. Puedes preparar contenido en borrador y publicarlo cuando este listo.
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            <Link href="/admin/courses" className="rounded-2xl border border-border/70 px-4 py-3 text-muted-foreground hover:text-foreground">
              Revisar materias visibles
            </Link>
            <Link href="/admin/resources" className="rounded-2xl border border-border/70 px-4 py-3 text-muted-foreground hover:text-foreground">
              Publicar u ocultar recursos
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Stat({ label, value, icon: Icon, href }: any) {
  return (
    <Link
      href={href}
      className="glass-panel rounded-[1.5rem] p-4 transition hover:-translate-y-0.5 hover:bg-card"
    >
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </Link>
  );
}
