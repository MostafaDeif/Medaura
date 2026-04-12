import { NextRequest, NextResponse } from "next/server";
import { prescriptionService } from "@/lib/api/prescriptions";
import type { PrescriptionCreateRequest } from "@/lib/types/api";

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
    const bookingId = segments[segments.length - 1];

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Missing booking ID" },
        { status: 400 }
      );
    }

    const body = (await request.json()) as PrescriptionCreateRequest;

    if (!body.patient_age || !body.diagnosis || !body.medication_name || !body.dose || !body.duration) {
      return NextResponse.json(
        { success: false, error: "Missing required prescription fields" },
        { status: 400 }
      );
    }

    const response = await prescriptionService.createPrescription(
      parseInt(bookingId),
      body,
      token
    );

    return NextResponse.json({ success: true, data: response }, { status: 201 });
  } catch (error: any) {
    console.error("Create prescription error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create prescription" },
      { status: error.status || 500 }
    );
  }
}

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

    const segments = request.nextUrl.pathname.split("/").filter(Boolean);
    const bookingId = segments[segments.length - 1];

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Missing booking ID" },
        { status: 400 }
      );
    }

    const response = await prescriptionService.getPrescription(
      parseInt(bookingId),
      token
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get prescription by booking ID error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch prescription" },
      { status: error.status || 500 }
    );
  }
}
