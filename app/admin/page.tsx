import { requireTeacherSession } from "@/lib/auth";
import { getAdminEducationDashboard } from "@/lib/education-service";
import { getAdminUsers } from "@/lib/user-service";
import { FolderKanban, BookOpen, FileStack, Video, Users, UserCog } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await requireTeacherSession();

  const [{ courses, topics, resources, authors }, users] = await Promise.all([
    getAdminEducationDashboard(),
    getAdminUsers().catch(() => []),
  ]);

  const videoCount = resources.filter((r) => r.type === "VIDEO").length;
  const pdfCount = resources.filter((r) => r.type === "PDF").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-6">
        <Stat label="Cursos" value={courses.length} icon={FolderKanban} />
        <Stat label="Temas" value={topics.length} icon={BookOpen} />
        <Stat label="Videos" value={videoCount} icon={Video} />
        <Stat label="PDFs" value={pdfCount} icon={FileStack} />
        <Stat label="Autores" value={authors.length} icon={Users} />
        <Stat label="Usuarios" value={users.length} icon={UserCog} href="/admin/users" />
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, href }: any) {
  const content = (
    <>
      <Icon className="h-5 w-5 text-primary" />
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="border rounded-xl p-4 transition hover:-translate-y-0.5 hover:bg-muted/40">
        {content}
      </Link>
    );
  }

  return (
    <div className="border rounded-xl p-4">
      {content}
    </div>
  );
}
