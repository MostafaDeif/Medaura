import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/api/bookings";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctor_id");
    const bookingDate = searchParams.get("booking_date");

    if (!doctorId || !bookingDate) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: doctor_id, booking_date" },
        { status: 400 }
      );
    }

    const response = await bookingService.getAvailableSlots({
      doctor_id: parseInt(doctorId),
      booking_date: bookingDate,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get booking slots error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch available slots" },
      { status: error.status || 500 }
    );
  }
}
