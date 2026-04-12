import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/api/admin";

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

    const response = await adminService.listAuditLogs(token);
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get audit logs error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch audit logs" },
      { status: error.status || 500 }
    );
  }
}
