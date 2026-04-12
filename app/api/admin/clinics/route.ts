import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/api/admin";

// GET /api/admin/clinics
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing authorization token",
        },
        { status: 401 }
      );
    }

    const response = await adminService.listClinics(token);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("List clinics error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch clinics",
      },
      { status: error.status || 500 }
    );
  }
}
