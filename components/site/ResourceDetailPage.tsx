import PublicResourceViewer from "@/components/site/PublicResourceViewer";
import { getTeacherSession } from "@/lib/auth";
import { getPublicResourceCatalog, ResourceCollectionKind } from "@/lib/education-service";
import { notFound } from "next/navigation";

type ResourceDetailPageProps = {
  kind: ResourceCollectionKind;
  subject: string;
  slug: string;
};

export default async function ResourceDetailPage({
  kind,
  subject,
  slug,
}: ResourceDetailPageProps) {
  const [catalog, teacherSession] = await Promise.all([
    getPublicResourceCatalog(kind, subject),
    getTeacherSession(),
  ]);

  const resource = catalog.items.find((item) => item.slug === slug);

  if (!resource) {
    notFound();
  }

  return (
    <PublicResourceViewer
      kind={kind}
      resource={resource}
      teacherMode={Boolean(teacherSession)}
    />
  );
}
