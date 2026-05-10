import { getPublicNavigation } from "@/lib/navigation-service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const navigation = await getPublicNavigation();

  return NextResponse.json(navigation);
}
