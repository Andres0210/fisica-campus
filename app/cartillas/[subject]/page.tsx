import Navbar from "@/components/Navbar";
import PublicResourceGrid from "@/components/site/PublicResourceGrid";
import SubjectLinks from "@/components/site/SubjectLinks";
import { getTeacherSession } from "@/lib/auth";
import { getPublicCourseLinks, getPublicResourceCatalog } from "@/lib/education-service";

type SubjectBookletsPageProps = {
  params: Promise<{
    subject: string;
  }>;
};

export default async function SubjectBookletsPage({ params }: SubjectBookletsPageProps) {
  const { subject } = await params;

  const [catalog, teacherSession, courses] = await Promise.all([
    getPublicResourceCatalog("cartillas", subject),
    getTeacherSession(),
    getPublicCourseLinks(),
  ]);
  const subjectTitle = catalog.items[0]?.subjectLabel ?? courses.find((course) => course.slug === subject)?.title ?? "Asignatura";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <section className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Cartillas</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {subjectTitle} - cartillas del curso
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Material de estudio extendido para acompanar el progreso del
            estudiante por unidades.
          </p>
        </section>

        <div className="mt-8">
          <PublicResourceGrid items={catalog.items} kind="cartillas" teacherMode={Boolean(teacherSession)} />
        </div>

        <section className="mt-10">
          <SubjectLinks courses={courses} basePath="/cartillas" kind="cartillas" title="Cambiar de asignatura" />
        </section>
      </section>
    </main>
  );
}
