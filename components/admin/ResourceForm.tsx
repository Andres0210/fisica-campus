"use client";

import { saveResourceAction } from "@/app/admin/actions";
import {
  AdminCourseRecord,
  AdminResourceRecord,
  AdminTopicRecord,
  resourceCategoryLabels,
  resourceStatusOptions,
} from "@/lib/education-service";
import { apiClient } from "@/lib/api-client";
import { RESOURCE_CATEGORY, RESOURCE_TYPE, type ResourceCategory, type ResourceType } from "@/lib/campus-domain";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

type ResourceFormProps = {
  courses: AdminCourseRecord[];
  topics: AdminTopicRecord[];
  editingResource?: AdminResourceRecord | null;
};

type UploadedAssetState = {
  bucket: string;
  path: string;
  publicUrl: string;
  originalFileName: string;
  mimeType: string;
  fileSizeMb: number;
  detectedDurationMinutes: number | null;
  detectedDurationLabel: string | null;
};

const pdfCategories: ResourceCategory[] = [
  RESOURCE_CATEGORY.DOCUMENT,
  RESOURCE_CATEGORY.BOOK,
  RESOURCE_CATEGORY.BOOKLET,
];

function formatBytesToMb(size: number) {
  return Number((size / 1024 / 1024).toFixed(2));
}

function formatDurationLabel(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getRoundedDurationMinutes(totalSeconds: number) {
  return Math.max(1, Math.round(totalSeconds / 60));
}

function readVideoMetadata(file: File) {
  return new Promise<{ durationMinutes: number | null; durationLabel: string | null }>((resolve) => {
    if (!file.type.startsWith("video/")) {
      resolve({
        durationMinutes: null,
        durationLabel: null,
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const seconds = Number(video.duration);
      URL.revokeObjectURL(previewUrl);

      if (!Number.isFinite(seconds) || seconds <= 0) {
        resolve({
          durationMinutes: null,
          durationLabel: null,
        });
        return;
      }

      resolve({
        durationMinutes: getRoundedDurationMinutes(seconds),
        durationLabel: formatDurationLabel(seconds),
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      resolve({
        durationMinutes: null,
        durationLabel: null,
      });
    };

    video.src = previewUrl;
  });
}

export default function ResourceForm({
  courses,
  topics,
  editingResource,
}: ResourceFormProps) {
  const initialCourseId = editingResource?.courseId ?? courses[0]?.id ?? "";
  const initialType = editingResource?.type ?? RESOURCE_TYPE.VIDEO;

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedTopicId, setSelectedTopicId] = useState(editingResource?.topicId ?? "");
  const [resourceType, setResourceType] = useState<ResourceType>(initialType);
  const [category, setCategory] = useState<ResourceCategory>(
    editingResource?.category ?? (initialType === RESOURCE_TYPE.VIDEO ? RESOURCE_CATEGORY.VIDEO : RESOURCE_CATEGORY.DOCUMENT),
  );
  const [storageUrl, setStorageUrl] = useState(editingResource?.storageUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(editingResource?.thumbnailUrl ?? "");
  const [fileSizeMb, setFileSizeMb] = useState<string>(editingResource?.fileSizeMb ? String(editingResource.fileSizeMb) : "");
  const [durationMinutes, setDurationMinutes] = useState<string>(
    editingResource?.durationMinutes ? String(editingResource.durationMinutes) : "",
  );
  const [detectedDurationLabel, setDetectedDurationLabel] = useState<string | null>(null);
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAssetState | null>(
    editingResource
      ? {
          bucket: editingResource.storageBucket ?? "",
          path: editingResource.storagePath ?? "",
          publicUrl: editingResource.storageUrl,
          originalFileName: editingResource.originalFileName ?? editingResource.title,
          mimeType: editingResource.mimeType ?? "",
          fileSizeMb: editingResource.fileSizeMb ?? 0,
          detectedDurationMinutes: editingResource.durationMinutes ?? null,
          detectedDurationLabel: null,
        }
      : null,
  );
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "uploaded" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => topic.courseId === selectedCourseId);
  }, [selectedCourseId, topics]);

  const categoryOptions = resourceType === RESOURCE_TYPE.VIDEO ? [RESOURCE_CATEGORY.VIDEO] : pdfCategories;
  const showVideoFields = resourceType === RESOURCE_TYPE.VIDEO;
  const selectedTopic = filteredTopics.find((topic) => topic.id === selectedTopicId);

  useEffect(() => {
    if (resourceType === RESOURCE_TYPE.VIDEO) {
      setCategory(RESOURCE_CATEGORY.VIDEO);
      setFileSizeMb("");
      return;
    }

    setDurationMinutes("");

    if (!pdfCategories.includes(category)) {
      setCategory(RESOURCE_CATEGORY.DOCUMENT);
    }
  }, [category, resourceType]);

  useEffect(() => {
    if (!filteredTopics.length) {
      setSelectedTopicId("");
      return;
    }

    const topicStillExists = filteredTopics.some((topic) => topic.id === selectedTopicId);

    if (!topicStillExists) {
      setSelectedTopicId(filteredTopics[0].id);
    }
  }, [filteredTopics, selectedTopicId]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadStatus("uploading");
    setUploadMessage("Subiendo archivo y analizando metadatos...");

    try {
      const [videoMetadata, uploaded] = await Promise.all([
        readVideoMetadata(file),
        (async () => {
          const formData = new FormData();
          formData.set("file", file);
          formData.set("folder", "academic-resources");
          return apiClient.uploadResourceAsset(formData) as Promise<{
            bucket: string;
            path: string;
            publicUrl: string;
            originalFileName: string;
            mimeType: string;
            fileSizeMb: number;
          }>;
        })(),
      ]);

      const nextAsset: UploadedAssetState = {
        ...uploaded,
        fileSizeMb: uploaded.fileSizeMb || formatBytesToMb(file.size),
        detectedDurationMinutes: videoMetadata.durationMinutes,
        detectedDurationLabel: videoMetadata.durationLabel,
      };

      setUploadedAsset(nextAsset);
      setStorageUrl(nextAsset.publicUrl);
      setUploadStatus("uploaded");
      setUploadMessage("Archivo cargado correctamente. Ya puedes guardar el recurso.");

      if (resourceType === RESOURCE_TYPE.VIDEO) {
        setDurationMinutes(nextAsset.detectedDurationMinutes ? String(nextAsset.detectedDurationMinutes) : "");
      } else {
        setFileSizeMb(String(nextAsset.fileSizeMb));
      }

      setDetectedDurationLabel(videoMetadata.durationLabel);
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage(error instanceof Error ? error.message : "No se pudo cargar el archivo.");
    }
  }

  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Repositorio Docente</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {editingResource ? "Editar recurso" : "Crear recurso"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Relaciona cada material con una asignatura y un tema. El archivo se carga primero y
            luego solo confirmas los datos del recurso.
          </p>
        </div>
        <div className="rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-medium text-primary">
          Videos, documentos, libros y cartillas
        </div>
      </div>

      <form action={saveResourceAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="resourceId" value={editingResource?.id ?? ""} />
        <input type="hidden" name="storageBucket" value={uploadedAsset?.bucket ?? ""} />
        <input type="hidden" name="storagePath" value={uploadedAsset?.path ?? ""} />
        <input type="hidden" name="originalFileName" value={uploadedAsset?.originalFileName ?? ""} />
        <input type="hidden" name="mimeType" value={uploadedAsset?.mimeType ?? ""} />

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Titulo</span>
          <input
            name="title"
            defaultValue={editingResource?.title ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Ej. Guia de laboratorio de ondas"
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Slug opcional</span>
          <input
            name="slug"
            defaultValue={editingResource?.slug ?? ""}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Se autogenera si lo dejas vacio"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Tipo de recurso</span>
          <select
            name="type"
            value={resourceType}
            onChange={(event) => setResourceType(event.target.value as ResourceType)}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
          >
            <option value={RESOURCE_TYPE.VIDEO}>Video</option>
            <option value={RESOURCE_TYPE.PDF}>PDF</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Categoria editorial</span>
          <select
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ResourceCategory)}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            disabled={resourceType === RESOURCE_TYPE.VIDEO}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {resourceCategoryLabels[option]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Asignatura</span>
          <select
            name="courseId"
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            required
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Tema</span>
          <select
            name="topicId"
            value={selectedTopicId}
            onChange={(event) => setSelectedTopicId(event.target.value)}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            required
            disabled={!filteredTopics.length}
          >
            {filteredTopics.length ? (
              filteredTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  Unidad {topic.position} · {topic.title}
                </option>
              ))
            ) : (
              <option value="">Crea primero un tema para esta asignatura</option>
            )}
          </select>
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="text-muted-foreground">Descripcion</span>
          <textarea
            name="description"
            defaultValue={editingResource?.description ?? ""}
            className="min-h-32 rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Objetivo, alcance del recurso y observaciones para los estudiantes."
            required
          />
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="text-muted-foreground">Archivo del recurso</span>
          <input
            type="file"
            name="resourceFile"
            className="rounded-2xl border border-dashed border-border/70 bg-background/70 px-4 py-3"
            accept=".pdf,.mp4,.mov,.webm,.m4v"
            onChange={handleFileChange}
          />
          <span className="text-xs text-muted-foreground">
            Sube primero el archivo para obtener automaticamente la URL publica y los metadatos.
          </span>
        </label>

        <div className="md:col-span-2 rounded-[1.5rem] border border-border/70 bg-background/65 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Resumen del archivo</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {uploadStatus === "idle"
                  ? "Aun no has cargado un archivo. Tambien puedes pegar una URL manual."
                  : uploadMessage}
              </p>
            </div>
            {uploadStatus === "uploading" ? (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                Subiendo...
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Archivo</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {uploadedAsset?.originalFileName ?? "Sin archivo cargado"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {uploadedAsset?.mimeType || "El sistema detectara el tipo automaticamente"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tema asociado</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {selectedTopic?.title ?? "Selecciona una asignatura y un tema"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedTopic ? `Unidad ${selectedTopic.position} de ${selectedTopic.courseTitle}` : "Esto ayuda a organizar el recurso para los estudiantes."}
              </p>
            </div>
          </div>
        </div>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="text-muted-foreground">URL del recurso</span>
          <input
            name="storageUrl"
            value={storageUrl}
            onChange={(event) => setStorageUrl(event.target.value)}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="Se completa automaticamente si subes archivo. Tambien puedes pegar una URL."
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Miniatura opcional</span>
          <input
            name="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            placeholder="https://..."
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Estado</span>
          <select
            name="status"
            defaultValue={editingResource?.status ?? "DRAFT"}
            className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
          >
            {resourceStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {showVideoFields ? (
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Duracion detectada</span>
            <input
              type="text"
              value={detectedDurationLabel ?? (durationMinutes ? `${durationMinutes} min aprox.` : "")}
              readOnly
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-muted-foreground"
              placeholder="Se detecta automaticamente al subir el video"
            />
            <input type="hidden" name="durationMinutes" value={durationMinutes} />
          </label>
        ) : (
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Tamano del archivo (MB)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              name="fileSizeMb"
              value={fileSizeMb}
              onChange={(event) => setFileSizeMb(event.target.value)}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              placeholder="Se completa automaticamente al subir el archivo"
            />
          </label>
        )}

        <div className="md:col-span-2 rounded-[1.5rem] border border-border/70 bg-background/65 p-4 text-sm leading-6 text-muted-foreground">
          Flujo recomendado: crea primero la asignatura y el tema. Luego sube el archivo, revisa la
          URL y finalmente guarda el recurso. Los autores se gestionan en su propia seccion, aparte
          del repositorio de materiales.
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            {editingResource ? "Guardar cambios" : "Crear recurso"}
          </button>
          <a
            href="/admin/resources"
            className="rounded-full border border-border/70 px-5 py-3 text-sm font-medium text-muted-foreground"
          >
            Limpiar formulario
          </a>
        </div>
      </form>
    </section>
  );
}
