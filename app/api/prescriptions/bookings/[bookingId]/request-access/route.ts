import { NextRequest, NextResponse } from "next/server";
import { prescriptionService } from "@/lib/api/prescriptions";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const segments = request.nextUrl.pathname.split("/").filter(Boolean);
    const bookingId = segments[segments.length - 2];

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Missing booking ID" },
        { status: 400 }
      );
    }

    const response = await prescriptionService.requestAccess(
      parseInt(bookingId),
      token
    );

    return NextResponse.json({ success: true, data: response }, { status: 201 });
  } catch (error: any) {
    console.error("Request prescription access error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to request access" },
      { status: error.status || 500 }
    );
  }
}
