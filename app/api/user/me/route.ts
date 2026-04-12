import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth";

// GET /api/user/me
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

    const response = await authService.getProfile(token);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch profile",
      },
      { status: error.status || 500 }
    );
  }
}

// PATCH /api/user/me
export async function PATCH(request: NextRequest) {
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

    const contentType = request.headers.get("content-type") || "";
    const body = contentType.includes("multipart/form-data")
      ? await request.formData()
      : await request.json();

    const response = await authService.updateProfile(token, body);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update profile",
      },
      { status: error.status || 500 }
    );
  }
}
