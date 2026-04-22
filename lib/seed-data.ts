import {
  COURSE_LEVEL,
  RESOURCE_STATUS,
  RESOURCE_TYPE,
  USER_ROLE,
  type CourseLevel,
  type ResourceStatus,
  type ResourceType,
  type UserRole,
} from "@/lib/campus-domain";

export const seedUsers: Array<{
  id: string;
  name: string;
  email: string;
  role: UserRole;
}> = [
  {
    id: "teacher-fisica-1",
    name: "Dra. Laura Mendoza",
    email: "laura.mendoza@universidad.edu",
    role: USER_ROLE.TEACHER,
  },
];

export const seedCourses: Array<{
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  isPublished: boolean;
}> = [
  {
    id: "course-fisica-ondas",
    title: "Fisica General II",
    slug: "fisica-general-ii",
    description: "Curso enfocado en ondas, oscilaciones, sonido y fenomenos de interferencia.",
    level: COURSE_LEVEL.INTERMEDIATE,
    isPublished: true,
  },
];

export const seedTopics: Array<{
  id: string;
  title: string;
  slug: string;
  description: string;
  position: number;
  courseId: string;
}> = [
  {
    id: "topic-ondas",
    title: "Ondas mecanicas",
    slug: "ondas-mecanicas",
    description: "Introduccion a amplitud, frecuencia, fase y velocidad de propagacion.",
    position: 1,
    courseId: "course-fisica-ondas",
  },
  {
    id: "topic-mas",
    title: "Movimiento armonico simple",
    slug: "movimiento-armonico-simple",
    description: "Resortes, energia y oscilaciones amortiguadas.",
    position: 2,
    courseId: "course-fisica-ondas",
  },
];

export const seedResources: Array<{
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ResourceType;
  status: ResourceStatus;
  storageUrl: string;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  fileSizeMb: number | null;
  publishedAt: Date | null;
  authorId: string;
  courseId: string;
  topicId: string;
}> = [
  {
    id: "resource-video-ondas-1",
    title: "Introduccion a ondas mecanicas",
    slug: "introduccion-ondas-mecanicas",
    description: "Video introductorio para entender amplitud, frecuencia y longitud de onda.",
    type: RESOURCE_TYPE.VIDEO,
    status: RESOURCE_STATUS.PUBLISHED,
    storageUrl: "https://example.com/videos/ondas-intro",
    thumbnailUrl: null,
    durationMinutes: 18,
    fileSizeMb: 240,
    publishedAt: new Date("2026-04-16T09:00:00.000Z"),
    authorId: "teacher-fisica-1",
    courseId: "course-fisica-ondas",
    topicId: "topic-ondas",
  },
  {
    id: "resource-pdf-ondas-1",
    title: "Guia PDF de ondas",
    slug: "guia-pdf-ondas",
    description: "Documento con teoria, ejercicios base y preguntas orientadoras.",
    type: RESOURCE_TYPE.PDF,
    status: RESOURCE_STATUS.PUBLISHED,
    storageUrl: "https://example.com/docs/guia-ondas.pdf",
    thumbnailUrl: null,
    durationMinutes: null,
    fileSizeMb: 4.8,
    publishedAt: new Date("2026-04-15T12:00:00.000Z"),
    authorId: "teacher-fisica-1",
    courseId: "course-fisica-ondas",
    topicId: "topic-ondas",
  },
  {
    id: "resource-video-mas-1",
    title: "MAS y energia potencial",
    slug: "mas-y-energia-potencial",
    description: "Clase en video sobre resorte, periodo y conservacion de energia.",
    type: RESOURCE_TYPE.VIDEO,
    status: RESOURCE_STATUS.DRAFT,
    storageUrl: "https://example.com/videos/mas-energia",
    thumbnailUrl: null,
    durationMinutes: 24,
    fileSizeMb: 315,
    publishedAt: null,
    authorId: "teacher-fisica-1",
    courseId: "course-fisica-ondas",
    topicId: "topic-mas",
  },
];
