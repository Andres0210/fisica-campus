import { deleteResourceAction, updateResourceStatusAction } from "@/app/admin/actions";
import {
  AdminResourceRecord,
  resourceCategoryLabels,
} from "@/lib/education-service";
import { FileText, PencilLine, Video } from "lucide-react";

type ResourceTableProps = {
  resources: AdminResourceRecord[];
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
          <p className="eyebrow">Recursos Registrados</p>
          <h2 className="mt-2 text-2xl font-semibold">Inventario editable del campus</h2>
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
              <th className="px-4">Clasificacion</th>
              <th className="px-4">Curso y tema</th>
              <th className="px-4">Estado</th>
              <th className="px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => {
              const Icon = resource.type === "VIDEO" ? Video : FileText;

              return (
                <tr key={resource.id} className="bg-background/65">
                  <td className="rounded-l-2xl border-y border-l border-border/70 px-4 py-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-2xl bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
                        <a
                          href={resource.storageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex text-xs uppercase tracking-[0.18em] text-primary"
                        >
                          Ver recurso
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="border-y border-border/70 px-4 py-4 align-top text-sm text-muted-foreground">
                    <p>{resource.type}</p>
                    <p className="mt-2 font-medium text-foreground">{resourceCategoryLabels[resource.category]}</p>
                    <p className="mt-2 text-xs">
                      {resource.type === "VIDEO"
                        ? `${resource.durationMinutes ?? "-"} min`
                        : `${resource.fileSizeMb ?? "-"} MB`}
                    </p>
                  </td>
                  <td className="border-y border-border/70 px-4 py-4 align-top text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{resource.courseTitle}</p>
                    <p className="mt-1">{resource.topicTitle}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em]">
                      {resource.publishedAt ? `Publicado ${resource.publishedAt}` : "Sin publicar"}
                    </p>
                  </td>
                  <td className="border-y border-border/70 px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusStyles[resource.status]}`}
                    >
                      {resource.status}
                    </span>
                  </td>
                  <td className="rounded-r-2xl border-y border-r border-border/70 px-4 py-4 align-top">
                    <div className="flex min-w-48 flex-col gap-2">
                      <a
                        href={`/admin/resources?resource=${resource.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground"
                      >
                        <PencilLine className="h-3.5 w-3.5" />
                        Editar
                      </a>

                      <form action={updateResourceStatusAction}>
                        <input type="hidden" name="resourceId" value={resource.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={resource.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"}
                        />
                        <button
                          type="submit"
                          className="w-full rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground"
                        >
                          {resource.status === "PUBLISHED" ? "Ocultar recurso" : "Publicar recurso"}
                        </button>
                      </form>

                      <form action={deleteResourceAction}>
                        <input type="hidden" name="resourceId" value={resource.id} />
                        <button
                          type="submit"
                          className="w-full rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
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
