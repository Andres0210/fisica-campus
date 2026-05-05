import { deleteTopicAction, saveTopicAction } from "@/app/admin/actions";
import { AdminCourseRecord, AdminTopicRecord } from "@/lib/education-service";
import { Network } from "lucide-react";

type TopicManagerProps = {
  courses: AdminCourseRecord[];
  topics: AdminTopicRecord[];
  editingTopic?: AdminTopicRecord | null;
};

export default function TopicManager({ courses, topics, editingTopic }: TopicManagerProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Temas</p>
          <h2 className="mt-2 text-2xl font-semibold">{editingTopic ? "Editar tema" : "Crear tema"}</h2>
        </div>
        <div className="rounded-full border border-border/70 px-4 py-2 text-xs text-muted-foreground">
          {topics.length} temas
        </div>
      </div>

      <form action={saveTopicAction} className="mt-6 grid gap-4">
        <input type="hidden" name="topicId" defaultValue={editingTopic?.id ?? ""} />

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Asignatura</span>
          <select
            name="courseId"
            defaultValue={editingTopic?.courseId ?? courses[0]?.id ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Titulo</span>
            <input
              name="title"
              defaultValue={editingTopic?.title ?? ""}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              placeholder="Ej. Ondas mecanicas"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Slug opcional</span>
            <input
              name="slug"
              defaultValue={editingTopic?.slug ?? ""}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              placeholder="ondas-mecanicas"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_140px]">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Descripcion</span>
            <textarea
              name="description"
              defaultValue={editingTopic?.description ?? ""}
              className="min-h-28 rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              placeholder="Contenido, enfoque y alcance del tema."
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Posicion</span>
            <input
              type="number"
              min="1"
              step="1"
              name="position"
              defaultValue={editingTopic?.position ?? 1}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            {editingTopic ? "Guardar tema" : "Crear tema"}
          </button>
          <a
            href="/admin"
            className="rounded-full border border-border/70 px-5 py-3 text-sm font-medium text-muted-foreground"
          >
            Limpiar
          </a>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {topics.map((topic) => (
          <article
            key={topic.id}
            className="rounded-[1.5rem] border border-border/70 bg-background/65 p-4"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Network className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{topic.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{topic.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {topic.courseTitle} · Unidad {topic.position} · {topic.totalResources} recursos
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`/admin/topics?topic=${topic.id}`}
                  className="rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground"
                >
                  Editar
                </a>
                <form action={deleteTopicAction}>
                  <input type="hidden" name="topicId" value={topic.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
