export const USER_ROLE = {
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  ASSISTANT: "ASSISTANT",
} as const;

export const COURSE_LEVEL = {
  BASIC: "BASIC",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
} as const;

export const RESOURCE_TYPE = {
  VIDEO: "VIDEO",
  PDF: "PDF",
} as const;

export const RESOURCE_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type CourseLevel = (typeof COURSE_LEVEL)[keyof typeof COURSE_LEVEL];
export type ResourceType = (typeof RESOURCE_TYPE)[keyof typeof RESOURCE_TYPE];
export type ResourceStatus = (typeof RESOURCE_STATUS)[keyof typeof RESOURCE_STATUS];
