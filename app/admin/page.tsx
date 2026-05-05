import { requireTeacherSession } from "@/lib/auth";
import { getAdminEducationDashboard } from "@/lib/education-service";
import { FolderKanban, BookOpen, FileStack, Video, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  await requireTeacherSession();

  const { courses, topics, resources, authors } =
    await getAdminEducationDashboard();

  const videoCount = resources.filter((r) => r.type === "VIDEO").length;
  const pdfCount = resources.filter((r) => r.type === "PDF").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-5">
        <Stat label="Cursos" value={courses.length} icon={FolderKanban} />
        <Stat label="Temas" value={topics.length} icon={BookOpen} />
        <Stat label="Videos" value={videoCount} icon={Video} />
        <Stat label="PDFs" value={pdfCount} icon={FileStack} />
        <Stat label="Autores" value={authors.length} icon={Users} />
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: any) {
  return (
    <div className="border rounded-xl p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
