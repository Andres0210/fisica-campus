import Navbar from "@/components/Navbar";
import { getTeacherCredentials, getTeacherSession } from "@/lib/auth";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { loginTeacherAction } from "./actions";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    email?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const session = await getTeacherSession();

  if (session) {
    redirect("/admin");
  }

  const params = searchParams ? await searchParams : undefined;
  const credentials = getTeacherCredentials();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="section-shell flex min-h-[calc(100vh-7rem)] items-center py-10">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1.05fr)_420px]">
          <section className="glass-panel rounded-[2.25rem] p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Iniciar sesión</p>
                <p className="text-sm text-muted-foreground">
                  Acceso reservado para administradores
                </p>
              </div>
            </div>

            {params?.error ? (
              <div className="mt-6 rounded-[1.25rem] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {params.error}
              </div>
            ) : null}

            <form action={loginTeacherAction} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm">
                <span className="text-muted-foreground">
                  Correo institucional
                </span>
                <input
                  type="email"
                  name="email"
                  defaultValue={params?.email ?? credentials.email}
                  className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                  placeholder="profe@areandina.edu.co"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-muted-foreground">Contraseña</span>
                <input
                  type="password"
                  name="password"
                  className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                  placeholder="Ingresa la contraseña"
                  required
                />
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
              >
                Entrar al panel
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}