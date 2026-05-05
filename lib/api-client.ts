const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

function buildQuery(query?: Record<string, string | number | boolean | undefined | null>) {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    params.set(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

async function apiRequest<T>(path: string, init?: RequestOptions): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;

    try {
      const payload = (await response.json()) as { message?: string; error?: string };
      message = payload.message ?? payload.error ?? message;
    } catch {
      // Keep generic message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  getAuthors: (query?: { search?: string }) =>
    apiRequest(`/authors${buildQuery(query)}`),
  createAuthor: (body: unknown) =>
    apiRequest("/authors", { method: "POST", body }),
  updateAuthor: (id: string, body: unknown) =>
    apiRequest(`/authors/${id}`, { method: "PATCH", body }),
  deleteAuthor: (id: string) =>
    apiRequest(`/authors/${id}`, { method: "DELETE" }),

  getCourses: () =>
    apiRequest("/courses"),
  getCourse: (id: string) =>
    apiRequest(`/courses/${id}`),
  createCourse: (body: unknown) =>
    apiRequest("/courses", { method: "POST", body }),
  updateCourse: (id: string, body: unknown) =>
    apiRequest(`/courses/${id}`, { method: "PATCH", body }),
  deleteCourse: (id: string) =>
    apiRequest(`/courses/${id}`, { method: "DELETE" }),

  getTopics: (query?: { courseId?: string }) =>
    apiRequest(`/topics${buildQuery(query)}`),
  getTopic: (id: string) =>
    apiRequest(`/topics/${id}`),
  createTopic: (body: unknown) =>
    apiRequest("/topics", { method: "POST", body }),
  updateTopic: (id: string, body: unknown) =>
    apiRequest(`/topics/${id}`, { method: "PATCH", body }),
  deleteTopic: (id: string) =>
    apiRequest(`/topics/${id}`, { method: "DELETE" }),

  getResources: (query?: Record<string, string | number | boolean | undefined | null>) =>
    apiRequest(`/resources${buildQuery(query)}`),
  getResource: (id: string) =>
    apiRequest(`/resources/${id}`),
  uploadResourceAsset: async (formData: FormData) => {
    const response = await fetch(buildUrl("/resources/upload"), {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      let message = `Upload failed with status ${response.status}`;

      try {
        const payload = (await response.json()) as { message?: string; error?: string };
        message = payload.message ?? payload.error ?? message;
      } catch {
        // Keep generic message.
      }

      throw new Error(message);
    }

    return response.json();
  },
  createResource: (body: unknown) =>
    apiRequest("/resources", { method: "POST", body }),
  updateResource: (id: string, body: unknown) =>
    apiRequest(`/resources/${id}`, { method: "PATCH", body }),
  deleteResource: (id: string) =>
    apiRequest(`/resources/${id}`, { method: "DELETE" }),
  getCatalog: (kind: "videos" | "documentos" | "libros" | "cartillas", subject?: string) =>
    apiRequest(`/resources/catalog/${kind}${buildQuery({ subject })}`),
};
