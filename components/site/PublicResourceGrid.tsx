import { PublicResourceRecord, ResourceCollectionKind, resourceCategoryLabels } from "@/lib/education-service";
import { getPublicResourceHref } from "@/lib/public-resource-routes";
import { BookMarked, FileText, PlayCircle } from "lucide-react";
import Link from "next/link";
import TeacherResourceActions from "./TeacherResourceActions";

type PublicResourceGridProps = {
  items: PublicResourceRecord[];
  kind: ResourceCollectionKind;
  teacherMode?: boolean;
};

export default function PublicResourceGrid({ items, kind, teacherMode = false }: PublicResourceGridProps) {
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
          <article key={item.id} className="glass-panel rounded-[1.85rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                {resourceCategoryLabels[item.category]}
              </div>
            </div>

            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
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
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {item.type === "VIDEO" ? "Ver video" : "Leer en plataforma"}
            </Link>

            {teacherMode ? <TeacherResourceActions resourceId={item.id} /> : null}
          </article>
        );
      })}
    </section>
  );
}
