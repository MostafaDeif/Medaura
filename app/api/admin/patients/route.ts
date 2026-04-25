import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/api/admin";
import { getServerAccessToken, applyAuthCookies } from "@/lib/api/server-auth";

// GET /api/admin/patients
export async function GET(request: NextRequest) {
  let auth = await getServerAccessToken(request);

  if (!auth.token) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const response = await adminService.listPatients(auth.token);

    return applyAuthCookies(
      NextResponse.json({ success: true, data: response }),
      auth
    );
  } catch (error: any) {
    console.error("List patients error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch patients",
      },
      { status: error.status || 500 }
    );
  }
}
