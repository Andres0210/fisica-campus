import TopicManager from "@/components/admin/TopicManager";
import { requireTeacherSession } from "@/lib/auth";
import { getAdminEducationDashboard } from "@/lib/education-service";

type TopicsPageProps = {
  searchParams?: Promise<{
    topic?: string;
  }>;
};

export default async function TopicsPage({ searchParams }: TopicsPageProps) {
  await requireTeacherSession();

  const params = searchParams ? await searchParams : undefined;
  const { courses, topics } =
    await getAdminEducationDashboard();
  const editingTopic = topics.find((topic) => topic.id === params?.topic) ?? null;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Temas</h1>

      <TopicManager
        courses={courses}
        topics={topics}
        editingTopic={editingTopic}
      />
    </div>
  );
}
