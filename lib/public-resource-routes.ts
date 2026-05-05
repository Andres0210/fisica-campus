import type { PublicResourceRecord, ResourceCollectionKind } from "@/lib/education-service";

export function getPublicResourceHref(
  kind: ResourceCollectionKind,
  resource: Pick<PublicResourceRecord, "subjectSlug" | "slug">,
) {
  return `/${kind}/${resource.subjectSlug}/${resource.slug}`;
}
