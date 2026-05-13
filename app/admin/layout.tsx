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
    <div className="flex min-h-screen bg-background text-foreground">
      <Suspense fallback={null}>
        <AdminFeedback />
      </Suspense>
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <form action={logoutTeacherAction}>
          <button className="flex items-center gap-2 text-sm border px-3 py-2 rounded-lg w-full">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
