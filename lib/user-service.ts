import { apiClient } from "@/lib/api-client";

export type AdminUserRole = "TEACHER" | "ASSISTANT" | "STUDENT";

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  createdAt: string;
  updatedAt?: string;
};

export type CreateAdminUserInput = {
  name: string;
  email: string;
  password: string;
  role: AdminUserRole;
};

export function getAdminUsers() {
  return apiClient.getUsers() as Promise<AdminUserRecord[]>;
}

export function createAdminUser(input: CreateAdminUserInput) {
  return apiClient.createUser(input) as Promise<AdminUserRecord>;
}
