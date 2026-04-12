import { NextRequest, NextResponse } from "next/server";
import { prescriptionService } from "@/lib/api/prescriptions";
import type { PrescriptionActionRequest } from "@/lib/types/api";

export async function PATCH(request: NextRequest) {
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

    const body = (await request.json()) as PrescriptionActionRequest;

    if (!body.action) {
      return NextResponse.json(
        { success: false, error: "Missing action field" },
        { status: 400 }
      );
    }

    const response = await prescriptionService.respondAccess(
      parseInt(bookingId),
      body,
      token
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Respond prescription access error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to respond access" },
      { status: error.status || 500 }
    );
  }
}
