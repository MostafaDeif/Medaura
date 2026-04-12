import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth";
import type { LoginRequest } from "@/lib/types/api";

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginRequest;

    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: email, password",
        },
        { status: 400 }
      );
    }

    const response = await authService.login(body);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Login failed",
      },
      { status: error.status || 500 }
    );
  }
}
