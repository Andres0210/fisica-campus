import { saveUserAction } from "@/app/admin/actions";
import { AdminUserRecord } from "@/lib/user-service";
import { ShieldCheck, UserPlus } from "lucide-react";

type UserManagerProps = {
  users: AdminUserRecord[];
};

const roleLabels: Record<AdminUserRecord["role"], string> = {
  TEACHER: "Profesor/Admin",
  ASSISTANT: "Administrador auxiliar",
  STUDENT: "Estudiante",
};

export default function UserManager({ users }: UserManagerProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <form action={saveUserAction} className="glass-panel rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="eyebrow">Usuarios</p>
            <h2 className="mt-1 text-2xl font-semibold">Crear acceso administrativo</h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Crea usuarios que podran iniciar sesion en el panel. Para administrar contenido usa los roles
          Profesor/Admin o Administrador auxiliar.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Nombre completo</span>
            <input
              name="name"
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              placeholder="Ej. Maria Gomez"
              required
              maxLength={120}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Correo</span>
            <input
              type="email"
              name="email"
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              placeholder="usuario@correo.com"
              required
              maxLength={180}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Contrasena temporal</span>
            <input
              type="password"
              name="password"
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              placeholder="Minimo 8 caracteres"
              required
              minLength={8}
              maxLength={120}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Rol</span>
            <select
              name="role"
              defaultValue="ASSISTANT"
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            >
              <option value="ASSISTANT">Administrador auxiliar</option>
              <option value="TEACHER">Profesor/Admin</option>
              <option value="STUDENT">Estudiante</option>
            </select>
          </label>

          <button className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
            Crear usuario
          </button>
        </div>
      </form>

      <section className="glass-panel rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="eyebrow">Accesos existentes</p>
            <h2 className="mt-1 text-2xl font-semibold">Usuarios registrados</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                  {roleLabels[user.role]}
                </span>
              </div>
            </article>
          ))}
        </div>

        {!users.length ? (
          <p className="mt-6 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
            Aun no hay usuarios creados desde la base de datos.
          </p>
        ) : null}
      </section>
    </section>
  );
}
