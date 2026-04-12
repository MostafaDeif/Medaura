import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/api/admin";

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const segments = request.nextUrl.pathname.split("/").filter(Boolean);
    const clinicId = segments[segments.length - 2];

    if (!clinicId) {
      return NextResponse.json(
        { success: false, error: "Missing clinic ID" },
        { status: 400 }
      );
    }

    const response = await adminService.rejectClinic(
      parseInt(clinicId),
      token
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Reject clinic error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reject clinic" },
      { status: error.status || 500 }
    );
  }
}
