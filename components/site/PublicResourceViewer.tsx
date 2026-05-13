import Navbar from "@/components/Navbar";
import TeacherResourceActions from "@/components/site/TeacherResourceActions";
import { PublicResourceRecord, ResourceCollectionKind, resourceCategoryLabels } from "@/lib/education-service";
import { ArrowLeft, ExternalLink, FileText, PlayCircle } from "lucide-react";
import Link from "next/link";

type PublicResourceViewerProps = {
  kind: ResourceCollectionKind;
  resource: PublicResourceRecord;
  teacherMode?: boolean;
};

const kindLabels: Record<ResourceCollectionKind, string> = {
  videos: "Videos",
  documentos: "Documentos",
  libros: "Libros",
  cartillas: "Cartillas",
};

export default function PublicResourceViewer({
  kind,
  resource,
  teacherMode = false,
}: PublicResourceViewerProps) {
  const backHref = `/${kind}/${resource.subjectSlug}`;
  const isVideo = resource.type === "VIDEO";
  const ResourceIcon = isVideo ? PlayCircle : FileText;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(127,181,54,0.18),transparent_34%),linear-gradient(180deg,#f8fbf3_0%,#ffffff_42%,#f7f8f4_100%)] text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link href={`/${kind}`} className="transition hover:text-foreground">
            {kindLabels[kind]}
          </Link>
          <span>/</span>
          <Link href={backHref} className="transition hover:text-foreground">
            {resource.subjectLabel}
          </Link>
          <span>/</span>
          <span className="text-foreground">{resource.title}</span>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_rgba(25,39,17,0.12)] backdrop-blur md:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_360px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <ResourceIcon className="h-4 w-4" />
                {resource.subjectLabel} · {resource.topicTitle}
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                {resource.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                {resource.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={resource.storageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_35px_rgba(127,181,54,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(127,181,54,0.32)]"
                >
                  Abrir archivo original
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a {resource.subjectLabel}
                </Link>
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-border/70 bg-[#f9fbf4]/90 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Resumen</p>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-2xl border border-border/70 bg-white/80 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tipo</p>
                  <p className="mt-2 font-medium">{isVideo ? "Video" : "PDF"}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-white/80 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Categoria</p>
                  <p className="mt-2 font-medium">{resourceCategoryLabels[resource.category]}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-white/80 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Asignatura</p>
                  <p className="mt-2 font-medium">{resource.courseTitle}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-white/80 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tema</p>
                  <p className="mt-2 font-medium">{resource.topicTitle}</p>
                </div>
                {isVideo ? (
                  <div className="rounded-2xl border border-border/70 bg-white/80 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Duracion</p>
                    <p className="mt-2 font-medium">{resource.durationMinutes ?? "-"} min</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/70 bg-white/80 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tamano</p>
                    <p className="mt-2 font-medium">{resource.fileSizeMb ?? "-"} MB</p>
                  </div>
                )}
              </div>

              {teacherMode ? <TeacherResourceActions resourceId={resource.id} /> : null}
            </aside>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-[0_24px_80px_rgba(25,39,17,0.10)] backdrop-blur md:p-6">
          {isVideo ? (
            <video
              controls
              preload="metadata"
              className="aspect-video w-full rounded-[1.5rem] bg-black"
              src={resource.storageUrl}
            >
              Tu navegador no soporta reproduccion de video embebida.
            </video>
          ) : (
            <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-white">
              <iframe
                src={resource.storageUrl}
                title={resource.title}
                loading="lazy"
                className="h-[78vh] w-full"
              />
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
