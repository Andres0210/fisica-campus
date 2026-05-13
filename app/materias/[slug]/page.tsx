import Navbar from "@/components/Navbar";
import PublicResourceGrid from "@/components/site/PublicResourceGrid";
import { getTeacherSession } from "@/lib/auth";
import { getPublicCourseLinks, getPublicResourceCatalog, ResourceCollectionKind } from "@/lib/education-service";
import { notFound } from "next/navigation";

type SubjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const sections: Array<{
  kind: ResourceCollectionKind;
  title: string;
  description: string;
}> = [
  {
    kind: "videos",
    title: "Videos",
    description: "Clases breves, reels academicos y explicaciones audiovisuales de la asignatura.",
  },
  {
    kind: "documentos",
    title: "Documentos",
    description: "Guias, talleres, anexos y material PDF de apoyo.",
  },
  {
    kind: "libros",
    title: "Libros",
    description: "Bibliografia digital seleccionada para profundizar los temas del curso.",
  },
  {
    kind: "cartillas",
    title: "Cartillas",
    description: "Material guiado para estudiar por unidades y reforzar el proceso de clase.",
  },
];

export default async function SubjectDetailPage({ params }: SubjectDetailPageProps) {
  const { slug } = await params;

  const [courses, teacherSession, videos, documentos, libros, cartillas] = await Promise.all([
    getPublicCourseLinks(),
    getTeacherSession(),
    getPublicResourceCatalog("videos", slug),
    getPublicResourceCatalog("documentos", slug),
    getPublicResourceCatalog("libros", slug),
    getPublicResourceCatalog("cartillas", slug),
  ]);

  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  const catalogs = {
    videos,
    documentos,
    libros,
    cartillas,
  };

  const hasAnyResource = Object.values(catalogs).some((catalog) => catalog.items.length > 0);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell pb-12 pt-8">
        <section className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Asignatura</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{course.title}</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            {course.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/70 px-3 py-1">{course.totalTopics} temas</span>
            <span className="rounded-full border border-border/70 px-3 py-1">{course.totalVideos} videos</span>
            <span className="rounded-full border border-border/70 px-3 py-1">{course.totalDocuments} documentos</span>
            <span className="rounded-full border border-border/70 px-3 py-1">{course.totalBooks} libros</span>
            <span className="rounded-full border border-border/70 px-3 py-1">{course.totalBooklets} cartillas</span>
          </div>
        </section>

        {!hasAnyResource ? (
          <section className="mt-8 rounded-[1.5rem] border border-border/70 bg-background/70 p-6 text-sm text-muted-foreground">
            Esta materia ya existe, pero aun no tiene recursos publicados.
          </section>
        ) : null}

        <div className="mt-8 grid gap-10">
          {sections.map((section) => {
            const catalog = catalogs[section.kind];

            if (!catalog.items.length) {
              return null;
            }

            return (
              <section key={section.kind} className="grid gap-5">
                <div>
                  <p className="eyebrow">{section.title}</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">{section.title} de {course.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{section.description}</p>
                </div>
                <PublicResourceGrid
                  items={catalog.items}
                  kind={section.kind}
                  teacherMode={Boolean(teacherSession)}
                />
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
