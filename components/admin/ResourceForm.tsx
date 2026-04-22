import { DashboardCourse, DashboardTopic } from "@/lib/campus-data";

type ResourceFormProps = {
  courses: DashboardCourse[];
  topics: DashboardTopic[];
};

export default function ResourceForm({ courses, topics }: ResourceFormProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Carga De Recursos</p>
          <h2 className="mt-2 text-2xl font-semibold">Formulario base para videos y PDFs</h2>
        </div>
        <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-medium text-amber-200">
          MVP sin subida real todavia
        </div>
      </div>

      <form className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Titulo</span>
          <input
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Ej. Guia de laboratorio de ondas"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Tipo</span>
          <select className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
            <option>VIDEO</option>
            <option>PDF</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Asignatura</span>
          <select className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
            {courses.map((course) => (
              <option key={course.id}>{course.title}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Tema</span>
          <select className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
            {topics.map((topic) => (
              <option key={topic.id}>{topic.title}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="text-muted-foreground">Descripcion</span>
          <textarea
            className="min-h-32 rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Resumen del recurso, objetivos y observaciones para los estudiantes."
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">URL temporal del archivo</span>
          <input
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="https://..."
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Estado</span>
          <select className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
            <option>DRAFT</option>
            <option>PUBLISHED</option>
            <option>ARCHIVED</option>
          </select>
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            className="rounded-full border border-border/70 px-5 py-3 text-sm font-medium text-muted-foreground"
          >
            Conectar subida real despues
          </button>
        </div>
      </form>
    </section>
  );
}
