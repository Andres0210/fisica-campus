import CourseManager from "@/components/admin/CourseManager";
import { requireTeacherSession } from "@/lib/auth";
import { getAdminEducationDashboard } from "@/lib/education-service";

type CoursesPageProps = {
  searchParams?: Promise<{
    course?: string;
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  await requireTeacherSession();

  const params = searchParams ? await searchParams : undefined;
  const { courses } = await getAdminEducationDashboard();
  const editingCourse = courses.find((course) => course.id === params?.course) ?? null;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Cursos</h1>

      <CourseManager courses={courses} editingCourse={editingCourse} />
    </div>
  );
}
