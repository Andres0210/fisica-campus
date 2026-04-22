import { StudentResourceCard } from "@/lib/student-dashboard-service";
import { FileText, PlayCircle } from "lucide-react";

type ResourceListProps = {
  resources: StudentResourceCard[];
};

export default function ResourceList({ resources }: ResourceListProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Recursos Publicados</p>
          <h2 className="mt-2 text-2xl font-semibold">Videos y documentos disponibles</h2>
        </div>
        <div className="rounded-full border border-border/70 px-4 py-2 text-xs text-muted-foreground">
          {resources.length} disponibles
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {resources.map((resource) => {
          const Icon = resource.type === "VIDEO" ? PlayCircle : FileText;

          return (
            <article
              key={resource.id}
              className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{resource.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {resource.courseTitle} / {resource.topicTitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:max-w-64 md:justify-end">
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
