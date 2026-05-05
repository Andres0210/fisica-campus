import { authors as academicAuthors, getResourcesByType } from "@/lib/academic-content";
import { apiClient } from "@/lib/api-client";
import { getCampusDashboardSeedData } from "@/lib/campus-data";
import {
  COURSE_LEVEL,
  RESOURCE_CATEGORY,
  RESOURCE_STATUS,
  RESOURCE_TYPE,
  type CourseLevel,
  type ResourceCategory,
  type ResourceStatus,
  type ResourceType,
} from "@/lib/campus-domain";

export type AdminCourseRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  isPublished: boolean;
  totalTopics: number;
  totalResources: number;
};

export type AdminTopicRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  position: number;
  courseId: string;
  courseTitle: string;
  totalResources: number;
};

export type AdminResourceRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  status: ResourceStatus;
  storageUrl: string;
  storageBucket: string | null;
  storagePath: string | null;
  originalFileName: string | null;
  mimeType: string | null;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  fileSizeMb: number | null;
  publishedAt: string | null;
  courseId: string;
  courseTitle: string;
  topicId: string;
  topicTitle: string;
};

export type AdminAuthorRecord = {
  id: string;
  name: string;
  slug: string;
  profession: string;
  bio: string;
  avatarUrl: string | null;
  totalResources: number;
};

export type CourseUpsertInput = {
  title: string;
  description: string;
  level: CourseLevel;
  isPublished: boolean;
  slug?: string;
};

export type TopicUpsertInput = {
  title: string;
  description: string;
  position: number;
  courseId: string;
  slug?: string;
};

export type ResourceUpsertInput = {
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  status: ResourceStatus;
  storageUrl: string;
  thumbnailUrl?: string;
  durationMinutes?: number | null;
  fileSizeMb?: number | null;
  storageBucket?: string;
  storagePath?: string;
  originalFileName?: string;
  mimeType?: string;
  courseId: string;
  topicId: string;
  slug?: string;
};

export type AuthorUpsertInput = {
  name: string;
  profession: string;
  bio: string;
  avatarUrl?: string;
  slug?: string;
};

export type ResourceCollectionKind = "videos" | "documentos" | "libros" | "cartillas";

export type PublicResourceRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  storageUrl: string;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  fileSizeMb: number | null;
  publishedAt: string | null;
  courseTitle: string;
  courseSlug: string;
  topicTitle: string;
  subjectSlug: string;
  subjectLabel: string;
};

export const courseLevelOptions = Object.values(COURSE_LEVEL);
export const resourceTypeOptions = Object.values(RESOURCE_TYPE);
export const resourceCategoryOptions = Object.values(RESOURCE_CATEGORY);
export const resourceStatusOptions = Object.values(RESOURCE_STATUS);

export const resourceCategoryLabels: Record<ResourceCategory, string> = {
  VIDEO: "Video",
  DOCUMENT: "Documento",
  BOOK: "Libro",
  BOOKLET: "Cartilla",
};

type ApiCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  isPublished: boolean;
  _count?: {
    topics: number;
    resources: number;
  };
};

type ApiAuthor = {
  id: string;
  name: string;
  slug: string;
  profession: string;
  bio: string;
  avatarUrl: string | null;
  _count?: {
    resources: number;
  };
};

type ApiTopic = {
  id: string;
  title: string;
  slug: string;
  description: string;
  position: number;
  courseId: string;
  course: {
    title: string;
    slug: string;
  };
  _count?: {
    resources: number;
  };
};

type ApiResource = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  status: ResourceStatus;
  storageUrl: string;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  fileSizeMb: number | null;
  publishedAt: string | null;
  courseId: string;
  topicId: string;
  course: {
    title: string;
    slug: string;
  };
  topic: {
    title: string;
  };
  storageBucket?: string | null;
  storagePath?: string | null;
  originalFileName?: string | null;
  mimeType?: string | null;
};

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferSubjectSlug(courseSlug: string, courseTitle: string) {
  const haystack = `${courseSlug} ${courseTitle}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/\b(fisica|fisica general)?[\s-]*(iii|3)\b/.test(haystack)) {
    return "fisica-3";
  }

  if (/\b(fisica|fisica general)?[\s-]*(ii|2)\b/.test(haystack)) {
    return "fisica-2";
  }

  return courseSlug;
}

function inferSubjectLabel(subjectSlug: string, fallbackTitle: string) {
  if (subjectSlug === "fisica-2") {
    return "Fisica II";
  }

  if (subjectSlug === "fisica-3") {
    return "Fisica III";
  }

  return fallbackTitle;
}

function mapCourse(course: ApiCourse): AdminCourseRecord {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    level: course.level,
    isPublished: course.isPublished,
    totalTopics: course._count?.topics ?? 0,
    totalResources: course._count?.resources ?? 0,
  };
}

function mapTopic(topic: ApiTopic): AdminTopicRecord {
  return {
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    description: topic.description,
    position: topic.position,
    courseId: topic.courseId,
    courseTitle: topic.course.title,
    totalResources: topic._count?.resources ?? 0,
  };
}

function mapResource(resource: ApiResource): AdminResourceRecord {
  return {
    id: resource.id,
    title: resource.title,
    slug: resource.slug,
    description: resource.description,
    type: resource.type,
    category: resource.category,
    status: resource.status,
    storageUrl: resource.storageUrl,
    storageBucket: resource.storageBucket ?? null,
    storagePath: resource.storagePath ?? null,
    originalFileName: resource.originalFileName ?? null,
    mimeType: resource.mimeType ?? null,
    thumbnailUrl: resource.thumbnailUrl,
    durationMinutes: resource.durationMinutes,
    fileSizeMb: resource.fileSizeMb,
    publishedAt: resource.publishedAt,
    courseId: resource.courseId,
    courseTitle: resource.course.title,
    topicId: resource.topicId,
    topicTitle: resource.topic.title,
  };
}

function mapAuthor(author: ApiAuthor): AdminAuthorRecord {
  return {
    id: author.id,
    name: author.name,
    slug: author.slug,
    profession: author.profession,
    bio: author.bio,
    avatarUrl: author.avatarUrl,
    totalResources: author._count?.resources ?? 0,
  };
}

function mapPublicResource(resource: ApiResource): PublicResourceRecord {
  const subjectSlug = inferSubjectSlug(resource.course.slug, resource.course.title);

  return {
    id: resource.id,
    slug: resource.slug,
    title: resource.title,
    description: resource.description,
    type: resource.type,
    category: resource.category,
    storageUrl: resource.storageUrl,
    thumbnailUrl: resource.thumbnailUrl,
    durationMinutes: resource.durationMinutes,
    fileSizeMb: resource.fileSizeMb,
    publishedAt: resource.publishedAt,
    courseTitle: resource.course.title,
    courseSlug: resource.course.slug,
    topicTitle: resource.topic.title,
    subjectSlug,
    subjectLabel: inferSubjectLabel(subjectSlug, resource.course.title),
  };
}

function getFallbackCollection(kind: ResourceCollectionKind, subjectSlug?: string): PublicResourceRecord[] {
  const items =
    kind === "videos"
      ? getResourcesByType("videos", subjectSlug as never)
      : kind === "documentos"
        ? getResourcesByType("documentos", subjectSlug as never)
        : kind === "cartillas"
          ? getResourcesByType("cartillas", subjectSlug as never)
          : [];

  return items.map((item) => ({
    id: item.id,
    slug: normalizeSlug(item.title),
    title: item.title,
    description: item.description,
    type: kind === "videos" ? RESOURCE_TYPE.VIDEO : RESOURCE_TYPE.PDF,
    category:
      kind === "videos"
        ? RESOURCE_CATEGORY.VIDEO
        : kind === "cartillas"
          ? RESOURCE_CATEGORY.BOOKLET
          : kind === "libros"
            ? RESOURCE_CATEGORY.BOOK
            : RESOURCE_CATEGORY.DOCUMENT,
    storageUrl: item.url ?? item.pdf ?? item.file ?? "#",
    thumbnailUrl: null,
    durationMinutes: kind === "videos" ? 1 : null,
    fileSizeMb: kind === "videos" ? null : 1,
    publishedAt: null,
    courseTitle: inferSubjectLabel(item.subject, item.subject),
    courseSlug: item.subject,
    topicTitle: item.tags?.[0] ?? "General",
    subjectSlug: item.subject,
    subjectLabel: inferSubjectLabel(item.subject, item.subject),
  }));
}

export async function getAdminEducationDashboard() {
  try {
    const [courses, topics, resources, authors] = await Promise.all([
      apiClient.getCourses() as Promise<ApiCourse[]>,
      apiClient.getTopics() as Promise<ApiTopic[]>,
      apiClient.getResources() as Promise<ApiResource[]>,
      apiClient.getAuthors() as Promise<ApiAuthor[]>,
    ]);

    return {
      source: "database" as const,
      courses: courses.map(mapCourse),
      topics: topics.map(mapTopic),
      resources: resources.map(mapResource),
      authors: authors.map(mapAuthor),
    };
  } catch {
    const seed = await getCampusDashboardSeedData();

    return {
      source: "seed" as const,
      courses: seed.courses.map((course) => ({
        ...course,
        level: course.level as CourseLevel,
        isPublished: true,
        totalResources: seed.resources.filter((resource) => resource.courseId === course.id).length,
      })),
      topics: seed.topics.map((topic) => ({
        ...topic,
        slug: normalizeSlug(topic.title),
        description: `Unidad enfocada en ${topic.title.toLowerCase()}.`,
        position: 1,
        courseTitle: seed.courses.find((course) => course.id === topic.courseId)?.title ?? "",
        totalResources: seed.resources.filter((resource) => resource.topicId === topic.id).length,
      })),
      resources: seed.resources.map((resource) => ({
        ...resource,
        category: resource.category ?? (resource.type === RESOURCE_TYPE.VIDEO ? RESOURCE_CATEGORY.VIDEO : RESOURCE_CATEGORY.DOCUMENT),
        storageBucket: null,
        storagePath: null,
        originalFileName: null,
        mimeType: null,
        thumbnailUrl: null,
      })),
      authors: [],
    };
  }
}

export async function getAuthorsCatalog() {
  try {
    const authors = (await apiClient.getAuthors()) as ApiAuthor[];

    return {
      source: "database" as const,
      authors: authors.map(mapAuthor),
    };
  } catch {
    return {
      source: "seed" as const,
      authors: academicAuthors.map((author) => ({
        id: author.id,
        name: author.name,
        slug: normalizeSlug(author.name),
        profession: author.role,
        bio: author.bio,
        avatarUrl: author.image ?? null,
        totalResources: 0,
      })),
    };
  }
}

export function createAuthor(input: AuthorUpsertInput) {
  return apiClient.createAuthor(input);
}

export function updateAuthor(authorId: string, input: AuthorUpsertInput) {
  return apiClient.updateAuthor(authorId, input);
}

export function deleteAuthor(authorId: string) {
  return apiClient.deleteAuthor(authorId);
}

export function createCourse(input: CourseUpsertInput) {
  return apiClient.createCourse(input);
}

export function updateCourse(courseId: string, input: CourseUpsertInput) {
  return apiClient.updateCourse(courseId, input);
}

export function deleteCourse(courseId: string) {
  return apiClient.deleteCourse(courseId);
}

export function createTopic(input: TopicUpsertInput) {
  return apiClient.createTopic(input);
}

export function updateTopic(topicId: string, input: TopicUpsertInput) {
  return apiClient.updateTopic(topicId, input);
}

export function deleteTopic(topicId: string) {
  return apiClient.deleteTopic(topicId);
}

export function createResource(input: ResourceUpsertInput) {
  return apiClient.createResource(input);
}

export function updateResource(resourceId: string, input: ResourceUpsertInput) {
  return apiClient.updateResource(resourceId, input);
}

export function deleteResource(resourceId: string) {
  return apiClient.deleteResource(resourceId);
}

export function updateResourceStatus(resourceId: string, status: ResourceStatus) {
  return apiClient.updateResource(resourceId, { status });
}

export async function getPublicResourceCatalog(kind: ResourceCollectionKind, subjectSlug?: string) {
  try {
    const resources = (await apiClient.getCatalog(kind, subjectSlug)) as ApiResource[];

    return {
      source: "database" as const,
      items: resources.map(mapPublicResource),
    };
  } catch {
    return {
      source: "seed" as const,
      items: getFallbackCollection(kind, subjectSlug),
    };
  }
}
