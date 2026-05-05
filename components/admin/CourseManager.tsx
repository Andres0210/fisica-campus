import { deleteCourseAction, saveCourseAction } from "@/app/admin/actions";
import { AdminCourseRecord, courseLevelOptions } from "@/lib/education-service";
import { GraduationCap } from "lucide-react";

type CourseManagerProps = {
  courses: AdminCourseRecord[];
  editingCourse?: AdminCourseRecord | null;
};

export default function CourseManager({ courses, editingCourse }: CourseManagerProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Asignaturas</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {editingCourse ? "Editar asignatura" : "Crear asignatura"}
          </h2>
        </div>
        <div className="rounded-full border border-border/70 px-4 py-2 text-xs text-muted-foreground">
          {courses.length} registradas
        </div>
      </div>

      <form action={saveCourseAction} className="mt-6 grid gap-4">
        <input type="hidden" name="courseId" defaultValue={editingCourse?.id ?? ""} />

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Nombre</span>
          <input
            name="title"
            defaultValue={editingCourse?.title ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Ej. Fisica II"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Slug opcional</span>
          <input
            name="slug"
            defaultValue={editingCourse?.slug ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="fisica-2"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Descripcion</span>
          <textarea
            name="description"
            defaultValue={editingCourse?.description ?? ""}
            className="min-h-28 rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Enfoque, alcance y competencias de la asignatura."
          />
        </label>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Nivel</span>
            <select
              name="level"
              defaultValue={editingCourse?.level ?? "BASIC"}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            >
              {courseLevelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-end gap-3 text-sm">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={editingCourse?.isPublished ?? true}
              className="h-4 w-4 rounded border-border"
            />
            <span className="pb-3 text-muted-foreground">Visible para estudiantes</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            {editingCourse ? "Guardar asignatura" : "Crear asignatura"}
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
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-[1.5rem] border border-border/70 bg-background/65 p-4"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{course.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {course.level} · {course.totalTopics} temas · {course.totalResources} recursos
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`/admin/courses?course=${course.id}`}
                  className="rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground"
                >
                  Editar
                </a>
                <form action={deleteCourseAction}>
                  <input type="hidden" name="courseId" value={course.id} />
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
