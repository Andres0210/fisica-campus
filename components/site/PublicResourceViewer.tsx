import Navbar from "@/components/Navbar";
import TeacherResourceActions from "@/components/site/TeacherResourceActions";
import { PublicResourceRecord, ResourceCollectionKind, resourceCategoryLabels } from "@/lib/education-service";
import { getPublicResourceHref } from "@/lib/public-resource-routes";
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

  return (
    <main className="min-h-screen bg-background text-foreground">
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

        <section className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_360px]">
            <div>
              <p className="eyebrow">
                {resource.subjectLabel} · {resource.topicTitle}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                {resource.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                {resource.description}
              </p>
            </div>

            <aside className="rounded-[1.75rem] border border-border/70 bg-background/75 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Resumen</p>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-2xl border border-border/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tipo</p>
                  <p className="mt-2 font-medium">{resource.type === "VIDEO" ? "Video" : "PDF"}</p>
                </div>
                <div className="rounded-2xl border border-border/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Categoria</p>
                  <p className="mt-2 font-medium">{resourceCategoryLabels[resource.category]}</p>
                </div>
                <div className="rounded-2xl border border-border/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Asignatura</p>
                  <p className="mt-2 font-medium">{resource.courseTitle}</p>
                </div>
                <div className="rounded-2xl border border-border/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tema</p>
                  <p className="mt-2 font-medium">{resource.topicTitle}</p>
                </div>
                {resource.type === "VIDEO" ? (
                  <div className="rounded-2xl border border-border/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Duracion</p>
                    <p className="mt-2 font-medium">{resource.durationMinutes ?? "-"} min</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tamano</p>
                    <p className="mt-2 font-medium">{resource.fileSizeMb ?? "-"} MB</p>
                  </div>
                )}
              </div>

              <a
                href={resource.storageUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                Abrir archivo original
              </a>

              {teacherMode ? <TeacherResourceActions resourceId={resource.id} /> : null}
            </aside>
          </div>
        </section>

        <section className="mt-8 glass-panel rounded-[2rem] p-4 md:p-6">
          {resource.type === "VIDEO" ? (
            <video
              controls
              preload="metadata"
              className="w-full rounded-[1.5rem] bg-black"
              src={resource.storageUrl}
            >
              Tu navegador no soporta reproduccion de video embebida.
            </video>
          ) : (
            <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-white">
              <iframe
                src={resource.storageUrl}
                title={resource.title}
                className="h-[78vh] w-full"
              />
            </div>
          )}
        </section>

        <div className="mt-6">
          <Link
            href={backHref}
            className="inline-flex rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            Volver a {resource.subjectLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
