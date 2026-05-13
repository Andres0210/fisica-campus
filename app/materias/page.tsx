import Navbar from "@/components/Navbar";
import { getPublicCourseLinks } from "@/lib/education-service";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function SubjectsPage() {
  const courses = await getPublicCourseLinks();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-12 pt-8">
        <section className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Materias</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Explora los recursos por asignatura.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Cada materia reune sus videos, documentos, libros y cartillas publicados para que el estudiante
            encuentre el material de clase sin depender de rutas quemadas.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/materias/${course.slug}`}
              className="glass-panel rounded-[1.75rem] p-5 transition hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold">{course.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border/70 px-3 py-1">{course.totalTopics} temas</span>
                <span className="rounded-full border border-border/70 px-3 py-1">{course.totalResources} recursos</span>
              </div>
            </Link>
          ))}
        </section>

        {!courses.length ? (
          <section className="mt-8 rounded-[1.5rem] border border-border/70 bg-background/70 p-6 text-sm text-muted-foreground">
            Aun no hay materias publicadas.
          </section>
        ) : null}
      </section>
    </main>
  );
}
