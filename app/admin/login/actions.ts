"use server";

import { authenticateTeacher } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginTeacherAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  // Validación básica
  if (!email || !password || password.length < 4) {
    redirect(
      `/admin/login?error=Datos%20invalidos&email=${encodeURIComponent(email)}`
    );
  }

  // Delay simple anti fuerza bruta
  await new Promise((r) => setTimeout(r, 700));

  const session = await authenticateTeacher(email, password);

  if (!session) {
    redirect(
      `/admin/login?error=Credenciales%20invalidas&email=${encodeURIComponent(
        email
      )}`
    );
  }

  redirect("/admin");
}