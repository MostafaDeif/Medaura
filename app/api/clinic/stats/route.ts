import { NextRequest, NextResponse } from "next/server";
import { clinicService } from "@/lib/api/clinic";

// GET /api/clinic/stats
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

    const response = await clinicService.getStats(token);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get clinic stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch clinic stats",
      },
      { status: error.status || 500 }
    );
  }
}
