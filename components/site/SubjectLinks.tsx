import { SubjectContent } from "@/lib/academic-content";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type SubjectLinksProps = {
  subjects: SubjectContent[];
  basePath: "/simuladores" | "/videos" | "/documentos" | "/cartillas";
  title: string;
};

export default function SubjectLinks({ subjects, basePath, title }: SubjectLinksProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <p className="eyebrow">{title}</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {subjects.map((subject) => (
          <Link
            key={subject.slug}
            href={`${basePath}/${subject.slug}`}
            className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{subject.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{subject.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    {subject.simulators.length} simuladores
                  </span>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    Ruta por fenomenos
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
