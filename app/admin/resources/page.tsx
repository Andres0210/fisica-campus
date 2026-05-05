import ResourceForm from "@/components/admin/ResourceForm";
import ResourceTable from "@/components/admin/ResourceTable";
import { requireTeacherSession } from "@/lib/auth";
import { getAdminEducationDashboard } from "@/lib/education-service";

type ResourcesPageProps = {
  searchParams?: Promise<{
    resource?: string;
  }>;
};

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  await requireTeacherSession();

  const params = searchParams ? await searchParams : undefined;
  const { courses, topics, resources } =
    await getAdminEducationDashboard();
  const editingResource = resources.find((resource) => resource.id === params?.resource) ?? null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Recursos</h1>

      <ResourceForm
        courses={courses}
        topics={topics}
        editingResource={editingResource}
      />

      <ResourceTable resources={resources} />
    </div>
  );
}
