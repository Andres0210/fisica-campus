import {
  RESOURCE_CATEGORY,
  RESOURCE_STATUS,
  RESOURCE_TYPE,
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "@/lib/campus-domain";

export type DashboardCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  totalTopics: number;
};

export type DashboardTopic = {
  id: string;
  title: string;
  courseId: string;
};

export type DashboardResource = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  status: ResourceStatus;
  storageUrl: string;
  durationMinutes: number | null;
  fileSizeMb: number | null;
  publishedAt: string | null;
  courseId: string;
  courseTitle: string;
  topicId: string;
  topicTitle: string;
};

const courses: DashboardCourse[] = [
  {
    id: "course-fisica-ondas",
    title: "Fisica General II",
    slug: "fisica-general-ii",
    description: "Curso enfocado en ondas, oscilaciones, sonido y fenomenos de interferencia.",
    level: "Intermedio",
    totalTopics: 2,
  },
];

const topics: DashboardTopic[] = [
  {
    id: "topic-ondas",
    title: "Ondas mecanicas",
    courseId: "course-fisica-ondas",
  },
  {
    id: "topic-mas",
    title: "Movimiento armonico simple",
    courseId: "course-fisica-ondas",
  },
];

const resources: DashboardResource[] = [
  {
    id: "resource-video-ondas-1",
    title: "Introduccion a ondas mecanicas",
    slug: "introduccion-ondas-mecanicas",
    description: "Video introductorio para entender amplitud, frecuencia y longitud de onda.",
    type: RESOURCE_TYPE.VIDEO,
    category: RESOURCE_CATEGORY.VIDEO,
    status: RESOURCE_STATUS.PUBLISHED,
    storageUrl: "https://example.com/videos/ondas-intro",
    durationMinutes: 18,
    fileSizeMb: 240,
    publishedAt: "2026-04-16",
    courseId: "course-fisica-ondas",
    courseTitle: "Fisica General II",
    topicId: "topic-ondas",
    topicTitle: "Ondas mecanicas",
  },
  {
    id: "resource-pdf-ondas-1",
    title: "Guia PDF de ondas",
    slug: "guia-pdf-ondas",
    description: "Documento con teoria, ejercicios base y preguntas orientadoras.",
    type: RESOURCE_TYPE.PDF,
    category: RESOURCE_CATEGORY.DOCUMENT,
    status: RESOURCE_STATUS.PUBLISHED,
    storageUrl: "https://example.com/docs/guia-ondas.pdf",
    durationMinutes: null,
    fileSizeMb: 4.8,
    publishedAt: "2026-04-15",
    courseId: "course-fisica-ondas",
    courseTitle: "Fisica General II",
    topicId: "topic-ondas",
    topicTitle: "Ondas mecanicas",
  },
  {
    id: "resource-video-mas-1",
    title: "MAS y energia potencial",
    slug: "mas-y-energia-potencial",
    description: "Clase en video sobre resorte, periodo y conservacion de energia.",
    type: RESOURCE_TYPE.VIDEO,
    category: RESOURCE_CATEGORY.VIDEO,
    status: RESOURCE_STATUS.DRAFT,
    storageUrl: "https://example.com/videos/mas-energia",
    durationMinutes: 24,
    fileSizeMb: 315,
    publishedAt: null,
    courseId: "course-fisica-ondas",
    courseTitle: "Fisica General II",
    topicId: "topic-mas",
    topicTitle: "Movimiento armonico simple",
  },
];

export async function getCampusDashboardSeedData() {
  return {
    courses,
    topics,
    resources,
  };
}
