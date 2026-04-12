import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/api/bookings";
import type { BookingRequest } from "@/lib/types/api";

// POST /api/bookings/create
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

    const rawBody = await request.json();
    const body = {
      ...rawBody,
      booking_from: rawBody.booking_from || rawBody.booking_time,
    } as BookingRequest;

    if (!body.doctor_id || !body.booking_date || !body.booking_from) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: doctor_id, booking_date, booking_from",
        },
        { status: 400 }
      );
    }

    const response = await bookingService.create(body, token);

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create booking",
      },
      { status: error.status || 500 }
    );
  }
}
