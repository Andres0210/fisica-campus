import { SimulatorItem } from "@/lib/academic-content";

type SimulatorGridProps = {
  items: SimulatorItem[];
};

export default function SimulatorGrid({ items }: SimulatorGridProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="glass-panel rounded-[1.75rem] p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
              {item.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                item.status === "validado"
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-amber-400/10 text-amber-300"
              }`}
            >
              {item.status}
            </span>
          </div>

          <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>

          <div className="mt-5 rounded-[1.35rem] border border-border/70 bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
            {item.note}
          </div>
        </article>
      ))}
    </section>
  );
}
