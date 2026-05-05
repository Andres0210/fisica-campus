import ResourceDetailPage from "@/components/site/ResourceDetailPage";

type BookViewerPageProps = {
  params: Promise<{
    subject: string;
    slug: string;
  }>;
};

export default async function BookViewerPage({ params }: BookViewerPageProps) {
  const { subject, slug } = await params;

  return <ResourceDetailPage kind="libros" subject={subject} slug={slug} />;
}
