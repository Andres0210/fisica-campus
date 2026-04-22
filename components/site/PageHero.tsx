import { CheckCircle2 } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  points?: string[];
};

export default function PageHero({ eyebrow, title, description, badge, points = [] }: PageHeroProps) {
  return (
    <section className="glass-panel relative overflow-hidden rounded-[2rem] p-6 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_24%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>

          {points.length > 0 && (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {points.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-[1.35rem] border border-border/70 bg-background/65 px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-[1.75rem] border border-border/70 bg-slate-950 p-5 text-slate-100">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/80">
            Panel De Estado
          </p>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Rutas y filtros por asignatura
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Contenido preparado para desktop y laptop
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Base lista para simulaciones interactivas
            </div>
            {badge && (
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-cyan-100">
                {badge}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
