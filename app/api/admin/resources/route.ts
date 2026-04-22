import { getAdminResourceDashboard } from "@/lib/admin-resource-service";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getAdminResourceDashboard();

  return NextResponse.json({
    resources: data.resources,
    courses: data.courses,
    topics: data.topics,
    source: data.source,
  });
}
