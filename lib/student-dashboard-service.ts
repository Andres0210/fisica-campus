import { apiClient } from "@/lib/api-client";
import { getCampusDashboardSeedData } from "@/lib/campus-data";

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

async function getStudentSeedDashboard() {
  const seed = await getCampusDashboardSeedData();

  const courses: StudentCourseCard[] = seed.courses.map((course) => {
    const courseResources = seed.resources.filter((resource) => resource.courseId === course.id);

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      level: course.level,
      topicCount: course.totalTopics,
      resourceCount: courseResources.length,
      publishedCount: courseResources.filter((resource) => resource.status === "PUBLISHED").length,
    };
  });

  const topics: StudentTopicCard[] = seed.topics.map((topic) => {
    const topicResources = seed.resources.filter((resource) => resource.topicId === topic.id);
    const course = seed.courses.find((item) => item.id === topic.courseId);

    return {
      id: topic.id,
      title: topic.title,
      description: `Unidad enfocada en ${topic.title.toLowerCase()} y sus aplicaciones.`,
      position: 1,
      courseId: topic.courseId,
      courseSlug: course?.slug ?? "",
      courseTitle: course?.title ?? "",
      videoCount: topicResources.filter((resource) => resource.type === "VIDEO").length,
      pdfCount: topicResources.filter((resource) => resource.type === "PDF").length,
    };
  });

  const resources: StudentResourceCard[] = seed.resources
    .filter((resource) => resource.status === "PUBLISHED")
    .map((resource) => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      status: resource.status,
      topicTitle: resource.topicTitle,
      courseTitle: resource.courseTitle,
      publishedAt: resource.publishedAt,
      durationMinutes: resource.durationMinutes,
      fileSizeMb: resource.fileSizeMb,
      storageUrl: resource.storageUrl,
    }));

  const simulations: StudentSimulationCard[] = [];

  return {
    source: "seed" as const,
    courses,
    topics,
    resources,
    simulations,
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
      return getStudentSeedDashboard();
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
    return getStudentSeedDashboard();
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
    const seed = await getStudentSeedDashboard();
    const course = seed.courses.find((item) => item.slug === courseSlug);

    if (!course) {
      return null;
    }

    return {
      source: "seed" as const,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        level: course.level,
      },
      topics: seed.topics
        .filter((topic) => topic.courseSlug === courseSlug)
        .map((topic) => ({
          id: topic.id,
          title: topic.title,
          description: topic.description,
          position: topic.position,
          resources: seed.resources
            .filter((resource) => resource.topicTitle === topic.title)
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
  }
}
