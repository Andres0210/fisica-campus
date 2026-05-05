import ResourceDetailPage from "@/components/site/ResourceDetailPage";

type BookletViewerPageProps = {
  params: Promise<{
    subject: string;
    slug: string;
  }>;
};

export default async function BookletViewerPage({ params }: BookletViewerPageProps) {
  const { subject, slug } = await params;

  return <ResourceDetailPage kind="cartillas" subject={subject} slug={slug} />;
}
