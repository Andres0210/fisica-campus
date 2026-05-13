import { getTeacherSession } from "@/lib/auth";
import { NextResponse } from "next/server";

function getBackendUploadUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Falta API_BASE_URL o NEXT_PUBLIC_API_BASE_URL en el frontend.");
  }

  return `${baseUrl.replace(/\/$/, "")}/resources/upload`;
}

export async function POST(request: Request) {
  const session = await getTeacherSession();

  if (!session) {
    return NextResponse.json(
      { message: "Debes iniciar sesion para subir archivos." },
      { status: 401 },
    );
  }

  const adminToken = process.env.ADMIN_API_TOKEN;

  if (!adminToken) {
    return NextResponse.json(
      { message: "Falta ADMIN_API_TOKEN en el frontend." },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const response = await fetch(getBackendUploadUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: formData,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo subir el archivo.",
      },
      { status: 500 },
    );
  }
}
