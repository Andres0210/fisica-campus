import { apiClient } from "@/lib/api-client";
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

export type PublicCourseSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  totalTopics: number;
  totalResources: number;
  totalVideos: number;
  totalDocuments: number;
  totalBooks: number;
  totalBooklets: number;
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

function getResourceKind(resource: Pick<ApiResource, "type" | "category">): ResourceCollectionKind {
  if (resource.type === RESOURCE_TYPE.VIDEO) {
    return "videos";
  }

  if (resource.category === RESOURCE_CATEGORY.BOOK) {
    return "libros";
  }

  if (resource.category === RESOURCE_CATEGORY.BOOKLET) {
    return "cartillas";
  }

  return "documentos";
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
    subjectSlug: resource.course.slug,
    subjectLabel: resource.course.title,
  };
}

export async function getPublicCourseSummaries(): Promise<PublicCourseSummary[]> {
  try {
    const [courses, resources] = await Promise.all([
      apiClient.getCourses() as Promise<ApiCourse[]>,
      apiClient.getResources({ publishedOnly: true }) as Promise<ApiResource[]>,
    ]);

    return courses
      .filter((course) => course.isPublished !== false)
      .map((course) => {
        const courseResources = resources.filter((resource) => resource.courseId === course.id);

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          totalTopics: course._count?.topics ?? 0,
          totalResources: courseResources.length,
          totalVideos: courseResources.filter((resource) => getResourceKind(resource) === "videos").length,
          totalDocuments: courseResources.filter((resource) => getResourceKind(resource) === "documentos").length,
          totalBooks: courseResources.filter((resource) => getResourceKind(resource) === "libros").length,
          totalBooklets: courseResources.filter((resource) => getResourceKind(resource) === "cartillas").length,
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title, "es", { sensitivity: "base" }));
  } catch {
    return [];
  }
}

export function getCourseResourceCount(course: PublicCourseSummary, kind: ResourceCollectionKind) {
  if (kind === "videos") {
    return course.totalVideos;
  }

  if (kind === "documentos") {
    return course.totalDocuments;
  }

  if (kind === "libros") {
    return course.totalBooks;
  }

  return course.totalBooklets;
}

export async function getPublicCourseLinks(kind?: ResourceCollectionKind) {
  const courses = await getPublicCourseSummaries();

  if (!kind) {
    return courses;
  }

  return courses.filter((course) => getCourseResourceCount(course, kind) > 0);
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
    return {
      source: "unavailable" as const,
      courses: [],
      topics: [],
      resources: [],
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
      source: "unavailable" as const,
      authors: [],
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
      source: "unavailable" as const,
      items: [] as PublicResourceRecord[],
    };
  }
}
