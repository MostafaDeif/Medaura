import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/api/admin";
import { applyAuthCookies, getServerAccessToken } from "@/lib/api/server-auth";

export async function GET(request: NextRequest) {
  const auth = await getServerAccessToken(request);

  if (!auth.token) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const response = await adminService.listDoctors(auth.token);

    return applyAuthCookies(
      NextResponse.json({ success: true, data: response }),
      auth
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch verified doctors";
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    console.error("List verified doctors error:", error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}