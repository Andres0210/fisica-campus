export type SubjectSlug = "fisica-2" | "fisica-3";

export type SimulatorItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: "validado" | "recomendado";
  note: string;
};

export type ResourceItem = {
  url?: any;
  file?: any;
  pdf?: any;
  id: string;
  title: string;
  description: string;
  subject: SubjectSlug;
  format: string;
  tags?: string[]; 
  simulatorId?: string; 
  cover?: string; 
  pages?: number; 
};

export type AuthorItem = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  image?: string;
};

export type SubjectContent = {
  slug: SubjectSlug;
  title: string;
  shortTitle: string;
  description: string;
  focus: string;
  simulatorValidation: string;
  simulators: SimulatorItem[];
};

export const subjects: SubjectContent[] = [
  {
    slug: "fisica-2",
    title: "Fisica II",
    shortTitle: "Fisica II",
    description:
      "Asignatura orientada a oscilaciones y elasticidad como base del movimiento armonico.",
    focus:
      "Se inicia con el sistema masa-resorte como fundamento para comprender el movimiento armonico simple.",
    simulatorValidation:
      "Se prioriza un unico simulador bien construido antes de expandir a otros fenomenos.",
    simulators: [
      {
        id: "hooke",
        title: "Sistema masa-resorte (Movimiento Armónico Simple)",
        summary:
          "Simulación del oscilador masa-resorte con posición, velocidad, energía, frecuencia y periodo.",
        category: "Elasticidad y oscilaciones",
        status: "validado",
        note:
          "Integra Ley de Hooke y M.A.S. en una experiencia completa.",
      },
    ],
  },

  {
    slug: "fisica-3",
    title: "Fisica III",
    shortTitle: "Fisica III",
    description:
      "Asignatura enfocada en ondas mecanicas, propagacion y fenomenos ondulatorios.",
    focus:
      "Se construye a partir de la relacion entre vibracion y propagacion de ondas en distintos medios.",
    simulatorValidation:
      "Se inicia con un simulador base de onda en cuerda que permite entender propagacion, frecuencia y longitud de onda.",
    simulators: [
      {
        id: "wave",
        title: "Onda en cuerda (propagación de ondas)",
        summary:
          "Simulación de una onda mecánica en una cuerda con control de tensión, densidad, frecuencia y fuente oscilante.",
        category: "Ondas mecanicas",
        status: "validado",
        note:
          "Este simulador es la base para comprender propagación, velocidad de onda y relación entre frecuencia y longitud de onda.",
      },
    ],
  },
];

export const videos: ResourceItem[] = [
  {
    id: "video-f2-1",
    title: "Ley de Hooke explicada en 60 segundos",
    description: "Resumen rapido para introducir constante elastica...",
    subject: "fisica-2",
    format: "Reel",
    tags: ["Elasticidad", "Hooke", "Fuerza"],
    simulatorId: "hooke", // 🔥 conexión directa
  },
  {
    id: "video-f2-2",
    title: "Campo electrico alrededor de cargas puntuales",
    description: "Visualizacion conceptual...",
    subject: "fisica-2",
    format: "Reel",
    tags: ["Campo eléctrico", "Cargas"],
    simulatorId: "electric-field",
  },
];

export const documents: ResourceItem[] = [
  {
    id: "doc-f2-1",
    title: "Guia de ejercicios de oscilaciones",
    description:
      "Serie de problemas sobre Hooke, periodo, frecuencia y energia.",
    subject: "fisica-2",
    format: "PDF",
  },
  {
    id: "doc-f2-2",
    title: "Taller de electrostatica",
    description: "Fuerza electrica, campo, potencial y movimiento de cargas.",
    subject: "fisica-2",
    format: "PDF",
  },
  {
    id: "doc-f3-1",
    title: "Guia de ondas mecanicas",
    description:
      "Lectura de amplitud, longitud de onda, velocidad de propagacion e interferencia.",
    subject: "fisica-3",
    format: "PDF",
  },
  {
    id: "doc-f3-2",
    title: "Laboratorio de sonido y vibraciones",
    description:
      "Practica orientada a tono, frecuencia e intensidad con preguntas de analisis.",
    subject: "fisica-3",
    format: "PDF",
  },
];

export const booklets: ResourceItem[] = [
  {
    id: "cartilla-f2-1",
    title: "Cartilla de oscilaciones y elasticidad",
    description:
      "Material de apoyo con teoria resumida, ejemplos y ejercicios guiados.",
    subject: "fisica-2",
    format: "Cartilla",
  //  cover: "/booklets/oscillations.jpg",
    pages: 120,
  },
  {
    id: "cartilla-f2-2",
    title: "Cartilla de electrostatica aplicada",
    description:
      "Apoyo conceptual para ley de Coulomb, campo electrico y circuitos basicos.",
    subject: "fisica-2",
    format: "Cartilla",
  //  cover: "/booklets/electrostatics.jpg",
    pages: 95,
  },
  {
    id: "cartilla-f3-1",
    title: "Cartilla de ondas y sonido",
    description:
      "Explica modelos de propagacion, vibracion e interferencia con apoyo grafico.",
    subject: "fisica-3",
    format: "Cartilla",
   // cover: "/booklets/waves.jpg",
    pages: 110,
  },
];

export const authors: AuthorItem[] = [
  {
    id: "autor-1",
    name: "Laura Mendoza",
    role: "Fisica teorica",
    avatar: "LM",
    bio: "Docente universitaria enfocada en mecanica, oscilaciones y desarrollo de recursos didacticos interactivos.",
    image: "/authors/mujer1.png",
  },
  {
    id: "autor-2",
    name: "Carlos Ramirez",
    role: "Ingeniero electrico",
    avatar: "CR",
    bio: "Profesor de electromagnetismo y circuitos, con interes en visualizacion computacional de fenomenos electricos.",
    image: "/authors/hombre1.png",
  },
  {
    id: "autor-3",
    name: "Ana Torres",
    role: "Fisica experimental",
    avatar: "AT",
    bio: "Trabaja en laboratorio de ondas y sonido; disena experiencias de aula centradas en comprension conceptual.",
    image: "/authors/mujer2.png",
  },
  {
    id: "autor-4",
    name: "Miguel Pardo",
    role: "Divulgador cientifico",
    avatar: "MP",
    bio: "Produce materiales breves y visuales para estudiantes de primeros semestres en cursos de fisica general.",
    image: "/authors/hombre2.png",
  },
];

export function getSubject(slug: string) {
  return subjects.find((subject) => subject.slug === slug);
}

export function getSubjectLabel(slug: SubjectSlug) {
  return getSubject(slug)?.title ?? slug;
}

export function getResourcesByType(
  type: "videos" | "documentos" | "cartillas",
  subject?: SubjectSlug,
) {
  const source =
    type === "videos" ? videos : type === "documentos" ? documents : booklets;

  return subject ? source.filter((item) => item.subject === subject) : source;
}

export function getResourceById(
  type: "videos" | "documentos" | "cartillas",
  id: string
) {
  const source =
    type === "videos"
      ? videos
      : type === "documentos"
      ? documents
      : booklets;

  return source.find((item) => item.id === id);
}
