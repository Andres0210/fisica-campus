"use client";

import { deleteAuthorAction, saveAuthorAction } from "@/app/admin/actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { AdminAuthorRecord } from "@/lib/education-service";
import { ImagePlus, Loader2, PencilLine, UserRound } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

type AuthorManagerProps = {
  authors: AdminAuthorRecord[];
  editingAuthor?: AdminAuthorRecord | null;
};

type UploadedAvatar = {
  publicUrl: string;
  path: string;
  bucket: string;
  fileSizeMb: number;
  originalFileName: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AU";
}

export default function AuthorManager({ authors, editingAuthor }: AuthorManagerProps) {
  const [name, setName] = useState(editingAuthor?.name ?? "");
  const [profession, setProfession] = useState(editingAuthor?.profession ?? "");
  const [bio, setBio] = useState(editingAuthor?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(editingAuthor?.avatarUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedAvatar, setUploadedAvatar] = useState<UploadedAvatar | null>(null);

  useEffect(() => {
    setName(editingAuthor?.name ?? "");
    setProfession(editingAuthor?.profession ?? "");
    setBio(editingAuthor?.bio ?? "");
    setAvatarUrl(editingAuthor?.avatarUrl ?? "");
    setUploadedAvatar(null);
    setUploadError("");
  }, [editingAuthor]);

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Selecciona una imagen valida en formato JPG, PNG, WEBP o GIF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setUploadError("");

    try {
      const response = await fetch("/api/admin/authors/upload-avatar", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message ?? "No se pudo subir la imagen.");
      }

      setUploadedAvatar(payload as UploadedAvatar);
      setAvatarUrl(payload.publicUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  const previewName = name.trim() || "Nombre del autor";
  const previewProfession = profession.trim() || "Profesion o area academica";
  const previewBio =
    bio.trim() || "Aqui se vera una descripcion breve del perfil academico, experiencia y aporte del autor.";

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="glass-panel rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Autores</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {editingAuthor ? "Editar autor" : "Crear autor"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Sube una fotografia o retrato institucional, revisa la vista previa y guarda el perfil cuando todo se vea correcto.
            </p>
          </div>
          <div className="rounded-full border border-border/70 px-4 py-2 text-xs text-muted-foreground">
            {authors.length} perfiles
          </div>
        </div>

        <form action={saveAuthorAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="authorId" defaultValue={editingAuthor?.id ?? ""} />
          <input type="hidden" name="avatarUrl" value={avatarUrl} readOnly />

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Nombre</span>
            <input
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
              placeholder="Ej. Laura Mendoza"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Slug opcional</span>
            <input
              name="slug"
              defaultValue={editingAuthor?.slug ?? ""}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
              placeholder="laura-mendoza"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Profesion</span>
            <input
              name="profession"
              value={profession}
              onChange={(event) => setProfession(event.target.value)}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
              placeholder="Fisica teorica"
              required
            />
          </label>

          <div className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Imagen del autor</span>
            <label className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-primary/35 bg-primary/5 px-4 py-3 text-sm transition hover:border-primary/60 hover:bg-primary/10">
              <span className="inline-flex items-center gap-2 font-medium text-primary">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {uploading ? "Subiendo imagen..." : "Subir imagen"}
              </span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WEBP - max 8 MB</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
            </label>
            {avatarUrl ? (
              <p className="truncate rounded-full bg-muted/70 px-3 py-2 text-xs text-muted-foreground">
                URL lista: {avatarUrl}
              </p>
            ) : null}
            {uploadedAvatar ? (
              <p className="text-xs text-primary">
                Imagen cargada: {uploadedAvatar.originalFileName} ({uploadedAvatar.fileSizeMb} MB)
              </p>
            ) : null}
            {uploadError ? <p className="text-xs text-destructive">{uploadError}</p> : null}
          </div>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="text-muted-foreground">Biografia</span>
            <textarea
              name="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="min-h-32 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
              placeholder="Descripcion breve del autor, enfoque docente y experiencia."
              required
            />
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[0_16px_35px_rgba(127,181,54,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingAuthor ? "Guardar autor" : "Crear autor"}
            </button>
            <a
              href="/admin/authors"
              className="rounded-full border border-border/70 px-5 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Limpiar
            </a>
          </div>
        </form>
      </div>

      <aside className="glass-panel rounded-[2rem] p-6 xl:sticky xl:top-24 xl:self-start">
        <p className="eyebrow">Vista previa</p>
        <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-border/70 bg-background shadow-sm">
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-primary/20 via-white to-accent/20">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={previewName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="grid h-28 w-28 place-items-center rounded-[2rem] bg-primary/10 text-3xl font-semibold text-primary">
                  {getInitials(previewName)}
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-5 text-white">
              <p className="text-xl font-semibold leading-tight">{previewName}</p>
              <p className="mt-1 text-sm text-white/78">{previewProfession}</p>
            </div>
          </div>
          <div className="p-5">
            <p className="line-clamp-5 text-sm leading-6 text-muted-foreground">{previewBio}</p>
          </div>
        </div>
      </aside>

      <div className="glass-panel rounded-[2rem] p-6 xl:col-span-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Perfiles publicados</p>
            <h3 className="mt-2 text-xl font-semibold">Autores registrados</h3>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {authors.map((author) => (
            <article
              key={author.id}
              className="rounded-[1.5rem] border border-border/70 bg-background/65 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-primary/10 text-primary">
                  {author.avatarUrl ? (
                    <img src={author.avatarUrl} alt={author.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserRound className="h-6 w-6" />
                    </div>
                  )}
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

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{author.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`/admin/authors?author=${author.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground"
                    >
                      <PencilLine className="h-3.5 w-3.5" />
                      Editar
                    </a>
                    <form action={deleteAuthorAction}>
                      <input type="hidden" name="authorId" value={author.id} />
                      <ConfirmSubmitButton
                        label="Eliminar"
                        title="Eliminar autor"
                        message={`Estas a punto de eliminar el perfil de "${author.name}". Esta accion no se puede deshacer.`}
                        className="rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-700"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
