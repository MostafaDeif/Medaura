import { NextRequest, NextResponse } from "next/server";
import { doctorService } from "@/lib/api/doctors";

// GET /api/doctors/dashboard
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

    const response = await doctorService.getDashboard(token);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get doctor dashboard error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch doctor dashboard",
      },
      { status: error.status || 500 }
    );
  }
}
