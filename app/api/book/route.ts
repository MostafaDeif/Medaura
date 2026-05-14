import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/api/bookings";
import { applyAuthCookies, getServerAccessToken } from "@/lib/api/server-auth";

function getStatus(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status?: number }).status)
    : undefined;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function POST(request: NextRequest) {
  try {
    let auth = await getServerAccessToken(request);
    let token = auth.token;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.staff_id || !body.booking_date || !body.booking_from) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: staff_id, booking_date, booking_from",
        },
        { status: 400 }
      );
    }

    let response;
    try {
      response = await bookingService.create(body, token);
    } catch (error: unknown) {
      if (getStatus(error) !== 401) throw error;
      auth = await getServerAccessToken(request, { forceRefresh: true });
      token = auth.token;
      if (!token) throw error;
      response = await bookingService.create(body, token);
    }

    const nextResponse = NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    );
    return applyAuthCookies(nextResponse, auth);
  } catch (error: unknown) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error, "Failed to create booking") },
      { status: getStatus(error) || 500 }
    );
  }
}
