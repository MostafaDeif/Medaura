import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth";
import type { RefreshTokenRequest } from "@/lib/types/api";

// POST /api/auth/refresh
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RefreshTokenRequest;

    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: email, password",
        },
        { status: 400 }
      );
    }

    const response = await authService.refresh(body);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Token refresh failed",
      },
      { status: error.status || 500 }
    );
  }
}
