import { apiClient } from "@/lib/api-client";

export type StudentCourseCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  topicCount: number;
  resourceCount: number;
  publishedCount: number;
};

export type StudentTopicCard = {
  id: string;
  title: string;
  description: string;
  position: number;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  videoCount: number;
  pdfCount: number;
};

export type StudentResourceCard = {
  id: string;
  title: string;
  description: string;
  type: "VIDEO" | "PDF";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  topicTitle: string;
  courseTitle: string;
  publishedAt: string | null;
  durationMinutes: number | null;
  fileSizeMb: number | null;
  storageUrl: string;
};

export type StudentSimulationCard = {
  id: string;
  title: string;
  description: string;
  topicTitle: string;
  courseTitle: string;
  isPublished: boolean;
};

type ApiCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  isPublished: boolean;
  _count?: {
    topics: number;
    resources: number;
  };
};

type ApiTopic = {
  id: string;
  title: string;
  description: string;
  position: number;
  courseId: string;
  course: {
    slug: string;
    title: string;
  };
  _count?: {
    resources: number;
  };
};

type ApiResource = {
  id: string;
  title: string;
  description: string;
  type: "VIDEO" | "PDF";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  durationMinutes: number | null;
  fileSizeMb: number | null;
  storageUrl: string;
  courseId: string;
  topicId: string;
  course: {
    title: string;
    slug: string;
  };
  topic: {
    title: string;
    description?: string;
    position?: number;
  };
};

function getUnavailableStudentDashboard() {
  return {
    source: "unavailable" as const,
    courses: [] as StudentCourseCard[],
    topics: [] as StudentTopicCard[],
    resources: [] as StudentResourceCard[],
    simulations: [] as StudentSimulationCard[],
  };
}

export async function getStudentDashboardData() {
  try {
    const [courses, topics, resources] = await Promise.all([
      apiClient.getCourses() as Promise<ApiCourse[]>,
      apiClient.getTopics() as Promise<ApiTopic[]>,
      apiClient.getResources({ publishedOnly: true }) as Promise<ApiResource[]>,
    ]);

    const publishedCourses = courses.filter((course) => course.isPublished);

    if (publishedCourses.length === 0) {
      return getUnavailableStudentDashboard();
    }

    return {
      source: "database" as const,
      courses: publishedCourses.map((course) => {
        const courseResources = resources.filter((resource) => resource.courseId === course.id);

        return {
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.description,
          level: course.level,
          topicCount: topics.filter((topic) => topic.courseId === course.id).length,
          resourceCount: courseResources.length,
          publishedCount: courseResources.length,
        };
      }),
      topics: topics
        .filter((topic) => publishedCourses.some((course) => course.id === topic.courseId))
        .map((topic) => {
          const topicResources = resources.filter((resource) => resource.topicId === topic.id);

          return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            position: topic.position,
            courseId: topic.courseId,
            courseSlug: topic.course.slug,
            courseTitle: topic.course.title,
            videoCount: topicResources.filter((resource) => resource.type === "VIDEO").length,
            pdfCount: topicResources.filter((resource) => resource.type === "PDF").length,
          };
        }),
      resources: resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        status: resource.status,
        topicTitle: resource.topic.title,
        courseTitle: resource.course.title,
        publishedAt: resource.publishedAt,
        durationMinutes: resource.durationMinutes,
        fileSizeMb: resource.fileSizeMb,
        storageUrl: resource.storageUrl,
      })),
      simulations: [] as StudentSimulationCard[],
    };
  } catch {
    return getUnavailableStudentDashboard();
  }
}

export async function getStudentCourseDetail(courseSlug: string) {
  try {
    const [courses, topics, resources] = await Promise.all([
      apiClient.getCourses() as Promise<ApiCourse[]>,
      apiClient.getTopics() as Promise<ApiTopic[]>,
      apiClient.getResources({ publishedOnly: true }) as Promise<ApiResource[]>,
    ]);

    const course = courses.find((item) => item.slug === courseSlug && item.isPublished);

    if (!course) {
      return null;
    }

    const courseTopics = topics
      .filter((topic) => topic.courseId === course.id)
      .sort((a, b) => a.position - b.position);

    return {
      source: "database" as const,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        level: course.level,
      },
      topics: courseTopics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        position: topic.position,
        resources: resources
          .filter((resource) => resource.topicId === topic.id)
          .map((resource) => ({
            id: resource.id,
            title: resource.title,
            description: resource.description,
            type: resource.type,
            publishedAt: resource.publishedAt,
            durationMinutes: resource.durationMinutes,
            fileSizeMb: resource.fileSizeMb,
            storageUrl: resource.storageUrl,
          })),
        simulations: [] as Array<{
          id: string;
          title: string;
          description: string;
          isPublished: boolean;
        }>,
      })),
    };
  } catch {
    return null;
  }
}
