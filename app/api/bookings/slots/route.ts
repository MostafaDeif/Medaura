import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/api/bookings";

// GET /api/bookings/slots?staff_id=2&booking_date=2026-02-22
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staff_id");
    const bookingDate = searchParams.get("booking_date");

    if (!staffId || !bookingDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: staff_id, booking_date",
        },
        { status: 400 }
      );
    }

    const response = await bookingService.getAvailableSlots({
      staff_id: parseInt(staffId),
      booking_date: bookingDate,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: unknown) {
    console.error("Get booking slots error:", error);
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number((error as { status?: number }).status)
        : 500;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch available slots",
      },
      { status }
    );
  }
}
