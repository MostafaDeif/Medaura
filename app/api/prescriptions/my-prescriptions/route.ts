import { NextRequest, NextResponse } from "next/server";
import { prescriptionService } from "@/lib/api/prescriptions";

// GET /api/prescriptions/my-prescriptions
export async function GET(request: NextRequest) {
  try {
    // Extract JWT from cookies
    const token = request.cookies.get("jwt")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const response = await prescriptionService.getMyPrescriptions(token);
    const responseData = (response as { data?: unknown }).data;
    const nestedData = (responseData as { data?: unknown } | undefined)?.data;
    const prescriptions = Array.isArray(response)
      ? response
      : Array.isArray(responseData)
        ? responseData
        : Array.isArray(nestedData)
          ? nestedData
        : [];

    return NextResponse.json({ success: true, data: prescriptions });
  } catch (error: unknown) {
    console.error("Get my prescriptions error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch prescriptions";
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}
