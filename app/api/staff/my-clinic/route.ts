import { NextRequest, NextResponse } from "next/server";
import { staffService } from "@/lib/api/staff";
import { applyAuthCookies, getServerAccessToken } from "@/lib/api/server-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await getServerAccessToken(request);

    if (!auth.token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const response = await staffService.getMyClinic(auth.token);
    return applyAuthCookies(
      NextResponse.json({ success: true, data: response }),
      auth
    );
  } catch (error: any) {
    console.error("Get staff clinic error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch clinic" },
      { status: error.status || 500 }
    );
  }
}
