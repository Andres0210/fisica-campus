import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { StudentCourseCard } from "@/lib/student-dashboard-service";

type CourseCardProps = {
  course: StudentCourseCard;
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="glass-panel rounded-[1.75rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <BookOpen className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
          {course.level}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold">{course.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.description}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Temas</p>
          <p className="mt-2 text-2xl font-semibold">{course.topicCount}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recursos</p>
          <p className="mt-2 text-2xl font-semibold">{course.publishedCount}</p>
        </div>
      </div>

      <Link
        href={`/student/courses/${course.slug}`}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
      >
        Entrar al curso
        <ChevronRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
