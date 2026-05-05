import Navbar from "@/components/Navbar";
import PublicResourceGrid from "@/components/site/PublicResourceGrid";
import SubjectLinks from "@/components/site/SubjectLinks";
import { getSubject, subjects } from "@/lib/academic-content";
import { getTeacherSession } from "@/lib/auth";
import { getPublicResourceCatalog } from "@/lib/education-service";

type SubjectVideosPageProps = {
  params: Promise<{
    subject: string;
  }>;
};

export default async function SubjectVideosPage({ params }: SubjectVideosPageProps) {
  const { subject } = await params;
  const subjectInfo = getSubject(subject);

  const [catalog, teacherSession] = await Promise.all([
    getPublicResourceCatalog("videos", subject),
    getTeacherSession(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-10 pt-8">
        <section className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Reels De Fisica</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {subjectInfo?.title ?? "Asignatura"} · videos publicados
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Vista filtrada por asignatura para que el estudiante encuentre unicamente los videos publicados en ese
            curso y la profesora pueda revisarlos en contexto cuando inicia sesion.
          </p>
        </section>

        <div className="mt-8">
          <PublicResourceGrid items={catalog.items} kind="videos" teacherMode={Boolean(teacherSession)} />
        </div>

        <section className="mt-10">
          <SubjectLinks subjects={subjects} basePath="/videos" title="Cambiar de asignatura" />
        </section>
      </section>
    </main>
  );
}
