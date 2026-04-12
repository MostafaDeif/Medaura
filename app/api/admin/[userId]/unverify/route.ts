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
    const userId = segments[segments.length - 2];

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing user ID" },
        { status: 400 }
      );
    }

    const response = await adminService.unverifyDoctor(parseInt(userId), token);
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Unverify admin doctor error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to unverify doctor" },
      { status: error.status || 500 }
    );
  }
}
