import { PublicCourseSummary, ResourceCollectionKind, getCourseResourceCount } from "@/lib/education-service";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type SubjectLinksProps = {
  courses: PublicCourseSummary[];
  basePath: "/simuladores" | "/videos" | "/documentos" | "/libros" | "/cartillas";
  title: string;
  kind?: ResourceCollectionKind;
};

export default function SubjectLinks({ courses, basePath, title, kind }: SubjectLinksProps) {
  const visibleCourses = kind
    ? courses.filter((course) => getCourseResourceCount(course, kind) > 0)
    : courses;

  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <p className="eyebrow">{title}</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {visibleCourses.map((course) => (
          <Link
            key={course.slug}
            href={`${basePath}/${course.slug}`}
            className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    {kind ? getCourseResourceCount(course, kind) : course.totalResources} recursos publicados
                  </span>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    {course.totalTopics} temas
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
          </Link>
        ))}
      </div>
      {!visibleCourses.length ? (
        <p className="mt-5 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
          Aun no hay asignaturas publicadas con recursos de esta categoria.
        </p>
      ) : null}
    </section>
  );
}
