"use client";

import AdminFeedback from "@/components/admin/AdminFeedback";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  FileStack,
  LogOut,
  Users,
  UserCog,
} from "lucide-react";
import { logoutTeacherAction } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Cursos", icon: FolderKanban },
  { href: "/admin/topics", label: "Temas", icon: BookOpen },
  { href: "/admin/resources", label: "Recursos", icon: FileStack },
  { href: "/admin/authors", label: "Autores", icon: Users },
  { href: "/admin/users", label: "Usuarios", icon: UserCog },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5f7ef] text-foreground dark:bg-background">
      <Suspense fallback={null}>
        <AdminFeedback />
      </Suspense>

      <aside className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/92 px-4 py-3 backdrop-blur-xl lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
        <div>
          <div className="mb-0 flex items-center justify-between gap-3 lg:mb-8">
            <div>
              <p className="eyebrow">Panel</p>
              <h2 className="text-lg font-semibold">Administracion</h2>
            </div>
          </div>

          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:mt-0 lg:grid lg:gap-2 lg:overflow-visible lg:pb-0">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm transition lg:rounded-2xl ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[0_14px_34px_rgba(127,181,54,0.22)]"
                      : "border border-border/60 bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <form action={logoutTeacherAction} className="mt-4 hidden lg:block">
          <button className="flex w-full items-center gap-2 rounded-2xl border border-border/70 px-4 py-3 text-sm text-muted-foreground transition hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </form>
      </aside>

      <main className="px-4 pb-10 pt-32 lg:ml-72 lg:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
