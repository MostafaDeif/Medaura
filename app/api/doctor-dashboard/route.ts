import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/api/bookings";
import { doctorService } from "@/lib/api/doctors";
import type { BookingResponse, DoctorDashboard } from "@/lib/types/api";
import { applyAuthCookies, getServerAccessToken } from "@/lib/api/server-auth";

type DashboardBooking = BookingResponse & {
  patient_name?: string;
  patient_full_name?: string;
  patient_gender?: string;
  doctor_name?: string;
  specialty?: string;
  specialist?: string;
  booking_time?: string;
  diagnosis?: string;
};

function getErrorStatus(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
    ? error.status
    : 500;
}

function isUnauthorized(error: unknown) {
  return getErrorStatus(error) === 401;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Failed to fetch dashboard";
}

function getBookingTime(booking: DashboardBooking) {
  return booking.booking_from || booking.booking_time || "";
}

function getPatientName(booking: DashboardBooking) {
  return (
    booking.patient_name ||
    booking.patient_full_name ||
    `Patient #${booking.patient_id ?? booking.id}`
  );
}

function getPatientGender(booking: DashboardBooking) {
  return booking.patient_gender || "غير محدد";
}

function getDoctorName(booking: DashboardBooking, doctor?: DoctorDashboard) {
  return booking.doctor_name || doctor?.full_name || `Doctor #${booking.doctor_id}`;
}

function formatDateTime(booking: DashboardBooking) {
  return [booking.booking_date, getBookingTime(booking)].filter(Boolean).join(", ");
}

function buildLastSevenDays() {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return date.toISOString().slice(0, 10);
  });
}

function buildWeeklyPatients(bookings: DashboardBooking[]) {
  return buildLastSevenDays().map((date) => {
    const dayBookings = bookings.filter((booking) => booking.booking_date === date);
    const seen = new Set<number>();
    const returning = new Set<number>();

    for (const booking of bookings) {
      if (!booking.patient_id || booking.booking_date >= date) continue;
      seen.add(booking.patient_id);
    }

    let newPatients = 0;

    for (const booking of dayBookings) {
      if (!booking.patient_id) continue;

      if (seen.has(booking.patient_id)) {
        returning.add(booking.patient_id);
      } else {
        newPatients += 1;
        seen.add(booking.patient_id);
      }
    }

    return {
      date,
      exixiting: returning.size,
      new: newPatients,
    };
  });
}

function buildTrend(total: number) {
  const safeTotal = Math.max(total, 1);

  return Array.from({ length: 5 }, (_, index) => ({
    value: Math.max(0, Math.round((safeTotal * (index + 1)) / 5)),
  }));
}

function buildPatients(bookings: DashboardBooking[]) {
  const patients = new Map<number, DashboardBooking>();

  for (const booking of bookings) {
    if (!booking.patient_id) continue;

    const existing = patients.get(booking.patient_id);
    if (
      !existing ||
      `${booking.booking_date} ${getBookingTime(booking)}` >
        `${existing.booking_date} ${getBookingTime(existing)}`
    ) {
      patients.set(booking.patient_id, booking);
    }
  }

  return Array.from(patients.values()).map((booking) => ({
    id: booking.patient_id,
    name: getPatientName(booking),
    gender: getPatientGender(booking),
    department: booking.specialty || booking.specialist || "General",
    date: booking.booking_date || "",
  }));
}

function buildReports(bookings: DashboardBooking[]) {
  return bookings
    .filter((booking) => booking.status === "completed")
    .slice(0, 7)
    .map((booking) => ({
      id: booking.id,
      name: getPatientName(booking),
      status: "available",
      description: booking.diagnosis || "Patient report",
    }));
}

function buildTodayAppointments(bookings: DashboardBooking[]) {
  const today = new Date().toISOString().slice(0, 10);

  return bookings
    .filter((booking) => booking.booking_date === today)
    .sort((a, b) => getBookingTime(a).localeCompare(getBookingTime(b)))
    .map((booking) => ({
      id: booking.id,
      name: getPatientName(booking),
      type: booking.status || "زيارة",
      date: booking.booking_date,
      time: getBookingTime(booking),
    }));
}

function buildGenderStats(bookings: DashboardBooking[]) {
  const patients = buildPatients(bookings);
  const total = patients.length;

  if (!total) {
    return { male: 0, female: 0, total: 0 };
  }

  const male = patients.filter((patient) =>
    ["male", "m", "ذكر"].includes(patient.gender.toLowerCase())
  ).length;
  const female = patients.filter((patient) =>
    ["female", "f", "أنثى", "انثى"].includes(patient.gender.toLowerCase())
  ).length;

  return {
    male: Math.round((male / total) * 100),
    female: Math.round((female / total) * 100),
    total: 100,
  };
}

export async function GET(request: NextRequest) {
  let auth = await getServerAccessToken(request);

  if (!auth.token) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    let [doctorResult, bookingsResult] = await Promise.allSettled([
      doctorService.getDashboard(auth.token),
      bookingService.getMyBookings(auth.token),
    ]);

    if (
      (doctorResult.status === "rejected" && isUnauthorized(doctorResult.reason)) ||
      (bookingsResult.status === "rejected" && isUnauthorized(bookingsResult.reason))
    ) {
      auth = await getServerAccessToken(request, { forceRefresh: true });

      if (!auth.token) {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        );
      }

      [doctorResult, bookingsResult] = await Promise.allSettled([
        doctorService.getDashboard(auth.token),
        bookingService.getMyBookings(auth.token),
      ]);
    }

    if (doctorResult.status === "rejected" && bookingsResult.status === "rejected") {
      throw doctorResult.reason;
    }

    const doctor =
      doctorResult.status === "fulfilled" ? doctorResult.value : undefined;
    const bookings: DashboardBooking[] =
      bookingsResult.status === "fulfilled" && Array.isArray(bookingsResult.value)
        ? bookingsResult.value
        : [];

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    );
    const completedBookings = bookings.filter(
      (booking) => booking.status === "completed"
    );
    const patientIds = new Set(
      bookings
        .map((booking) => booking.patient_id)
        .filter((id): id is number => typeof id === "number")
    );

    const totalBookings = doctor?.total_bookings ?? bookings.length;
    const totalPatients = patientIds.size || totalBookings;

    const appointmentRows = bookings.map((booking) => ({
      id: String(booking.patient_id ?? booking.id),
      name: getPatientName(booking),
      type: "زيارة",
      doctor: getDoctorName(booking, doctor),
      status: booking.status || "pending",
      date: formatDateTime(booking),
    }));

    const appointmentRequests = pendingBookings.slice(0, 5).map((booking) => ({
      id: booking.id,
      name: getPatientName(booking),
      specialty: booking.specialty || booking.specialist || doctor?.full_name || "General",
      time: formatDateTime(booking),
      image: `https://i.pravatar.cc/40?u=${booking.patient_id ?? booking.id}`,
      status: "pending",
    }));
    const patients = buildPatients(bookings);

    return applyAuthCookies(
      NextResponse.json({
        success: true,
        data: {
          doctor,
          totals: {
            appointments: totalBookings,
            patients: totalPatients,
            pending: doctor?.pending_bookings ?? pendingBookings.length,
            completed: doctor?.completed_bookings ?? completedBookings.length,
            rating: doctor?.rating ?? 0,
          },
          cards: {
            appointments: {
              value: totalBookings,
              percentage: 0,
              trend: buildTrend(totalBookings),
            },
            patients: {
              value: totalPatients,
              percentage: 0,
              trend: buildTrend(totalPatients),
            },
          },
          weeklyPatients: buildWeeklyPatients(bookings),
          genderStats: buildGenderStats(bookings),
          appointmentRequests,
          appointments: appointmentRows,
          patients,
          reports: buildReports(bookings),
          todayAppointments: buildTodayAppointments(bookings),
        },
      }),
      auth
    );
  } catch (error: unknown) {
    console.error("Get doctor dashboard snapshot error:", error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: getErrorStatus(error) }
    );
  }
}
