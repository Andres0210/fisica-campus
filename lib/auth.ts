import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE_NAME = "fisica-campus-teacher-session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

const DEFAULT_TEACHER_EMAIL = "laura.mendoza@universidad.edu";
const DEFAULT_TEACHER_PASSWORD = "ProfesoraAreandina2026!";
const DEFAULT_TEACHER_NAME = "Dra. Laura Mendoza";

type TeacherSessionPayload = {
  email: string;
  name: string;
  role: "TEACHER";
  expiresAt: number;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? "fisica-campus-dev-secret";
}

function signPayload(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

function encodeSession(payload: TeacherSessionPayload) {
  const rawPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(rawPayload);
  return `${rawPayload}.${signature}`;
}

function decodeSession(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [rawPayload, signature] = token.split(".");

  if (!rawPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(rawPayload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(rawPayload, "base64url").toString("utf8")) as TeacherSessionPayload;

    if (payload.role !== "TEACHER" || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getTeacherCredentials() {
  return {
    email: process.env.TEACHER_EMAIL ?? DEFAULT_TEACHER_EMAIL,
    password: process.env.TEACHER_PASSWORD ?? DEFAULT_TEACHER_PASSWORD,
    name: process.env.TEACHER_NAME ?? DEFAULT_TEACHER_NAME,
  };
}

export async function createTeacherSession() {
  const credentials = getTeacherCredentials();
  const payload: TeacherSessionPayload = {
    email: credentials.email,
    name: credentials.name,
    role: "TEACHER",
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });

  return payload;
}

export async function clearTeacherSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getTeacherSession() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireTeacherSession() {
  const session = await getTeacherSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function authenticateTeacher(email: string, password: string) {
  const credentials = getTeacherCredentials();

  if (email !== credentials.email || password !== credentials.password) {
    return null;
  }

  return createTeacherSession();
}
