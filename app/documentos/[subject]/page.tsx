import Navbar from "@/components/Navbar";
import PublicResourceGrid from "@/components/site/PublicResourceGrid";
import SubjectLinks from "@/components/site/SubjectLinks";
import { getTeacherSession } from "@/lib/auth";
import { getPublicCourseLinks, getPublicResourceCatalog } from "@/lib/education-service";

type SubjectDocumentsPageProps = {
  params: Promise<{
    subject: string;
  }>;
};

export default async function SubjectDocumentsPage({ params }: SubjectDocumentsPageProps) {
  const { subject } = await params;

  const [catalog, teacherSession, courses] = await Promise.all([
    getPublicResourceCatalog("documentos", subject),
    getTeacherSession(),
    getPublicCourseLinks(),
  ]);
  const subjectTitle = catalog.items[0]?.subjectLabel ?? courses.find((course) => course.slug === subject)?.title ?? "Asignatura";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <section className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Documentos</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {subjectTitle} - biblioteca documental
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Guia de lectura, talleres y anexos del curso organizados en una sola
            ruta publica.
          </p>
        </section>

        <div className="mt-8">
          <PublicResourceGrid items={catalog.items} kind="documentos" teacherMode={Boolean(teacherSession)} />
        </div>

        <section className="mt-10">
          <SubjectLinks courses={courses} basePath="/documentos" kind="documentos" title="Cambiar de asignatura" />
        </section>
      </section>
    </main>
  );
}
