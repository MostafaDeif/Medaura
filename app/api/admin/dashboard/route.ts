import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/api/admin";
import { getServerAccessToken, applyAuthCookies } from "@/lib/api/server-auth";

export async function GET(request: NextRequest) {
  let auth = await getServerAccessToken(request);

  if (!auth.token) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    // Fetch all data in parallel with fallbacks to empty arrays
    const [doctors, clinics, staff, patients, bookings] = await Promise.all([
      adminService.listDoctors(auth.token).catch(() => []),
      adminService.listClinics(auth.token).catch(() => []),
      adminService.listStaff(auth.token).catch(() => []),
      adminService.listPatients(auth.token).catch(() => []),
      adminService.listAllBookings(auth.token).catch(() => []),
    ]);

    // Aggregate stats safely
    const stats = {
      totalDoctors: doctors?.length || 0,
      totalClinics: clinics?.length || 0,
      totalStaff: staff?.length || 0,
      totalPatients: patients?.length || 0,
      totalBookings: bookings?.length || 0,
      pendingBookings: Array.isArray(bookings) ? bookings.filter((b: any) => b.status === "pending").length : 0,
      verifiedDoctors: Array.isArray(doctors) ? doctors.filter((d: any) => d.verified).length : 0,
      unverifiedDoctors: Array.isArray(doctors) ? doctors.filter((d: any) => !d.verified).length : 0,
      verifiedClinics: Array.isArray(clinics) ? clinics.filter((c: any) => c.verified).length : 0,
      unverifiedClinics: Array.isArray(clinics) ? clinics.filter((c: any) => !c.verified).length : 0,
    };

    return applyAuthCookies(
      NextResponse.json({
        success: true,
        data: {
          stats,
          doctors: Array.isArray(doctors) ? doctors.slice(0, 10) : [],
          clinics: Array.isArray(clinics) ? clinics.slice(0, 10) : [],
          patients: Array.isArray(patients) ? patients.slice(0, 10) : [],
          staff: Array.isArray(staff) ? staff.slice(0, 10) : [],
          recentBookings: Array.isArray(bookings) ? bookings.slice(0, 10) : [],
          pendingRequests: Array.isArray(bookings) ? bookings.filter((b: any) => b.status === "pending").slice(0, 5) : [],
        },
      }),
      auth
    );
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    
    // If unauthorized, try to refresh once
    if (error.status === 401) {
      auth = await getServerAccessToken(request, { forceRefresh: true });
      if (auth.token) {
        // Retry logic could go here, but for simplicity we'll just return the error for now
        // or we could recursively call GET but that's risky.
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch admin dashboard data",
      },
      { status: error.status || 500 }
    );
  }
}
