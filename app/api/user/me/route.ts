import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getErrorStatus(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
    ? error.status
    : 500;
}

// GET /api/user/me
export async function GET(request: NextRequest) {
  try {
    // Extract JWT from cookies and forward to backend
    const token = request.cookies.get("jwt")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const response = await authService.getProfile(token);

    return NextResponse.json({ success: true, data: response });
  } catch (error: unknown) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error, "Failed to fetch profile"),
      },
      { status: getErrorStatus(error) }
    );
  }
}

// PATCH /api/user/me
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = request.cookies.get("jwt")?.value || authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
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
  } catch (error: unknown) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error, "Failed to update profile"),
      },
      { status: getErrorStatus(error) }
    );
  }
}
