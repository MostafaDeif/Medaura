import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
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

    // Get raw response to capture Set-Cookie headers from backend
    const backendResponse = await apiClient.getRawResponse(
      "/api/auth/login",
      "POST",
      body
    );

    // Parse response data
    const responseData = await backendResponse.json();

    // Handle errors
    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.message || responseData.error || "Login failed",
        },
        { status: backendResponse.status }
      );
    }

    const res = NextResponse.json({ success: true, data: responseData });

    // Extract Set-Cookie headers from backend response and forward them
    const setCookieHeader = backendResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      // For multiple cookies, set-cookie can appear multiple times
      const cookies = backendResponse.headers.getSetCookie?.() || [];
      cookies.forEach((cookie) => {
        res.headers.append("set-cookie", cookie);
      });
    }

    // Also set cookies from response data as fallback
    if (responseData.access_token || responseData.token) {
      const token = responseData.access_token || responseData.token;
      if (token) {
        res.cookies.set("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
      }
    }

    if (responseData.refresh_token || responseData.refreshToken) {
      const refreshToken = responseData.refresh_token || responseData.refreshToken;
      if (refreshToken) {
        res.cookies.set("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: "/",
        });
      }
    }

    return res;
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
