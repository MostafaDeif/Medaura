import { NextRequest, NextResponse } from "next/server";
import { prescriptionService } from "@/lib/api/prescriptions";

// GET /api/prescriptions/my-prescriptions
export async function GET(request: NextRequest) {
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

    const response = await prescriptionService.getMyPrescriptions(token);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get my prescriptions error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch prescriptions",
      },
      { status: error.status || 500 }
    );
  }
}
