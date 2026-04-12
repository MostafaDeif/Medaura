import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/api/bookings";

// POST /api/bookings/cancel?id=17
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing authorization token",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id");

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing booking ID parameter",
        },
        { status: 400 }
      );
    }

    const response = await bookingService.cancelBooking(
      parseInt(bookingId),
      token
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to cancel booking",
      },
      { status: error.status || 500 }
    );
  }
}
