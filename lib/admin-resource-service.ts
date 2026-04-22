import { prisma } from "@/lib/prisma";
import { getCampusDashboardSeedData } from "@/lib/campus-data";

function toIsoDate(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : null;
}

export async function getAdminResourceDashboard() {
  try {
    const [courses, topics, resources] = await Promise.all([
      prisma.course.findMany({
        orderBy: { title: "asc" },
        include: {
          _count: {
            select: {
              topics: true,
            },
          },
        },
      }),
      prisma.topic.findMany({
        orderBy: [{ courseId: "asc" }, { position: "asc" }],
      }),
      prisma.resource.findMany({
        orderBy: [{ createdAt: "desc" }],
        include: {
          course: true,
          topic: true,
        },
      }),
    ]);

    if (courses.length === 0) {
      return {
        ...(await getCampusDashboardSeedData()),
        source: "seed" as const,
      };
    }

    return {
      source: "database" as const,
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        level: course.level,
        totalTopics: course._count.topics,
      })),
      topics: topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        courseId: topic.courseId,
      })),
      resources: resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        slug: resource.slug,
        description: resource.description,
        type: resource.type,
        status: resource.status,
        storageUrl: resource.storageUrl,
        durationMinutes: resource.durationMinutes,
        fileSizeMb: resource.fileSizeMb,
        publishedAt: toIsoDate(resource.publishedAt),
        courseId: resource.courseId,
        courseTitle: resource.course.title,
        topicId: resource.topicId,
        topicTitle: resource.topic.title,
      })),
    };
  } catch {
    return {
      ...(await getCampusDashboardSeedData()),
      source: "seed" as const,
    };
  }
}
