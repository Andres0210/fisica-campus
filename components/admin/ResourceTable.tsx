import { DashboardResource } from "@/lib/campus-data";
import { FileText, Video } from "lucide-react";

type ResourceTableProps = {
  resources: DashboardResource[];
};

const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  DRAFT: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  ARCHIVED: "bg-slate-400/10 text-slate-300 border-slate-400/20",
};

export default function ResourceTable({ resources }: ResourceTableProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Repositorio Academico</p>
          <h2 className="mt-2 text-2xl font-semibold">Videos y PDFs registrados</h2>
        </div>
        <div className="rounded-full border border-border/70 px-4 py-2 text-xs text-muted-foreground">
          {resources.length} recursos
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-4">Recurso</th>
              <th className="px-4">Curso</th>
              <th className="px-4">Tema</th>
              <th className="px-4">Estado</th>
              <th className="px-4">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => {
              const Icon = resource.type === "VIDEO" ? Video : FileText;

              return (
                <tr key={resource.id} className="bg-background/65">
                  <td className="rounded-l-2xl border-y border-l border-border/70 px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-2xl bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-y border-border/70 px-4 py-4 text-sm text-muted-foreground">
                    {resource.courseTitle}
                  </td>
                  <td className="border-y border-border/70 px-4 py-4 text-sm text-muted-foreground">
                    {resource.topicTitle}
                  </td>
                  <td className="border-y border-border/70 px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusStyles[resource.status]}`}
                    >
                      {resource.status}
                    </span>
                  </td>
                  <td className="rounded-r-2xl border-y border-r border-border/70 px-4 py-4 text-sm text-muted-foreground">
                    {resource.type === "VIDEO"
                      ? `${resource.durationMinutes ?? "-"} min`
                      : `${resource.fileSizeMb ?? "-"} MB`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
