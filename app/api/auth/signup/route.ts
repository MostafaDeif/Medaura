import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth";
import type { SignupRequest, LoginRequest } from "@/lib/types/api";

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
        { status: 400 }
      );
    }

    const response = await authService.signup(body);

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Signup failed",
      },
      { status: error.status || 500 }
    );
  }
}
