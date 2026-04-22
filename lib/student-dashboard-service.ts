import { prisma } from "@/lib/prisma";
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

function toIsoDate(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : null;
}

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

  const simulations: StudentSimulationCard[] = [
    {
      id: "sim-seed-ondas",
      title: "Laboratorio virtual de ondas",
      description: "Explora amplitud, frecuencia y velocidad de propagacion en tiempo real.",
      topicTitle: "Ondas mecanicas",
      courseTitle: "Fisica General II",
      isPublished: true,
    },
  ];

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
    const [courses, topics, resources, simulations] = await Promise.all([
      prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { title: "asc" },
        include: {
          topics: true,
          resources: true,
        },
      }),
      prisma.topic.findMany({
        orderBy: [{ courseId: "asc" }, { position: "asc" }],
        include: {
          course: true,
          resources: true,
        },
      }),
      prisma.resource.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }],
        include: {
          course: true,
          topic: true,
        },
      }),
      prisma.simulation.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          topic: {
            include: {
              course: true,
            },
          },
        },
      }),
    ]);

    if (courses.length === 0) {
      return getStudentSeedDashboard();
    }

    return {
      source: "database" as const,
      courses: courses.map((course) => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        level: course.level,
        topicCount: course.topics.length,
        resourceCount: course.resources.length,
        publishedCount: course.resources.filter((resource) => resource.status === "PUBLISHED").length,
      })),
      topics: topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        position: topic.position,
        courseId: topic.courseId,
        courseSlug: topic.course.slug,
        courseTitle: topic.course.title,
        videoCount: topic.resources.filter((resource) => resource.type === "VIDEO").length,
        pdfCount: topic.resources.filter((resource) => resource.type === "PDF").length,
      })),
      resources: resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        status: resource.status,
        topicTitle: resource.topic.title,
        courseTitle: resource.course.title,
        publishedAt: toIsoDate(resource.publishedAt),
        durationMinutes: resource.durationMinutes,
        fileSizeMb: resource.fileSizeMb,
        storageUrl: resource.storageUrl,
      })),
      simulations: simulations.map((simulation) => ({
        id: simulation.id,
        title: simulation.title,
        description: simulation.description,
        topicTitle: simulation.topic.title,
        courseTitle: simulation.topic.course.title,
        isPublished: simulation.isPublished,
      })),
    };
  } catch {
    return getStudentSeedDashboard();
  }
}

export async function getStudentCourseDetail(courseSlug: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        topics: {
          orderBy: { position: "asc" },
          include: {
            resources: {
              where: { status: "PUBLISHED" },
              orderBy: [{ publishedAt: "desc" }],
            },
            simulations: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    return {
      source: "database" as const,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        level: course.level,
      },
      topics: course.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        position: topic.position,
        resources: topic.resources.map((resource) => ({
          id: resource.id,
          title: resource.title,
          description: resource.description,
          type: resource.type,
          publishedAt: toIsoDate(resource.publishedAt),
          durationMinutes: resource.durationMinutes,
          fileSizeMb: resource.fileSizeMb,
          storageUrl: resource.storageUrl,
        })),
        simulations: topic.simulations.map((simulation) => ({
          id: simulation.id,
          title: simulation.title,
          description: simulation.description,
          isPublished: simulation.isPublished,
        })),
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
          simulations: seed.simulations
            .filter((simulation) => simulation.topicTitle === topic.title)
            .map((simulation) => ({
              id: simulation.id,
              title: simulation.title,
              description: simulation.description,
              isPublished: simulation.isPublished,
            })),
        })),
    };
  }
}
