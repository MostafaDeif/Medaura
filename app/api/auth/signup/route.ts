import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth";
import type { SignupRequest } from "@/lib/types/api";

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
    error: message || "Signup failed",
  };
}

// POST /api/auth/signup
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupRequest;

    // Validate required fields
    if (!body.email || !body.password || !body.user_type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: email, password, user_type",
        },
        { status: 400 },
      );
    }

    const response = await authService.signup(body);

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup error:", error);
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
