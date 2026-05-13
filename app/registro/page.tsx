import Navbar from "@/components/Navbar";
import RegisterForm from "@/components/auth/RegisterForm";
import { UserPlus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear usuario | FisicaLab Areandina",
  description: "Registro publico de estudiantes para FisicaLab Areandina.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f1] text-foreground">
      <Navbar />

      <section className="section-shell relative py-12 md:py-20">
        <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_18%_18%,rgba(127,181,54,0.22),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(245,152,47,0.16),transparent_26%)]" />

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
          <section className="glass-panel rounded-[2.25rem] p-7 md:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <UserPlus className="h-7 w-7" />
            </div>

            <p className="eyebrow mt-8">Registro De Usuario</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Crea tu cuenta para participar en la plataforma
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Registra tus datos basicos para que la plataforma pueda
              identificarte dentro de las actividades, recursos y experiencias
              academicas.
            </p>

            <div className="mt-10 grid gap-4 border-t border-border/70 pt-7 sm:grid-cols-3">
              {["Nombre", "Correo", "Contrasena"].map((item, index) => (
                <div key={item}>
                  <p className="text-2xl font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2.25rem] border border-border/70 bg-background/88 p-6 shadow-[0_28px_90px_rgba(47,62,18,0.12)] backdrop-blur-xl md:p-8">
            <h2 className="text-2xl font-semibold">Crear usuario</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Solo necesitas nombre, correo y una contrasena segura.
            </p>

            <div className="mt-7">
              <RegisterForm />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
