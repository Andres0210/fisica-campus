import ResourceDetailPage from "@/components/site/ResourceDetailPage";

type VideoViewerPageProps = {
  params: Promise<{
    subject: string;
    slug: string;
  }>;
};

export default async function VideoViewerPage({ params }: VideoViewerPageProps) {
  const { subject, slug } = await params;

  return <ResourceDetailPage kind="videos" subject={subject} slug={slug} />;
}
