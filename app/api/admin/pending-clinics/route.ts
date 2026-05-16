import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/api/admin";
import { applyAuthCookies, getServerAccessToken } from "@/lib/api/server-auth";

// GET /api/admin/pending-clinics
export async function GET(request: NextRequest) {
  const auth = await getServerAccessToken(request);

  if (!auth.token) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const response = await adminService.listPendingClinics(auth.token);

    return applyAuthCookies(
      NextResponse.json({ success: true, data: response }),
      auth
    );
  } catch (error: any) {
    console.error("List pending clinics error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch pending clinics",
      },
      { status: error.status || 500 }
    );
  }
}
