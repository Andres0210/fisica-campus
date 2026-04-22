import AuthorCard from "@/components/authors/AuthorCard";
import Navbar from "@/components/Navbar";
import { authors } from "@/lib/academic-content";

export default function AuthorsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        {/* HEADER SIMPLE */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold">Equipo académico</h1>

          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Profesionales que diseñan contenido claro, práctico y enfocado en
            ayudarte a entender y aplicar los conceptos.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <AuthorCard key={author.id} item={author} />
          ))}
        </div>

        {/* FOOTER / FILOSOFÍA */}
        <div className="mt-20 border-t border-border/60 pt-10">
          <p className="text-sm text-muted-foreground max-w-2xl leading-6">
            Cada autor aporta su experiencia para construir material que no solo
            explica, sino que entrena la forma de pensar. El enfoque está en la
            comprensión real, la práctica constante y la resolución de
            problemas.
          </p>
        </div>
      </section>
    </main>
  );
}
