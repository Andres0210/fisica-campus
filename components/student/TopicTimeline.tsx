import { StudentTopicCard } from "@/lib/student-dashboard-service";
import { FileText, PlayCircle, Waves } from "lucide-react";

type TopicTimelineProps = {
  topics: StudentTopicCard[];
};

export default function TopicTimeline({ topics }: TopicTimelineProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <p className="eyebrow">Ruta Del Estudiante</p>
      <h2 className="mt-2 text-2xl font-semibold">Temas organizados por avance</h2>

      <div className="mt-6 grid gap-4">
        {topics.map((topic, index) => (
          <article
            key={topic.id}
            className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                  Tema {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{topic.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{topic.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {topic.courseTitle}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 px-3 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>{topic.videoCount} videos</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 px-3 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{topic.pdfCount} PDFs</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 px-3 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                    <span>Simulacion</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
