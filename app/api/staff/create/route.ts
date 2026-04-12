import { NextRequest, NextResponse } from "next/server";
import { staffService } from "@/lib/api/staff";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.email || !body.password || !body.full_name || !body.role_title) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await staffService.createStaff(body, token);
    return NextResponse.json({ success: true, data: response }, { status: 201 });
  } catch (error: any) {
    console.error("Create staff error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create staff" },
      { status: error.status || 500 }
    );
  }
}
