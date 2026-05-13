import { apiClient } from "@/lib/api-client";
import { RESOURCE_CATEGORY, RESOURCE_STATUS, RESOURCE_TYPE } from "@/lib/campus-domain";

export type NavigationChild = {
  label: string;
  href: string;
};

export type PublicNavigation = {
  materias: NavigationChild[];
  simuladores: NavigationChild[];
  videos: NavigationChild[];
  documentos: NavigationChild[];
  libros: NavigationChild[];
  cartillas: NavigationChild[];
};

type CourseRef = {
  id: string;
  title: string;
  slug: string;
  isPublished?: boolean;
};

type ApiResource = {
  id: string;
  type: string;
  category: string;
  status: string;
  courseId: string;
  course: CourseRef;
};

const emptyNavigation: PublicNavigation = {
  materias: [],
  simuladores: [],
  videos: [],
  documentos: [],
  libros: [],
  cartillas: [],
};

function byCourseTitle(a: NavigationChild, b: NavigationChild) {
  return a.label.localeCompare(b.label, "es", { sensitivity: "base" });
}

function isVisibleCourse(course?: CourseRef) {
  return Boolean(course?.slug && course?.title && course.isPublished !== false);
}

function uniqueCourseChildren(
  courses: CourseRef[],
  labelPrefix: string,
  hrefBase: string,
) {
  const unique = new Map<string, NavigationChild>();

  for (const course of courses) {
    if (!isVisibleCourse(course) || unique.has(course.slug)) {
      continue;
    }

    unique.set(course.slug, {
      label: `${labelPrefix} ${course.title}`,
      href: `${hrefBase}/${course.slug}`,
    });
  }

  return Array.from(unique.values()).sort(byCourseTitle);
}

function resourcesByKind(
  resources: ApiResource[],
  matcher: (resource: ApiResource) => boolean,
  labelPrefix: string,
  hrefBase: string,
) {
  return uniqueCourseChildren(
    resources
      .filter((resource) => resource.status === RESOURCE_STATUS.PUBLISHED)
      .filter(matcher)
      .map((resource) => resource.course),
    labelPrefix,
    hrefBase,
  );
}

export async function getPublicNavigation(): Promise<PublicNavigation> {
  const nextNavigation = { ...emptyNavigation };

  try {
    const [courses, resources] = await Promise.all([
      apiClient.getCourses() as Promise<CourseRef[]>,
      apiClient.getResources({ publishedOnly: true }) as Promise<ApiResource[]>,
    ]);

    nextNavigation.materias = uniqueCourseChildren(
      courses,
      "",
      "/materias",
    ).map((course) => ({
      ...course,
      label: course.label.trim(),
    }));

    nextNavigation.videos = resourcesByKind(
      resources,
      (resource) => resource.type === RESOURCE_TYPE.VIDEO,
      "Reels de",
      "/videos",
    );
    nextNavigation.documentos = resourcesByKind(
      resources,
      (resource) => resource.type === RESOURCE_TYPE.PDF && resource.category === RESOURCE_CATEGORY.DOCUMENT,
      "Documentos de",
      "/documentos",
    );
    nextNavigation.libros = resourcesByKind(
      resources,
      (resource) => resource.type === RESOURCE_TYPE.PDF && resource.category === RESOURCE_CATEGORY.BOOK,
      "Libros de",
      "/libros",
    );
    nextNavigation.cartillas = resourcesByKind(
      resources,
      (resource) => resource.type === RESOURCE_TYPE.PDF && resource.category === RESOURCE_CATEGORY.BOOKLET,
      "Cartillas de",
      "/cartillas",
    );
  } catch {
    return nextNavigation;
  }

  return nextNavigation;
}
