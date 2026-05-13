"use client";

import { apiClient } from "@/lib/api-client";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";

type FormStatus =
  | { type: "idle"; message?: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function RegisterForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle" });

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      await apiClient.createUser({ name, email, password });
      event.currentTarget.reset();
      setStatus({
        type: "success",
        message: "Usuario creado correctamente. Ya puedes continuar explorando la plataforma.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo crear el usuario. Intentalo nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Nombre completo</span>
        <input
          type="text"
          name="name"
          className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 outline-none transition focus:border-primary"
          placeholder="Escribe tu nombre"
          required
          maxLength={120}
        />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Correo electronico</span>
        <input
          type="email"
          name="email"
          className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 outline-none transition focus:border-primary"
          placeholder="nombre@correo.com"
          required
          maxLength={180}
        />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Contrasena</span>
        <input
          type="password"
          name="password"
          className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 outline-none transition focus:border-primary"
          placeholder="Minimo 8 caracteres"
          required
          minLength={8}
          maxLength={120}
        />
      </label>

      {status.type !== "idle" ? (
        <div
          className={`rounded-[1.25rem] border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-primary/25 bg-primary/10 text-primary"
              : "border-rose-500/25 bg-rose-500/10 text-rose-300"
          }`}
        >
          <div className="flex items-start gap-3">
            {status.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : null}
            <span>{status.message}</span>
          </div>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_42px_rgba(127,181,54,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creando usuario..." : "Crear usuario"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
