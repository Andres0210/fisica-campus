import { ResourceItem } from "@/lib/academic-content";
import { FileText, PlayCircle, BookMarked } from "lucide-react";

type ResourceGridProps = {
  items: ResourceItem[];
};

export default function ResourceGrid({ items }: ResourceGridProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => {
        const Icon =
          item.format === "Reel" ? PlayCircle : item.format === "PDF" ? FileText : BookMarked;

        return (
          <article key={item.id} className="glass-panel rounded-[1.75rem] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
            <div className="mt-5 inline-flex rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
              {item.format}
            </div>
          </article>
        );
      })}
    </section>
  );
}
