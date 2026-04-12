import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/api/admin";

// GET /api/admin/doctors
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

    const response = await adminService.listDoctors(token);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("List doctors error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch doctors",
      },
      { status: error.status || 500 }
    );
  }
}
