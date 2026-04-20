import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/api/bookings";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const response = await bookingService.getMyBookings(token);
    const responseData = (response as { data?: unknown }).data;
    const nestedData = (responseData as { data?: unknown } | undefined)?.data;
    const bookings = Array.isArray(response)
      ? response
      : Array.isArray(responseData)
        ? responseData
        : Array.isArray(nestedData)
          ? nestedData
        : [];

    return NextResponse.json({ success: true, data: bookings });
  } catch (error: unknown) {
    console.error("Get my bookings error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch bookings";
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
