import { PublicResourceRecord, ResourceCollectionKind, resourceCategoryLabels } from "@/lib/education-service";
import { getPublicResourceHref } from "@/lib/public-resource-routes";
import { BookMarked, FileText, FolderOpen, PlayCircle } from "lucide-react";
import Link from "next/link";
import TeacherResourceActions from "./TeacherResourceActions";

type PublicResourceGridProps = {
  items: PublicResourceRecord[];
  kind: ResourceCollectionKind;
  teacherMode?: boolean;
};

export default function PublicResourceGrid({ items, kind, teacherMode = false }: PublicResourceGridProps) {
  if (!items.length) {
    return (
      <section className="rounded-[2rem] border border-dashed border-border/80 bg-background/65 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FolderOpen className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold">Aun no hay recursos publicados</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Cuando la docente publique contenido para esta seccion, aparecera aqui organizado por asignatura y tema.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon =
          item.type === "VIDEO"
            ? PlayCircle
            : item.category === "BOOK"
              ? BookMarked
              : FileText;

        return (
          <article key={item.id} className="group glass-panel overflow-hidden rounded-[1.85rem]">
            <div className="relative h-28 overflow-hidden bg-[#10170d]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(127,181,54,0.38),transparent_32%),radial-gradient(circle_at_76%_72%,rgba(230,0,126,0.18),transparent_34%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)] opacity-45" />
              <div className="absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-white backdrop-blur-xl">
                <Icon className="h-6 w-6" />
              </div>
              <div className="absolute right-5 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-xl">
                {resourceCategoryLabels[item.category]}
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {item.subjectLabel} · {item.topicTitle}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border/70 px-3 py-1">{item.courseTitle}</span>
                <span className="rounded-full border border-border/70 px-3 py-1">
                  {item.type === "VIDEO"
                    ? `${item.durationMinutes ?? "-"} min`
                    : `${item.fileSizeMb ?? "-"} MB`}
                </span>
                {item.publishedAt ? (
                  <span className="rounded-full border border-border/70 px-3 py-1">{item.publishedAt}</span>
                ) : null}
              </div>

              <Link
                href={getPublicResourceHref(kind, item)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition group-hover:-translate-y-0.5"
              >
                {item.type === "VIDEO" ? "Ver video" : "Leer en plataforma"}
              </Link>

              {teacherMode ? <TeacherResourceActions resourceId={item.id} /> : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}
