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

    const res = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear cookies
    res.cookies.set("jwt", "", { maxAge: 0 });
    res.cookies.set("refresh_token", "", { maxAge: 0 });

    return res;
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
