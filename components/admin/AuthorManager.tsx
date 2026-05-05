import { deleteAuthorAction, saveAuthorAction } from "@/app/admin/actions";
import { AdminAuthorRecord } from "@/lib/education-service";
import { PencilLine, UserRound } from "lucide-react";

type AuthorManagerProps = {
  authors: AdminAuthorRecord[];
  editingAuthor?: AdminAuthorRecord | null;
  errorMessage?: string;
};

export default function AuthorManager({ authors, editingAuthor, errorMessage }: AuthorManagerProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Autores</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {editingAuthor ? "Editar autor" : "Crear autor"}
          </h2>
        </div>
        <div className="rounded-full border border-border/70 px-4 py-2 text-xs text-muted-foreground">
          {authors.length} perfiles
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-6 rounded-[1.25rem] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </div>
      ) : null}

      <form action={saveAuthorAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="authorId" defaultValue={editingAuthor?.id ?? ""} />

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Nombre</span>
          <input
            name="name"
            defaultValue={editingAuthor?.name ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Ej. Laura Mendoza"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Slug opcional</span>
          <input
            name="slug"
            defaultValue={editingAuthor?.slug ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="laura-mendoza"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Profesion</span>
          <input
            name="profession"
            defaultValue={editingAuthor?.profession ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Fisica teorica"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Avatar o imagen</span>
          <input
            name="avatarUrl"
            defaultValue={editingAuthor?.avatarUrl ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="/authors/mujer1.png o https://..."
          />
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="text-muted-foreground">Biografia</span>
          <textarea
            name="bio"
            defaultValue={editingAuthor?.bio ?? ""}
            className="min-h-32 rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Descripcion breve del autor, enfoque docente y experiencia."
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            {editingAuthor ? "Guardar autor" : "Crear autor"}
          </button>
          <a
            href="/admin/authors"
            className="rounded-full border border-border/70 px-5 py-3 text-sm font-medium text-muted-foreground"
          >
            Limpiar
          </a>
        </div>
      </form>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {authors.map((author) => (
          <article
            key={author.id}
            className="rounded-[1.5rem] border border-border/70 bg-background/65 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{author.name}</p>
                    <p className="mt-1 text-sm text-primary">{author.profession}</p>
                  </div>
                  <div className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    {author.totalResources} recursos
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">{author.bio}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`/admin/authors?author=${author.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground"
                  >
                    <PencilLine className="h-3.5 w-3.5" />
                    Editar
                  </a>
                  <form action={deleteAuthorAction}>
                    <input type="hidden" name="authorId" value={author.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
