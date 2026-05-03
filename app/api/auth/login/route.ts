import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import type { LoginRequest } from "@/lib/types/api";

type LoginResponseData = {
  data?: LoginResponseData;
  access?: string;
  access_token?: string;
  accessToken?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
};

function unwrapLoginData(data: LoginResponseData): LoginResponseData {
  if (data?.data && typeof data.data === "object") {
    return unwrapLoginData(data.data);
  }

  return data;
}

function getAccessToken(data: LoginResponseData) {
  const unwrapped = unwrapLoginData(data);
  return (
    unwrapped.access ||
    unwrapped.access_token ||
    unwrapped.accessToken ||
    unwrapped.token
  );
}

function getRefreshToken(data: LoginResponseData) {
  const unwrapped = unwrapLoginData(data);
  return unwrapped.refresh_token || unwrapped.refreshToken;
}

function getCookieValue(setCookies: string[], names: string[]) {
  for (const cookie of setCookies) {
    const [pair] = cookie.split(";");
    const separatorIndex = pair.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();

    if (names.includes(name) && value) {
      return decodeURIComponent(value);
    }
  }

  return undefined;
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
    const backendCookies =
      backendResponse.headers.getSetCookie?.() ||
      (setCookieHeader ? [setCookieHeader] : []);

    backendCookies.forEach((cookie) => {
      res.headers.append("set-cookie", cookie);
    });

    const token =
      getAccessToken(responseData) ||
      getCookieValue(backendCookies, [
        "jwt",
        "access",
        "access_token",
        "accessToken",
        "token",
      ]);
    if (token) {
      res.cookies.set("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    const refreshToken =
      getRefreshToken(responseData) ||
      getCookieValue(backendCookies, ["refresh_token", "refreshToken"]);
    if (refreshToken) {
      res.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}
