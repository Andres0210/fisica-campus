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

function redirectWithError(message: string) {
  redirect(`/admin?error=${encodeURIComponent(message)}`);
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
}

export async function saveCourseAction(formData: FormData) {
  await requireTeacherSession();

  try {
    const courseId = String(formData.get("courseId") ?? "").trim();
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
    redirect("/admin");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "No se pudo guardar la asignatura.");
  }
}

export async function deleteCourseAction(formData: FormData) {
  await requireTeacherSession();

  const courseId = String(formData.get("courseId") ?? "").trim();

  if (!courseId) {
    redirectWithError("No se encontro la asignatura que querias eliminar.");
  }

  try {
    await deleteCourse(courseId);
    refreshContentRoutes();
    redirect("/admin");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "No se pudo eliminar la asignatura.");
  }
}

export async function saveTopicAction(formData: FormData) {
  await requireTeacherSession();

  try {
    const topicId = String(formData.get("topicId") ?? "").trim();
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
    redirect("/admin");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "No se pudo guardar el tema.");
  }
}

export async function deleteTopicAction(formData: FormData) {
  await requireTeacherSession();

  const topicId = String(formData.get("topicId") ?? "").trim();

  if (!topicId) {
    redirectWithError("No se encontro el tema que querias eliminar.");
  }

  try {
    await deleteTopic(topicId);
    refreshContentRoutes();
    redirect("/admin");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "No se pudo eliminar el tema.");
  }
}

export async function saveResourceAction(formData: FormData) {
  await requireTeacherSession();

  try {
    const resourceId = String(formData.get("resourceId") ?? "").trim();
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
    redirect("/admin");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "No se pudo guardar el recurso.");
  }
}

export async function deleteResourceAction(formData: FormData) {
  await requireTeacherSession();

  const resourceId = String(formData.get("resourceId") ?? "").trim();

  if (!resourceId) {
    redirectWithError("No se encontro el recurso que querias eliminar.");
  }

  try {
    await deleteResource(resourceId);
    refreshContentRoutes();
    redirect("/admin");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "No se pudo eliminar el recurso.");
  }
}

export async function updateResourceStatusAction(formData: FormData) {
  await requireTeacherSession();

  const resourceId = String(formData.get("resourceId") ?? "").trim();
  const status = String(formData.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";

  if (!resourceId) {
    redirectWithError("No se encontro el recurso que querias actualizar.");
  }

  try {
    await updateResourceStatus(resourceId, status);
    refreshContentRoutes();
    redirect("/admin");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "No se pudo actualizar la visibilidad.");
  }
}

export async function saveAuthorAction(formData: FormData) {
  await requireTeacherSession();

  try {
    const authorId = String(formData.get("authorId") ?? "").trim();
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
    redirect("/admin/authors");
  } catch (error) {
    redirect(`/admin/authors?error=${encodeURIComponent(error instanceof Error ? error.message : "No se pudo guardar el autor.")}`);
  }
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
    redirect("/admin/authors");
  } catch (error) {
    redirect(`/admin/authors?error=${encodeURIComponent(error instanceof Error ? error.message : "No se pudo eliminar el autor.")}`);
  }
}

export async function logoutTeacherAction() {
  await clearTeacherSession();
  redirect("/admin/login");
}
