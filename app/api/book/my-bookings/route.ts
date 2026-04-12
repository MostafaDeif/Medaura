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
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get my bookings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bookings" },
      { status: error.status || 500 }
    );
  }
}
