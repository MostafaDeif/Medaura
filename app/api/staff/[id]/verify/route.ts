import { NextRequest, NextResponse } from "next/server";
import { staffService } from "@/lib/api/staff";

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
    const staffId = segments[segments.length - 2];

    if (!staffId) {
      return NextResponse.json(
        { success: false, error: "Missing staff ID" },
        { status: 400 }
      );
    }

    const response = await staffService.verify(parseInt(staffId), token);
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Verify staff error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify staff" },
      { status: error.status || 500 }
    );
  }
}
