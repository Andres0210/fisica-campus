import { AuthorItem } from "@/lib/academic-content";

type AuthorGridProps = {
  items: AuthorItem[];
};

export default function AuthorGrid({ items }: AuthorGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.id} className="glass-panel rounded-[1.75rem] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/12 text-lg font-semibold text-primary">
            {item.avatar}
          </div>
          <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
          <p className="mt-2 text-sm font-medium text-primary">{item.role}</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.bio}</p>
        </article>
      ))}
    </section>
  );
}
