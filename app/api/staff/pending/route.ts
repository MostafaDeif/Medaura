import { NextRequest, NextResponse } from "next/server";
import { staffService } from "@/lib/api/staff";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const response = await staffService.getPendingStaff(token);
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get pending staff error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch pending staff" },
      { status: error.status || 500 }
    );
  }
}
