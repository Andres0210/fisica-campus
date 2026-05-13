"use server";

import { clearTeacherSession, requireTeacherSession } from "@/lib/auth";
import {
  createAuthor,
  createCourse,
  createResource,
  createTopic,
  deleteAuthor,
  deleteCourse,
  deleteResource,
  deleteTopic,
  updateAuthor,
  updateCourse,
  updateResource,
  updateResourceStatus,
  updateTopic,
} from "@/lib/education-service";
import { createAdminUser } from "@/lib/user-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on";
}

function parseInteger(value: FormDataEntryValue | null, fallback = 1) {
  const parsed = Number(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDecimal(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function redirectWithError(path: string, message: string) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(path: string, message: string) {
  redirect(`${path}?success=${encodeURIComponent(message)}`);
}

function refreshContentRoutes() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/authors");
  revalidatePath("/student");
  revalidatePath("/autores");
  revalidatePath("/videos");
  revalidatePath("/documentos");
  revalidatePath("/cartillas");
  revalidatePath("/libros");
  revalidatePath("/materias");
}

function refreshAdminUsersRoutes() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function saveCourseAction(formData: FormData) {
  await requireTeacherSession();

  const courseId = String(formData.get("courseId") ?? "").trim();
  const successMessage = courseId
    ? "Asignatura actualizada correctamente."
    : "Asignatura creada correctamente.";

  try {
    const payload = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? ""),
      level: String(formData.get("level") ?? "BASIC") as "BASIC" | "INTERMEDIATE" | "ADVANCED",
      isPublished: parseBoolean(formData.get("isPublished")),
    };

    if (courseId) {
      await updateCourse(courseId, payload);
    } else {
      await createCourse(payload);
    }

    refreshContentRoutes();
  } catch (error) {
    redirectWithError("/admin/courses", error instanceof Error ? error.message : "No se pudo guardar la asignatura.");
  }

  redirectWithSuccess("/admin/courses", successMessage);
}

export async function deleteCourseAction(formData: FormData) {
  await requireTeacherSession();

  const courseId = String(formData.get("courseId") ?? "").trim();

  if (!courseId) {
    redirectWithError("/admin/courses", "No se encontro la asignatura que querias eliminar.");
  }

  try {
    await deleteCourse(courseId);
    refreshContentRoutes();
  } catch (error) {
    redirectWithError("/admin/courses", error instanceof Error ? error.message : "No se pudo eliminar la asignatura.");
  }

  redirectWithSuccess("/admin/courses", "Asignatura eliminada correctamente.");
}

export async function saveTopicAction(formData: FormData) {
  await requireTeacherSession();

  const topicId = String(formData.get("topicId") ?? "").trim();
  const successMessage = topicId
    ? "Tema actualizado correctamente."
    : "Tema creado correctamente.";

  try {
    const payload = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? ""),
      position: parseInteger(formData.get("position"), 1),
      courseId: String(formData.get("courseId") ?? ""),
    };

    if (topicId) {
      await updateTopic(topicId, payload);
    } else {
      await createTopic(payload);
    }

    refreshContentRoutes();
  } catch (error) {
    redirectWithError("/admin/topics", error instanceof Error ? error.message : "No se pudo guardar el tema.");
  }

  redirectWithSuccess("/admin/topics", successMessage);
}

export async function deleteTopicAction(formData: FormData) {
  await requireTeacherSession();

  const topicId = String(formData.get("topicId") ?? "").trim();

  if (!topicId) {
    redirectWithError("/admin/topics", "No se encontro el tema que querias eliminar.");
  }

  try {
    await deleteTopic(topicId);
    refreshContentRoutes();
  } catch (error) {
    redirectWithError("/admin/topics", error instanceof Error ? error.message : "No se pudo eliminar el tema.");
  }

  redirectWithSuccess("/admin/topics", "Tema eliminado correctamente.");
}

export async function saveResourceAction(formData: FormData) {
  await requireTeacherSession();

  const resourceId = String(formData.get("resourceId") ?? "").trim();
  const successMessage = resourceId
    ? "Recurso actualizado correctamente."
    : "Recurso creado correctamente.";

  try {
    const type = String(formData.get("type") ?? "VIDEO") as "VIDEO" | "PDF";
    const payload = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? ""),
      type,
      category: String(formData.get("category") ?? "VIDEO") as "VIDEO" | "DOCUMENT" | "BOOK" | "BOOKLET",
      status: String(formData.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      storageUrl: String(formData.get("storageUrl") ?? ""),
      storageBucket: String(formData.get("storageBucket") ?? "") || undefined,
      storagePath: String(formData.get("storagePath") ?? "") || undefined,
      originalFileName: String(formData.get("originalFileName") ?? "") || undefined,
      mimeType: String(formData.get("mimeType") ?? "") || undefined,
      thumbnailUrl: String(formData.get("thumbnailUrl") ?? ""),
      durationMinutes: type === "VIDEO" ? parseDecimal(formData.get("durationMinutes")) : null,
      fileSizeMb: type === "PDF" ? parseDecimal(formData.get("fileSizeMb")) : null,
      courseId: String(formData.get("courseId") ?? ""),
      topicId: String(formData.get("topicId") ?? ""),
    };

    if (resourceId) {
      await updateResource(resourceId, payload);
    } else {
      await createResource(payload);
    }

    refreshContentRoutes();
  } catch (error) {
    redirectWithError("/admin/resources", error instanceof Error ? error.message : "No se pudo guardar el recurso.");
  }

  redirectWithSuccess("/admin/resources", successMessage);
}

export async function deleteResourceAction(formData: FormData) {
  await requireTeacherSession();

  const resourceId = String(formData.get("resourceId") ?? "").trim();

  if (!resourceId) {
    redirectWithError("/admin/resources", "No se encontro el recurso que querias eliminar.");
  }

  try {
    await deleteResource(resourceId);
    refreshContentRoutes();
  } catch (error) {
    redirectWithError("/admin/resources", error instanceof Error ? error.message : "No se pudo eliminar el recurso.");
  }

  redirectWithSuccess("/admin/resources", "Recurso eliminado correctamente.");
}

export async function updateResourceStatusAction(formData: FormData) {
  await requireTeacherSession();

  const resourceId = String(formData.get("resourceId") ?? "").trim();
  const status = String(formData.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";

  if (!resourceId) {
    redirectWithError("/admin/resources", "No se encontro el recurso que querias actualizar.");
  }

  try {
    await updateResourceStatus(resourceId, status);
    refreshContentRoutes();
  } catch (error) {
    redirectWithError("/admin/resources", error instanceof Error ? error.message : "No se pudo actualizar la visibilidad.");
  }

  redirectWithSuccess(
    "/admin/resources",
    status === "PUBLISHED" ? "Recurso publicado correctamente." : "Recurso ocultado correctamente.",
  );
}

export async function saveAuthorAction(formData: FormData) {
  await requireTeacherSession();

  const authorId = String(formData.get("authorId") ?? "").trim();
  const successMessage = authorId
    ? "Autor actualizado correctamente."
    : "Autor creado correctamente.";

  try {
    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      profession: String(formData.get("profession") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      avatarUrl: String(formData.get("avatarUrl") ?? ""),
    };

    if (authorId) {
      await updateAuthor(authorId, payload);
    } else {
      await createAuthor(payload);
    }

    refreshContentRoutes();
  } catch (error) {
    redirect(`/admin/authors?error=${encodeURIComponent(error instanceof Error ? error.message : "No se pudo guardar el autor.")}`);
  }

  redirectWithSuccess("/admin/authors", successMessage);
}

export async function deleteAuthorAction(formData: FormData) {
  await requireTeacherSession();

  const authorId = String(formData.get("authorId") ?? "").trim();

  if (!authorId) {
    redirect(`/admin/authors?error=${encodeURIComponent("No se encontro el autor que querias eliminar.")}`);
  }

  try {
    await deleteAuthor(authorId);
    refreshContentRoutes();
  } catch (error) {
    redirect(`/admin/authors?error=${encodeURIComponent(error instanceof Error ? error.message : "No se pudo eliminar el autor.")}`);
  }

  redirectWithSuccess("/admin/authors", "Autor eliminado correctamente.");
}

export async function saveUserAction(formData: FormData) {
  await requireTeacherSession();

  try {
    await createAdminUser({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? "ASSISTANT") as "TEACHER" | "ASSISTANT" | "STUDENT",
    });

    refreshAdminUsersRoutes();
  } catch (error) {
    redirect(`/admin/users?error=${encodeURIComponent(error instanceof Error ? error.message : "No se pudo crear el usuario.")}`);
  }

  redirectWithSuccess("/admin/users", "Usuario creado correctamente.");
}

export async function logoutTeacherAction() {
  await clearTeacherSession();
  redirect("/admin/login");
}
