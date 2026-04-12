import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth";

// POST /api/auth/logout
export async function POST(request: NextRequest) {
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

    await authService.logout({ token });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Logout failed",
      },
      { status: error.status || 500 }
    );
  }
}
