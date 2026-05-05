import AuthorManager from "@/components/admin/AuthorManager";
import { requireTeacherSession } from "@/lib/auth";
import { getAuthorsCatalog } from "@/lib/education-service";

type AuthorsPageProps = {
  searchParams?: Promise<{
    author?: string;
    error?: string;
  }>;
};

export default async function AuthorsPage({ searchParams }: AuthorsPageProps) {
  await requireTeacherSession();

  const params = searchParams ? await searchParams : undefined;
  const { authors } = await getAuthorsCatalog();
  const editingAuthor = authors.find((author) => author.id === params?.author) ?? null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Autores</h1>

      <AuthorManager
        authors={authors}
        editingAuthor={editingAuthor}
        errorMessage={params?.error}
      />
    </div>
  );
}
