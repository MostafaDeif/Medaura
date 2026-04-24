import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/api/bookings";
import type { BookingResponse } from "@/lib/types/api";
import { applyAuthCookies, getServerAccessToken } from "@/lib/api/server-auth";

type AppointmentRow = {
  id: string;
  name: string;
  type: string;
  doctor: string;
  status: string;
  date: string;
};

function formatAppointment(booking: BookingResponse): AppointmentRow {
  return {
    id: String(booking.patient_id ?? booking.id),
    name: `Patient #${booking.patient_id ?? "-"}`,
    type: "زيارة",
    doctor: `Doctor #${booking.doctor_id ?? "-"}`,
    status: booking.status || "pending",
    date: [booking.booking_date, booking.booking_from].filter(Boolean).join(", "),
  };
}

function getErrorStatus(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
    ? error.status
    : 500;
}

export async function GET(request: NextRequest) {
  let auth = await getServerAccessToken(request);
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const limit = Math.max(Number(searchParams.get("limit") || 10), 1);

  if (!auth.token) {
    return NextResponse.json([], {
      headers: { "X-Total-Count": "0" },
    });
  }

  try {
    let bookings;
    try {
      bookings = await bookingService.getMyBookings(auth.token);
    } catch (error: unknown) {
      if (getErrorStatus(error) !== 401) throw error;

      auth = await getServerAccessToken(request, { forceRefresh: true });
      if (!auth.token) throw error;
      bookings = await bookingService.getMyBookings(auth.token);
    }
    const rows = Array.isArray(bookings) ? bookings.map(formatAppointment) : [];
    const start = (page - 1) * limit;
    const paginated = rows.slice(start, start + limit);

    return applyAuthCookies(
      NextResponse.json(paginated, {
        headers: { "X-Total-Count": String(rows.length) },
      }),
      auth
    );
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json([], {
      headers: { "X-Total-Count": "0" },
    });
  }
}
