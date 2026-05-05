import Navbar from "@/components/Navbar";
import PublicResourceGrid from "@/components/site/PublicResourceGrid";
import SubjectLinks from "@/components/site/SubjectLinks";
import { getSubject, subjects } from "@/lib/academic-content";
import { getTeacherSession } from "@/lib/auth";
import { getPublicResourceCatalog } from "@/lib/education-service";

type SubjectBookletsPageProps = {
  params: Promise<{
    subject: string;
  }>;
};

export default async function SubjectBookletsPage({ params }: SubjectBookletsPageProps) {
  const { subject } = await params;
  const subjectInfo = getSubject(subject);

  const [catalog, teacherSession] = await Promise.all([
    getPublicResourceCatalog("cartillas", subject),
    getTeacherSession(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <section className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Cartillas</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {subjectInfo?.title ?? "Asignatura"} · cartillas del curso
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Material de estudio extendido para acompañar el progreso del estudiante por unidades.
          </p>
        </section>

        <div className="mt-8">
          <PublicResourceGrid items={catalog.items} kind="cartillas" teacherMode={Boolean(teacherSession)} />
        </div>

        <section className="mt-10">
          <SubjectLinks subjects={subjects} basePath="/cartillas" title="Cambiar de asignatura" />
        </section>
      </section>
    </main>
  );
}
