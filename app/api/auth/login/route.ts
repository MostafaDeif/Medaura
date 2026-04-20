import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth";
import type { LoginRequest } from "@/lib/types/api";

function mapAuthError(error: any) {
  const message = String(error?.message || "");
  const status = Number(error?.status) || 500;

  if (/invalid object name|dbo\.users|table|relation/i.test(message)) {
    return {
      status: 503,
      error:
        "Authentication service is temporarily unavailable. Please check backend database migrations.",
    };
  }

  if (status >= 500) {
    return {
      status,
      error: "Authentication service is temporarily unavailable.",
    };
  }

  return {
    status,
    error: message || "Login failed",
  };
}

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
        { status: 400 },
      );
    }

    const response = await authService.login(body);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Login error:", error);
    const mapped = mapAuthError(error);
    return NextResponse.json(
      {
        success: false,
        error: mapped.error,
      },
      { status: mapped.status },
    );
  }
}
