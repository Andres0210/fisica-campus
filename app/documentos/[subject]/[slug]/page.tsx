import ResourceDetailPage from "@/components/site/ResourceDetailPage";

type DocumentViewerPageProps = {
  params: Promise<{
    subject: string;
    slug: string;
  }>;
};

export default async function DocumentViewerPage({ params }: DocumentViewerPageProps) {
  const { subject, slug } = await params;

  return <ResourceDetailPage kind="documentos" subject={subject} slug={slug} />;
}
